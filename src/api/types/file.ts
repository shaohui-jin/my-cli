export interface ILoginData {
  token: string
  userInfo: {
    address: string
    username: string
  }
}

/**
 * 接口定义Types
 * --------------------------------------------------------------------------
 */
export interface IFileApi {
  // login: (params: ILoginApiParams) => Promise<StoreState.ResType<ILoginData>>
  /**
   * 获取图片列表
   * */
  getImageList: () => Promise<unknown>
}
