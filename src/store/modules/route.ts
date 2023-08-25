import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { CookieEnum } from '@/constant'
import { RouteRecordRaw } from '@/router/utils.ts'

export type RouteType = {
  // 路由
  routesList: RouteRecordRaw[]
  // 是否悬在菜单上
  isColumnsMenuHover: boolean
  // 是否悬在子菜单上
  isColumnsNavHover: boolean
  // tagView
  tagViewList: RouteRecordRaw[]
  // tagView是否全屏
  tagViewCurrenFull: boolean
}
export const RouteStore = defineStore(
  'route',
  () => {
    const routeData = reactive<RouteType>({
      routesList: [],
      isColumnsMenuHover: false,
      isColumnsNavHover: false,
      tagViewList: [],
      tagViewCurrenFull: false
    })
    // const setRoutesList = (data: Array<RouteRecordRaw>) => (routeData.routesList = data)

    // 设置分栏布局，鼠标是否移入移出（菜单）
    // const setColumnsMenuHover = (bool: boolean) => (routeData.isColumnsMenuHover = bool)

    // const setColumnsNavHover = (bool: boolean) => (routeData.isColumnsNavHover = bool)

    return {
      ...toRefs(routeData)
      // setRoutesList
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
