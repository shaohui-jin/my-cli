import { nextTick, onUnmounted, onMounted, getCurrentInstance, defineComponent, computed, ref } from 'vue'
import { useStore } from '@/store'
import { getLightColor } from '@/utils/theme.ts'
import { verifyAndSpace } from '@/utils/validate.ts'
import Watermark from '@/utils/watermark.ts'
import { getCookie, setCookie } from '@/utils/cookie.ts'
import { copyText } from '@/utils/common.ts'
import { CopyDocument, RefreshRight } from '@element-plus/icons-vue'
import { ThemeType } from '@/store/modules/theme.ts'
import { isMobile as _isMobile } from '@/utils/common.ts'

type BaseSettingItem = {
  // 属性值
  key: keyof ThemeType
  // 属性名
  label: string
  // render函数
  render?: any
  // 整体style
  style?: any
  // 元素style
  elStyle?: any
  disabled?: boolean
} & (
  | ({ type: 'color' } & ColorItem)
  | ({ type: 'select' } & SelectItem)
  | ({ type: 'switch' } & SwitchItem)
  | ({ type: 'input' } & InputItem)
  | ({ type: 'input-number' } & InputNumberItem)
)

type ColorItem = { onChange?: () => void }
type SelectItem = {
  onChange: () => void
  options: { [k in 'label' | 'value']: string }[]
}
type SwitchItem = { onChange: () => void }
type InputItem = { onInput: (str: string) => void }
type InputNumberItem = { onChange: () => void }

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any
    const isMobile = ref<boolean>(false)
    // 获取布局配置信息
    const themeConfig = computed(() => useStore().useThemeStore)
    // 1、全局主题
    const onColorPickerChange = (color: string) => {
      setPropertyFun(`--color-${color}`, themeConfig.value[color])
      setDispatchThemeConfig()
    }
    // 1、全局主题设置函数
    const setPropertyFun = (color: string, targetVal: any) => {
      document.documentElement.style.setProperty(color, targetVal)
      for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(`${color}-light-${i}`, getLightColor(targetVal, i / 10))
      }
    }
    // 2、菜单 / 顶栏
    const onBgColorPickerChange = (bg: string) => {
      document.documentElement.style.setProperty(`--bg-${bg}`, themeConfig.value[bg])
      onTopBarGradualChange()
      onMenuBarGradualChange()
      onColumnsMenuBarGradualChange()
      setDispatchThemeConfig()
    }
    // 2、菜单 / 顶栏 --> 顶栏背景渐变
    const onTopBarGradualChange = () => {
      setGraduaFun('.layout-navbar-breadcrumb-index', themeConfig.value.isTopBarColorGradual, themeConfig.value.topBar)
    }
    // 2、菜单 / 顶栏 --> 菜单背景渐变
    const onMenuBarGradualChange = () => {
      setGraduaFun('.layout-container .el-aside', themeConfig.value.isMenuBarColorGradual, themeConfig.value.menuBar)
    }
    // 2、菜单 / 顶栏 --> 分栏菜单背景渐变
    const onColumnsMenuBarGradualChange = () => {
      setGraduaFun(
        '.layout-container .layout-columns-aside',
        themeConfig.value.isColumnsMenuBarColorGradual,
        themeConfig.value.columnsMenuBar
      )
    }
    // 2、菜单 / 顶栏 --> 背景渐变函数
    const setGraduaFun = (el: string, bool: boolean, color: string) => {
      nextTick(() => {
        const els = document.querySelector(el)
        if (!els) return false
        if (bool)
          els.setAttribute(
            'style',
            `background-image:linear-gradient(to bottom left , ${color}, ${getLightColor(color, 0.6)})`
          )
        else els.setAttribute('style', `background-image:${color}`)
        setLocalThemeConfig()
      })
    }
    // 2、菜单 / 顶栏 --> 菜单字体背景高亮
    const onMenuBarHighlightChange = () => {
      nextTick(() => {
        setTimeout(() => {
          const elsItems = document.querySelectorAll('.el-menu-item')
          const elActive = document.querySelector('.el-menu-item.is-active')
          if (!elActive) return false
          if (themeConfig.value.isMenuBarColorHighlight) {
            elsItems.forEach((el: any) => el.setAttribute('id', ``))
            elActive.setAttribute('id', `add-is-active`)
            setCookie('menuBarHighlightId', elActive.getAttribute('id'), { type: 'localStorage' })
          } else {
            elActive.setAttribute('id', ``)
          }
          setLocalThemeConfig()
        }, 0)
      })
    }
    // 3、界面设置 --> 菜单水平折叠
    const onThemeConfigChange = () => {
      onMenuBarHighlightChange()
      setDispatchThemeConfig()
    }
    // 3、界面设置 --> 固定 Header
    const onIsFixedHeaderChange = () => {
      themeConfig.value.isFixedHeaderChange = !themeConfig.value.isFixedHeader
      setLocalThemeConfig()
    }
    // 3、界面设置 --> 经典布局分割菜单
    const onClassicSplitMenuChange = () => {
      themeConfig.value.isBreadcrumb = false
      setLocalThemeConfig()
      proxy.mittBus.emit('getBreadcrumbIndexSetFilterRoutes')
    }
    // 4、界面显示 --> 侧边栏 Logo
    const onIsShowLogoChange = () => {
      themeConfig.value.isShowLogoChange = !themeConfig.value.isShowLogo
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 面包屑 Breadcrumb
    const onIsBreadcrumbChange = () => {
      if (themeConfig.value.layout === 'classic') {
        themeConfig.value.isClassicSplitMenu = false
      }
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 开启 TagsView 拖拽
    const onSortableTagsViewChange = () => {
      proxy.mittBus.emit('openOrCloseSortable')
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 开启 TagsView 共用
    const onShareTagsViewChange = () => {
      proxy.mittBus.emit('openShareTagsView')
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 灰色模式/色弱模式
    const onAddFilterChange = (attr: string) => {
      if (attr === 'grayscale') {
        if (themeConfig.value.isGrayscale) themeConfig.value.isInvert = false
      } else {
        if (themeConfig.value.isInvert) themeConfig.value.isGrayscale = false
      }
      const cssAttr =
        attr === 'grayscale'
          ? `grayscale(${themeConfig.value.isGrayscale ? 1 : 0})`
          : `invert(${themeConfig.value.isInvert ? '80%' : '0%'})`
      const appEle: any = document.body
      appEle.setAttribute('style', `filter: ${cssAttr}`)
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 深色模式
    const onAddDarkChange = () => {
      const body = document.documentElement as HTMLElement
      if (themeConfig.value.isIsDark) body.setAttribute('data-theme', 'dark')
      else body.setAttribute('data-theme', '')
    }
    // 4、界面显示 --> 开启水印
    const onWaterMarkChange = () => {
      themeConfig.value.isWatermark ? Watermark.set(themeConfig.value.watermarkText) : Watermark.del()
      setLocalThemeConfig()
    }
    // 4、界面显示 --> 水印文案
    const onWaterMarkTextInput = (val: string) => {
      themeConfig.value.watermarkText = verifyAndSpace(val)
      if (themeConfig.value.watermarkText === '') return false
      if (themeConfig.value.isWatermark) Watermark.set(themeConfig.value.watermarkText)
      setLocalThemeConfig()
    }
    // 5、布局切换
    const onSetLayout = (layout: 'default' | 'classic' | 'transverse' | 'columns') => {
      setCookie('oldLayout', JSON.stringify(layout), { type: 'localStorage' })
      if (themeConfig.value.layout === layout) return false
      themeConfig.value.layout = layout
      themeConfig.value.isDrawer = false
      initLayoutChangeFun()
      onMenuBarHighlightChange()
    }
    // 设置布局切换函数
    const initLayoutChangeFun = () => {
      onBgColorPickerChange('menuBar')
      onBgColorPickerChange('menuBarColor')
      onBgColorPickerChange('topBar')
      onBgColorPickerChange('topBarColor')
    }
    // 关闭弹窗时，初始化变量。变量用于处理 proxy.$refs.layoutScrollbarRef.update()
    const onDrawerClose = () => {
      themeConfig.value.isFixedHeaderChange = false
      themeConfig.value.isShowLogoChange = false
      themeConfig.value.isDrawer = false
      setLocalThemeConfig()
    }
    // 布局配置弹窗打开
    const openDrawer = () => {
      themeConfig.value.isDrawer = true
    }
    // 触发 store 布局配置更新
    const setDispatchThemeConfig = () => {
      setLocalThemeConfig()
      setLocalThemeConfigStyle()
    }
    // 存储布局配置
    const setLocalThemeConfig = () => {
      useStore().useThemeStore = themeConfig.value
      // Local.remove('themeConfig')
      // Local.set('themeConfig', themeConfig.value)
    }
    // 存储布局配置全局主题样式（html根标签）
    const setLocalThemeConfigStyle = () => {
      setCookie('themeConfigStyle', document.documentElement.style.cssText, { type: 'localStorage' })
    }
    // 一键复制配置
    const onCopyConfigClick = () => {
      const copyThemeConfig = useStore().useThemeStore
      copyThemeConfig.isDrawer = false
      copyText(JSON.stringify(copyThemeConfig)).then(() => {
        themeConfig.value.isDrawer = false
      })
    }
    // 一键恢复默认
    const onResetConfigClick = () => {
      useStore().useThemeStore.$reset()
      window.location.reload()
    }
    // 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
    const initSetStyle = () => {
      setTimeout(() => {
        // 2、菜单 / 顶栏 --> 顶栏背景渐变
        onTopBarGradualChange()
        // 2、菜单 / 顶栏 --> 菜单背景渐变
        onMenuBarGradualChange()
        // 2、菜单 / 顶栏 --> 分栏菜单背景渐变
        onColumnsMenuBarGradualChange()
        // 2、菜单 / 顶栏 --> 菜单字体背景高亮
        onMenuBarHighlightChange()
      }, 1300)
    }
    onMounted(() => {
      nextTick(() => {
        // 判断当前布局是否不相同，不相同则初始化当前布局的样式，防止监听窗口大小改变时，布局配置logo、菜单背景等部分布局失效问题
        if (!getCookie('frequency', { type: 'localStorage' })) initLayoutChangeFun()
        setCookie('frequency', '1', { type: 'localStorage' })
        // 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
        proxy.mittBus.on('onSignInClick', () => {
          initSetStyle()
        })
        // 监听菜单点击，菜单字体背景高亮
        proxy.mittBus.on('onMenuClick', () => {
          onMenuBarHighlightChange()
        })
        // 监听窗口大小改变，非默认布局，设置成默认布局（适配移动端）
        proxy.mittBus.on('layoutMobileResize', (res: any) => {
          themeConfig.value.layout = res.layout
          themeConfig.value.isDrawer = false
          initLayoutChangeFun()
          onMenuBarHighlightChange()
          isMobile.value = _isMobile()
        })
        setTimeout(() => {
          // 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
          initSetStyle()
          // 灰色模式
          if (themeConfig.value.isGrayscale) onAddFilterChange('grayscale')
          // 色弱模式
          if (themeConfig.value.isInvert) onAddFilterChange('invert')
          // 深色模式
          if (themeConfig.value.isIsDark) onAddDarkChange()
          // 开启水印
          onWaterMarkChange()
          // 语言国际化
          // proxy.$i18n.locale = useStore().useThemeStore.globalI18n
        }, 100)
      })
    })
    onUnmounted(() => {
      // 取消监听菜单点击，菜单字体背景高亮
      proxy.mittBus.off('onMenuClick')
      proxy.mittBus.off('onSignInClick')
      proxy.mittBus.off('layoutMobileResize')
    })

    const globalTheme = ref<BaseSettingItem[]>([
      { label: 'primary', key: 'primary', type: 'color' },
      { label: 'success', key: 'success', type: 'color' },
      { label: 'info', key: 'info', type: 'color' },
      { label: 'warning', key: 'warning', type: 'color' },
      { label: 'danger', key: 'danger', type: 'color' }
    ])
    const globalMenu = ref<BaseSettingItem[]>([
      {
        label: '顶栏背景',
        key: 'topBar',
        onChange: () => onBgColorPickerChange('topBar'),
        type: 'color'
      },
      {
        label: '菜单背景',
        key: 'menuBar',
        onChange: () => onBgColorPickerChange('menuBar'),
        type: 'color'
      },
      {
        label: '分栏菜单背景',
        key: 'columnsMenuBar',
        onChange: () => onBgColorPickerChange('columnsMenuBar'),
        type: 'color'
      },
      {
        label: '顶栏默认字体颜色',
        key: 'topBarColor',
        onChange: () => onBgColorPickerChange('topBarColor'),
        type: 'color'
      },
      {
        label: '菜单默认字体颜色',
        key: 'menuBarColor',
        onChange: () => onBgColorPickerChange('menuBarColor'),
        type: 'color'
      },
      {
        label: '分栏菜单默认字体颜色',
        key: 'columnsMenuBarColor',
        onChange: () => onBgColorPickerChange('columnsMenuBarColor'),
        type: 'color'
      },
      {
        label: '顶栏背景渐变',
        key: 'isTopBarColorGradual',
        onChange: () => onTopBarGradualChange(),
        type: 'switch'
      },
      {
        label: '菜单背景渐变',
        key: 'isMenuBarColorGradual',
        onChange: () => onMenuBarGradualChange(),
        type: 'switch'
      },
      {
        label: '分栏菜单背景渐变',
        key: 'isColumnsMenuBarColorGradual',
        onChange: () => onColumnsMenuBarGradualChange(),
        type: 'switch'
      },
      {
        label: '菜单字体背景高亮',
        key: 'isMenuBarColorHighlight',
        onChange: () => onMenuBarHighlightChange(),
        type: 'switch'
      }
    ])
    const globalPageShow = ref<BaseSettingItem[]>([
      {
        label: '侧边栏 Logo',
        key: 'isShowLogo',
        type: 'switch',
        onChange: () => onIsShowLogoChange()
      },
      {
        label: '开启 Breadcrumb',
        key: 'isBreadcrumb',
        type: 'switch',
        style: {
          opacity: themeConfig.value.layout === 'classic' || themeConfig.value.layout === 'transverse' ? 0.5 : 1
        },
        disabled: themeConfig.value.layout === 'classic' || themeConfig.value.layout === 'transverse',
        onChange: () => onIsBreadcrumbChange()
      },
      {
        label: '开启 Breadcrumb 图标',
        key: 'isBreadcrumbIcon',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '开启 TagView',
        key: 'isTagView',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '开启 TagView 图标',
        key: 'isTagViewIcon',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '开启 TagView 缓存',
        key: 'isCacheTagView',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '开启 TagView 拖拽',
        key: 'isSortableTagView',
        type: 'switch',
        style: { opacity: isMobile.value ? 0.5 : 1 },
        disabled: isMobile.value,
        onChange: () => onSortableTagsViewChange()
      },
      {
        label: '开启 TagView 共用',
        key: 'isShareTagView',
        type: 'switch',
        onChange: () => onShareTagsViewChange()
      },
      {
        label: '开启 Footer',
        key: 'isFooter',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '灰色模式',
        key: 'isGrayscale',
        type: 'switch',
        onChange: () => onAddFilterChange('grayscale')
      },
      {
        label: '色弱模式',
        key: 'isInvert',
        type: 'switch',
        onChange: () => onAddFilterChange('invert')
      },
      {
        label: '深色模式',
        key: 'isIsDark',
        type: 'switch',
        onChange: () => onAddDarkChange()
      },
      {
        label: '开启水印',
        key: 'isWatermark',
        type: 'switch',
        onChange: () => onWaterMarkChange()
      },
      {
        label: '水印文案',
        key: 'watermarkText',
        type: 'input',
        elStyle: { width: '90px' },
        disabled: isMobile.value,
        onInput: (event: string) => onWaterMarkTextInput(event)
      }
    ])
    const globalPageSetting = ref<BaseSettingItem[]>([
      {
        label: '菜单水平折叠',
        key: 'isCollapse',
        type: 'switch',
        onChange: () => onThemeConfigChange()
      },
      {
        label: '菜单手风琴',
        key: 'isUniqueOpened',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '固定 Header',
        key: 'isFixedHeader',
        type: 'switch',
        onChange: () => onIsFixedHeaderChange()
      },
      {
        label: '经典布局分割菜单',
        key: 'isClassicSplitMenu',
        type: 'switch',
        style: { opacity: themeConfig.value.layout !== 'classic' ? 0.5 : 1 },
        onChange: () => onClassicSplitMenuChange()
      },
      {
        label: '开启锁屏',
        key: 'isLockScreen',
        type: 'switch',
        onChange: () => setLocalThemeConfig()
      },
      {
        label: '自动锁屏(s/秒)',
        key: 'lockScreenTime',
        type: 'input-number',
        elStyle: { width: '90px' },
        onChange: () => setLocalThemeConfig()
      }
    ])
    const otherSetting = ref<BaseSettingItem[]>([
      {
        label: 'TagView 风格',
        key: 'tagStyle',
        type: 'select',
        elStyle: { width: '90px' },
        onChange: () => setLocalThemeConfig(),
        options: [
          { label: '风格1', value: 'tags-style-one' },
          { label: '风格2', value: 'tags-style-two' },
          { label: '风格3', value: 'tags-style-three' },
          { label: '风格4', value: 'tags-style-four' },
          { label: '风格5', value: 'tags-style-five' }
        ]
      },
      {
        label: '主页面切换动画',
        key: 'animation',
        type: 'select',
        elStyle: { width: '90px' },
        onChange: () => setLocalThemeConfig(),
        options: [
          { label: 'slide-right', value: 'slide-right' },
          { label: 'slide-left', value: 'slide-left' },
          { label: 'opacitys', value: 'opacitys' }
        ]
      },
      {
        label: '分栏高亮风格',
        key: 'columnsAsideStyle',
        type: 'select',
        elStyle: { width: '90px' },
        onChange: () => setLocalThemeConfig(),
        options: [
          { label: '圆角', value: 'columns-round' },
          { label: '卡片', value: 'columns-card' }
        ]
      },
      {
        label: '分栏布局风格',
        key: 'columnsAsideLayout',
        type: 'select',
        elStyle: { width: '90px' },
        onChange: () => setLocalThemeConfig(),
        options: [
          { label: '水平', value: 'columns-horizontal' },
          { label: '垂直', value: 'columns-vertical' }
        ]
      }
    ])
    return {
      globalTheme,
      globalMenu,
      globalPageShow,
      globalPageSetting,
      otherSetting,
      openDrawer,
      onColorPickerChange,
      themeConfig,
      onDrawerClose,
      onSetLayout,
      onCopyConfigClick,
      onResetConfigClick
    }
  },
  render() {
    const {
      globalTheme,
      globalMenu,
      globalPageShow,
      globalPageSetting,
      otherSetting,
      onColorPickerChange,
      themeConfig,
      onDrawerClose,
      onSetLayout,
      onCopyConfigClick,
      onResetConfigClick
    } = this
    return (
      <>
        <div class="layout-breadcrumb-setting">
          <el-drawer
            title="布局配置"
            v-model={themeConfig.isDrawer}
            direction="rtl"
            destroy-on-close
            size="240px"
            onClose={onDrawerClose}
          >
            <el-scrollbar class="layout-breadcrumb-setting-bar">
              <el-divider content-position="left">全局主题</el-divider>
              {globalTheme.map(e => {
                return (
                  <>
                    <div class="layout-breadcrumb-setting-bar-flex">
                      <div class="layout-breadcrumb-setting-bar-flex-label">{e.label}</div>
                      <div class="layout-breadcrumb-setting-bar-flex-value">
                        <el-color-picker v-model={themeConfig[e.key]} onChange={() => onColorPickerChange(e.key)} />
                      </div>
                    </div>
                  </>
                )
              })}
              <el-divider content-position="left">菜单 / 顶栏</el-divider>
              {globalMenu.map(e => {
                return (
                  <>
                    <div class="layout-breadcrumb-setting-bar-flex">
                      <div class="layout-breadcrumb-setting-bar-flex-label">{e.label}</div>
                      <div class="layout-breadcrumb-setting-bar-flex-value">
                        {e.type === 'color' && (
                          <el-color-picker v-model={themeConfig[e.key]} onChange={() => e?.onChange && e.onChange()} />
                        )}
                        {e.type === 'switch' && (
                          <el-switch v-model={themeConfig[e.key]} onChange={() => e.onChange()}></el-switch>
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
              <el-divider content-position="left">界面设置</el-divider>
              {globalPageSetting.map(e => {
                return (
                  <>
                    <div class="layout-breadcrumb-setting-bar-flex">
                      <div class="layout-breadcrumb-setting-bar-flex-label">{e.label}</div>
                      <div class="layout-breadcrumb-setting-bar-flex-value">
                        {e.type === 'input-number' && (
                          <el-input-number
                            v-model={themeConfig[e.key]}
                            controls-position="right"
                            min={1}
                            max={9999}
                            onChange={() => e.onChange()}
                            size="small"
                            style={e.elStyle}
                          ></el-input-number>
                        )}
                        {e.type === 'switch' && (
                          <el-switch v-model={themeConfig[e.key]} onChange={() => e.onChange()}></el-switch>
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
              <el-divider content-position="left">界面显示</el-divider>
              {globalPageShow.map(e => {
                return (
                  <>
                    <div class="layout-breadcrumb-setting-bar-flex" style={e.style || {}}>
                      <div class="layout-breadcrumb-setting-bar-flex-label">{e.label}</div>
                      <div class="layout-breadcrumb-setting-bar-flex-value">
                        {e.type === 'color' && (
                          <el-color-picker v-model={themeConfig[e.key]} onChange={() => e?.onChange && e.onChange()} />
                        )}
                        {e.type === 'switch' && (
                          <el-switch
                            v-model={themeConfig[e.key]}
                            disabled={e.disabled || false}
                            onChange={() => e.onChange()}
                          ></el-switch>
                        )}
                        {e.type === 'input' && (
                          <el-input
                            v-model={themeConfig[e.key]}
                            disabled={e.disabled || false}
                            style={e.elStyle || {}}
                            onInput={(event: string) => e.onInput(event)}
                          ></el-input>
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
              <el-divider content-position="left">其它设置</el-divider>
              {otherSetting.map(e => {
                return (
                  <>
                    <div class="layout-breadcrumb-setting-bar-flex" style={e.style || {}}>
                      <div class="layout-breadcrumb-setting-bar-flex-label">{e.label}</div>
                      <div class="layout-breadcrumb-setting-bar-flex-value">
                        {e.type === 'select' && (
                          <el-select
                            v-model={themeConfig[e.key]}
                            placeholder="请选择"
                            size="small"
                            style={e.elStyle}
                            onChange={() => e.onChange()}
                          >
                            {e.options.map(o => {
                              return (
                                <>
                                  <el-option label={o.label} value={o.value}></el-option>
                                </>
                              )
                            })}
                          </el-select>
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
              {/* 布局切换 */}
              <el-divider content-position="left">布局切换</el-divider>
              <div class="layout-drawer-content-flex">
                {/* defaults 布局 */}
                <div class="layout-drawer-content-item" onClick={() => onSetLayout('default')}>
                  <section
                    class={[
                      'el-container',
                      'el-circular',
                      themeConfig.layout === 'default' ? 'drawer-layout-active' : ''
                    ]}
                  >
                    <aside class="el-aside" style="width: 20px"></aside>
                    <section class="el-container is-vertical">
                      <header class="el-header" style="height: 10px"></header>
                      <main class="el-main"></main>
                    </section>
                  </section>
                  <div class={['layout-tips-warp', themeConfig.layout === 'default' ? 'layout-tips-warp-active' : '']}>
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">默认</p>
                    </div>
                  </div>
                </div>
                {/* classic 布局 */}
                <div class="layout-drawer-content-item" onClick={() => onSetLayout('classic')}>
                  <section
                    class={[
                      'el-container',
                      'is-vertical',
                      'el-circular',
                      themeConfig.layout === 'classic' ? 'drawer-layout-active' : ''
                    ]}
                  >
                    <header class="el-header" style="height: 10px"></header>
                    <section class="el-container">
                      <aside class="el-aside" style="width: 20px"></aside>
                      <section class="el-container is-vertical">
                        <main class="el-main"></main>
                      </section>
                    </section>
                  </section>
                  <div class={['layout-tips-warp', themeConfig.layout === 'classic' ? 'layout-tips-warp-active' : '']}>
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">经典</p>
                    </div>
                  </div>
                </div>
                {/* transverse 布局 */}
                <div class="layout-drawer-content-item" onClick={() => onSetLayout('transverse')}>
                  <section
                    class={[
                      'el-container',
                      'is-vertical',
                      'el-circular',
                      themeConfig.layout === 'transverse' ? 'drawer-layout-active' : ''
                    ]}
                  >
                    <header class="el-header" style="height: 10px"></header>
                    <section class="el-container">
                      <section class="el-container is-vertical">
                        <main class="el-main"></main>
                      </section>
                    </section>
                  </section>
                  <div
                    class={['layout-tips-warp', themeConfig.layout === 'transverse' ? 'layout-tips-warp-active' : '']}
                  >
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">横向</p>
                    </div>
                  </div>
                </div>
                {/* columns 布局 */}
                <div class="layout-drawer-content-item" onClick={() => onSetLayout('columns')}>
                  <section
                    class={[
                      'el-container',
                      'el-circular',
                      themeConfig.layout === 'columns' ? 'drawer-layout-active' : ''
                    ]}
                  >
                    <aside class="el-aside-dark" style="width: 10px"></aside>
                    <aside class="el-aside" style="width: 20px"></aside>
                    <section class="el-container is-vertical">
                      <header class="el-header" style="height: 10px"></header>
                      <main class="el-main"></main>
                    </section>
                  </section>
                  <div class={['layout-tips-warp', themeConfig.layout === 'columns' ? 'layout-tips-warp-active' : '']}>
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">分栏</p>
                    </div>
                  </div>
                </div>
                <div class="copy-config">
                  <el-button
                    size="small"
                    class="copy-config-btn"
                    type="primary"
                    ref="copyConfigBtnRef"
                    onClick={onCopyConfigClick}
                  >
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                    一键复制配置
                  </el-button>
                  <el-button size="small" class="copy-config-btn-reset" type="info" onClick={onResetConfigClick}>
                    <el-icon>
                      <RefreshRight />
                    </el-icon>
                    一键恢复默认
                  </el-button>
                </div>
              </div>
            </el-scrollbar>
          </el-drawer>
        </div>
      </>
    )
  }
})
