import { ObjectType } from '@/types'

// todo 搞成类就是为了使用装饰器，如： @debounceDecorator
class Utils {
  /**
   * desc: 对象扁平化
   * @param obj
   * @param prefix
   */
  static flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
    return Object.keys(obj).reduce(
      (acc, k) => {
        const pre = prefix.length ? prefix + '.' : ''
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          Object.assign(acc, this.flattenObject(obj[k], pre + k))
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
  static unFlattenObject(obj: Record<string, any>): ObjectType {
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
  static flattenArray(arr: any[], prefix = ''): any[] {
    return arr.reduce((result, item): any[] => {
      result = result.concat(item)
      const checkData = prefix ? item[prefix] : item
      if (Array.isArray(checkData)) {
        return result.concat(this.flattenArray(checkData, prefix))
      }
      return result
    }, [])
  }

  /***
   * desc: 判断对象是否为空
   * @param {Object} obj
   * @return 是否为空
   */
  static isObjectEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0
  }

  /**
   * desc: 格式化时间
   * @param {number/Date} time 时间
   * @param {string} fmt 格式
   * @return 格式化hou de 时间
   */
  static format(time: number | Date, fmt: string) {
    time = typeof time === 'number' ? new Date(time) : time
    let o = {
      'M+': time.getMonth() + 1, //月份
      'd+': time.getDate(), //日
      'h+': time.getHours(), //小时
      'm+': time.getMinutes(), //分
      's+': time.getSeconds(), //秒
      'q+': Math.floor((time.getMonth() + 3) / 3), //季度
      'S': time.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
    return fmt
  }

  //
  /**
   * desc: 获取剩余 非整数
   * @param startDate
   * @param days
   * @param endDate
   */
  static getRestDays(startDate: string, days: number, endDate = new Date()): number {
    return (
      (endDate.getTime() - (new Date(startDate + ' 00:00:00').getTime() + days * 86400000)) /
      86400000
    )
  }

  /**
   * desc: 文件转base64
   * @param file 文件
   * @return 文件base64流
   */
  static getBase64(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => {
        console.group('===file转base64失败===')
        console.log('name====getBase64')
        console.log('file====', file)
        console.log('error====', error)
        console.groupEnd()
      }
    })
  }

  /**
   * desc:防抖函数实现
   * @param callback 回调函数
   * @param interval 间隔时间
   * @param isImmediate 是否第一次执行
   */
  static debounce(
    callback: (...rest: any) => void,
    interval: number = 500,
    isImmediate: boolean = true
  ): (this: any, ...rest: any[]) => void {
    let timer: number = null

    return function (this: any, ...rest: any[]) {
      if (isImmediate) {
        callback.apply(this, rest)
        isImmediate = false
        return
      }
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        callback.apply(this, rest)
        clearTimeout(timer as number)
        timer = null
      }, interval)
    }
  }

  /**
   * 节流函数
   * @param callback 回调函数
   * @param interval 时间
   */
  static throttle(
    callback: (...rest: any) => void,
    interval: number = 500
  ): (this: any, ...rest: any[]) => void {
    let oldTime: number = 0
    return function (this: any, ...rest: any[]) {
      let newTime: number = new Date().getTime()

      if (newTime - oldTime > interval) {
        oldTime = newTime
        callback.apply(this, rest)
      }
    }
  }

  /**
   * desc: 判断是否为平年
   * @param year 年份
   * @return 是否为平年
   */
  static isOrdinaryYear(year: number): boolean {
    return !((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
  }

  /**
   * desc: 获取字符串键值对的值
   * @param path 请求头
   * @param name key
   * @return 值
   */
  static getQueryString(path: string, name: string): string {
    let reg = new RegExp('(^|;)' + name + '=([^;]*)(;|$)', 'i')
    let r = path.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  /**
   * 检查是否未定义
   * @param variable 被检查的对象
   * @return 是否未定义
   */
  static checkUndefined = (variable: any): boolean => {
    return typeof variable === 'undefined'
  }

  /**
   * @todo 还没有定义入参类型
   * desc: 处理下载的blob数据
   * @param response 接口返回的数据
   */
  static handleBlob = (response: any) => {
    const filename = getQueryString(response.headers['content-disposition'], 'filename')
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(response.data)
    //设置文件名称
    a.download = filename as string
    if (navigator.userAgent.indexOf('Firefox') > 0) {
      // 火狐浏览器
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    } else {
      a.click()
    }
    document.body.appendChild(a)
  }
}
export default Utils
