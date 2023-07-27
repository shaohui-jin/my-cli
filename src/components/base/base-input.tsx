import { BaseInputItem } from '@/types'

interface Props extends BaseInputItem {
  onchange: (value: Event) => void // 触发改变函数
  onPressEnter: (value: Event) => void // 触发改变函数
}

export interface BaseInputProps {
  (props: Props): JSX.Element
}

const BaseInput: BaseInputProps = ({ label, placeholder, onchange, onPressEnter }) => {
  return (
    <>
      <label className="label" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        placeholder={placeholder || '请输入' + label}
        onChange={onchange}
        onPressEnter={onPressEnter}
      ></input>
    </>
  )
}

export default BaseInput
