import { defineComponent } from 'vue'
import { BaseComponentItem } from '@/types'
// import React, { useState } from "react";
// import { ModalFuncProps } from "antd/lib/modal";
// import { Form, Input, InputNumber, Modal, Select, TreeSelect } from "antd";
// import BaseUpload from "@/components/base/base-upload/base-upload";
// import BaseSwitch from "@/components/base/base-form-switch/base-form-switch";
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
/**
 * desc: 根据类型返回不同的jsx
 *
 * @param item 单项
 * @param formData
 */
const getJSXByType = (item: BaseComponentItem, formData: any) => {
  switch (item.type) {
    case 'switch':
      return (
        <>
          <el-switch
            v-model={formData[item.key]}
            active-text={item.activeText || ''}
            inactive-text={item.inactiveText || ''}
          />
        </>
      )
    case 'input':
      return (
        <>
          <el-input
            v-model={formData[item.key]}
            disabled={item.disabled}
            placeholder={item.placeholder}
          />
        </>
      )
    // case 'textarea':
    //   return (
    //     <TextArea
    //       style={ { width: '100%' } }
    //       placeholder={ placeholder }
    //       autoSize={ true }
    //       disabled={ item.disabled }
    //     />
    //   )
    // case 'number':
    //   return (
    //     <InputNumber
    //       addonAfter={ item.addonAfter }
    //       precision={ item.precision }
    //       min={ item.min }
    //       step={ item.step }
    //       style={ { width: '100%' } }
    //       placeholder={ placeholder }
    //       disabled={ item.disabled }
    //     />
    //   )
    // case 'select':
    //   return (
    //     <Select disabled={ item.disabled } placeholder={ placeholder } { ...item.selectProps }></Select>
    //   )
    // case 'tree':
    //   return (
    //     <TreeSelect
    //       getPopupContainer={ () => document.getElementById('root') as HTMLElement }
    //       { ...item.props }
    //     />
    //   )
    // case 'upload':
    //   return (
    //     <BaseUpload
    //       disabled={ item.disabled }
    //       maxLength={ item.maxLength }
    //       maxSize={ item.maxSize }
    //       action={ item.action }
    //       actionData={ item.actionData }
    //       symbol={ item.symbol }
    //     />
    //   )
  }
}

/**
 * desc: create根据data返回jsx
 * @param data 数组
 */
export default defineComponent({
  props: {
    formOptions: {
      type: Array as () => BaseComponentItem[],
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  // emits: () => {
  //   const res = this.formData.map(e => `update:${e.key}`)
  //   console.log(res)
  //   return res
  // },
  render() {
    return (
      <>
        {this.$props.formOptions.map(item => (
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
            {getJSXByType(item, this.$props.formData)}
          </el-form-item>
        ))}
      </>
    )
  }
})
