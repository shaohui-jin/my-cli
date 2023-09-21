import { defineAsyncComponent, defineComponent, getCurrentInstance, onMounted, ref, reactive, toRefs, computed } from 'vue'
import { Search, Bell, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ElMessageBox, ElMessage } from 'element-plus'
import screenfull from 'screenfull'
// const SearchBox = defineAsyncComponent(() => import('@/layout/navbar/navgation/search.vue'))
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const router = useRouter()
    const searchRef = ref()
    const state = reactive({
      isScreenFull: false,
      isShowUserNewsPopover: false,
      disabledI18n: 'zh-cn',
      disabledSize: ''
    })
    // 获取用户信息 vuex
    const getUserInfos = computed(() => useStore().useUserStore.userInfo)
    // 获取布局配置信息
    const getThemeConfig = computed(() => useStore().useThemeStore)
    // 设置分割样式
    const layoutUserFlexNum = computed(() => {
      const { layout, isClassicSplitMenu } = useStore().useThemeStore
      let num = null
      if (layout === 'default' || (layout === 'classic' && !isClassicSplitMenu) || layout === 'columns') {
        num = 1
      }
      return num
    })
    // 全屏点击时
    const onScreenFullClick = () => {
      if (!screenfull.isEnabled) {
        ElMessage.warning('暂不不支持全屏')
        return false
      }
      screenfull.toggle()
      screenfull.on('change', () => {
        if (screenfull.isFullscreen) state.isScreenFull = true
        else state.isScreenFull = false
      })
    }
    // 布局配置 icon 点击时
    const onLayoutSettingClick = () => {
      proxy.mittBus.emit('openSetingsDrawer')
    }

    /**
     * 下拉菜单点击时
     * */
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
            signOut().then(() => {
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
    // 菜单搜索点击
    const onSearchClick = () => {
      searchRef.value.openSearch()
    }
    // 组件大小改变
    const onComponentSizeChange = (size: string) => {
      Local.remove('themeConfig')
      getThemeConfig.value.globalComponentSize = size
      Local.set('themeConfig', getThemeConfig.value)
      proxy.$ELEMENT.size = size
      initComponentSize()
      window.location.reload()
    }
    // 语言切换
    const onLanguageChange = (lang: string) => {
      Local.remove('themeConfig')
      getThemeConfig.value.globalI18n = lang
      Local.set('themeConfig', getThemeConfig.value)
      proxy.$i18n.locale = lang
      initI18n()
      other.useTitle()
    }
    // 设置 element plus 组件的国际化
    const setI18nConfig = (locale: string) => {
      proxy.mittBus.emit('getI18nConfig', proxy.$i18n.messages[locale])
    }
    // 初始化言语国际化
    const initI18n = () => {
      switch (Local.get('themeConfig').globalI18n) {
        case 'zh-cn':
          state.disabledI18n = 'zh-cn'
          setI18nConfig('zh-cn')
          break
        case 'en':
          state.disabledI18n = 'en'
          setI18nConfig('en')
          break
        case 'zh-tw':
          state.disabledI18n = 'zh-tw'
          setI18nConfig('zh-tw')
          break
      }
    }
    // 初始化全局组件大小
    const initComponentSize = () => {
      switch (Local.get('themeConfig').globalComponentSize) {
        case '':
          state.disabledSize = ''
          break
        case 'medium':
          state.disabledSize = 'medium'
          break
        case 'small':
          state.disabledSize = 'small'
          break
        case 'mini':
          state.disabledSize = 'mini'
          break
      }
    }
    // 页面加载时
    onMounted(() => {
      if (Local.get('themeConfig')) {
        initI18n()
        initComponentSize()
      }
    })
    return {
      getUserInfos,
      onLayoutSettingClick,
      onHandleCommandClick,
      onScreenFullClick,
      onSearchClick,
      onComponentSizeChange,
      onLanguageChange,
      searchRef,
      layoutUserFlexNum,
      ...toRefs(state)
    }
  },
  render() {
    const {
      layoutUserFlexNum,
      disabledSize,
      disabledI18n,
      isShowUserNewsPopover,
      isScreenFull,
      getUserInfos,
      onComponentSizeChange,
      onLanguageChange,
      onSearchClick,
      onLayoutSettingClick,
      onScreenFullClick,
      onHandleCommandClick
    } = this
    return (
      <>
        <div class="layout-navbar-breadcrumb-user" style={{ flex: layoutUserFlexNum }}>
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
          <el-dropdown
            show-timeout={70}
            hide-timeout={50}
            trigger="click"
            onCommand={onLanguageChange}
            v-slots={{
              dropdown: () => {
                return (
                  <>
                    <el-dropdown-menu>
                      <el-dropdown-item command={'zh-cn'} disabled={disabledI18n === 'zh-cn'}>
                        简体中文
                      </el-dropdown-item>
                      <el-dropdown-item command={'en'} disabled={disabledI18n === 'en'}>
                        English
                      </el-dropdown-item>
                      <el-dropdown-item command={'zh-tw'} disabled={disabledI18n === 'zh-tw'}>
                        繁體中文
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </>
                )
              }
            }}
          >
            <div class="layout-navbars-breadcrumb-user-icon">
              <i
                class={['iconfont', disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen']}
                title="语言切换"
              ></i>
            </div>
          </el-dropdown>
          <div class="layout-navbars-breadcrumb-user-icon" onClick={onSearchClick}>
            <el-icon title="菜单搜索">
              <Search />
            </el-icon>
          </div>
          <div class="layout-navbar-breadcrumb-user-icon" onClick={onLayoutSettingClick}>
            <i class="icon-skin iconfont" title="布局配置"></i>
          </div>
          <div class="layout-navbars-breadcrumb-user-icon">
            <el-popover
              placement="bottom"
              trigger="click"
              visible={isShowUserNewsPopover}
              width={300}
              popper-class="el-popover-pupop-user-news"
              v-slots={{
                reference: () => {
                  return (
                    <>
                      <el-badge is-dot={true} onClick={() => (isShowUserNewsPopover = !isShowUserNewsPopover)}>
                        <el-icon title="title4">
                          <Bell />
                        </el-icon>
                      </el-badge>
                    </>
                  )
                }
              }}
            >
              <transition name="el-zoom-in-top">
                123123
                {/*<UserNews v-show="isShowUserNewsPopover" />*/}
              </transition>
            </el-popover>
          </div>
          <div class="layout-navbar-breadcrumb-user-icon mr10" onClick={onScreenFullClick}>
            <i
              title={isScreenFull ? '关全屏' : '开全屏'}
              class={['iconfont', !isScreenFull ? 'icon-fullscreen' : 'icon-tuichuquanping']}
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
              <img src={getUserInfos.photo} class="layout-navbar-breadcrumb-user-link-photo mr5" />
              {getUserInfos.username === '' ? 'test' : getUserInfos.username}
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
          </el-dropdown>
          123123
          {/*<Search ref="searchRef" />*/}
        </div>
      </>
    )
  }
})

//
// <script lang="ts">
// import { ref, getCurrentInstance, computed, reactive, toRefs, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
// import { ElMessageBox, ElMessage } from 'element-plus';
// import screenfull from 'screenfull';
// import { useI18n } from 'vue-i18n';
// import { resetRoute } from '@/router/index';
// import { useStore } from '@/store/index';
// import other from '@/utils/other';
// import { Session, Local } from '@/utils/storage';
// import UserNews from '@/layout/navBars/breadcrumb/userNews.vue';
// import Search from '@/layout/navBars/breadcrumb/search.vue';
// import { signOut } from '@/api/login';
// export default {
// 	name: 'layoutBreadcrumbUser',
// 	components: { UserNews, Search },
// 	setup() {
//
// 	},
// };
// </script>
//
// <style scoped lang="scss">
// .layout-navbars-breadcrumb-user {
// 	display: flex;
// 	align-items: center;
// 	justify-content: flex-end;
// 	&-link {
// 		height: 100%;
// 		display: flex;
// 		align-items: center;
// 		white-space: nowrap;
// 		&-photo {
// 			width: 25px;
// 			height: 25px;
// 			border-radius: 100%;
// 		}
// 	}
// 	&-icon {
// 		padding: 0 10px;
// 		cursor: pointer;
// 		color: var(--bg-topBarColor);
// 		height: 50px;
// 		line-height: 50px;
// 		display: flex;
// 		align-items: center;
// 		&:hover {
// 			background: rgba(0, 0, 0, 0.04);
// 			i {
// 				display: inline-block;
// 				animation: logoAnimation 0.3s ease-in-out;
// 			}
// 		}
// 	}
// 	::v-deep(.el-dropdown) {
// 		color: var(--bg-topBarColor);
// 	}
// 	::v-deep(.el-badge) {
// 		height: 40px;
// 		line-height: 40px;
// 		display: flex;
// 		align-items: center;
// 	}
// 	::v-deep(.el-badge__content.is-fixed) {
// 		top: 12px;
// 	}
// }
// </style>
