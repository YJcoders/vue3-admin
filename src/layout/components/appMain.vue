<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar v-if="props.fixedHeader" @scroll="onScroll">
          <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
            <backTop />
          </el-backtop>
          <transitionMain :route="route">
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component
                :is="Component"
                :key="route.fullPath"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="route.fullPath"
              class="main-content"
            />
          </transitionMain>
        </el-scrollbar>
        <div v-else>
          <transitionMain :route="route">
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component
                :is="Component"
                :key="route.fullPath"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="route.fullPath"
              class="main-content"
            />
          </transitionMain>
        </div>
      </template>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { useAppStoreHook } from "@/store/modules/app";
import useGetInstance from "@/hooks/useGetInstance";
import backTop from "@/assets/svg/back_top.svg?component";
import { h, computed, Transition, defineComponent } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { debounce } from "@/utils";

const props = defineProps({
  fixedHeader: Boolean
});

const { $appConfig, $config } = useGetInstance();
const keepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $appConfig?.configure.hideTabs;
});

const layout = computed(() => {
  return $appConfig?.layout.layout === "vertical";
});

const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout ? "padding-top: 48px;" : "",
    !hideTabs.value && layout ? "padding-top: 85px;" : "",
    hideTabs.value && !layout.value ? "padding-top: 48px" : "",
    !hideTabs.value && !layout.value ? "padding-top: 85px;" : "",
    props.fixedHeader ? "" : "padding-top: 0;"
  ];
});

const onScroll = debounce(data => {
  useAppStoreHook().setScrollInfo(data);
}, 200);

const transitionMain = defineComponent({
  render() {
    return h(
      Transition,
      {
        name:
          transitions.value(this.route) &&
          this.route.meta.transition.enterTransition
            ? "fe-classes-transition"
            : (transitions.value(this.route) &&
                this.route.meta.transition.name) ||
              "fade-transform",
        enterActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.enterTransition}`,
        leaveActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.leaveTransition}`,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  },
  props: {
    route: {
      type: undefined,
      required: true
    }
  }
});
</script>

<style scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin: 24px;
}
</style>
