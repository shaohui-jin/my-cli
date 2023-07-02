import {defineStore} from 'pinia'

interface UserType {
  userName: string,
  token: string,
}

export const UserStore = defineStore('user', {
  // 状态库
  state: () => ({
    userInfo: {
      token: '',
      userName: ''
    } as UserType, //用户信息
  }),
  getters: {
    getUserName: async (state) => {
      if(!state.userInfo.token) {
        await this.getUserInfo()
      }
      return state.userInfo.userName
    },
    getUserToken: async (state) => {
      if(!state.userInfo.token) {
        await this.getUserInfo()
      }
      return state.userInfo.token
    },
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data
    },
    async getUserInfo() {
      const data = await async () => {
        return new Promise(resolve => {
            resolve({
              name: 'get username value jsh',
              token: 'get token value 1111',
            })
          }
        )
      };
      this.setUserInfo(data)
      return data
    },
  },
})