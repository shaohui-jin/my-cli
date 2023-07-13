// import { FormInstance } from "antd/lib/form";
// import { SelectProps } from "antd/lib/select";
// import { SHOW_PARENT } from "rc-tree-select";
//
// export type ObjectType = Record<string, string>;
//
// interface RcFile extends File {
//   uid: string;
//   readonly lastModifiedDate: Date;
//   readonly webkitRelativePath: string;
// }
//
// export type TransformFileHandler = (file: RcFile) => string | Blob | File | PromiseLike<string | Blob | File>;
//
// export interface TreeData {
//   value: string;
//   title: string;
//   children?: TreeData[];
// }
//
// // 导出基础的formData 对象
// export interface BaseFormDataItem<T> {
//   label: string;
//   required: boolean;
//   message?: string;
//   placeholder?: string;
//   pattern?: RegExp;
//   disabled?: boolean; //
//   key: T;
// }
//
// export interface BaseUpload {
//   disabled?: boolean; // 是否可用
//   maxLength?: number; // 最大数量
//   maxSize?: number; // 图片最大的值 单位是k
//   action?: string; // 上传地址
//   actionData?: ObjectType; // 上传需要的数据
//   symbol?: string; // 切割符与连接符 默认是:;
//   transformFile?: TransformFileHandler;
// }
//
// export interface BaseFormProps<T> {
//   title: string; // 标题文字
//   visible: boolean; //  是否展示
//   confirmLoading: boolean; // 处理中状态
//   onCreate: () => void; // 新增函数
//   onCancel: () => void; // 取消函数
//   form: FormInstance; // form
//   formdata?: FormDataItem[]; // form的key集合
//   modifyInfo: T | {}; // 数据集合
//   children?: React.ReactNode; // 子节点
//   okText?: string; // 确认节点文字
// }
//
// // 字符串的输入，数字输入，简单下拉框，树
// export interface InputBaseFormDataItem<T> extends BaseFormDataItem<T> {
//   type?: "string";
//   formDateType?: "string";
// }
// export interface NumberBaseFormDataItem<T> extends BaseFormDataItem<T> {
//   type: "number";
//   formDateType: "number";
//   addonAfter?: React.ReactNode;
//   precision?: number;
//   step?: number | string;
//   min?: number;
// }
// export interface SelectBaseFormDataItem<T> extends BaseFormDataItem<T> {
//   type: "array" | "string" | "number";
//   formDateType: "select";
//   selectProps: Omit<SelectProps<any>, "placeholder">;
// }
// export interface TreeBaseFormDataItem<T> extends BaseFormDataItem<T> {
//   type: "string" | "array";
//   formDateType: "tree";
//   props: {
//     treeData: TreeData[];
//     treeCheckable: boolean;
//     showCheckedStrategy: typeof SHOW_PARENT;
//     searchPlaceholder: string;
//     style: React.CSSProperties;
//   };
// }
// export interface SwitchBaseFormDataItem<T = any> extends BaseFormDataItem<T> {
//   formDateType: "switch";
//   type: "string";
//   key: T;
//   props?: {
//     checkedChildrens?: [string, string];
//   };
//   extraList?: FormDataItem<T>[];
// }
//
// export interface BaseUploadItem<T> extends BaseFormDataItem<T>, BaseUpload {
//   type: "string";
//   formDateType: "upload";
// }
// export interface BaseTextarea<T> extends BaseFormDataItem<T>, BaseUpload {
//   type: "string";
//   formDateType: "textarea";
// }
//
// export type FormDataItem<T = string> =
//   | BaseTextarea<T>
//   | InputBaseFormDataItem<T>
//   | NumberBaseFormDataItem<T>
//   | SelectBaseFormDataItem<T>
//   | TreeBaseFormDataItem<T>
//   | BaseUploadItem<T>
//   | SwitchBaseFormDataItem<T>;
//
// export interface Sequence {
//   $start: number /**开始序列号 */;
// }
