/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端接口基础路径（需与 vite proxy / 后端网关前缀一致，默认 /api） */
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
