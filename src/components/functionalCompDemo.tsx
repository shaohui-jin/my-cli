import { ref, FunctionalComponent, getCurrentInstance, CSSProperties } from 'vue'
import {Events} from "@vue/runtime-dom";

interface Props {
  msg: string;
  style: CSSProperties
}

type Emit = {
  'update:msg': (msg: string) => void
}
// 定义到functional外部，才不会每次都重新声明
let count = ref(0);

const demoComp: FunctionalComponent<Props, Emit> = (props, { slots, emit }) => {
  const { appContext : { config: { globalProperties: global } } } = getCurrentInstance()
  global.$console.info('渲染了FunctionalComponent组件')
  const handleButton: Events = () => {
    count.value++
    emit('update:msg', `${props.msg}${count.value}`)
  };
  return (
    <div>
      {slots?.default && slots.default()}
      <h2>这个是外部传入的： {props.msg}</h2>
      {slots?.common && slots.common()}
      <h2>这是内部的： {count.value}</h2>
      <button type="button" onClick={handleButton}>点击一起增加</button>
    </div>
  )

}

export default demoComp
// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
