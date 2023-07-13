import { ElInput } from 'element-plus';
import { BaseInputItem } from '@/types';

interface Props extends BaseInputItem {
  onchange: (value: React.ChangeEvent<HTMLInputElement>) => void; // 触发改变函数
  onPressEnter: (value: React.KeyboardEvent<HTMLInputElement>) => void; // 触发改变函数
}

export interface BaseInputProps {
  (props: Props): JSX.Element
}

const BaseInput: BaseInputProps = ({ label, placeholder, onchange, onPressEnter }) => {
  return <>
    <label className="label" htmlFor={label}>{label}</label>
    <Input id={label} placeholder={placeholder || ('请输入' + label)} onChange={onchange} onPressEnter={onPressEnter}></Input>
  </>
}

export default BaseInput;
