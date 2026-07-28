# 状态管理：Pinia

> Vue 3 项目状态管理方案。关于"什么时候用 store、什么时候用 local state"的决策见 @.claude/sop/通用/08-状态管理规范.md。

---

## 文件位置

```
src/stores/
├── index.ts           ← 导出所有 store，方便统一引用
├── user.ts            ← 用户模块
└── report.ts          └ 报表模块
```

## 基本规则

| 规则           | 说明                                                 |
| -------------- | ---------------------------------------------------- |
| 文件命名       | camelCase，遵 @.claude/sop/通用/02-命名规则.md       |
| Store 命名     | `useXxxStore` 格式                                   |
| defineStore id | 字符串与文件名一致                                   |
| 风格           | Composition API `defineStore('name', () => { ... })` |
| 暴露           | 必须明确 `return { ... }`，不暴露内部 helper         |

## 完整模式（含异步请求）

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TUserInfo } from '@/types/user'
import { fetchUserList, fetchUserDetail } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // ── state ──
  const list = ref<TUserInfo[]>([])
  const current = ref<TUserInfo | null>(null)
  const loading = ref(false)

  // ── actions ──
  async function fetchList(params: { page: number }) {
    loading.value = true
    try {
      const res = await fetchUserList(params)
      list.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id: number) {
    const res = await fetchUserDetail(id)
    current.value = res.data
  }

  // ── reset ──
  function $reset() {
    list.value = []
    current.value = null
    loading.value = false
  }

  return { list, current, loading, fetchList, fetchDetail, $reset }
})
```

## 在组件中使用

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 保持响应性地解构 state
const { list, loading } = storeToRefs(userStore)
// action 可以直接解构
const { fetchList } = userStore
```

## 约定

- **不在组件内创建 store 实例之外的逻辑**（不需要在组件内再包一层 ref）
- **不要在 store 里放 UI 状态**（弹窗 visible、当前表单值——这些属于组件）
- **异步操作在 action 内完成**，组件只调用 action，不写 fetch
- **store 间引用**：用 `useXxxStore()` 在 action 内部调用，避免循环依赖

## 替换

换 React 项目时，此文件整体替换为对应方案（如 Zustand / Redux Toolkit），决策规则不变（见 08-状态管理规范.md）。
