/**
 * desc: 防抖装饰器 @debounceDecorator
 * @param time
 */
export const debounceDecorator = (time: number) => {
  return function (target, key, descriptor) {
    const oldFunction = descriptor.value
    let timer = null
    descriptor.value = function () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        console.log('zhongduanle')
        oldFunction.apply(this, arguments)
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
  return function (target, key, descriptor) {
    const oldFunction = descriptor.value
    let isLock = false
    descriptor.value = function () {
      if (isLock) {
        return
      }
      isLock = true
      oldFunction.apply(this, arguments)
      setTimeout(() => {
        isLock = false
      }, time)
    }
    return descriptor
  }
}
