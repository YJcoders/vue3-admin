import App from "./App.vue";
import router from "./router";
import { setupStore } from "./store";
import ElementPlus from "element-plus";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";
// import { useEcharts } from "@/plugins/echarts"; // 按需引入echarts
import { Auth } from "./components/ReAuth";
import { getServerConfig } from "./config";
import { injectAppConfig } from "./utils/setConfig";
import IStorage from "./utils/storage";

import "./style/index.scss";
import "element-plus/dist/index.css";

const app = createApp(App);

// 自定义指令
import * as directives from "./directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 自定义 全局存储方法
app.config.globalProperties.$localStorage = new IStorage("localStorage");
app.config.globalProperties.$sessionStorage = new IStorage("sessionStorage");

// 全局注册`@iconify/vue`图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

// 全局注册按钮级别权限组件
app.component("Auth", Auth);

getServerConfig(app).then(async config => {
  app.use(router);
  await router.isReady();
  injectAppConfig(app, config);
  setupStore(app);
  app.use(MotionPlugin).use(ElementPlus);
  // .use(useEcharts);
  app.mount("#app");
});
