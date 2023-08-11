import { Document, Location, House, Finished } from '@element-plus/icons-vue'
import { Route } from '@/types'

export const routes: Route[] = [
  {
    path: '/home',
    name: '首页',
    meta: {
      type: 'home',
      icon: House
    },
    component: () => import('@/views/home')
  },
  {
    path: '/file/images',
    name: '图片集',
    meta: {
      icon: Document,
      type: 'images'
    },
    component: () => import('@/views/file/images')
  },
  {
    path: '/demo',
    name: '代码演示',
    meta: {
      icon: Location,
      type: 'demo'
    },
    // component: () => import('@/views/home'),
    children: [
      {
        path: '/define-demo',
        name: 'define 代码演示',
        meta: {
          icon: Finished,
          type: 'demo'
        },
        component: () => import('@/views/demo/define')
      },
      {
        path: '/functional-demo',
        name: 'functional 代码演示',
        meta: {
          icon: Finished,
          type: 'demo'
        },
        component: () => import('@/views/demo/functional')
      },
      {
        path: '/hook-demo',
        name: 'usePage 代码演示',
        meta: {
          icon: Finished,
          type: 'demo'
        },
        component: () => import('@/views/demo/usePage')
      }
    ]
  }
  // {
  //     path: '/login',
  //     name: 'login',
  //     meta: {
  //         type: 'login',
  //     },
  //     component: () => import('@/views/login'),
  // },
  // {
  //     path: '/:pathMatch(.*)*', // 注意此处 404页面匹配规则和以前不相同，得采用这种配置方式才行
  //     name: '404',
  //     component: () => import('@/views/404'),
  // },
]
