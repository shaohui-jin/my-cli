import { ref, FunctionalComponent, defineEmits, CSSProperties } from 'vue'
import {Events} from "@vue/runtime-dom";

interface Props {
  msg: number;
  style: CSSProperties
}

type Emit = {
  'update:msg': (num: number) => void
}

const demoComp: FunctionalComponent<Props, Emit> = (props, ctx) => {
  let { msg } = props
  const { slots, emit } = ctx
  let count = ref(0);
  const handleButton: Events = () => {
    count.value++
    emit('update:msg', msg + 1)
  }
  return (
    <div>
      {slots?.default && slots.default()}
      <h1>这个是外部传入的： {msg}</h1>
      <div className="card">
        这是内部的： {count.value}
        <button type="button" onClick={handleButton}>点击一起增加</button>
      </div>
    </div>
  )
}

export default demoComp
// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
