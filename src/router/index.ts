import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/store'
import { resetRoute, staticRoutes } from '@/router/utils.ts'
import { initFrontEndRoutes } from '@/router/frontEnd.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
  routes: staticRoutes
})

// 路由加载前
router.beforeEach(async (to, _, next) => {
  // const themeStore = ThemeStore()
  // NProgress.configure({ showSpinner: false })
  // if (to.meta.title) NProgress.start()
  // const token = useStore().useUserStore.token
  const token = useStore().useUserStore.token

  if (!token) {
    if (to.path === '/login') {
      // 防止无token的时候无限循环
      next()
    } else {
      next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`)
      useStore().$reset()
      resetRoute()
      // NProgress.done()
    }
  } else {
    // isRequestRoutes 为 true，则开启后端控制路由，路径：`/src/store/modules/themeConfig.ts`
    // const isRequestRoutes = useStore().useThemeStore.isRequestRoutes
    // 前端控制路由：初始化方法，防止刷新时路由丢失
    // if (isRequestRoutes === false) await initFrontEndRoutes()

    if (to.path === '/login') {
      // 防止无token的时候无限循环
      next('/home')
    }
    // if (store.state.routesList.routesList.length === 0) {
    //   if (isRequestRoutes) {
    //     // 后端控制路由：路由数据初始化，防止刷新时丢失
    //     await initBackEndControlRoutes()
    //     // 动态添加路由：防止非首页刷新时跳转回首页的问题
    //     // 确保 addRoute() 时动态添加的路由已经被完全加载上去
    //     next({ ...to, replace: true })
    //   }
    // } else {
    next()
    // }
  }
})
// 路由加载后
router.afterEach(() => {})

// 导出路由
export default router
