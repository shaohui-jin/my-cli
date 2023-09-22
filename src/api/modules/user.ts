import { ILoginApiParams, ILoginData, IUserApi } from '@/api/types/user'
import { useStore } from '@/store'
import { UserType } from '@/store/modules/user.ts'
import { resetRoute } from '@/router/utils.ts'

// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
export const adminRoles: Array<string> = ['admin']
// admin 按钮权限标识
export const adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link']
// admin 头像
export const adminPhoto: string = '/ms-icon-144.png'
// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
export const testRoles: Array<string> = ['common']
// test 按钮权限标识
export const testAuthBtnList: Array<string> = ['btn.add', 'btn.link']
// test 头像
export const testPhoto: string = '/ms-icon-144.png'
export const token: string = 'this is token'

const UserApi: IUserApi = {
  login: ({ username }: ILoginApiParams) => {
    return new Promise<ILoginData>(resolve => {
      // 不同用户模拟不同的用户权限
      const isAdmin: boolean = username === 'admin'
      const defaultRoles: Array<string> = isAdmin ? adminRoles : testRoles
      const defaultAuthBtnList: Array<string> = isAdmin ? adminAuthBtnList : testAuthBtnList
      const defaultPhoto: string = isAdmin ? adminPhoto : testPhoto
      // 用户信息模拟数据
      const userInfo: any = {
        username: username,
        photo: defaultPhoto,
        time: new Date().getTime()
      }
      const loginData: UserType = {
        userInfo,
        token,
        authList: defaultRoles,
        authBtnList: defaultAuthBtnList
      }
      useStore().useUserStore.$patch(loginData)
      resolve(loginData)
    })
  },
  signOut: () => {
    return new Promise<void>(resolve => {
      useStore().$reset() // 清除缓存/token等
      resetRoute() // 删除/重置路由
      resolve()
    })
  }
}

export default UserApi
