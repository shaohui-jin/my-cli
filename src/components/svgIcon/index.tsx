import { h, resolveComponent, defineComponent } from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    // svg 图标组件名字
    name: {
      type: String,
      required: true
    },
    // svg 大小
    size: {
      type: Number,
      required: false,
      default: undefined
    },
    // svg 颜色
    color: {
      type: String,
      required: false,
      default: undefined
    }
  },
  setup(props) {
    if (props.name.indexOf('element') > -1) {
      return () =>
        h('i', { class: 'el-icon', style: `--font-size: ${props.size};--color: ${props.color}` }, [
          h(resolveComponent(props.name))
        ])
    } else {
      return () => h('i', { class: props.name, style: `font-size: ${props.size};color: ${props.color}` })
    }
  }
})
