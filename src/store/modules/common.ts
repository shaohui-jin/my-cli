import {defineStore} from 'pinia'
import { UserStore } from "./user";
const userStore = UserStore()
export const CommonStore = defineStore('common', {
  state: () => ({
    token: '',
  }),
  getters: {
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data
    },
    async getUserToken(params) {
      const data = await async () => {
        return new Promise(resolve => {
            resolve({name: 'get username value jsh'})
          }
        )
      };
      this.setUserInfo(data)
      return data
    },
  },
})