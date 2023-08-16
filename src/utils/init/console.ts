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
}
