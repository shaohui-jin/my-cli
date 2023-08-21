import { defineStore } from 'pinia'
import { CookieEnum } from '@/constant'
import { reactive, toRefs } from 'vue'
import { isObjectEmpty } from '@/utils/common.ts'
import { getCookie } from '@/utils/cookie.ts'

/**
 * 默认场景参数
 */
const defaultThemeConfig: ThemeType = {
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
  isCollapse: false,
  isUniqueOpened: false, // 是否开启菜单手风琴效果
  isFixedHeader: false,
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
  isTagView: true,
  isBreadcrumbIcon: false, // 是否开启 Breadcrumb 图标
  isTagViewIcon: false, // 是否开启 Tagsview 图标
  isCacheTagsView: false, // 是否开启 TagsView 缓存
  isSortableTagsView: true, // 是否开启 TagsView 拖拽
  isShareTagsView: false, // 是否开启 TagsView 共用
  isFooter: true,
  isGrayscale: false, // 是否开启灰色模式
  isInvert: false, // 是否开启色弱模式
  isIsDark: false, // 是否开启深色模式
  isWartermark: false, // 是否开启水印
  wartermarkText: '帅气小辉', // 水印文案
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
  layout: 'default',
  /** 后端控制路由  */
  isRequestRoutes: false,
  /** 全局网站标题 / 副标题 */
  globalTitle: '小石头潭记',
  globalViceTitle: '帅气小辉',
  globalI18n: 'zh-cn',
  globalComponentSize: 'large'
}

// 场景类型， 已经使用的默认场景参数才写进来
export type ThemeType = {
  // 是否开启菜单水平折叠效果
  isCollapse: boolean
  // 是否开启固定 Header
  isFixedHeader: boolean

  // 是否开启 TagView
  isTagView: boolean
  // 是否开启 Footer 底部版权信息
  isFooter: boolean

  // 是否开启后端控制路由
  isRequestRoutes: boolean

  // 布局切换
  layout: 'default' | 'classic' | 'transverse' | 'columns'

  // 网站主标题（菜单导航、浏览器当前网页标题）
  globalTitle: string
  // 网站副标题（登录页顶部文字）
  globalViceTitle: string
  // 默认初始语言
  globalI18n: 'zh-cn' | 'en' | 'zh-tw'
  // 默认全局组件大小
  globalComponentSize: '' | 'default' | 'small' | 'large'
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
