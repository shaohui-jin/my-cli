import { defineStore } from 'pinia'
import { ref } from 'vue'

type UserType = {
  token: string
  userInfo: any
  authList: any[] // 权限列表
  authBtnList: string[] // 按钮权限列表
}

const defaultUser: UserType = {
  token: '',
  userInfo: {},
  authList: [],
  authBtnList: []
}
export const UserStore = defineStore('user', () => {
  const user = ref<UserType>(defaultUser)

  const getUser = (): UserType => user.value
  const setUser = (userData: UserType) => (user.value = userData)
  // const getUserAuth = (): any[] => user.value.authList
  // const getUserAuthButton = (): string[] => user.value.authBtnList
  const clearUser = () => setUser(defaultUser)
  const setUserToken = (token: string) => user.value.token = token
  return {
    user,
    getUser,
    clearUser,
    setUserToken
    // setUser
    // getUserAuth,
    // getUserAuthButton,
  }
})
