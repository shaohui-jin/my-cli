import { ref, FunctionalComponent, getCurrentInstance, CSSProperties } from 'vue'
import { Events } from 'vue'

interface Props {
  msg: string
  style: CSSProperties
}

type Emit = {
  'update:msg': (msg: string) => void
}
// 定义到functional外部，才不会每次都重新声明
let count = ref(0)

const demoComp: FunctionalComponent<Props, Emit> = (props, { slots, emit }) => {
  window.App.$console.info('SLAFunctionalComponentDemo 组件渲染，组件类型 functionalComponent')
  const handleButton: Events = () => {
    count.value++
    emit('update:msg', `${props.msg}${count.value}`)
  }
  return (
    <div class="flex-center flex-column">
      <h2>
        外部的： {props.msg}，内部的： {count.value}
      </h2>
      {slots?.default && slots.default()}
      {slots?.common && slots.common()}
      <button type="button" onClick={handleButton}>
        点击增加
      </button>
    </div>
  )
}

export default demoComp
