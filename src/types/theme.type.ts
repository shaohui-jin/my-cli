type ThemeSidebar = {
  // 是否展开菜单
  isCollapse: boolean
}

type ThemeHeader = {
  // 头部标题
  title: string
}

export type ThemeType = Record<'sidebar', ThemeSidebar> & Record<'header', ThemeHeader>
