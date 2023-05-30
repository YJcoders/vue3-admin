import { store } from "@/store";
import { appType, scrollType } from "./types";
import { defineStore } from "pinia";
import { getConfig } from "@/config";
import { getDevice } from "@/utils";
import IStorage from "@/utils/storage";
const $localStorage = new IStorage("localStorage");

export const useAppStore = defineStore({
  id: "use-app",
  state: (): appType => ({
    sidebar: {
      opened:
        $localStorage.getItem("app-config")?.layout?.sidebarStatus ??
        getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickCollapse: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout: $localStorage.getItem("app-config")?.layout ?? getConfig().Layout,
    device: getDevice().isMobile ? "mobile" : "desktop",
    //  主体页面 el-scrollbar 滚动数据
    scrollInfo: {
      scrollLeft: 0,
      scrollTop: 0
    }
  }),
  getters: {
    getSidebarStatus() {
      return this.sidebar.opened;
    },
    getDevice() {
      return this.device;
    },
    getScrollInfo() {
      return this.scrollInfo;
    }
  },
  actions: {
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      const config = $localStorage.getItem("app-config");
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        config.layout.sidebarStatus = true;
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        config.layout.sidebarStatus = false;
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickCollapse = !this.sidebar.opened;
        config.layout.sidebarStatus = this.sidebar.opened;
      }
      $localStorage.setItem("app-config", config);
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      await this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    setScrollInfo(data) {
      this.scrollInfo = data;
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
