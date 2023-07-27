// import { CSSProperties } from 'vue'
//
// export type ButtonType = 'search' | 'down' | 'add' | 'import' // 按钮类型
//
// export type Picker = 'date' | 'week' | 'month' | 'quarter' | 'year'
//
// // 值 文字
// export type Option = Record<'value' | 'label', string>
//
import { Component } from 'vue'

type BaseComponent<T = string> = {
  key: T
  label: string
  className?: string
  value: any
}

//
// export interface BaseInputItem<T = string> extends BaseComponents<T> {
//   label: string // label字
//   placeholder?: string // 占位符
// }
//
// export interface BaseSelectItem<T = string> extends BaseComponents<T> {
//   label: string // label
//   placeholder?: string // 占位符
//   options: Option[] // options
//   showSearch?: boolean
// }
//
// export interface BaseRangePickerItem extends BaseComponents {
//   keys: [string, string] //
//   label: string //label
//   defaultValue?: [string, string] //
//   maxMonth?: number // 最大月份
//   placeholder?: [string, string] // 占位符
//   picker?: Picker // pciker
// }
//
// export interface BaseButtonItem extends BaseComponents {
//   buttonType?: ButtonType // button 类型
//   // placeholder: string // 按钮文字
//   style?: CSSProperties // 样式
// }
export type BaseSwitchItem<T = string> = BaseComponent<T> & {
  activeText: string | ''
  inactiveText: string | '' // switch 的状态为 off 时的文字描述
  activeValue: boolean | string | number
  disabled?: boolean | false // 是否禁用
  loading?: boolean | false // 是否显示加载中
  size?: '' | 'large' | 'default' | 'small' // switch 的大小
  width?: number | string // switch 的宽度
  inlinePrompt?: boolean | false // 无论图标或文本是否显示在点内，只会呈现文本的第一个字符
  activeIcon?: string | Component // switch 状态为 on 时所显示图标，设置此项会忽略 active-text
  inactiveIcon?: string | Component // switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text
}

export type BaseComponentItem<T = any> =
  | (BaseSwitchItem<T> & { type: 'switch' })
  | (BaseInputItem<T> & { type: 'input' })
// | (BaseSelectItem<T> & { type: 'select' })
// | (BaseRangePickerItem & { type: 'rangePicker' })
// | (BaseButtonItem & { type: 'button' })
