import router from '@/router/index.ts'
import { RouteRecordRaw as _RouteRecordRaw } from 'vue-router'
import { useStore } from '@/store'

/**
 * 路由meta对象参数说明
 */
export type RouteRecordRaw = _RouteRecordRaw & {
  meta: {
    // 菜单栏及 tagView 栏、菜单搜索名称（国际化）
    title: string
    // 是否超链接菜单，开启外链条件，`1、isLink:true 2、链接地址不为空`
    isLink: string
    // 是否隐藏此路由
    isHide: boolean
    // 是否缓存组件状态
    isKeepAlive: boolean
    // 是否固定在 tagView 栏上
    isAffix: boolean
    // 是否内嵌窗口，，开启条件，`1、isIframe:true 2、链接地址不为空`
    isIframe: boolean
    // 当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
    roles: Array<string>
    // 菜单、tagView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
    icon: string
  }
}

/**
 * 定义动态路由
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import('@/layout/index.tsx'),
    redirect: '/home',
    meta: {
      title: 'home',
      isLink: '',
      isHide: false,
      isKeepAlive: true,
      isAffix: true,
      isIframe: false,
      roles: ['admin', 'common'],
      icon: ''
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: {
          title: '首页',
          // title: 'message.router.home',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: true,
          isIframe: false,
          roles: ['admin', 'common'],
          icon: 'iconfont icon-shouye'
        }
      },
      {
        path: '/file/images',
        name: 'file-images',
        component: () => import('@/views/file/images'),
        meta: {
          // title: 'message.router.images',
          title: '图片集',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin', 'common'],
          icon: 'iconfont icon-document'
        }
      },
      {
        path: '/demo',
        name: '代码演示',
        meta: {
          type: 'demo'
        },
        // component: () => import('@/views/home'),
        children: [
          {
            path: '/demo/define',
            name: 'define-demo',
            meta: {
              title: 'define 代码演示',
              // title: 'message.router.images',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'iconfont icon-document'
            },
            component: () => import('@/views/demo/define')
          },
          {
            path: '/demo/functional',
            name: 'functional-demo',
            meta: {
              title: 'functional 代码演示',
              // title: 'message.router.images',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'iconfont icon-document'
            },
            component: () => import('@/views/demo/functional')
          },
          {
            path: '/demo/hook',
            name: 'hook-demo',
            meta: {
              title: 'hook 代码演示',
              // title: 'message.router.images',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin', 'common'],
              icon: 'iconfont icon-document'
            },
            component: () => import('@/views/demo/usePage')
          }
        ]
      }
    ]
  }
]

/**
 * 定义静态路由
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.tsx'),
    meta: {
      title: '登录',
      isLink: '',
      isHide: false,
      isKeepAlive: true,
      isAffix: true,
      isIframe: false,
      roles: ['admin', 'common'],
      icon: ''
    }
  }
  // {
  //   path: '/404',
  //   name: 'notFound',
  //   component: () => import('@/views/error/404.vue'),
  //   meta: {
  //     title: 'message.staticRoutes.notFound'
  //   }
  // },
  // {
  //   path: '/401',
  //   name: 'noPower',
  //   component: () => import('@/views/error/401.vue'),
  //   meta: {
  //     title: 'message.staticRoutes.noPower'
  //   }
  // },
]

/**
 * 定义404界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
const pathMatch = {
  path: '/:path(.*)*',
  redirect: '/404'
}

/**
 * 路由扁平化
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
const flatRoutes = (arr: any[]) => {
  // if (arr.length <= 0) return
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
    }
  }
  return arr
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
const unFlatRoutes = (arr: RouteRecordRaw[]): RouteRecordRaw[] => {
  // if (arr.length <= 0) return false
  const newArr: any = []
  const cacheList: Array<string> = []
  arr.forEach((v: any) => {
    if (v.path === '/') {
      newArr.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      })
    } else {
      // 判断是否是动态路由（xx/:id/:name）
      if (v.path.indexOf('/:') > -1) {
        v.meta['isDynamic'] = true
        v.meta['isDynamicPath'] = v.path
      }
      newArr[0].children.push({ ...v })
      // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
      if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
        cacheList.push(v.name)
        useStore().useKeepAliveStore.$patch({ keepAliveNames: cacheList })
      }
    }
  })
  return newArr
}

/**
 * 获取 当前用户权限标识 的路由表（未处理成多级嵌套路由）
 * @description 这里主要用于动态路由的添加，router.addRoute
 * @param child dynamicRoutes 第一个顶级 children 的下路由集合
 * @returns 返回有当前用户权限标识的路由数组
 */
const filterRoleRoutes = (child: RouteRecordRaw[]): RouteRecordRaw[] => {
  const filterRoute: RouteRecordRaw[] = []
  child.forEach((route: any) => {
    if (route.meta.roles) {
      // 菜单多权限、账号多角色  都能支持
      route.meta.roles.forEach((metaRoles: string) => {
        if (useStore().useUserStore.authList.includes(metaRoles)) {
          filterRoute.push({ ...route })
        }
      })
    }
  })
  return filterRoute
}

/**
 * 获取有当前用户权限标识的路由数组，进行对原路由的过滤
 * @description 替换 dynamicRoutes 第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
const getFilterRoleRoutes = (): RouteRecordRaw[] => {
  const filterRouteEnd: any = unFlatRoutes(flatRoutes(dynamicRoutes))
  filterRouteEnd[0].children = [...filterRoleRoutes(filterRouteEnd[0].children), { ...pathMatch }]
  return filterRouteEnd
}

/**
 * 设置动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes 第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export const setRoutes = () => {
  getFilterRoleRoutes().forEach((route: RouteRecordRaw) => {
    const routeName: any = route.name
    if (!router.hasRoute(routeName)) router.addRoute(route)
  })
}

/**
 * 删除/重置路由
 * @method router.removeRoute
 * @description 此处循环为 dynamicRoutes（@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#push
 */
export const resetRoute = () => {
  getFilterRoleRoutes().forEach((route: RouteRecordRaw) => {
    const routeName: any = route.name
    router.hasRoute(routeName) && router.removeRoute(routeName)
  })
}

/**
 * 判断路由 `meta.roles` 中是否包含当前登录用户权限字段
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @param route 当前循环时的路由项
 * @returns 返回对比后有权限的路由项
 */
const hasRoles = (roles: Array<string>, route: any): boolean => {
  if (route.meta && route.meta.roles) {
    return roles.some((role: string) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 获取当前用户权限标识去比对路由表，设置递归过滤有权限的路由
 * @param routes 当前路由 children
 * @param roles 用户权限标识，在 userInfo（用户信息）的 authList（登录页登录时缓存到浏览器）数组
 * @returns 返回有权限的路由数组 `meta.roles` 中控制
 */
export const filterHasRolesMenu = (routes: RouteRecordRaw[], roles: Array<string>): RouteRecordRaw[] => {
  const menu: RouteRecordRaw[] = []
  routes.forEach((route: RouteRecordRaw) => {
    const item = { ...route }
    if (hasRoles(roles, item)) {
      if (Object.prototype.hasOwnProperty.call(item, 'children')) {
        item.children = filterHasRolesMenu((item as any).children, roles)
      }
      menu.push(item)
    }
  })
  return menu
}

/**
 * 设置递归过滤有权限的路由到 store routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagView、菜单搜索中：未过滤隐藏的(isHide)
 */
export const storeMenuAndTagViewRoutes = () => {
  useStore().useRouteStore.routesList = filterHasRolesMenu(
    (dynamicRoutes as any)[0].children,
    useStore().useUserStore.authList
  )
  // 获取所有有权限的路由，否则 tagView、菜单搜索中无权限的路由也将显示
  const rolesRoutes = filterHasRolesMenu(dynamicRoutes, useStore().useUserStore.authList)
  useStore().useRouteStore.tagViewList = (unFlatRoutes(flatRoutes(rolesRoutes)) as any)[0].children
}
