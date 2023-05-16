import CryptoJS from "crypto-js";
import { isJson } from "./index";

class IStorage {
  type?: string; // 存储类型 localStorage sessionStorage
  prefix?: string; // 名称前缀
  expire?: number; // 过期时间 单位：秒
  isEncrypt?: boolean; // 是否加密
  private SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
  private SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");
  constructor(
    type = "sessionStorage",
    prefix = "_",
    expire = 0,
    isEncrypt = false
  ) {
    this.type = type;
    this.prefix = prefix;
    this.expire = expire;
    this.isEncrypt = isEncrypt;
  }

  // 加密
  encrypt(data) {
    if (typeof data === "object") {
      try {
        data = JSON.stringify(data);
      } catch (error) {
        console.log("encrypt error:", error);
      }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(dataHex, this.SECRET_KEY, {
      iv: this.SECRET_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
  }
  // 解密方法
  decrypt(data) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, this.SECRET_KEY, {
      iv: this.SECRET_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  // 添加前缀
  addPrefix(key) {
    const prefix = this.prefix ? this.prefix : "";
    return prefix + key;
  }
  // 移除前缀
  delPrefix(key) {
    const len = this.prefix ? this.prefix.length + 1 : "";
    return key.substr(len);
  }

  // 添加存储
  setItem(key, value, expire = 0) {
    if (isNaN(expire) || expire < 0) {
      throw new Error("过期时间expire，应该大于0");
    }

    expire = (expire ? expire : this.expire) * 1000;
    const data = {
      value: value, // 存储值
      time: Date.now(), // 存值时间戳
      expire: expire // 过期时间
    };
    // 加密处理
    const encryptString = this.isEncrypt
      ? this.encrypt(JSON.stringify(data))
      : JSON.stringify(data);
    window[this.type].setItem(this.addPrefix(key), encryptString);
  }
  // 获取存储
  getItem(key) {
    key = this.addPrefix(key);
    if (
      !window[this.type].getItem(key) ||
      JSON.stringify(window[this.type].getItem(key)) === "null"
    ) {
      return null;
    }

    const storage = this.isEncrypt
      ? JSON.parse(this.decrypt(window[this.type].getItem(key)))
      : JSON.parse(window[this.type].getItem(key));
    const nowTime = Date.now();
    if (this.expire && this.expire < nowTime - storage.time) {
      this.removeItem(key);
      return null;
    } else {
      // 未过期期间被调用 则自动续期
      // setStorage(autoRemovePrefix(key), this.value);
      if (isJson(storage.value)) return JSON.parse(storage.value);
      return storage.value;
    }
  }
  // 移除存储
  removeItem(key) {
    window[this.type].removeItem(this.addPrefix(key));
  }
  // 清除所有
  clear() {
    window[this.type].clear();
  }
  // 是否存在
  hasItem(key) {
    key = this.addPrefix(key);
    const arr = this.getAllItem().filter(item => item.key === key);
    return arr.length ? true : false;
  }
  // 获取所有存储的 key
  getAllKeys = () => {
    const items = this.getAllItem();
    const keys = [];
    items.forEach(item => keys.push(item.key));
    return keys;
  };
  // 获取所有存储
  getAllItem() {
    const len = window[this.type].length;
    const arr = [];
    for (let i = 0; i < len; i++) {
      const key = window[this.type].key(i);
      // 获取key 索引从0开始
      const getKey = this.delPrefix(key);
      // 获取key对应的值
      const storage = this.isEncrypt
        ? JSON.parse(this.decrypt(window[this.type].getItem(key)))
        : JSON.parse(window[this.type].getItem(key));

      const nowTime = Date.now();
      if (storage.expire && nowTime - storage.time > storage.expire) {
        this.removeItem(getKey);
      } else {
        let getVal = storage.value;
        if (isJson(getVal)) {
          getVal = JSON.parse(getVal);
        }
        // 放进数组
        arr.push({ key: getKey, val: getVal });
      }
    }
    return arr;
  }
}

export default IStorage;
