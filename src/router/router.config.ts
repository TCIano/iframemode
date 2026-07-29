import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    component: () => import('@/views/dataFlow/index.vue'),
    meta: { title: '数据流向管理' },
    name: 'DataFlow',
    path: '/data-flow',
  },
]
