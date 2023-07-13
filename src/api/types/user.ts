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
}

/**
 * 接口参数Types
 * --------------------------------------------------------------------------
 */
// 登录参数
export interface ILoginApiParams {
  username: string // 用户名
  password: string // 密码
  captcha: string // 验证码
  uuid: string // 验证码uuid
}

/**
 * 接口定义Types
 * --------------------------------------------------------------------------
 */
export interface IUserApi {
  login: (params: ILoginApiParams) => Promise<StoreState.ResType<ILoginData>>
}