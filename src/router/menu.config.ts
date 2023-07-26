import { Document, Menu as IconMenu, Location } from '@element-plus/icons-vue'

interface Icon {
  render: Function
}

const defaultIcon: Icon = {
  render: () => {}
}

interface MenuItem {
  title: string
  icon: Icon
  route?: string
}

// 一级
export interface Menu extends MenuItem {
  childMenu?: SubMenu[] | MenuItemGroup[]
}

// 二级
interface SubMenu extends MenuItem {
  isGroup: false
}

export interface MenuItemGroup extends MenuItem {
  isGroup: true
  childMenu: MenuItem[]
}

// 对外使用的类型
export type MenuItemType = SubMenu | MenuItemGroup | MenuItem

export const menu: Menu[] = [
  {
    icon: IconMenu as Icon,
    title: '首页',
    route: '/home'
  },
  {
    icon: Document as Icon,
    title: '头像',
    route: '/file/images'
  },
  {
    icon: Location as Icon,
    title: '测试菜单结构',
    childMenu: [
      {
        isGroup: true,
        icon: defaultIcon,
        title: 'Group One',
        childMenu: [
          { icon: defaultIcon, route: '/file/images', title: 'child one' },
          { icon: defaultIcon, route: '/file/images', title: 'child two' }
        ]
      },
      {
        isGroup: true,
        title: 'Group Two',
        icon: defaultIcon,
        childMenu: [{ icon: defaultIcon, route: '/file/images', title: 'child three' }]
      },
      {
        isGroup: false,
        icon: defaultIcon,
        title: 'Item four'
      }
    ]
  }
]
