import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tag/list',
  },
  {
    component: () => import('@/views/tag-list/index.vue'),
    meta: { title: '标签管理' },
    name: 'TagList',
    path: '/tag/list',
  },
]
