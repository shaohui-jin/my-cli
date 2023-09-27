import { defineStore } from 'pinia'
import { CookieEnum } from '@/constant'
import { reactive, toRefs } from 'vue'
import { isObjectEmpty } from '@/utils/common.ts'
import { getCookie } from '@/utils/cookie.ts'

/**
 * 默认场景参数
 */
const defaultThemeConfig: ThemeType = {
  isDrawer: false,

  primary: '#409eff',
  success: '#67c23a',
  info: '#909399',
  warning: '#e6a23c',
  danger: '#f56c6c',
  topBar: '#ffffff',
  menuBar: '#545c64',
  columnsMenuBar: '#545c64',
  topBarColor: '#606266',
  menuBarColor: '#eaeaea',
  columnsMenuBarColor: '#e6e6e6',

  isTopBarColorGradual: false,
  isMenuBarColorGradual: false,
  isColumnsMenuBarColorGradual: false,
  isMenuBarColorHighlight: false,
  isCollapse: false,
  isUniqueOpened: false,
  isFixedHeader: false,
  isFixedHeaderChange: false,
  isClassicSplitMenu: false,
  isLockScreen: false,
  lockScreenTime: 30,
  isShowLogo: true,
  isShowLogoChange: false,
  isBreadcrumb: true,
  isTagView: true,
  isBreadcrumbIcon: true,
  isTagViewIcon: true,
  isCacheTagView: false,
  isSortableTagView: true,
  isShareTagView: true,
  isFooter: true,
  isGrayscale: false,
  isInvert: false,
  isIsDark: false,
  isWatermark: false,
  watermarkText: '帅气小辉',
  layout: 'default',

  // tagStyle: 'tags-style-five',
  tagStyle: 'tags-style-one',
  animation: 'slide-right',
  columnsAsideStyle: 'columns-round',
  columnsAsideLayout: 'columns-vertical',

  isRequestRoutes: false,

  globalTitle: '小石头潭记',
  globalViceTitle: '帅气小辉',
  globalI18n: 'zh-cn',
  globalComponentSize: ''
}

/** 全局主题 */
type ThemeOption = {
  // 默认 primary 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  primary: string
  // 默认 success 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  success: string
  // 默认 info 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  info: string
  // 默认 warning 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  warning: string
  // 默认 danger 颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  danger: string
  // 默认顶栏导航背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  topBar: string
  // 默认菜单导航背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  menuBar: string
  // 默认分栏菜单背景颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  columnsMenuBar: string
  // 默认顶栏导航字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  topBarColor: string
  // 默认菜单导航字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  menuBarColor: string
  // 默认分栏菜单字体颜色，请注意：需要同时修改 `@/theme/common/var.scss` 对应的值
  columnsMenuBarColor: string
}

/** 布局设置 */
type LayoutOption = {
  // 是否开启顶栏背景颜色渐变
  isTopBarColorGradual: boolean
  // 是否开启菜单背景颜色渐变
  isMenuBarColorGradual: boolean
  // 是否开启分栏菜单背景颜色渐变
  isColumnsMenuBarColorGradual: boolean
  // 是否开启菜单字体背景高亮
  isMenuBarColorHighlight: boolean
  // 是否开启菜单水平折叠效果
  isCollapse: boolean
  // 是否开启菜单手风琴效果
  isUniqueOpened: boolean
  // 是否开启固定 Header
  isFixedHeader: boolean
  // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
  isFixedHeaderChange: boolean
  // 是否开启经典布局分割菜单（仅经典布局生效）
  isClassicSplitMenu: boolean
  // 是否开启自动锁屏
  isLockScreen: boolean
  // 开启自动锁屏倒计时(s/秒)
  lockScreenTime: number
  // 是否开启侧边栏 Logo
  isShowLogo: boolean
  // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
  isShowLogoChange: boolean
  // 是否开启 Breadcrumb，强制经典、横向布局不显示
  isBreadcrumb: boolean
  // 是否开启 TagView
  isTagView: boolean
  // 是否开启 Breadcrumb 图标
  isBreadcrumbIcon: boolean
  // 是否开启 TagView 图标
  isTagViewIcon: boolean
  // 是否开启 TagView 缓存
  isCacheTagView: boolean
  // 是否开启 TagView 拖拽
  isSortableTagView: boolean
  // 是否开启 TagView 共用
  isShareTagView: boolean
  // 是否开启 Footer 底部版权信息
  isFooter: boolean
  // 是否开启灰色模式
  isGrayscale: boolean
  // 是否开启色弱模式
  isInvert: boolean
  // 是否开启深色模式
  isIsDark: boolean
  // 是否开启水印
  isWatermark: boolean
  // 水印文案
  watermarkText: string
  // 布局切换
  layout: 'default' | 'classic' | 'transverse' | 'columns'
}

/** 其它设置 */
type OtherOption = {
  // TagView 风格，定义的值与 `/src/layout/navBars/tagView/tagView.vue` 中的 class 同名
  tagStyle: 'tags-style-one' | 'tags-style-two' | 'tags-style-three' | 'tags-style-four' | 'tags-style-five'
  // 主页面切换动画
  animation: 'slide-right' | 'slide-left' | 'opacitys'
  // 分栏高亮风格
  columnsAsideStyle: 'columns-round' | 'columns-card'
  // 分栏布局风格
  columnsAsideLayout: 'columns-horizontal' | 'columns-vertical'
}

/** 后端控制路由  */
type RouteOption = {
  // 是否开启后端控制路由
  isRequestRoutes: boolean
}

/** 全局网站标题 / 副标题 */
type GlobalOption = {
  // 网站主标题（菜单导航、浏览器当前网页标题）
  globalTitle: string
  // 网站副标题（登录页顶部文字）
  globalViceTitle: string
  // 默认初始语言
  globalI18n: 'zh-cn' | 'en' | 'zh-tw'
  // 默认全局组件大小
  globalComponentSize: '' | 'default' | 'small' | 'large'
}

// 场景类型， 已经使用的默认场景参数才写进来
export type ThemeType = ThemeOption &
  OtherOption &
  GlobalOption &
  RouteOption &
  LayoutOption & {
    // 是否开启布局配置抽屉
    isDrawer: boolean
  }

export const ThemeStore = defineStore(
  'theme',
  () => {
    let config = JSON.parse(getCookie(CookieEnum.CUSTOM_THEME, { type: 'localStorage' }) || '{}')
    config = isObjectEmpty(config) ? defaultThemeConfig : config
    // if (isObjectEmpty(config)) {
    //   useStore().useThemeStore.$patch(defaultThemeConfig)
    //   // setThemeConfig(defaultThemeConfig)
    // } else {
    //   useStore().useThemeStore.$patch(config)
    //   // setThemeConfig(config)
    // }

    const themeConfig = reactive<ThemeType>(config)
    const getThemeConfig = (): ThemeType => themeConfig

    return {
      ...toRefs(themeConfig),
      getThemeConfig
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: CookieEnum.CUSTOM_THEME,
          storage: localStorage
        }
      ]
    }
  }
)
