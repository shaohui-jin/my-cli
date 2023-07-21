import { reactive } from 'vue';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import type { DefineComponent } from 'vue';

export const menu = reactive<SubMenu[]>([
  {
    icon: Location,
    title: 'Navigator One',
    childMenu: [
      { isGroup: true, title: 'Group One', childMenu: [{ title: 'child one' }, { title: 'child two' }] },
      { isGroup: true, title: 'Group Two', childMenu: [{ title: 'child three' }] },
      { isGroup: false, title: 'Item four', childMenu: [{ title: 'child four' }] },
    ]
  },
  {
    icon: IconMenu,
    title: 'Navigator Two',
  },
  {
    icon: Document,
    title: 'Navigator Three',
  },
  {
    icon: Setting,
    title: 'Navigator Four',
  }
])

interface SubMenu {
  // 标题名称
  title: string,
  // 图标
  icon?: DefineComponent,
  // 路由
  route?: string,
  click?: Event,
  // 子菜单
  childMenu?: MenuItemGroup[] | SubMenu[]
}


interface MenuItemGroup {
  // 标题名称
  title: string,
  isGroup: true,
  childMenu: MenuItem[]
}
interface MenuItem {
  title: string,
  click?: Event
}

// 对外使用的类型
export type MenuItemType = MenuItemGroup | SubMenu