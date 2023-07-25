import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
const Icon = { render: () => {} }
export default defineComponent({
  name: 'MenuItem',
  props: {
    menuIndex: { type: String, required: true },
    menuTitle: { type: String, required: true },
    menuIcon: { type: Object, default: Icon },
    menuRoute: { type: String, default: '' }
  },
  setup(props, ctx) {
    const route = useRouter()
    const handleMenu = () => {
      console.log(props.menuRoute)
      console.log(route)
      props.menuRoute && route.push(props.menuRoute)
    }
    return { handleMenu }
  },
  render() {
    const {
      $props: { menuIndex, menuTitle, menuIcon },
      handleMenu
    } = this
    return (
      <el-menu-item
        index={`${menuIndex}`}
        v-slots={{
          title: () => {
            return (
              <>
                {menuIcon ? <el-icon>{menuIcon.render()}</el-icon> : <></>}
                <span>{menuTitle}</span>
              </>
            )
          }
        }}
        onClick={handleMenu}
      />
    )
  }
})
