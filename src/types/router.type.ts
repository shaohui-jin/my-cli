import { RouteRecordRaw } from 'vue-router'

export type Route = RouteRecordRaw & {
  redirect?: string
  meta: {
    isGroup?: boolean
    icon?: any
    type?: string
  }
  children?: Route[]
}
