type LEVEL = 'log' | 'info' | 'warn' | 'error'
const logLevel: Record<LEVEL, Record<'icon' | 'color', string>> = {
  log: { icon: '☺', color: 'black' },
  info: { icon: 'ℹ️', color: 'blue' },
  warn: { icon: '⚠️', color: 'orange' },
  error: { icon: '❌', color: 'red' }
}

/**
 * desc: 日志打印装饰器 @logDecorator
 * @param _
 * @param key
 * @param descriptor
 */
export const logDecorator = (_: any, key: LEVEL, descriptor: any) => {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const timestamp = new Date().toLocaleString()
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(' ')
    return originalMethod.apply(this, [
      `[${timestamp}] ${logLevel[key].icon} %c${formattedArgs}`,
      `color: ${logLevel[key].color}; font-weight: bold;`
    ])
  }
  return descriptor
}
