# 技术栈规则：Vue 3 + Ant Design Vue

> 目标：此技术栈下的项目约定，换技术栈时此文件整体替换。

---

## 目录结构

```
src/
├── api/              API 接口（按模块拆分，如 report.ts）
├── assets/           静态资源
├── components/       通用组件（PascalCase.vue）
├── hooks/            组合式函数（useXxx.ts）
├── router/           路由配置
│   ├── index.ts              创建路由实例
│   └── router.config.ts      路由表定义
├── stores/           Pinia store（useXxxStore）
├── types/            全局类型定义
├── utils/            工具函数
│   ├── request.ts    Axios 封装
│   └── echarts.ts    ECharts 按需注册
└── views/            页面组件（一个路由对应一个文件夹）
```

## 组件规范

### 文件结构（必须按此顺序）

```vue
<script setup lang="ts">
// 逻辑区
</script>

<template>
  <!-- 模板区 -->
</template>

<style scoped lang="less">
// 样式区
</style>
```

> 组件设计原则（分类、何时抽组件、Props 设计）见 @.claude/sop/通用/07-组件设计规范.md。

### Props 定义

```typescript
type BasicTableProps = {
  dataSource: TUserInfo[]
  loading?: boolean
  pagination?: { pageSize: number }
}

const props = withDefaults(defineProps<BasicTableProps>(), {
  loading: false,
  pagination: () => ({ pageSize: 10 }),
})
```

> Props 类型统一使用 `type`（遵 @.claude/sop/通用/03-代码约束.md）

### Emits 定义

```typescript
type BasicTableEmit = {
  (e: 'update', record: TUserInfo): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<BasicTableEmit>()
```

### Icon 引用

从 `@ant-design/icons-vue` 按需引入，**不要**全量注册：

```typescript
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
```

### 暴露内部方法

```typescript
defineExpose({ reload, reset })
```

## 状态管理

见 @.claude/sop/技术栈/vue-pinia.md

## HTTP 请求（Axios）

- 统一通过 `src/utils/request.ts` 创建的 Axios 实例
- 后端返回格式：`{ data, errMsg, result, totalSize }`
- 开发环境自动打印错误日志
- `baseURL` 通过 `import.meta.env.VITE_BASE_URL` 配置

### API 层写法

> API 函数命名、类型继承、前缀提取等通用规范见 @.claude/sop/通用/06-api设计规范.md。以下仅展示 Axios 实例的基本使用方式。

```typescript
// src/api/user.ts
import request from '@/utils/request'
import type { TUserListReq, TUserListResp, TUserInfo } from '@/types/user'

const PREFIX = '/user'

export function fetchUserList(params: TUserListReq) {
  return request.get<TUserListResp>(`${PREFIX}/list`, { params })
}

export function fetchUserDetail(id: number) {
  return request.get<TUserInfo>(`${PREFIX}/${id}`)
}

export function createUser(data: Partial<TUserInfo>) {
  return request.post<TUserInfo>(PREFIX, data)
}
```

## ECharts

- 通过 `src/utils/echarts.ts` 按需注册组件
- 不要直接 `import * as echarts from 'echarts'`
- 图表类型定义用 `src/types/echarts.ts` 中的 `chartOption`
- 图表 option 的构造逻辑封装在 `src/hooks/` 中

## 路由

- Hash 模式：`createWebHashHistory()`
- 路由表统一在 `router.config.ts` 中定义
- 菜单标题通过 `meta.title` 传递

```typescript
{
  path: '/user/list',
  name: 'UserList',
  component: () => import('@/views/user/list/index.vue'),
  meta: { title: '用户列表' },
}
```

## 样式（Less）

- 使用 scoped style
- 覆盖 Ant Design Vue 组件样式时，用 scoped + 嵌套选择器
- 全屏布局使用 `calc(100vh - Xpx)` 实现
- 组件根元素 class 统一使用 `组件名_kebab-case_wrapper` 格式

## 类型检查

- TypeScript `strict: true`
- 使用 `@vue/tsconfig` 基础配置
- 运行 `vue-tsc --build --force` 进行类型检查（见 `package.json`）
