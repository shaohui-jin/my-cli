interface Icon {
  render: Function
}

type MenuItem = {
  title: string
  icon: Icon
  route?: string
}

// 一级
export type Menu = MenuItem & {
  childMenu?: SubMenu[] | MenuItemGroup[]
}

// 二级
type SubMenu = MenuItem & { isGroup: false }

export type MenuItemGroup = MenuItem & {
  isGroup: true
  childMenu: MenuItem[]
}

// 对外使用的类型
export type MenuItemType = SubMenu | MenuItemGroup | MenuItem

// // 权限编码 权限描述  权限名称 权限路径
// export type BaseAction = Record<
//   'actionCode' | 'actionDesc' | 'actionName' | 'actionPath' | 'parentId',
//   string
// > & {
//   serialNum: number
// }
//
// export interface Action extends BaseAction {
//   actionType: string //
//   isDefault: null
//   isOwn: null
//   // 唯一id
//   actionId: string
//   // 子菜单
//   subAction: Action[]
// }
//
// export interface SilderMenuItem {
//   value: string
//   title: string
//   actionPath: string
//   children: SilderMenuItem[]
// }
//
// export type BaseRole = Record<'roleName' | 'tenantId' | 'hospitalName', string> &
//   Record<'roleType', 0 | 1 | 2>
//
// export type Role = BaseRole &
//   Record<'roleId' | 'createUserId', string> & {
//     actionList: Action[]
//   }
