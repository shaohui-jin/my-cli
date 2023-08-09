import { ref, defineAsyncComponent, defineComponent } from 'vue'
const DefineCompDemo = defineAsyncComponent(() => import('@/views/demo/components/defineComp.tsx'))

export default defineComponent({
  setup() {
    let defineCompDemoMsg = ref('DefineCompDemo')
    const childrenSlot = {
      default: () => {
        return <p>default 默认插槽</p>
      },
      common: () => {
        return <p>common 具名插槽</p>
      }
    }
    return { defineCompDemoMsg, childrenSlot }
  },
  render() {
    return (
      <div>
        <DefineCompDemo v-model={[this.defineCompDemoMsg, 'msg']} v-slots={this.childrenSlot} />
        <DefineCompDemo v-model:msg={this.defineCompDemoMsg} v-slots={this.childrenSlot} />
      </div>
    )
  }
})
