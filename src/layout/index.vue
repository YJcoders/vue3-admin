<template>
  <div :class="['app-wrapper', set.classes]" v-resize>
    <div
      v-show="
        set.device === 'mobile' &&
        set.sidebar.opened &&
        layout.includes('vertical')
      "
      class="app-mask"
      @click="useAppStoreHook().toggleSideBar()"
    />
    <Vertical
      v-show="
        !useSetting.hiddenSideBar &&
        (layout.includes('vertical') || layout.includes('mix'))
      "
    />
    <div
      :class="['main-container', useSetting.hiddenSideBar ? 'main-hidden' : '']"
    >
      <div v-if="set.fixedHeader">
        <layout-header />
        <!-- 主体内容 -->
        <app-main :fixed-header="set.fixedHeader" />
      </div>
      <el-scrollbar v-else>
        <el-backtop
          title="回到顶部"
          target=".main-container .el-scrollbar__wrap"
        >
          <backTop />
        </el-backtop>
        <layout-header />
        <!-- 主体内容 -->
        <app-main :fixed-header="set.fixedHeader" />
      </el-scrollbar>
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>

<script setup lang="ts">
import "animate.css";
// 引入 src/components/ReIcon/src/offlineIcon.ts 文件中所有使用addIcon添加过的本地图标
import "@/components/ReIcon/src/offlineIcon";
import { setType } from "./types";
import { emitter } from "@/utils/mitt";
import { useLayout } from "../hooks/useLayout";
import { useAppStoreHook } from "@/store/modules/app";
import { useSettingStoreHook } from "@/store/modules/settings";
import useGetInstance from "@/hooks/useGetInstance";
import { getDevice } from "@/utils";

import { h, reactive, computed, onMounted, defineComponent } from "vue";

import navbar from "./components/navbar.vue";
import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/setting/index.vue";
import Vertical from "./components/sidebar/vertical.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
import backTop from "@/assets/svg/back_top.svg?component";

const { layout } = useLayout();
const isMobile = getDevice().isMobile;
const useSetting = useSettingStoreHook();
const { $appConfig } = useGetInstance();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  fixedHeader: computed(() => {
    return useSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === "mobile"
    };
  }),

  hideTabs: computed(() => {
    return $appConfig?.configure.hideTabs;
  })
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  $appConfig.layout = {
    layout: `${layoutModel}`,
    theme: $appConfig.layout?.theme,
    darkMode: $appConfig.layout?.darkMode,
    sidebarStatus: $appConfig.layout?.sidebarStatus,
    epThemeColor: $appConfig.layout?.epThemeColor
  };
}

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize");
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

// 监听容器
emitter.on("resize", ({ detail }) => {
  if (isMobile) return;
  const { width } = detail;
  width <= 760 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990) {
    if (!set.sidebar.isClickCollapse) {
      toggle("desktop", true);
      isAutoCloseSidebar = true;
    }
  }
});

onMounted(() => {
  if (isMobile) {
    toggle("mobile", false);
  }
});

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": set.fixedHeader },
        style: [
          set.hideTabs && layout.value.includes("horizontal")
            ? "box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
            : ""
        ]
      },
      {
        default: () => [
          !useSetting.hiddenSideBar &&
          (layout.value.includes("vertical") || layout.value.includes("mix"))
            ? h(navbar)
            : null,
          !useSetting.hiddenSideBar && layout.value.includes("horizontal")
            ? h(Horizontal)
            : null,
          h(tag)
        ]
      }
    );
  }
});
</script>

<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.app-mask {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.re-screen {
  margin-top: 12px;
}
</style>
