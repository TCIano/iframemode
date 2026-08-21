# 状态管理：Pinia

> Vue 3 项目状态管理方案。关于"什么时候用 store、什么时候用 local state"的决策见 @.claude/sop/通用/08-状态管理规范.md。

---

## 文件位置

```
src/stores/
├── user.ts              ← 用户模块
└── report.ts            ← 报表模块
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
import { fetchUserDetailApi, fetchUserListApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // ── state ──
  const list = ref<TUserInfo[]>([])
  const current = ref<TUserInfo | null>(null)
  const loading = ref(false)

  // ── actions ──
  async function fetchList(params: { page: number }) {
    loading.value = true
    try {
      const res = await fetchUserListApi(params)
      list.value = res.data.list
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id: number) {
    const res = await fetchUserDetailApi(id)
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

## 性能：`shallowRef` vs `ref`

| 类型         | 什么时候用                                   | 为什么                                                    |
| ------------ | -------------------------------------------- | --------------------------------------------------------- |
| `ref`        | 表单、当前对象、小型数据                     | 深层响应，嵌套属性变更自动追踪                            |
| `shallowRef` | **大列表兜底**、全量缓存、频繁整体替换的数据 | 只追踪 `.value` 替换，不递归深层属性，省掉整棵 Proxy 开销 |

```typescript
// ❌ 大列表用 ref — 每条记录都包 Proxy，变更检测白费
const list = ref<UserInfo[]>([])

// ✅ 大列表用 shallowRef — 整体替换时通知，不递归深层
const list = shallowRef<UserInfo[]>([])
// 更新：直接整体赋值（不涉及深层属性变更）
const res = await fetchList(params)
list.value = res.data.list
```

**经验法则：** store 里存放"服务端兜底数据"（列表、字典、配置）优先 `shallowRef`。需要深层响应（表单对象、当前编辑项）才用 `ref`。

**注意：** `shallowRef` 不追踪深层属性变更，`list.value[0].name = 'x'` 不会触发更新。必须整体替换或手动 `triggerRef(list)`。

## 在组件中使用

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const { list, loading } = storeToRefs(userStore)

const { fetchList } = userStore
```

## 约定

- **不在组件内创建 store 实例之外的逻辑**（不需要在组件内再包一层 ref）
- **不要在 store 里放 UI 状态**（弹窗 visible、当前表单值——这些属于组件）
- **异步操作在 action 内完成**，组件只调用 action，不写 fetch
- **store 间引用**：用 `useXxxStore()` 在 action 内部调用，避免循环依赖

## 替换

换 React 项目时，此文件整体替换为对应方案（如 Zustand / Redux Toolkit），决策规则不变（见 08-状态管理规范.md）。

---

## 相关文档

- 08-状态管理规范（何时用 store 的决策规则）
