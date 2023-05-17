import {
  ref,
  watch,
  computed,
  reactive,
  onMounted,
  CSSProperties,
  getCurrentInstance
} from "vue";
import { tagsViewsType } from "../layout/types";
import { useEventListener } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { isBoolean, isEqual } from "@/utils";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import CloseAllTags from "@iconify-icons/ri/subtract-line";
import CloseOtherTags from "@iconify-icons/ri/text-spacing";
import CloseRightTags from "@iconify-icons/ri/text-direction-l";
import CloseLeftTags from "@iconify-icons/ri/text-direction-r";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Close from "@iconify-icons/ep/close";
import useGetInstance from "@/hooks/useGetInstance";

export function useTags() {
  const { $localStorage } = useGetInstance();

  const route = useRoute();
  const router = useRouter();
  const instance = getCurrentInstance();
  const useSetting = useSettingStoreHook();

  const buttonTop = ref(0);
  const buttonLeft = ref(0);
  const translateX = ref(0);
  const visible = ref(false);
  const activeIndex = ref(-1);
  // 当前右键选中的路由信息
  const currentSelect = ref({});

  /** 显示模式，默认灵动模式 */
  const showModel = ref(
    $localStorage.getItem("app-config")?.showModel || "smart"
  );
  /** 是否隐藏标签页，默认显示 */
  const showTags =
    ref($localStorage.getItem("app-config")?.hideTabs) ?? ref("false");
  const multiTags: any = computed(() => {
    return useMultiTagsStoreHook().multiTags;
  });

  const tagsViews = reactive<Array<tagsViewsType>>([
    {
      icon: RefreshRight,
      text: "重新加载",
      divided: false,
      disabled: false,
      show: true
    },
    {
      icon: Close,
      text: "关闭当前标签页",
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseLeftTags,
      text: "关闭左侧标签页",
      divided: true,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseRightTags,
      text: "关闭右侧标签页",
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseOtherTags,
      text: "关闭其他标签页",
      divided: true,
      disabled: multiTags.value.length > 2 ? false : true,
      show: true
    },
    {
      icon: CloseAllTags,
      text: "关闭全部标签页",
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: Fullscreen,
      text: "整体页面全屏",
      divided: true,
      disabled: false,
      show: true
    },
    {
      icon: Fullscreen,
      text: "内容区全屏",
      divided: false,
      disabled: false,
      show: true
    }
  ]);

  function conditionHandle(item, previous, next) {
    if (isBoolean(route?.meta?.showLink) && route?.meta?.showLink === false) {
      if (Object.keys(route.query).length > 0) {
        return isEqual(route.query, item.query) ? previous : next;
      } else {
        return isEqual(route.params, item.params) ? previous : next;
      }
    } else {
      return route.path === item.path ? previous : next;
    }
  }

  /** 鼠标移入添加激活样式 */
  function onMouseenter(index) {
    if (index) activeIndex.value = index;
  }

  /** 鼠标移出恢复默认样式 */
  function onMouseleave() {
    activeIndex.value = -1;
  }

  const iconIsActive = computed(() => {
    return (item, index) => {
      if (index === 0) return;
      return conditionHandle(item, true, false);
    };
  });

  const linkIsActive = computed(() => {
    return item => {
      return conditionHandle(item, "is-active", "");
    };
  });

  const scheduleIsActive = computed(() => {
    return item => {
      return conditionHandle(item, "schedule-active", "");
    };
  });

  const getTabStyle = computed((): CSSProperties => {
    return {
      transform: `translateX(${translateX.value}px)`
    };
  });

  const getContextMenuStyle = computed((): CSSProperties => {
    return { left: buttonLeft.value + "px", top: buttonTop.value + "px" };
  });

  const closeMenu = () => {
    visible.value = false;
  };

  function onContentFullScreen() {
    useSetting.hiddenSideBar
      ? useSetting.changeSetting({ key: "hiddenSideBar", value: false })
      : useSetting.changeSetting({ key: "hiddenSideBar", value: true });
  }

  onMounted(() => {
    if (!showModel.value) {
      const configure = $localStorage.getItem("app-config");
      configure.showModel = "card";
      $localStorage.setItem("app-config", configure);
    }
  });

  watch(
    () => visible.value,
    () => {
      useEventListener(document, "click", closeMenu);
    }
  );

  return {
    route,
    router,
    visible,
    showTags,
    instance,
    multiTags,
    showModel,
    tagsViews,
    buttonTop,
    buttonLeft,
    translateX,
    useSetting,
    activeIndex,
    getTabStyle,
    iconIsActive,
    linkIsActive,
    currentSelect,
    scheduleIsActive,
    getContextMenuStyle,
    closeMenu,
    onMounted,
    onMouseenter,
    onMouseleave,
    onContentFullScreen
  };
}
