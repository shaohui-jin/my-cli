import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routes from '@/router/router.config.ts'

const index = createRouter({
  history: createWebHistory(), //路由模式的配置采用API调用的方式 不再是之前的字符串 此处采用的hash路由
  routes
})

// router.beforeEach(
//   async (
//     to: RouteLocationNormalized,
//     from: RouteLocationNormalized,
//     next: NavigationGuardNext,
//   ) => {
//     const token: string = getToken() as string
//     if (token) {
//       // 第一次加载路由列表并且该项目需要动态路由
//       if (!isAddDynamicMenuRoutes) {
//         try {
//           //获取动态路由表
//           const res: any = await UserApi.getPermissionsList({})
//           if (res.code == 200) {
//             isAddDynamicMenuRoutes = true
//             const menu = res.data
//             // 通过路由表生成标准格式路由
//             const menuRoutes: any = fnAddDynamicMenuRoutes(
//               menu.menuList || [],
//               [],
//             )
//             mainRoutes.children = []
//             mainRoutes.children?.unshift(...menuRoutes, ...Routes)
//             // 动态添加路由
//             router.addRoute(mainRoutes)
//             // 注：这步很关键，不然导航获取不到路由
//             router.options.routes.unshift(mainRoutes)
//             // 本地存储按钮权限集合
//             sessionStorage.setItem(
//               'permissions',
//               JSON.stringify(menu.permissions || '[]'),
//             )
//             if (to.path == '/' || to.path == '/login') {
//               const firstName = menuRoutes.length && menuRoutes[0].name
//               next({ name: firstName, replace: true })
//             } else {
//               next({ path: to.fullPath })
//             }
//           } else {
//             sessionStorage.setItem('menuList', '[]')
//             sessionStorage.setItem('permissions', '[]')
//             next()
//           }
//         } catch (error) {
//           console.log(
//             `%c${error} 请求菜单列表和权限失败，跳转至登录页！！`,
//             'color:orange',
//           )
//         }
//       } else {
//         if (to.path == '/' || to.path == '/login') {
//           next(from)
//         } else {
//           next()
//         }
//       }
//     } else {
//       isAddDynamicMenuRoutes = false
//       if (to.name != 'login') {
//         next({ name: 'login' })
//       }
//       next()
//     }
//   },
// )
export default index
