import {reactive, ref, defineProps, defineComponent, defineEmits} from 'vue'
import {Events} from "@vue/runtime-dom";

export default defineComponent({
  props: {
    msg: {
      type: Number,
      default: 0,
    }
  },
  setup(props, ctx) {
    let count = ref(0);
    // const props = defineProps({
    //   msg: {
    //     type: Number,
    //     default: 0,
    //   }
    // })
    const emit = defineEmits(['update:msg'])
    const a: Events = () => {
      ctx.emit('update:msg', props.msg + 1)
      count.value++
    }
    return () => {
      return  (
        <div>
          <h1>{props.msg}</h1>
          <div className="card">
            <button type="button" onClick={a}>count is {count.value}</button>
          </div>
        </div>
      )
    }
  },
});


// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
