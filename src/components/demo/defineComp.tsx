import {ref, defineComponent, defineEmits, getCurrentInstance} from 'vue'
import {Events} from '@vue/runtime-dom'
import style from './demo.module.less'
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
      <div className={style.defineComp}>
        <div className={`${style.defineComp}__left`}>123123</div>
        <div className={`${style.defineComp}__right`}>
          {slots?.default && slots.default()}
          <h2>外部的： {props.msg}，内部的： {count}</h2>
          {slots?.common && slots.common()}
          <button type="button" onClick={handleButton}>点击增加</button>
        </div>
      </div>
    )
  }
});


// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
