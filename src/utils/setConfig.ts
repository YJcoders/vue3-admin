// 响应式storage
import { App } from "vue";
import { routerArrays } from "@/layout/types";

export const injectAppConfig = (app: App, config: ServerConfigs) => {
  const configObj = Object.assign(
    {
      // layout模式以及主题
      layout: {
        layout: config.Layout ?? "vertical",
        theme: config.Theme ?? "default",
        darkMode: config.DarkMode ?? false,
        sidebarStatus: config.SidebarStatus ?? true,
        epThemeColor: config.EpThemeColor ?? "#409EFF"
      },
      configure: {
        grey: config.Grey ?? false,
        weak: config.Weak ?? false,
        hideTabs: config.HideTabs ?? false,
        showLogo: config.ShowLogo ?? true,
        showModel: config.ShowModel ?? "smart",
        multiTagsCache: config.MultiTagsCache ?? false
      }
    },
    config.MultiTagsCache
      ? {
          // 默认显示首页tag
          tags: routerArrays
        }
      : {}
  );
  app.config.globalProperties.$appConfig = configObj;
};
