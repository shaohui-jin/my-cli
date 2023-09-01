type LEVEL = 'log' | 'info' | 'warn' | 'error' | 'table' | 'group' | 'groupCollapsed' | 'groupEnd'
const logLevel: Record<LEVEL, Record<'icon' | 'color', string>> = {
  log: { icon: '☺', color: 'blue' },
  info: { icon: 'ℹ️', color: 'blue' },
  warn: { icon: '⚠️', color: 'orange' },
  error: { icon: '❌', color: 'red' },
  table: { icon: '🤙', color: 'blue' },
  group: { icon: '🤙', color: 'blue' },
  groupCollapsed: { icon: '🤙', color: 'blue' },
  groupEnd: { icon: '🤟', color: 'blue' }
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
    const formattedArgs = arguments.length !== 0 ? args.map(arg => JSON.stringify(arg, '', 2)).join('\n') : ''
    switch (key) {
      case 'table':
        return originalMethod.apply(this, args)
        break
      default:
        return originalMethod.apply(this, [
          `[${timestamp}] ${logLevel[key].icon} %c${formattedArgs}`,
          `color: ${logLevel[key].color}; font-weight: bold;`
        ])
    }
  }
  return descriptor
}
