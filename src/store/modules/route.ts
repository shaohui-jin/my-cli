import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { CookieEnum } from '@/constant'
import { RouteRecordRaw } from 'vue-router'

export type RouteType = {
  routesList: RouteRecordRaw[]
  // isColumnsMenuHover: boolean
  // isColumnsNavHover: boolean
}
export const RouteStore = defineStore(
  'route',
  () => {
    const routeData = reactive<RouteType>({
      routesList: []
      // isColumnsMenuHover: false,
      // isColumnsNavHover: false
    })
    const setRoutesList = (data: Array<RouteRecordRaw>) => (routeData.routesList = data)

    // 设置分栏布局，鼠标是否移入移出（菜单）
    // const setColumnsMenuHover = (bool: boolean) => (routeData.isColumnsMenuHover = bool)

    // const setColumnsNavHover = (bool: boolean) => (routeData.isColumnsNavHover = bool)

    return {
      ...toRefs(routeData),
      setRoutesList
      // setColumnsMenuHover,
      // setColumnsNavHover
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: CookieEnum.USER_ROLE_ROUTE,
          storage: window.localStorage
        }
      ]
    }
  }
)
