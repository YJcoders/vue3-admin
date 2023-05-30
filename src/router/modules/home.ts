const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "homeFilled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "首页"
      }
    },
    {
      path: "/external",
      name: "http://www.baidu.com",
      meta: {
        title: "外链"
      }
    }
  ]
} as RouteConfig;
