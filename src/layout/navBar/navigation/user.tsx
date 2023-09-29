import { defineComponent, defineAsyncComponent, getCurrentInstance, onMounted, ref, computed } from 'vue'
import { Search, Bell, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ElMessageBox, ElMessage } from 'element-plus'
import screenfull from 'screenfull'
import UserApi from '@/api/modules/user.ts'

// const SearchBox = defineAsyncComponent(() => import('@/layout/navbar/navgation/search.vue'))
const UserNews = defineAsyncComponent(() => import('@/layout/navBar/navigation/userNews.tsx'))

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const router = useRouter()
    const searchRef = ref()
    const isScreenFull = ref<boolean>(false)
    const disabledSize = ref<string>('mini')

    // 用户信息
    const userInfo = computed(() => useStore().useUserStore.userInfo)
    // 布局配置信息
    const themeConfig = computed(() => useStore().useThemeStore)
    // 设置分割样式
    const layoutUserFlexNum = computed(() => {
      const { layout, isClassicSplitMenu } = useStore().useThemeStore
      return layout === 'default' || (layout === 'classic' && !isClassicSplitMenu) || layout === 'columns' ? 1 : null
    })
    /**
     * @desc 全屏点击时
     */
    const onScreenFullClick = () => {
      if (!screenfull.isEnabled) {
        ElMessage.warning('暂不不支持全屏')
        return false
      }
      screenfull.toggle()
      screenfull.on('change', () => {
        isScreenFull.value = screenfull.isFullscreen
      })
    }
    /**
     * @desc 布局配置 icon 点击时
     * @methods proxy.mittBus.emit('openSettingDrawer') 调用事件总线 openSettingDrawer
     */
    const onLayoutSettingClick = () => {
      proxy.mittBus.emit('openSettingDrawer')
    }
    /**
     * @desc 下拉菜单点击时
     */
    const onHandleCommandClick = (path: string) => {
      if (path === 'logOut') {
        ElMessageBox({
          closeOnClickModal: false,
          closeOnPressEscape: false,
          title: '提示',
          message: '此操作将退出登录, 是否继续?',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '退出中'
              setTimeout(() => {
                done()
                setTimeout(() => {
                  instance.confirmButtonLoading = false
                }, 300)
              }, 700)
            } else {
              done()
            }
          }
        })
          .then(() => {
            UserApi.signOut().then(() => {
              router.push('/login')
              setTimeout(() => {
                ElMessage.success('安全退出成功！')
              }, 300)
            })
          })
          .catch(() => {})
      } else {
        router.push(path)
      }
    }
    /**
     * @desc 菜单搜索点击
     */
    const onSearchClick = () => {
      searchRef.value.openSearch()
    }
    /**
     * @desc 组件大小改变
     * @param size
     */
    const onComponentSizeChange = (size: '' | 'default' | 'small' | 'large') => {
      themeConfig.value.globalComponentSize = size
      window.location.reload()
    }
    onMounted(() => {
      disabledSize.value = useStore().useThemeStore.globalComponentSize
    })
    return {
      userInfo,
      layoutUserFlexNum,
      isScreenFull,
      disabledSize,
      onLayoutSettingClick,
      onHandleCommandClick,
      onScreenFullClick,
      onSearchClick,
      onComponentSizeChange
    }
  },
  render() {
    const {
      userInfo,
      layoutUserFlexNum,
      isScreenFull,
      disabledSize,
      onLayoutSettingClick,
      onHandleCommandClick,
      onScreenFullClick,
      onSearchClick,
      onComponentSizeChange
    } = this
    return (
      <>
        <div class="layout-navbar-breadcrumb-user" style={`${layoutUserFlexNum ? 'flex: ' + layoutUserFlexNum : ''}`}>
          <el-dropdown
            show-timeout={70}
            hide-timeout={50}
            trigger="click"
            onCommand={onComponentSizeChange}
            v-slots={{
              dropdown: () => {
                return (
                  <>
                    <el-dropdown-menu>
                      <el-dropdown-item command={''} disabled={disabledSize === ''}>
                        默认
                      </el-dropdown-item>
                      <el-dropdown-item command={'medium'} disabled={disabledSize === 'medium'}>
                        中等
                      </el-dropdown-item>
                      <el-dropdown-item command={'small'} disabled={disabledSize === 'small'}>
                        小型
                      </el-dropdown-item>
                      <el-dropdown-item command={'mini'} disabled={disabledSize === 'mini'}>
                        超小
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </>
                )
              }
            }}
          >
            <div class="layout-navbar-breadcrumb-user-icon">
              <i class="iconfont icon-ziti" title="组件大小"></i>
            </div>
          </el-dropdown>
          <div class="layout-navbar-breadcrumb-user-icon" onClick={onSearchClick}>
            <el-icon title="菜单搜索">
              <Search />
            </el-icon>
          </div>
          <div class="layout-navbar-breadcrumb-user-icon" onClick={onLayoutSettingClick}>
            <i class="icon-skin iconfont" title="布局配置"></i>
          </div>
          <div class="layout-navbar-breadcrumb-user-icon">
            <el-popover
              placement="bottom"
              trigger="hover"
              width={300}
              popper-class="el-popover-pupop-user-news"
              v-slots={{
                reference: () => {
                  return (
                    <>
                      <el-badge is-dot>
                        <el-icon title={'消息'}>
                          <Bell />
                        </el-icon>
                      </el-badge>
                    </>
                  )
                }
              }}
            >
              <UserNews />
            </el-popover>
          </div>
          <div class="layout-navbar-breadcrumb-user-icon mr10" onClick={onScreenFullClick}>
            <i
              title={isScreenFull ? '关全屏' : '开全屏'}
              class={['iconfont', isScreenFull ? 'icon-tuichuquanping' : 'icon-fullscreen']}
            ></i>
          </div>
          <el-dropdown
            show-timeout={70}
            hide-timeout={50}
            onCommand={onHandleCommandClick}
            v-slots={{
              dropdown: () => {
                return (
                  <>
                    <el-dropdown-menu>
                      <el-dropdown-item command={'/home'}>首页</el-dropdown-item>
                      <el-dropdown-item command={'/personal'}>个人中心</el-dropdown-item>
                      <el-dropdown-item command={'/404'}>404</el-dropdown-item>
                      <el-dropdown-item command={'/401'}>401</el-dropdown-item>
                      <el-dropdown-item divided command={'logOut'}>
                        退出登录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </>
                )
              }
            }}
          >
            <span class="layout-navbar-breadcrumb-user-link">
              <img src={userInfo.photo} class="layout-navbar-breadcrumb-user-link-photo mr5" />
              {userInfo.username === '' ? 'test' : userInfo.username}
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
          </el-dropdown>
          {/*<Search ref="searchRef" />*/}
        </div>
      </>
    )
  }
})
