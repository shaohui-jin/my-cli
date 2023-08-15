import { ObjectType } from '@/types'

/**
 * desc: 对象扁平化
 * @param obj
 * @param prefix
 */
const flattenObject = (obj: ObjectType, prefix = ''): ObjectType => {
  return Object.keys(obj).reduce(
    (acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        Object.assign(acc, flattenObject(obj[k], pre + k))
      } else {
        acc[pre + k] = obj[k]
      }
      return acc
    },
    {} as Record<string, any>
  )
}

/**
 * 扁平化对象还原
 * @param obj
 */
const unFlattenObject = (obj: Record<string, any>): ObjectType => {
  const result: any = {}
  for (const key in obj) {
    const keys = key.split('.')
    let nestedObj = result
    for (let i = 0; i < keys.length - 1; i++) {
      if (!nestedObj[keys[i]]) {
        nestedObj[keys[i]] = {}
      }
      nestedObj = nestedObj[keys[i]]
    }
    nestedObj[keys[keys.length - 1]] = obj[key]
  }
  return result
}

/**
 * desc: 集合扁平化
 * @param  arr 原数组
 * @param prefix 标识
 * @return 扁平化后的数组
 */
const flattenArray = (arr: any[], prefix = ''): any[] => {
  return arr.reduce((result, item): any[] => {
    result = result.concat(item)
    const checkData = prefix ? item[prefix] : item
    if (Array.isArray(checkData)) {
      return result.concat(flattenArray(checkData, prefix))
    }
    return result
  }, [])
}

/***
 * desc: 判断对象是否为空
 * @param {Object} obj
 * @return 是否为空
 */
const isObjectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * 检查是否未定义
 * @param variable 被检查的对象
 * @return 是否未定义
 */
const checkUndefined = (variable: any): boolean => {
  return typeof variable === 'undefined'
}

/**
 * desc: 获取字符串键值对的值
 * @param path 请求头
 * @param name key
 * @return 值
 */
const getQueryString = (path: string, name: string): string | null => {
  const reg = new RegExp('(^|;)' + name + '=([^;]*)(;|$)', 'i')
  const r = path.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * desc:防抖函数实现
 * @param callback 回调函数
 * @param interval 间隔时间
 * @param isImmediate 是否第一次执行
 */
const debounce = (
  callback: (...rest: any) => void,
  interval: number = 500,
  isImmediate: boolean = true
): ((this: any, ...rest: any[]) => void) => {
  let timer: NodeJS.Timeout

  return function (this: any, ...rest: any[]) {
    if (isImmediate) {
      callback.apply(this, rest)
      isImmediate = false
      return
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      callback.apply(this, rest)
      clearTimeout(timer)
      timer = null as any as NodeJS.Timeout
    }, interval)
  }
}

/**
 * 节流函数
 * @param callback 回调函数
 * @param interval 时间
 */
const throttle = (callback: (...rest: any) => void, interval: number = 500): ((this: any, ...rest: any[]) => void) => {
  let oldTime: number = 0
  return function (this: any, ...rest: any[]) {
    const newTime: number = new Date().getTime()

    if (newTime - oldTime > interval) {
      oldTime = newTime
      callback.apply(this, rest)
    }
  }
}

export default {
  flattenObject,
  unFlattenObject,
  flattenArray,
  isObjectEmpty,
  checkUndefined,
  getQueryString,
  debounce,
  throttle,
}