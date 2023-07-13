import { defineAsyncComponent, defineComponent } from 'vue'
import { RouterView } from "vue-router";
import './style.css'
const sidebar = defineAsyncComponent(() => import('@/views/layout'))

export default defineComponent({
  setup() {
    return () => <>
      <sidebar />
      <RouterView />
    </>
  },
});
