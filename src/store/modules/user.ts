import { defineStore } from 'pinia'
import { reactive, toRefs, watchEffect } from 'vue'
import { CookieEnum } from '@/constant'
import { getCookie, setCookie } from '@/utils/cookie.ts'

export type UserType = {
  token: string
  userInfo: any
  authList: Array<string> // 权限列表
  authBtnList: Array<string> // 按钮权限列表
}

const defaultUser: UserType = {
  token: '',
  userInfo: {},
  authList: [],
  authBtnList: []
}

export const UserStore = defineStore(
  'user',
  () => {
    const user = reactive<UserType>(defaultUser)
    const getUser = (): UserType => user
    const getUserToken = getCookie(CookieEnum.USER_TOKEN, { type: 'localStorage' }) || getUser().token
    watchEffect(() => {
      setCookie(CookieEnum.USER_TOKEN, user.token, { type: 'localStorage' })
    })
    return {
      ...toRefs(user),
      getUser,
      getUserToken
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: CookieEnum.USER_INFO,
          storage: window.localStorage
          // paths: ['user']
        }
      ]
    }
  }
)
