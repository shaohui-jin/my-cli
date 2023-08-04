import { defineComponent } from 'vue'
import { routes } from '@/constant'
import './navbar.less'
import { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'SLANavbar',
  setup() {},
  render() {
    let {
      options: {
        history: {
          state: {
            back, // 上一个路由
            current // 当前路由 其实也可用this.$route直接获取对象
          }
        }
      }
    } = this.$router
    back = back || '/home'
    const showHome = current === '/home'
    const currentRoute: RouteRecordRaw = routes.find(route => route.path === current)
    const backRoute: RouteRecordRaw = routes.find(route => route.path === back)
    return (
      <>
        <div class="SLA-navbar-container">
          <el-page-header
            v-slots={{
              // breadcrumb: () => {
              // return (
              //   <el-breadcrumb separator="/">
              //     <el-breadcrumb-item v-if={showHome} to={{ path: '/' }}>
              //       首页
              //     </el-breadcrumb-item>
              //     <el-breadcrumb-item to={{ path: path }}>{name}</el-breadcrumb-item>
              //   </el-breadcrumb>
              // )
              // },
              // icon: () => 'Back',
              title: () => <a href={backRoute.path}> {backRoute.name} </a>,
              content: () => {
                return (
                  <>
                    <div class="">
                      {/*<span class="">{backRoute.name} </span>*/}
                      {/*<span class="">{currentRoute.name}</span>*/}
                      <el-tag>{currentRoute.name}</el-tag>
                    </div>
                  </>
                )
              }
            }}
          />
        </div>
      </>
    )
  }
})
