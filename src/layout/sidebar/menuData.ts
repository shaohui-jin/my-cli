import { reactive } from "vue";
import { Document, Location, Setting } from "@element-plus/icons-vue";
import { Menu as IconMenu } from "@element-plus/icons-vue/components";

const menu = reactive<HTMLUListElement>([
  {
    icon: Location,
    title: 'Navigator One',
    childMenu: [
      { isGroup: true, title: 'Group One', groupMenu: [{ title: 'item one' }, { title: 'item two' }] },
      { isGroup: true, title: 'Group Two', groupMenu: [{ title: 'item three' }] },
      { isGroup: false, title: 'item four', childMenu: [{ title: 'item three' }] },
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
  icon: any,
  // 子菜单
  childMenu?: any[]
}

interface MenuItemGroup {
  // 标题名称
  title: string,

}


// <el-sub-menu
// index={ menuIndex.toString() }
// v-slots={ {
//   title: () => {
//     return <>
//         <el-icon>{ menuItem.icon }</el-icon>
//       <span>{ menuItem.title }</span>
//       </>
//   }
// } }
// >
// <el-menu-item-group title="Group Two">
//   <el-menu-item index="1-3">item three</el-menu-item>
// </el-menu-item-group>
{/*<el-sub-menu index="1-4">*/ }
{/*  <template #title><span>item four</span></template>*/ }
{/*<el-menu-item index="1-4-1">item one</el-menu-item>*/ }
{/*</el-sub-menu>*/ }
// </el-sub-menu>