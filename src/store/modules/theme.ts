import { defineStore } from 'pinia'
import { CookieEnum } from '@/constant'
import { onMounted, ref } from 'vue'
import { isObjectEmpty } from '@/utils/common.ts'
import { getCookie, setCookie } from '@/utils/cookie.ts'

/**
 * 默认场景参数
 */
const defaultThemeConfig: ThemeType = {
  // sidebar: {
  //   isCollapse: false
  // },
  // navbar: {
  //   isBreadCrumb: true
  // },
  // header: {
  //   title: '小石头潭记'
  // },
  // layout: {
  //   headerHeight: 50,
  //   navbarHeight: 30,
  //   footerHeight: 40,
  //   asideWidth: 250
  // },

  isDrawer: false, // 是否开启布局配置抽屉
  /**
   * 全局主题
   */
  primary: '#409eff', // 默认 primary 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  success: '#67c23a', // 默认 success 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  info: '#909399', // 默认 info 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  warning: '#e6a23c', // 默认 warning 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  danger: '#f56c6c', // 默认 danger 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  /**
   * 菜单 / 顶栏
   * 注意：v1.0.17 版本去除设置布局切换，重置主题样式（initSetLayoutChange），
   * 切换布局需手动设置样式，设置的样式自动同步各布局，
   * 代码位置：@/layout/navBars/breadcrumb/setings.vue
   */
  topBar: '#ffffff', // 默认顶栏导航背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  menuBar: '#545c64', // 默认菜单导航背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  columnsMenuBar: '#545c64', // 默认分栏菜单背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  topBarColor: '#606266', // 默认顶栏导航字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  menuBarColor: '#eaeaea', // 默认菜单导航字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  columnsMenuBarColor: '#e6e6e6', // 默认分栏菜单字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  isTopBarColorGradual: false, // 是否开启顶栏背景颜色渐变
  isMenuBarColorGradual: false, // 是否开启菜单背景颜色渐变
  isColumnsMenuBarColorGradual: false, // 是否开启分栏菜单背景颜色渐变
  isMenuBarColorHighlight: false, // 是否开启菜单字体背景高亮
  /**
   * 界面设置
   */
  isCollapse: false, // 是否开启菜单水平折叠效果
  isUniqueOpened: false, // 是否开启菜单手风琴效果
  isFixedHeader: false, // 是否开启固定 Header
  isFixedHeaderChange: false, // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
  isClassicSplitMenu: false, // 是否开启经典布局分割菜单（仅经典布局生效）
  isLockScreen: false, // 是否开启自动锁屏
  lockScreenTime: 30, // 开启自动锁屏倒计时(s/秒)
  /**
   * 界面显示
   */
  isShowLogo: false, // 是否开启侧边栏 Logo
  isShowLogoChange: false, // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
  isBreadcrumb: true, // 是否开启 Breadcrumb，强制经典、横向布局不显示
  isTagsview: true, // 是否开启 Tagsview
  isBreadcrumbIcon: false, // 是否开启 Breadcrumb 图标
  isTagsviewIcon: false, // 是否开启 Tagsview 图标
  isCacheTagsView: false, // 是否开启 TagsView 缓存
  isSortableTagsView: true, // 是否开启 TagsView 拖拽
  isShareTagsView: false, // 是否开启 TagsView 共用
  isFooter: false, // 是否开启 Footer 底部版权信息
  isGrayscale: false, // 是否开启灰色模式
  isInvert: false, // 是否开启色弱模式
  isIsDark: false, // 是否开启深色模式
  isWartermark: false, // 是否开启水印
  wartermarkText: 'small@小柒', // 水印文案
  /**
   * 其它设置
   */
  tagsStyle: 'tags-style-five', // Tagsview 风格：可选值"<tags-style-one|tags-style-two|tags-style-three|tags-style-four|tags-style-five>"，定义的值与 `/src/layout/navBars/tagsView/tagsView.vue` 中的 class 同名
  animation: 'slide-right', // 主页面切换动画：可选值"<slide-right|slide-left|opacitys>"
  columnsAsideStyle: 'columns-round', // 分栏高亮风格：可选值"<columns-round|columns-card>"
  columnsAsideLayout: 'columns-vertical', // 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"
  /**
   * 布局切换
   * 注意：为了演示，切换布局时，颜色会被还原成默认，代码位置：@/layout/navBars/breadcrumb/setings.vue
   * 中的 `initSetLayoutChange(设置布局切换，重置主题样式)` 方法
   */
  layout: 'defaults', // 布局切换：可选值"<defaults|classic|transverse|columns>"
  /**
   * 后端控制路由
   */
  isRequestRoutes: false, // 是否开启后端控制路由
  /**
   * 全局网站标题 / 副标题
   */
  globalTitle: 'vue3-vite-work', // 网站主标题（菜单导航、浏览器当前网页标题）
  globalViceTitle: '帅气小辉', // 网站副标题（登录页顶部文字）
  globalI18n: 'zh-cn', // 默认初始语言，可选值"<zh-cn|en|zh-tw>"
  globalComponentSize: '' // 默认全局组件大小，可选值"<|medium|small|mini>"
}

// 场景类型， 已经使用的默认场景参数才写进来
export type ThemeType = {
  /**
   * 后端控制路由
   */
  isRequestRoutes: boolean // 是否开启后端控制路由
  /**
   * 全局网站标题 / 副标题
   */
  globalViceTitle: string // 网站副标题（登录页顶部文字）
}

export const ThemeStore = defineStore('theme', () => {
  const themeConfig = ref<ThemeType>(defaultThemeConfig)
  const hasInit = ref<boolean>(false)

  onMounted(() => {
    const hasThemeSetting = isObjectEmpty(themeConfig)
    if (!hasInit.value && !hasThemeSetting) {
      const themeConfig: ThemeType = JSON.parse(getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' }) || '{}')
      setThemeConfig(isObjectEmpty(themeConfig) ? defaultThemeConfig : themeConfig)
    }
  })
  const getThemeConfig = (): ThemeType => themeConfig.value
  const setThemeConfig = (themeData: ThemeType) => {
    themeConfig.value = themeData
    setCookie(CookieEnum.CUSTOM_THEME, JSON.stringify(themeData), { type: 'localStorage' })
  }
  const resetThemeConfig = () => setThemeConfig(defaultThemeConfig)

  return {
    themeConfig,
    getThemeConfig,
    setThemeConfig,
    resetThemeConfig
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
//     getThemeConfig: (state): ThemeType => {
//       const hasInit = Object.keys(state.theme).length !== 0
//       console.log(hasInit)
//       if (!hasInit) {
//         console.log('theme未初始化')
//         const themeConfig: ThemeType = JSON.parse(
//           getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' }) || '{}'
//         )
//         console.log(setThemeConfig)
//         // 这里因为上面设置了localstorage的缓存，就不用setCookie了
//         if (themeConfig) {
//           this.setThemeConfig(themeConfig)
//         } else {
//           this.setThemeConfig(defaultThemeConfig)
//         }
//       }
//       console.log('theme初始化')
//       console.log(state.theme)
//       return state.theme
//     }
//   },
//   actions: {
//     setThemeConfig(data: ThemeType) {
//       state.theme = data
//     }
//   }
// }
