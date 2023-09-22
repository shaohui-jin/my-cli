/**
 * 接口返回结果Types
 * --------------------------------------------------------------------------
 */
// 登录返回结果
export interface ILoginData {
  token: string
  userInfo: {
    address: string
    username: string
  }
  authList: Array<string>
  authBtnList: Array<string>
}

/**
 * 接口参数Types
 * --------------------------------------------------------------------------
 */
export interface ILoginApiParams {
  username: string // 用户名
  password: string // 密码
  captcha: string // 验证码
}

/**
 * 接口定义Types
 * --------------------------------------------------------------------------
 */
export interface IUserApi {
  // 验证码登录
  login: (params: ILoginApiParams) => Promise<ILoginData>
  // 用户退出登录
  signOut: () => Promise
}
