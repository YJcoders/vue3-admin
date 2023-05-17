import { computed } from "vue";
import { routerArrays } from "../layout/types";
import { useMultiTagsStore } from "@/store/modules/multiTags";
import useGetInstance from "@/hooks/useGetInstance";

export function useLayout() {
  const { $appConfig, $config } = useGetInstance();
  const initStorage = () => {
    /** 路由 */
    if (
      useMultiTagsStore().multiTagsCache &&
      (!$appConfig.tags || $appConfig.tags.length === 0)
    ) {
      $appConfig.tags = routerArrays;
    }
    /** 导航 */
    if (!$appConfig.layout) {
      $appConfig.layout = {
        layout: $config?.Layout ?? "vertical",
        theme: $config?.Theme ?? "default",
        darkMode: $config?.DarkMode ?? false,
        sidebarStatus: $config?.SidebarStatus ?? true,
        epThemeColor: $config?.EpThemeColor ?? "#409EFF"
      };
    }
    /** 灰色模式、色弱模式、隐藏标签页 */
    if (!$appConfig.configure) {
      $appConfig.configure = {
        grey: $config?.Grey ?? false,
        weak: $config?.Weak ?? false,
        hideTabs: $config?.HideTabs ?? false,
        showLogo: $config?.ShowLogo ?? true,
        showModel: $config?.ShowModel ?? "smart",
        multiTagsCache: $config?.MultiTagsCache ?? false
      };
    }
  };

  /** 清空缓存后从serverConfig.json读取默认配置并赋值到storage中 */
  const layout = computed(() => {
    return $appConfig?.layout.layout;
  });

  const layoutTheme = computed(() => {
    return $appConfig.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage
  };
}
