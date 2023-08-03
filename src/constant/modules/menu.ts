import { Document, Menu as IconMenu, Location } from '@element-plus/icons-vue'
import { Menu } from '@/types'

const defaultIcon: Icon = {
  render: () => {}
}

export const defaultMenuConfig: Menu[] = [
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
