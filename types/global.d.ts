import type {
  VNode,
  FunctionalComponent,
  PropType as VuePropType,
  ComponentPublicInstance
} from "vue";
import type { ECharts } from "echarts";
import type { IconifyIcon } from "@iconify/vue";
import { type RouteComponent, type RouteLocationNormalized } from "vue-router";

// 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
declare global {
  // 构建分支时间
  const __APP_VERSION__: string

  //  Window 的类型提示
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    [propsName: string]: any;
  }

  // 打包压缩格式的类型声明
  type ViteCompression =
    | "none"
    | "gzip"
    | "brotli"
    | "both"
    | "gzip-clear"
    | "brotli-clear"
    | "both-clear";

  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: string;
    VITE_CDN: boolean;
    VITE_COMPRESSION: ViteCompression;
  }

  // TableColumns
  interface TableColumnList extends Array<TableColumns> {}

  interface ServerConfigs {
    Version?: string;
    Title?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MultiTagsCache?: boolean;
    KeepAlive?: boolean;
    Locale?: string;
    Layout?: string;
    Theme?: string;
    DarkMode?: boolean;
    Grey?: boolean;
    Weak?: boolean;
    HideTabs?: boolean;
    SidebarStatus?: boolean;
    EpThemeColor?: string;
    ShowLogo?: boolean;
    ShowModel?: string;
    MenuArrowIconNoTransition?: boolean;
    CachingAsyncRoutes?: boolean;
    TooltipEffect?: Effect;
  }

  interface StorageConfigs {
    version?: string;
    title?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
    showLogo?: boolean;
    showModel?: string;
    username?: string;
  }
  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      layout?: string;
      theme?: string;
      darkMode?: boolean;
      sidebarStatus?: boolean;
      epThemeColor?: string;
    };
    configure: {
      grey?: boolean;
      weak?: boolean;
      hideTabs?: boolean;
      showLogo?: boolean;
      showModel?: string;
      multiTagsCache?: boolean;
    };
    tags?: Array<any>;
  }

  // `src/router` 文件夹里的类型声明
  interface toRouteType extends RouteLocationNormalized {
    meta: {
      roles: Array<string>;
      keepAlive?: boolean;
      dynamicLevel?: string;
    };
  }

  // 完整子路由配置表
  interface RouteChildrenConfig {
    /** 子路由地址 `必填` */
    path: string;
    /** 路由名字（对应不要重复，和当前组件的`name`保持一致）`必填` */
    name?: string;
    /** 路由重定向 `可选` */
    redirect?: string;
    /** 按需加载组件 `可选` */
    component?: RouteComponent;
    meta?: {
      /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加） `必填` */
      title: string;
      /** 菜单图标 `可选` */
      icon?: string | FunctionalComponent | IconifyIcon;
      /** 菜单名称右侧的额外图标 */
      extraIcon?: string | FunctionalComponent | IconifyIcon;
      /** 是否在菜单中显示（默认`true`）`可选` */
      showLink?: boolean;
      /** 是否显示父级菜单 `可选` */
      showParent?: boolean;
      /** 页面级别权限设置 `可选` */
      roles?: Array<string>;
      /** 按钮级别权限设置 `可选` */
      auths?: Array<string>;
      /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
      keepAlive?: boolean;
      /** 内嵌的`iframe`链接 `可选` */
      frameSrc?: string;
      /** `iframe`页是否开启首次加载动画（默认`true`）`可选` */
      frameLoading?: boolean;
      /** 页面加载动画（有两种形式，一种直接采用vue内置的`transitions`动画，另一种是使用`animate.css`写进、离场动画）`可选` */
      transition?: {
        /**
         * @description 当前路由动画效果
         * @see {@link https://next.router.vuejs.org/guide/advanced/transitions.html#transitions}
         * @see animate.css {@link https://animate.style}
         */
        name?: string;
        /** 进场动画 */
        enterTransition?: string;
        /** 离场动画 */
        leaveTransition?: string;
      };
      // 是否不添加信息到标签页，（默认`false`）
      hiddenTag?: boolean;
      /** 动态路由可打开的最大数量 `可选` */
      dynamicLevel?: number;
    };
    /** 子路由配置项 */
    children?: Array<RouteChildrenConfig>;
  }

  // 整体路由配置表（包括完整子路由）
  interface RouteConfig {
    /** 路由地址 `必填` */
    path: string;
    /** 路由名字（保持唯一）`可选` */
    name?: string;
    /** `Layout`组件 `可选` */
    component?: RouteComponent;
    /** 路由重定向 `可选` */
    redirect?: string;
    meta?: {
      /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加）`必填` */
      title: string;
      /** 菜单图标 `可选` */
      icon?: string | FunctionalComponent | IconifyIcon;
      /** 是否在菜单中显示（默认`true`）`可选` */
      showLink?: boolean;
      /** 菜单升序排序，值越高排的越后（只针对顶级路由）`可选` */
      rank?: number;
    };
    /** 子路由配置项 */
    children?: Array<RouteChildrenConfig>;
  }
}
