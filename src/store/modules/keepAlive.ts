import { defineStore } from 'pinia'
import { ref } from 'vue'

export const KeepAliveStore = defineStore('keepAlive', () => {
  const keepAliveNames = ref<string[]>([])

  return {
    keepAliveNames
  }
})
