const Layout = () => import("@/layout/index.vue");

export default {
  path: "/demo",
  redirect: "/demo/virtual-list",
  component: Layout,
  meta: {
    icon: "menu",
    title: "组件"
  },
  children: [
    {
      path: "/demo/virtual-list",
      name: "VirtualList",
      component: () => import("@/views/pages/demo/index.vue"),
      meta: {
        title: "虚拟列表"
      }
    },
    {
      path: "/demo/vue3",
      name: "Vue3",
      component: () => import("@/views/pages/demo/vue3/index.vue"),
      meta: {
        title: "vue3语法"
      }
    },
    {
      path: "/demo/lazy-load",
      redirect: "/demo/lazy-load/1",
      name: "LazyLoad",
      meta: {
        title: "懒加载"
      },
      children: [
        {
          path: "/demo/lazy-load/1",
          name: "LazyLoad1",
          component: () => import("@/views/pages/demo/LazyLoad/lazyLoad1.vue"),
          meta: {
            title: "方案一"
          }
        },
        {
          path: "/demo/lazy-load/2",
          name: "LazyLoad2",
          component: () => import("@/views/pages/demo/LazyLoad/lazyLoad2.vue"),
          meta: {
            title: "方案二"
          }
        }
      ]
    }
  ]
} as RouteConfig;
