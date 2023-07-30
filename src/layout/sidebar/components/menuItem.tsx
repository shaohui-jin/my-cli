import { defineComponent } from 'vue'
import { MenuItemType } from '@/types'

export default defineComponent({
  name: 'MenuItem',
  props: {
    menu: { type: Object as () => MenuItemType, required: true }
  },
  render() {
    const { menu } = this.$props
    return (
      <el-menu-item
        index={menu.route}
        v-slots={{
          title: () => (
            <>
              <el-icon>{menu.icon.render()}</el-icon>
              <span>{menu.title}</span>
            </>
          )
        }}
      />
    )
  }
})
