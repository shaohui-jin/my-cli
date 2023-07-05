import { ref, FunctionalComponent, defineEmits, CSSProperties, render } from 'vue'
import {Events} from "@vue/runtime-dom";

interface Props {
  msg: string;
  style: CSSProperties
}

type Emit = {
  'update:msg': (msg: string) => void
}

const demoComp: FunctionalComponent<Props, Emit> = (props, ctx) => {
  let count = ref(0);
  let { msg } = props;
  const { slots, emit } = ctx;
  const handleButton: Events = () => {
    console.log(count, count.value, ++count.value)
    count.value++
    emit('update:msg', `${msg}${count.value}`)
  };

  return (
    <div>
      {slots?.default && slots.default()}
      <h2>这个是外部传入的： {msg}</h2>
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
