/// <reference types="vite/client" />
declare global {
  interface ImportMeta {
    env: Record<string, unknown>
  }
  interface NodeJS {
    Timeout: number
  }
}

declare module 'sortablejs'
declare module 'mitt'

interface Window {
  [App: string]: any
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
    readonly BASENAME: string
  }
}

declare module '*.bmp' {
  export default src as string
}

declare module '*.gif' {
  export default src as string
}

declare module '*.jpg' {
  export default src as string
}

declare module '*.jpeg' {
  export default src as string
}

declare module '*.png' {
  export default src as string
}

declare module '*.webp' {
  export default src as string
}

declare module '*.svg' {
  import * as Vue from 'vue'
  export const VueComponent: Vue.FunctionalComponent<SVGProps<SVGElement>>
  export default src as string
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}
