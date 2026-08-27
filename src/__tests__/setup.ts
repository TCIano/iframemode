import { config } from '@vue/test-utils'
import Modal from 'ant-design-vue/es/modal'
import Spin from 'ant-design-vue/es/spin'

// 与 main.ts 一致，按需注册 Ant Design Vue 组件（子路径引入避免整包全量拖慢测试）
config.global.components = {
  ...config.global.components,
  AModal: Modal,
  ASpin: Spin,
}
