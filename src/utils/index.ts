import fs from "fs";
import path from "path";

// 深拷贝
export const deepClone = (obj: any, cache = new WeakMap()) => {
  // 判断是否是引用数据类型，基础数据类型本身就是地址拷贝
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj); // 处理时间函数
  if (obj instanceof RegExp) return new RegExp(obj); // 处理正则
  // 判断是否存在循环引用
  if (cache.get(obj)) return cache.get(obj);

  // 判断是数组还是对象
  const result = obj instanceof Array ? [] : ({} as any);
  //
  cache.set(obj, result);
  // 将每个源对象和拷贝的对象存到cache中，上面判断cache中是否存在循环引用
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      result[key] = deepClone(obj[key], cache);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};
// 防抖，防止许连续操作
export const debounce = function (
  func: Function,
  wait: number,
  immediate?: boolean
) {
  let timer: any;
  let result: Function;
  const debounced = function (this: unknown, ...args: any) {
    // 核心1：清除上一次的定时器
    if (timer) clearTimeout(timer);
    // 如果立即执行
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        // 此处如果添加，在一开始立即执行，wait之后还会再次执行一次
        // func.apply(this, args);
        timer = null;
      }, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timer = setTimeout(() => {
        // 核心2：修改this指向，参数传递
        func.apply(this, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
};

// 节流
export const throttle = function (func: Function, wait: number, options?: any) {
  // 并且不能不能同时设置 leading 和 trailing 都为false
  let timer: any;
  let previous = 0;
  if (!options) options = {};
  return function (this: unknown, ...args: any) {
    const now = new Date().getTime();

    //
    // 控制是否，一进入就执行
    if (!previous && options.leading === false) {
      previous = now;
    }
    if (now - previous > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(this, args);

      previous = now;
    } else if (!timer && options.trailing !== false) {
      // 控制离开后是否还执行最后一次
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
        previous = new Date().getTime();
      }, wait);
    }
  };
};

export const isString = str => {
  return str instanceof String || typeof str == "string";
};
export const isBoolean = data => {
  return typeof data == "boolean";
};
export const isUrl = url => {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(
    url
  );
};
export const isFunction = value => {
  return Object.prototype.toString.call(value) === "[object Function]";
};
// 是否是 object
export const isObject = obj => {
  return typeof obj === "object" && obj !== null;
};
export const isJson = value => {
  if (Object.prototype.toString.call(value) === "[object String]") {
    try {
      const obj = JSON.parse(value);
      const objType = Object.prototype.toString.call(obj);
      return objType === "[object Object]" || objType === "[object Array]";
    } catch (e) {
      return false;
    }
  }
  return false;
};
// 两者是否相等
export const isEqual = (obj1, obj2) => {
  // 两个数据有任何一个不是对象或数组
  if (!isObject(obj1) || !isObject(obj2)) {
    // 值类型(注意：参与equal的一般不会是函数)
    return obj1 === obj2;
  }
  // 如果传的两个参数都是同一个对象或数组
  if (obj1 === obj2) return true;

  // 两个都是对象或数组，而且不相等
  // 1.先比较obj1和obj2的key的个数，是否一样
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) return false;

  // 如果key的个数相等,就是第二步
  // 2.以obj1为基准，和obj2依次递归比较
  for (const key in obj1) {
    // 比较当前key的value  --- 递归
    const res = isEqual(obj1[key], obj2[key]);
    if (!res) return false;
  }

  // 3.全相等
  return true;
};

export const isEmpty = value => {
  switch (Object.prototype.toString.call(value)) {
    case "[object Undefined]":
      return value === void 0;
    case "[object Null]":
      return value === null;
    case "[object Number]":
      return isNaN(value);
    case "[object String]":
      return value === "";
    case "[object Boolean]":
      return false;
    case "[object Object]":
      return Object.keys(value).length === 0;
    case "[object Array]":
      return value.length === 0;
    default:
      return false;
  }
};

// 格式化大小
export const formatSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
// 获取文件夹大小
export const getPackageSize = async folderPath => {
  let totalSize = 0;
  const readFile = async folderPath => {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const states = fs.statSync(filePath);
      if (states.isDirectory()) {
        await readFile(filePath);
      } else {
        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          totalSize += stats.size;
        });
      }
    }
  };
  await readFile(folderPath);
  return formatSize(totalSize);
};

// 获取设备
export const getDevice = () => {
  const ua = navigator.userAgent;
  return {
    //移动终端浏览器版本信息
    trident: ua.indexOf("Trident") > -1, //IE内核
    presto: ua.indexOf("Presto") > -1, //opera内核
    webKit: ua.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
    gecko: ua.indexOf("Gecko") > -1 && ua.indexOf("KHTML") == -1, //火狐内核
    isMobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1, //android终端或uc浏览器
    iPhone: ua.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
    iPad: ua.indexOf("iPad") > -1, //是否iPad
    webApp: ua.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
    language: navigator.language.toLowerCase()
  };
};
