import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from '@/router/route.ts'
import { UserStore } from '@/store/modules/user.ts'
import { storeToRefs } from 'pinia'
import { ThemeStore } from '@/store/modules/theme.ts'
import { resetRoute } from '@/router/utils.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH), //路由模式的配置采用API调用的方式 不再是之前的字符串 此处采用的hash路由
  routes: staticRoutes
})

// isRequestRoutes 为 true，则开启后端控制路由，路径：`/src/store/modules/themeConfig.ts`
// const { isRequestRoutes } = themeStore.themeConfig
// 前端控制路由：初始化方法，防止刷新时路由丢失
// if (!isRequestRoutes) initFrontEndControlRoutes()

// 路由加载前
router.beforeEach(async (to, from, next) => {
  const userStore = UserStore()
  // const themeStore = ThemeStore()
  // NProgress.configure({ showSpinner: false })
  // if (to.meta.title) NProgress.start()
  const { user } = storeToRefs(userStore)
  const { token } = user.value
  if (!token) {
    if (to.path === '/login') {
      // 防止无token的时候无限循环
      next()
    } else {
      next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`)
      userStore.clearUser()
      resetRoute()
      // NProgress.done()
    }
  } else if (token && to.path === '/login') {
    next('/home')
    // NProgress.done()
  } else {
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
