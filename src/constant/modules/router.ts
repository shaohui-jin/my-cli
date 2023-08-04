import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '首页',
    meta: {
      type: 'home'
    },
    component: () => import('@/views/home')
  },
  {
    path: '/file/images',
    name: '图片集',
    meta: {
      type: 'images'
    },
    component: () => import('@/views/file/images')
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