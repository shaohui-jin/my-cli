import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

//todo getToken
const token = 'unknown'

// create an axios instance
const service: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || '', // 正式环境
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截
 */
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers && (config.headers.Authorization = token) // 请求头带上token
    config.headers && (config.headers.token = token)
    return config as any
  },
  error => Promise.reject(error)
)

/**
 * 响应拦截
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status == 201 || response.status == 200) {
      const { code, status, msg } = response.data
      if (code == 401) {
        // ElMessageBox.confirm({
        //   title: 'token出错',
        //   message: 'token失效，请重新登录！',
        //   onOk: () => {
        //     sessionStorage.clear()
        //   }
        // })
        sessionStorage.clear()
      } else if (code == 200) {
        if (status) {
          // 接口请求成功
          ElMessage.success(msg) // 后台如果返回了msg，则将msg提示出来
          return Promise.resolve(response) // 返回成功数据
        }
        // 接口异常
        ElMessage.warning(msg) // 后台如果返回了msg，则将msg提示出来
        return Promise.reject(response) // 返回异常数据
      } else {
        // 接口异常
        ElMessage.error(msg)
        return Promise.reject(response)
      }
    }
    return response
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          ElNotification.error({
            title: '温馨提示',
            message: '服务异常，请重启服务器！'
          })
          break
        case 401:
          ElNotification.error({
            title: '温馨提示',
            message: '服务异常，请重启服务器！'
          })
          break
        case 403:
          ElNotification.error({
            title: '温馨提示',
            message: '服务异常，请重启服务器！'
          })
          break
        // 404请求不存在
        case 404:
          ElNotification.error({
            title: '温馨提示',
            message: '服务异常，请重启服务器！'
          })
          break
        default:
          ElNotification.error({
            title: '温馨提示',
            message: '服务异常，请重启服务器！'
          })
      }
    }
    return Promise.reject(error.response)
  }
)

interface Http {
  fetch<T>(params: AxiosRequestConfig): Promise<T>
}

const http: Http = {
  // 用法与axios一致（包含axios内置所有请求方式）
  fetch(params) {
    return new Promise((resolve, reject) => {
      service(params)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    })
  }
}

export default http['fetch']
