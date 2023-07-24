import { Response } from '@/types'

export interface Artwork {
  id: number
  // 标题名称
  name: string
  user_id: number
  merchant_id: number
  author_id: number
  business_id: number
  // 是否置顶
  is_top: '1' | '0'
  artworks_type_id: number
  artworksInfo: Array
  audit_status: 'success'
  // 添加时间
  created_at: number
  // 修改时间
  updated_at: number
  // 删除时间
  deleted_at: number
}

/**
 * 文件相关接口
 * --------------------------------------------------------------------------
 */
export interface IFileApi {
  // login: (params: ILoginApiParams) => Promise<StoreState.ResType<ILoginData>>
  /**
   * 获取图片列表
   * */
  getArtworks: () => Promise<Response<Artwork[]>>
  a: number
}
