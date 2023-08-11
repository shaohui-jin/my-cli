import { ThemeType, BaseComponentItem } from '@/types'

/**
 * 默认场景参数
 */
export const defaultThemeConfig: ThemeType = {
  sidebar: {
    isCollapse: false
  },
  navbar: {
    isBreadCrumb: true
  },
  header: {
    title: '小石头潭记'
  },
  layout: {
    headerHeight: 50,
    navbarHeight: 30,
    footerHeight: 40,
    asideWidth: 250
  }
}

// 常用场景枚举
export enum THEME_ENUM {
  SIDEBAR_IS_COLLAPSE = 'sidebar.isCollapse', // 是否折叠菜单
  NAVBAR_IS_BREADCRUMB = 'navbar.isBreadCrumb', // 是否展示面包屑
  HEADER_TITLE = 'header.title', // 顶部标题
  LAYOUT_HEADER_HEIGHT = 'layout.headerHeight', // 顶部高度
  LAYOUT_NAVBAR_HEIGHT = 'layout.navbarHeight', // 面包屑高度
  LAYOUT_FOOTER_HEIGHT = 'layout.footerHeight', // 底部高度
  LAYOUT_ASIDE_WIDTH = 'layout.asideWidth' // 菜单宽度
}

export const defaultThemeForm: BaseComponentItem[] = [
  {
    type: 'switch',
    key: THEME_ENUM.SIDEBAR_IS_COLLAPSE,
    label: '是否折叠菜单',
    activeText: 'on',
    inactiveText: 'off',
    activeIcon: 'Check',
    inactiveIcon: 'Close'
  },
  {
    type: 'switch',
    key: THEME_ENUM.NAVBAR_IS_BREADCRUMB,
    label: '是否展示面包屑',
    activeText: 'on',
    inactiveText: 'off',
    activeIcon: 'Check',
    inactiveIcon: 'Close'
  },
  {
    type: 'input',
    key: THEME_ENUM.HEADER_TITLE,
    label: '顶部标题'
  },
  {
    type: 'input',
    key: THEME_ENUM.LAYOUT_HEADER_HEIGHT,
    label: '顶部高度'
  },
  {
    type: 'input',
    key: THEME_ENUM.LAYOUT_NAVBAR_HEIGHT,
    label: '面包屑高度'
  },
  {
    type: 'input',
    key: THEME_ENUM.LAYOUT_FOOTER_HEIGHT,
    label: '底部高度'
  },
  {
    type: 'input',
    key: THEME_ENUM.LAYOUT_ASIDE_WIDTH,
    label: '菜单宽度'
  }
]
