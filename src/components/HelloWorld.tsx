import { ref } from 'vue'

const HelloWorld = (msg: string) => {
  let count = ref(0)
  const a = () => {
    count.value++
  }
  return (
    <div>
      <h1>{ msg }</h1>
      <div class="card">
        <button type="button" onClick={() => a}>count is { count.value }</button>
        <p>Edit<code>components/HelloWorld.vue</code> to test HMR</p>
      </div>
    </div>
  )
}

export default HelloWorld

// <style scoped>
// .read-the-docs {
//   color: #888;
// }
// </style>
