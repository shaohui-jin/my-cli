/**
 * desc: 防抖装饰器 @debounceDecorator
 * @param time
 */
export const debounceDecorator = (time: number) => {
  return function (target: any, key: string, descriptor: any) {
    window.App.$console.log('@debounceDecorator:', target, key, descriptor)
    const oldFunction = descriptor.value
    let timer: NodeJS.Timeout
    descriptor.value = function (...args: any[]) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        oldFunction.apply(this, args)
      }, time)
    }
    return descriptor
  }
}

/**
 * desc: 节流装饰器 @throttleDecorator
 * @param time
 */
export const throttleDecorator = (time: number) => {
  return function (target: any, key: string, descriptor: any) {
    window.App.$console.log('@throttleDecorator:', target, key, descriptor)
    const oldFunction = descriptor.value
    let isLock = false
    descriptor.value = function (...args: any[]) {
      if (isLock) {
        return
      }
      isLock = true
      oldFunction.apply(this, args)
      setTimeout(() => {
        isLock = false
      }, time)
    }
    return descriptor
  }
}
