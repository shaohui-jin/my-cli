import { ref, FunctionalComponent, getCurrentInstance, CSSProperties } from 'vue'
import {Events} from "@vue/runtime-dom";
import styles from "@/components/demo/demo.module.less";

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
  global.$console.info('渲染了functionalComponent组件：functionalComponent')
  const handleButton: Events = () => {
    count.value++
    emit('update:msg', `${props.msg}${count.value}`)
  };
  return (
    <div className={styles.functionalComp}>
      <div className={styles.functionalComp__left}>
        <span>这是functionalComponent组件</span>
      </div>
      <div className={styles.functionalComp__right}>
        <h2>外部的： {props.msg}，内部的： {count.value}</h2>
        {slots?.default && slots.default()}
        {slots?.common && slots.common()}
        <button type="button" onClick={handleButton}>点击增加</button>
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
