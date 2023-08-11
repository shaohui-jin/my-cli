import { ref, defineAsyncComponent, defineComponent } from 'vue'
const DefineCompDemo = defineAsyncComponent(() => import('@/views/demo/components/defineComp.tsx'))

export default defineComponent({
  setup() {
    const defineCompDemoMsg = ref('DefineCompDemo')
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
        <DefineCompDemo msg={this.defineCompDemoMsg} v-slots={this.childrenSlot} />
      </div>
    )
  }
})
