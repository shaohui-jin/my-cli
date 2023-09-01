import { logDecorator } from '@/decorator'

export default class AdvancedConsole {
  @logDecorator
  static log(...args: any[]) {
    console.log(...args)
  }
  @logDecorator
  static info(...args: any[]) {
    console.info(...args)
  }
  @logDecorator
  static warn(...args: any[]) {
    console.warn(...args)
  }
  @logDecorator
  static error(...args: any[]) {
    console.error(...args)
  }
  @logDecorator
  static table(label: string, obj: any) {
    window.App.$console.info(label)
    console.table(obj)
  }
  @logDecorator
  static group(...args: any[]) {
    console.group(...args)
  }
  @logDecorator
  static groupCollapsed(...args: any[]) {
    console.groupCollapsed(...args)
  }
  @logDecorator
  static groupEnd() {
    console.groupEnd()
  }
}
