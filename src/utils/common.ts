import { ObjectType } from '@/types'
import { nextTick } from 'vue'

/**
 * desc: 对象扁平化
 * @param obj
 * @param prefix
 */
export const flattenObject = (obj: ObjectType, prefix = ''): ObjectType => {
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
export const unFlattenObject = (obj: ObjectType): ObjectType => {
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
export const flattenArray = (arr: any[], prefix = 'children'): any[] => {
  return arr.reduce((result, item): any[] => {
    result = result.concat(item)
    const checkData = prefix ? item[prefix] : item
    if (Array.isArray(checkData)) {
      return result.concat(flattenArray(checkData, prefix))
    }
    return result
  }, [])
}

/**
 * desc: 判断两数组是否相同
 * @param news 新数据
 * @param old 源数据
 * @returns 两数组相同返回 `true`，反之则反
 */
export function judgmentSameArr(news: Array<string>, old: Array<string>): boolean {
  let count = 0
  const leng = old.length
  for (const i in old) {
    for (const j in news) {
      if (old[i] === news[j]) count++
    }
  }
  return count === leng
}

/**
 * desc:判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b) return false
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length != bProps.length) return false
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    const propA = a[propName]
    const propB = b[propName]
    if (!Object.prototype.hasOwnProperty.call(b, propName)) return false
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}

/***
 * desc: 判断对象是否为空
 * @param {Object} obj
 * @return 是否为空
 */
export const isObjectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * 检查是否未定义
 * @param variable 被检查的对象
 * @return 是否未定义
 */
export const checkUndefined = (variable: any): boolean => {
  return typeof variable === 'undefined'
}

/**
 * desc: 获取字符串键值对的值
 * @param path 请求头
 * @param name key
 * @return 值
 */
export const getQueryString = (path: string, name: string): string | null => {
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
export const debounce = (
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
export const throttle = (
  callback: (...rest: any) => void,
  interval: number = 500
): ((this: any, ...rest: any[]) => void) => {
  let oldTime: number = 0
  return function (this: any, ...rest: any[]) {
    const newTime: number = new Date().getTime()

    if (newTime - oldTime > interval) {
      oldTime = newTime
      callback.apply(this, rest)
    }
  }
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el: any, arr: any) => {
  const io = new IntersectionObserver(res => {
    res.forEach((v: any) => {
      if (v.isIntersecting) {
        const { img, key } = v.target.dataset
        v.target.src = img
        v.target.onload = () => {
          io.unobserve(v.target)
          arr[key]['loading'] = false
        }
      }
    })
  })
  nextTick(() => {
    document.querySelectorAll(el).forEach(img => io.observe(img))
  })
}

/**
 * 判断是否是移动端
 */
export const isMobile = () => {
  return !!navigator.userAgent.match(
    /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
  )
}
