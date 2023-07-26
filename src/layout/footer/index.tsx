import { ref, defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  name: 'SLAFooter',
  setup() {},
  render() {
    const { isCollapse, handleOpen, handleClose } = this
    return <>@1997-2023 网站建设：JSH</>
  }
})
