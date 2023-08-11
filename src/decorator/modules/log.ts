enum LOG_LEVEL {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

const logLevel: Record<LOG_LEVEL, any> = {
  log: { icon: '☺', color: 'black' },
  info: { icon: 'ℹ️', color: 'blue' },
  warn: { icon: '⚠️', color: 'orange' },
  error: { icon: '❌', color: 'red' }
}

/**
 * desc: 日志打印装饰器 @logDecorator
 */
export const logDecorator = (target: any, key: LOG_LEVEL, descriptor: any) => {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    window.App.$console.log('@logDecorator:', target, key, descriptor)
    const timestamp = new Date().toLocaleString()
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(' ')
    return originalMethod.apply(this, [
      `[${timestamp}] ${logLevel[key].icon} %c${formattedArgs}`,
      `color: ${logLevel[key].color}; font-weight: bold;`
    ])
  }
  return descriptor
}
