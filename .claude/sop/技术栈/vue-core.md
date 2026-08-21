# 技术栈规则：Vue 3 核心

> 目标：Vue 3 项目基础约定（框架层）。换技术栈时此文件整体替换。
> Ant Design Vue 专属约定见 @.claude/sop/技术栈/vue-antd.md。

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
> AntD 组件用法（Icon、主题 token）见 @.claude/sop/技术栈/vue-antd.md。

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

### 暴露内部方法

```typescript
defineExpose({ reload, reset })
```

## 状态管理

见 @.claude/sop/技术栈/vue-pinia.md

## HTTP 请求（Axios）

- 统一通过 `src/utils/request.ts` 创建的 Axios 实例
- `baseURL` 通过 `import.meta.env.VITE_BASE_URL` 配置

> 统一响应契约（`{ code, message, data }`，见 CONTEXT.md）、分页 `TPageResult<T>` 定义及 API 层完整写法（命名 / 类型继承 / 前缀提取）见 @.claude/sop/通用/06-api设计规范.md。

## ECharts

见 @.claude/sop/技术栈/vue-echarts.md

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
- 全屏布局使用 `calc(100vh - Xpx)` 实现
- 组件 class 采用简化 BEM：块 = 组件根（组件名转 kebab-case），元素用 `块__元素`，修饰符用 `块--修饰`（详见 02-命名规则.md）

## 类型检查

- TypeScript `strict: true`
- 使用 `@vue/tsconfig` 基础配置
- 运行 `vue-tsc --build --force` 进行类型检查（见 `package.json`）

---

## 相关文档

- 07-组件设计规范（组件分类、何时抽组件、Props/Emits 设计）
- 06-api设计规范（API 命名、契约、类型继承）
- 03-代码约束（类型、代码组织、注释约束）
- 技术栈/vue-antd.md（Ant Design Vue 专属约定）
- 技术栈/vue-pinia.md（状态管理写法）
- 技术栈/vue-echarts.md（图表规范）
