import {ref, defineComponent, defineEmits, getCurrentInstance} from 'vue'
import {Events} from "@vue/runtime-dom";

export default defineComponent({
  props: {
    msg: {
      type: String,
    }
  },
  emits: ['update:msg'],
  setup(props, { slots, emit }) {
    const { appContext : { config: { globalProperties: global } } } = getCurrentInstance()
    global.$console.info('渲染了defineComponent组件')
    let count = ref(0);
    const handleButton: Events = () => {
      count.value++
      emit('update:msg', `${props.msg}${count.value}`)
    };
    return { slots, props, count, handleButton }
  },
  render() {
    const { slots, props, count, handleButton } = this
    return  (
      <div>
        {slots?.default && slots.default()}
        <h2>这个是外部传入的： {props.msg}</h2>
        {slots?.common && slots.common()}
        <h2>这是内部的： {count}</h2>
        <button type="button" onClick={handleButton}>点击增加</button>
      </div>
    )
  }
});


// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
