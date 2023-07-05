import {ref, defineComponent, defineEmits} from 'vue'
import {Events} from "@vue/runtime-dom";

export default defineComponent({
  props: {
    msg: {
      type: String,
    }
  },
  emits: ['update:msg'],
  setup(props, ctx) {
    let count = ref(0);
    let { msg } = props;
    const { slots, emit } = ctx;
    const handleButton: Events = () => {
      count.value++
      emit('update:msg', `${msg}${count.value}`)
    };
    return { slots, props, count, handleButton }
  },
  render() {
    const { slots, props, count, handleButton } = this
    return  (
      <div>
        {this.slots?.default && this.slots.default()}
        <h2>这个是外部传入的： {this.props.msg}</h2>
        {this.slots?.common && this.slots.common()}
        <h2>这是内部的： {this.count}</h2>
        <button type="button" onClick={this.handleButton}>点击增加</button>
      </div>
    )
  }
});


// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
