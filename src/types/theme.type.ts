type ThemeSidebar = {
  // 是否展开菜单
  isCollapse: boolean
}

type ThemeHeader = {
  // 顶部标题
  title: string
}

type ThemeNavbar = {
  // 是否展示面包屑
  isBreadCrumb: boolean
}

type ThemeLayout = {
  // 是否展示面包屑
  headerHeight: number
  navbarHeight: number
  footerHeight: number
  asideWidth: number
}

export type ThemeType = Record<'sidebar', ThemeSidebar> &
  Record<'header', ThemeHeader> &
  Record<'navbar', ThemeNavbar> &
  Record<'layout', ThemeLayout>
