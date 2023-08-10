import { defineStore } from 'pinia'
import { getCookie, setCookie } from '@/utils'
import { ThemeType } from '@/types'
import { CookieEnum, defaultThemeConfig } from '@/constant'
import { onMounted, ref } from 'vue'
const { isObjectEmpty } = window.App.$utils

export const ThemeStore = defineStore('theme', () => {
  let theme = ref<ThemeType>(defaultThemeConfig)
  let hasInit = ref<boolean>(false)

  onMounted(() => {
    const hasThemeSetting = isObjectEmpty(theme)
    if (!hasInit.value && !hasThemeSetting) {
      console.log('theme未初始化')
      const themeConfig: ThemeType = JSON.parse(
        getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' }) || '{}'
      )
      setTheme(isObjectEmpty(themeConfig) ? defaultThemeConfig : themeConfig)
    }
    return theme
  })
  const getTheme = (): ThemeType => theme.value
  const setTheme = (themeData: ThemeType) => {
    theme.value = themeData
    setCookie(CookieEnum.CUSTOM_THEME, JSON.stringify(themeData), { type: 'localStorage' })
  }
  const resetTheme = () => {
    setTheme(defaultThemeConfig)
  }
  return {
    theme,
    getTheme,
    setTheme,
    resetTheme
  }
})

// const aaa = () => ({
//   state: (): { theme: ThemeType } => ({
//     theme: {}
//   }),
//     // 开启数据缓存，装了piniaPluginPersist配置这个才生效
//     persist: {
//   enabled: true,
//     strategies: [
//     {
//       storage: localStorage, // 默认存储在sessionStorage里
//       paths: ['theme'] // 指定存储state，不写则存储所有
//     }
//   ]
// },
//   getters: {
//     getTheme: (state): ThemeType => {
//       const hasInit = Object.keys(state.theme).length !== 0
//       console.log(hasInit)
//       if (!hasInit) {
//         console.log('theme未初始化')
//         const themeConfig: ThemeType = JSON.parse(
//           getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' }) || '{}'
//         )
//         console.log(setTheme)
//         // 这里因为上面设置了localstorage的缓存，就不用setCookie了
//         if (themeConfig) {
//           this.setTheme(themeConfig)
//         } else {
//           this.setTheme(defaultThemeConfig)
//         }
//       }
//       console.log('theme初始化')
//       console.log(state.theme)
//       return state.theme
//     }
//   },
//   actions: {
//     setTheme(data: ThemeType) {
//       state.theme = data
//     }
//   }
// }