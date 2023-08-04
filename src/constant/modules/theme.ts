import { ThemeType, BaseComponentItem } from '@/types'

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

export const defaultThemeForm: BaseComponentItem[] = [
  {
    type: 'switch',
    key: 'sidebar.isCollapse',
    label: '是否折叠菜单',
    activeText: 'on',
    inactiveText: 'off',
    activeIcon: 'Check',
    inactiveIcon: 'Close'
  },
  {
    type: 'switch',
    key: 'navbar.isBreadCrumb',
    label: '是否展示面包屑',
    activeText: 'on',
    inactiveText: 'off',
    activeIcon: 'Check',
    inactiveIcon: 'Close'
  },
  {
    type: 'input',
    key: 'header.title',
    label: '顶部标题'
  },
  {
    type: 'input',
    key: 'layout.headerHeight',
    label: '顶部高度'
  },
  {
    type: 'input',
    key: 'layout.navbarHeight',
    label: '面包屑高度'
  },
  {
    type: 'input',
    key: 'layout.footerHeight',
    label: '底部高度'
  },
  {
    type: 'input',
    key: 'layout.asideWidth',
    label: '菜单宽度'
  }
]
