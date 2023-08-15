import { defineStore } from 'pinia'
import { UserType } from '@/types'
import { ref } from 'vue'

export const UserStore = defineStore('user', () => {
  const user = ref<UserType>({
    userInfo: {},
    authList: [],
    authBtnList: []
  })

  const getUser = (): UserType => user.value
  const setUser = (userData: UserType) => (user.value = userData)
  const getUserAuth = (): any[] => user.value.authList
  const getUserAuthButton = (): string[] => user.value.authBtnList

  return {
    user,
    getUser,
    getUserAuth,
    getUserAuthButton,
    setUser
  }
})
