// import React, { useState } from "react";
// import { ModalFuncProps } from "antd/lib/modal";
// import { Form, Input, InputNumber, Modal, Select, TreeSelect } from "antd";
// import BaseUpload from "@/components/base/base-upload/base-upload";
// import BaseSwitch from "@/components/base/base-form-switch/base-form-switch";
// import { FormDataItem } from "@/types";
//
// const { confirm } = Modal;
// const { TextArea } = Input;
//
// /**
//  * 删除操作
//  */
// export const deleteConfirm: (props: ModalFuncProps) => void = ({
//   content = "是否删除当前信息",
//   onOk = () => {},
//   onCancel = () => {},
//   title = "温馨提示",
//   okText = "确定",
//   cancelText = "取消",
//   okType = "danger"
// }) => {
//   confirm({
//     title: title,
//     content: content,
//     okText: okText,
//     okType: okType,
//     cancelText: cancelText,
//     onOk: onOk,
//     onCancel: onCancel
//   });
// };
//
// /**
//  * desc: 根据类型返回不同的jsx
//  *
//  * @param item 单项
//  */
// export const getJSXByType = (item: FormDataItem): JSX.Element => {
//   const placeholder = item.placeholder || `请输入${item.label}`;
//   switch (item.formDateType) {
//     case "textarea":
//       return <TextArea style={{ width: "100%" }} placeholder={placeholder} autoSize={true} disabled={item.disabled} />;
//     case "number":
//       return <InputNumber addonAfter={item.addonAfter} precision={item.precision} min={item.min} step={item.step} style={{ width: "100%" }} placeholder={placeholder} disabled={item.disabled} />;
//     case "select":
//       return <Select disabled={item.disabled} placeholder={placeholder} {...item.selectProps}></Select>;
//     case "tree":
//       return <TreeSelect getPopupContainer={() => document.getElementById("root") as HTMLElement} {...item.props} />;
//     case "upload":
//       return <BaseUpload disabled={item.disabled} maxLength={item.maxLength} maxSize={item.maxSize} action={item.action} actionData={item.actionData} symbol={item.symbol} />;
//     case "switch":
//       return <BaseSwitch extraList={item.extraList} checkedChildrens={item.props?.checkedChildrens} />;
//     default:
//       return <Input disabled={item.disabled} placeholder={placeholder} />;
//   }
// };
//
// /**
//  * desc: create根据data返回jsx
//  * @param data 数组
//  */
// export const getSearchFormJSX = (data: FormDataItem<any>[]): JSX.Element[] =>
//   data.map(item => (
//     <Form.Item
//       label={item.label}
//       name={item.key}
//       key={item.key}
//       rules={[
//         {
//           required: item.required,
//           pattern: item.pattern,
//           type: item.type || "string",
//           message: item.message || `请输入${item.label}`
//         }
//       ]}
//     >
//       {getJSXByType(item)}
//     </Form.Item>
//   ));
export const test: number = 1
