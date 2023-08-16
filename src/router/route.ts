import { RouteRecordRaw } from 'vue-router'

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink:true 2、链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，，开启条件，`1、isIframe:true 2、链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

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
      isKeepAlive: true
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
      title: '登录'
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
