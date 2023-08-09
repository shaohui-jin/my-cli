import { ref, defineAsyncComponent, defineComponent } from 'vue'
const FunctionalCompDemo = defineAsyncComponent(
  () => import('@/views/demo/components/functionalComp.tsx')
)

export default defineComponent({
  setup() {
    let functionalCompDemoMsg = ref<string>('FunctionalCompDemo')
    const childrenSlot = {
      default: () => {
        return <p>default 默认插槽</p>
      },
      common: () => {
        return <p>common 具名插槽</p>
      }
    }
    return { functionalCompDemoMsg, childrenSlot }
  },
  render() {
    return (
      <>
        <div>
          <FunctionalCompDemo
            msg={this.functionalCompDemoMsg}
            v-slots={this.childrenSlot}
            style={{}}
          />
          <FunctionalCompDemo
            v-model={[this.functionalCompDemoMsg, 'msg']}
            v-slots={this.childrenSlot}
            style={{}}
          />
        </div>
      </>
    )
  }
})
