import { store } from "@/store";
import { defineStore } from "pinia";
import { getConfig } from "@/config";
import IStorage from "@/utils/storage";
const $localStorage = new IStorage("localStorage");

export const useEpThemeStore = defineStore({
  id: "use-epTheme",
  state: () => ({
    epThemeColor:
      $localStorage.getItem("app-config")?.layout?.epThemeColor ??
      getConfig().EpThemeColor,
    epTheme:
      $localStorage.getItem("app-config")?.layout?.theme ?? getConfig().Theme
  }),
  getters: {
    getEpThemeColor() {
      return this.epThemeColor;
    },
    /** 用于mix导航模式下hamburger-svg的fill属性 */
    fill() {
      if (this.epTheme === "light") {
        return "#409eff";
      } else if (this.epTheme === "yellow") {
        return "#d25f00";
      } else {
        return "#fff";
      }
    }
  },
  actions: {
    setEpThemeColor(newColor: string): void {
      const config = $localStorage.getItem("app-config");
      this.epTheme = config.layout?.theme;
      this.epThemeColor = newColor;
      if (!config.layout) return;
      config.layout.epThemeColor = newColor;
      $localStorage.setItem("app-config", config);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
