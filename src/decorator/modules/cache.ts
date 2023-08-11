import { ObjectType } from '@/types'

/**
 * desc: 缓存装饰器 @cacheDecorator
 * @param target
 * @param key
 * @param descriptor
 */
export const cacheDecorator = (target: any, key: string, descriptor: any) => {
  const cache: ObjectType = {} // 缓存对象

  window.App.$console.log('@cacheDecorator:', target, key, descriptor)
  const originalMethod = descriptor.value // 保存原始方法

  descriptor.value = function (...args: any[]) {
    const cacheKey: string = JSON.stringify(args) // 生成缓存键

    if (cacheKey in cache) {
      window.App.$console.log('从缓存中获取结果')
      return cache[cacheKey] // 直接返回缓存结果
    }

    // 执行原始方法
    const result = originalMethod.apply(this, args)

    window.App.$console.log('将结果缓存起来')
    cache[cacheKey] = result // 缓存结果

    return result
  }

  return descriptor
}

// 示例类
// class Example {
//   @cacheDecorator
//   getValue(key) {
//     console.log('执行函数逻辑')
//     return key + Math.random() // 模拟复杂的计算逻辑
//   }
// }
//
// // 测试
// const example = new Example()
// console.log(example.getValue('foo'))
// console.log(example.getValue('foo')) // 从缓存中获取结果
