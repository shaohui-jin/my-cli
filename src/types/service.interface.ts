import { AxiosResponse } from 'axios'

// 都是字符串
export enum STATUS {
  // 成功
  SUCCESS = '0',
  // 无数据
  NONE_DATA = '1',
  // token过期需要重登录
  TOKEN_EXPIRED = '100',
  // 系统异常
  SYSTEM_ERROR = '-1',
  // 验证码不对
  ERROR_CODE = '111'
}

/**
 * 基础响应体
 * */
interface BaseResponse {
  // 编码
  resultCode: STATUS
  // 描述
  resultDesc: string
  // 状态
  success: boolean
}

/**
 * 通用对象响应体
 * */
export interface Response<T = any> extends BaseResponse {
  data?: T
}

/**
 * 通用集合响应体
 * */
export interface ArrayResponse<T = any> extends BaseResponse {
  data: T[]
}

/**
 * 表格数据响应体
 * */
export interface TableResponse<T = any> extends BaseResponse {
  data: T[] | { [K: string]: T[] }
}

/**
 * 文件流响应体
 * */
export type BlobResponse = AxiosResponse<Blob>

// export interface TableRequest<T> {
//   (params?: any): Promise<TableResponse<T>>
// }

// type baseQuery = Record<'pageSize', number>
// export type pageNoQuery = baseQuery & Record<'pageNo', number>
// export type currentPageQuery = baseQuery & Record<'currentPage', number>
