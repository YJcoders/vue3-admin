<script setup lang="ts">
import Logo from "./logo.vue";
import { useRoute } from "vue-router";
import { emitter } from "@/utils/mitt";
import SidebarItem from "./sidebarItem.vue";
import leftCollapse from "./leftCollapse.vue";
import { useNav } from "@/hooks/useNav";
import { ref, computed, watch, onBeforeMount } from "vue";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import useGetInstance from "@/hooks/useGetInstance";

const { $localStorage } = useGetInstance();
const route = useRoute();
const showLogo = ref($localStorage.getItem("app-config")?.showLogo ?? true);

const { routers, device, useApp, isCollapse, menuSelect, toggleSideBar } =
  useNav();

const subMenuData = ref([]);

const menuData = computed(() => {
  return useApp.layout === "mix" && device.value !== "mobile"
    ? subMenuData.value
    : usePermissionStoreHook().wholeMenus;
});

function getSubMenuData(path: string) {
  // path的上级路由组成的数组
  const parentPathArr = getParentPaths(
    path,
    usePermissionStoreHook().wholeMenus
  );
  // 当前路由的父级路由信息
  const parenetRoute = findRouteByPath(
    parentPathArr[0] || path,
    usePermissionStoreHook().wholeMenus
  );
  if (!parenetRoute?.children) return;
  subMenuData.value = parenetRoute?.children;
}

getSubMenuData(route.path);

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getSubMenuData(route.path);
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div
    v-loading="menuData.length === 0"
    :class="['sidebar-container', showLogo ? 'has-logo' : '']"
  >
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="[device === 'mobile' ? 'mobile' : 'pc']"
    >
      <el-menu
        router
        unique-opened
        mode="vertical"
        class="outer-most select-none"
        :collapse="isCollapse"
        :default-active="route.path"
        :collapse-transition="false"
        @select="indexPath => menuSelect(indexPath, routers)"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
          class="outer-most select-none"
        />
      </el-menu>
    </el-scrollbar>
    <leftCollapse
      v-if="device !== 'mobile'"
      :is-active="useApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
