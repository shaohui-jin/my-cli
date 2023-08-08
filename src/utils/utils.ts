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
   * desc: 数组扁平化
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
}
export default Utils
