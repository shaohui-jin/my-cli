import {ref, renderSlot, defineComponent, reactive} from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

export default defineComponent({
  setup() {
    const isCollapse = ref<boolean>(false)
    const menu = reactive<HTMLUListElement>([
      {
        icon: Location,
        title: 'Navigator One',
        childMenu: [
          { isGroup: true, title: 'Group One', groupMenu: [ { title: 'item one' }, { title: 'item two' } ] },
          { isGroup: true, title: 'Group Two', groupMenu: [ { title: 'item three' } ] },
          { isGroup: false, title: 'item four', childMenu: [ { title: 'item three' } ] },
        ]
      },
      {
        icon: IconMenu,
        title: 'Navigator Two',
      },
      {
        icon: Document,
        title: 'Navigator Three',
      },
      {
        icon: Setting,
        title: 'Navigator Four',
      }
    ])
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    return { menu, isCollapse, handleClose, handleOpen}

  },
  render() {
    const { menu, isCollapse, handleOpen, handleClose, $slots } = this
    return (
      <div>
      <el-radio-group v-model={isCollapse} style={{ marginBottom: '20px' }}>
        <el-radio-button label={false}>expand</el-radio-button>
        <el-radio-button label={true}>collapse</el-radio-button>
      </el-radio-group>

      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        collapse={isCollapse}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        { menu.map((menuItem, menuIndex) => {
          return <el-sub-menu
              index={menuIndex.toString()}
              v-slots={{
                title: () => {
                  return <>
                    <el-icon>{ menuItem.icon }</el-icon>
                    <span>{ menuItem.title }</span>
                  </>
                }
              }}
          >
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            {/*<el-sub-menu index="1-4">*/}
            {/*  <template #title><span>item four</span></template>*/}
            {/*<el-menu-item index="1-4-1">item one</el-menu-item>*/}
            {/*</el-sub-menu>*/}
          </el-sub-menu>
        })}
      </el-menu>
    </div>
  )}
})
