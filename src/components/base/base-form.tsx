// import React, { useState } from "react";
// import { ModalFuncProps } from "antd/lib/modal";
// import { Form, Input, InputNumber, Modal, Select, TreeSelect } from "antd";
// import BaseUpload from "@/components/base/base-upload/base-upload";
// import BaseSwitch from "@/components/base/base-form-switch/base-form-switch";
import { BaseComponentItem, FormDataItem } from '@/types'
import { defineComponent } from "vue";
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
export const getJSXByType = (item: BaseComponentItem): JSX.Element => {
  console.log(item)
  const placeholder = item.placeholder || `请输入${item.label}`
  switch (item.type) {
    // case 'textarea':
    //   return (
    //     <TextArea
    //       style={{ width: '100%' }}
    //       placeholder={placeholder}
    //       autoSize={true}
    //       disabled={item.disabled}
    //     />
    //   )
    // case 'number':
    //   return (
    //     <InputNumber
    //       addonAfter={item.addonAfter}
    //       precision={item.precision}
    //       min={item.min}
    //       step={item.step}
    //       style={{ width: '100%' }}
    //       placeholder={placeholder}
    //       disabled={item.disabled}
    //     />
    //   )
    // case 'select':
    //   return (
    //     <Select disabled={item.disabled} placeholder={placeholder} {...item.selectProps}></Select>
    //   )
    // case 'tree':
    //   return (
    //     <TreeSelect
    //       getPopupContainer={() => document.getElementById('root') as HTMLElement}
    //       {...item.props}
    //     />
    //   )
    // case 'upload':
    //   return (
    //     <BaseUpload
    //       disabled={item.disabled}
    //       maxLength={item.maxLength}
    //       maxSize={item.maxSize}
    //       action={item.action}
    //       actionData={item.actionData}
    //       symbol={item.symbol}
    //     />
    //   )
    case 'switch':
      return (
        <el-switch
          v-model={item.value}
          class="mb-2"
          active-text="Pay by month"
          inactive-text="Pay by year"
        />
      )
    default:
      return <el-input disabled={item.disabled} placeholder={placeholder} />
  }
}
//
/**
 * desc: create根据data返回jsx
 * @param data 数组
 */
export default defineComponent({
  props: {
    formData: {
      type: Array as () => FormDataItem[],
      required: true
    }
  },
  render() {
    return (
      <>
        {this.$props.formData.map(item => (
          <el-form-item
            key={item.key}
            label={item.label}
            prop={item.key}
            inline-message={true}
            rules={[
              {
                required: item.required,
                pattern: item.pattern,
                message: item.message || `请输入${item.label}`
              }
            ]}
          >
            {getJSXByType(item)}
          </el-form-item>
        ))
        }
      </>
    )
  }
})

  = (data: BaseComponentItem<any>[]): JSX.Element[] =>

