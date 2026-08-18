import { config } from '@vue/test-utils'
import { Modal } from 'ant-design-vue'

// 与 main.ts 一致，按需注册 Ant Design Vue 组件（避免整包全量引入拖慢测试）
config.global.components = { AModal: Modal }
