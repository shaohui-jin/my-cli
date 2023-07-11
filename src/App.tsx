import { defineComponent } from 'vue'
import { RouterView } from "vue-router";
import './style.css'

export default defineComponent({
  setup() {
    return () => <RouterView />;
  },
});
