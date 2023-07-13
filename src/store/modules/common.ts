import {defineStore} from 'pinia'
import { UserStore } from "./user";
const userStore = UserStore()
export const CommonStore = defineStore('common', {
  state: () => ({
    token: '',
  }),
  // 开启数据缓存，装了piniaPluginPersist配置这个才生效
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage, // 默认存储在sessionStorage里
        paths: ['token'],  // 指定存储state，不写则存储所有
      },
    ],
  },
  getters: {
  },
  actions: {
    setUserToken(token) {
      this.token = token
    },
    async getUserToken() {
      const token = userStore.getUserToken
      this.setUserToken(token)
      return token
    },
  },
})
