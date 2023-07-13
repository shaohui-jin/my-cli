export type ButtonType = "search" | "down" | "add" | "import"; // 按钮类型

export type Picker = "date" | "week" | "month" | "quarter" | "year";

// 值 文字
export type Option = Record<"value" | "label", string>;

interface BaseComponents<T = string> {
  key: T; // key
  className?: string; //类名
}

export interface BaseInputItem<T = string> extends BaseComponents<T> {
  label: string; // label字
  placeholder?: string; // 占位符
}

export interface BaseSelectItem<T = string> extends BaseComponents<T> {
  label: string; // label
  placeholder?: string; // 占位符
  options: Option[]; // options
  showSearch?: boolean;
}

export interface BaseRangePickerItem extends BaseComponents {
  keys: [string, string]; //
  label: string; //label
  defaultValue?: [string, string]; //
  maxMonth?: number; // 最大月份
  placeholder?: [string, string]; // 占位符
  picker?: Picker; // pciker
}

export interface BaseButtonItem extends BaseComponents {
  buttonType?: ButtonType; // button 类型
  placeholder: string; // 按钮文字
  style?: React.CSSProperties; // 样式
}

export type BaseItem<T = any> =
  | (BaseInputItem<T> & { type: "input" })
  | (BaseSelectItem<T> & { type: "select" })
  | (BaseRangePickerItem & { type: "rangePicker" })
  | (BaseButtonItem & { type: "button" });
