<template>
  <div class="login-scan-container">
    <div ref="qrCodeRef"></div>
  </div>
</template>

<script lang="ts">
  import { toRefs, reactive, defineComponent, onMounted, getCurrentInstance } from 'vue'
  import QRCode from 'qrcodejs2-fixes'
  export default defineComponent({
    name: 'LoginScan',
    setup() {
      const { proxy } = getCurrentInstance() as any
      const state = reactive({})
      // 初始化生成二维码
      const initQrCode = () => {
        proxy.$refs.qrCodeRef.innerHTML = ''
        new QRCode(proxy.$refs.qrCodeRef, {
          // text: `https://qm.qq.com/cgi-bin/qm/qr?k=RdUY97Vx0T0vZ_1OOu-X1yFNkWgDwbjC&jump_from=webapi`,
          text: `叼毛你好`,
          width: 260,
          height: 260,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
      }
      // 页面加载时
      onMounted(() => {
        initQrCode()
      })
      return {
        ...toRefs(state)
      }
    }
  })
</script>

<style scoped lang="scss">
  .login-scan-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    animation: logoAnimation 0.3s ease;
  }
</style>