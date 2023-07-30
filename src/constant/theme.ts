import { ThemeType, BaseComponentItem } from '@/types'

export const defaultThemeConfig: ThemeType = {
  sidebar: {
    isCollapse: false
  },
  header: {
    title: '小石头潭记'
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
    type: 'input',
    key: 'header.title',
    label: '小石头潭记'
  }
]
