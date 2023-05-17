import dayjs from "dayjs";
import path from "path";
import version from "./public/version";
import { warpperEnv } from "./build";
import { getPluginsList } from "./build/plugins";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

const root: string = process.cwd();
const __APP_VERSION__ = `分支：${version}  构建日期： ${dayjs(
  new Date()
).format("YYYY-MM-DD HH:mm:ss")}`;

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@build": path.resolve(__dirname, "./build")
      }
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {}
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/variables.scss";` //公共样式地址
        }
      }
    },
    plugins: getPluginsList(command, VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      // 预构建
      include: [
        "qs",
        "mitt",
        "dayjs",
        "axios",
        "pinia",
        "echarts",
        "js-cookie",
        "@vueuse/core",
        "element-resize-detector"
      ],
      // 本地图标 按需引入
      exclude: ["@iconify-icons/ep", "@iconify-icons/ri"]
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "./index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_VERSION__: JSON.stringify(__APP_VERSION__)
    }
  };
};
