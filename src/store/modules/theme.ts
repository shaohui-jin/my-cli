import { defineStore } from 'pinia'
import { getCookie } from '@/utils'

import { ThemeType } from '@/types'
import { CookieEnum, defaultThemeConfig } from '@/constant'

export const ThemeStore = defineStore('theme', {
  // 状态库
  state: (): { theme: ThemeType } => ({
    theme: {}
  }),
  // 开启数据缓存，装了piniaPluginPersist配置这个才生效
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage, // 默认存储在sessionStorage里
        paths: ['theme'] // 指定存储state，不写则存储所有
      }
    ]
  },
  getters: {
    getTheme: (state): ThemeType => {
      const hasInit = Object.keys(state.theme).length !== 0
      console.log(hasInit)
      if (!hasInit) {
        console.log('theme未初始化')
        const themeConfig: ThemeType = JSON.parse(
          getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' })
        )
        console.log(this.setTheme)
        // 这里因为上面设置了localstorage的缓存，就不用setCookie了
        if (themeConfig) {
          this.setTheme(themeConfig)
        } else {
          this.setTheme(defaultThemeConfig)
        }
      }
      console.log('theme初始化')
      console.log(state.theme)
      return state.theme
    }
  },
  actions: {
    setTheme(data: ThemeType) {
      this.defaultTheme = data
    }
    // async getUserInfo() {
    //   const data = await async () => {
    //     return new Promise(resolve => {
    //         resolve({
    //           name: 'get username value jsh',
    //           token: 'get token value 1111',
    //         })
    //       }
    //     )
    //   }
    //   this.setUserInfo(data)
    //   return data
    // },
  }
})
