import { useStore } from '@/store'
import { setAddRoute, setFilterMenuAndCacheTagsViewRoutes } from '@/router/utils.ts'

/**
 * 前端控制路由：初始化方法，防止刷新时路由丢失
 * @method  NextLoading 界面 loading 动画开始执行
 * @method  useStore().useUserStore.getUserToken 无 token 停止执行下一步
 * @method store.dispatch('userInfos/setUserInfos') 触发初始化用户信息
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initFrontEndRoutes() {
  // 界面 loading 动画开始执行
  // if (window.nextLoading === undefined) NextLoading.start()
  if (useStore().useUserStore.getUserToken) return false
  // 触发初始化用户信息
  // store.dispatch('userInfos/setUserInfos');
  // 添加动态路由
  await setAddRoute()
  // 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
  setFilterMenuAndCacheTagsViewRoutes()
}
