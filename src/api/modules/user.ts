import { ILoginApiParams, ILoginData, IUserApi } from '@/api/types/user'
import { useStore } from '@/store'
import { UserType } from '@/store/modules/user.ts'

// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
export const adminRoles: Array<string> = ['admin']
// admin 按钮权限标识
export const adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link']
// admin 头像
export const adminPhoto: string =
  'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg'
// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
export const testRoles: Array<string> = ['common']
// test 按钮权限标识
export const testAuthBtnList: Array<string> = ['btn.add', 'btn.link']
// test 头像
export const testPhoto: string =
  'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=317673774,2961727727&fm=26&gp=0.jpg'
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
  }
}

export default UserApi

/**
 * 用户退出登录
 */
// export function signOut(params: object) {
// 	return request({
// 		url: '/user/signOut',
// 		method: 'post',
// 		data: params,
// 	});
// }
// export function signOut() {
//   return new Promise<void>((resolve, reject) => {
//     Session.clear(); // 清除缓存/token等
//     resetRoute(); // 删除/重置路由
//     resolve()
//   })
// }
