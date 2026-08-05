# 技术栈规则：Ant Design Vue

> 目标：Ant Design Vue 4 专属约定（UI 库层）。换 UI 库时此文件整体替换。
> 依赖版本：`ant-design-vue ^4.2.2`、`@ant-design/icons-vue ^7.0.1`
> Vue 基础约定见 @.claude/sop/技术栈/vue-core.md。

---

## Icon 引用

从 `@ant-design/icons-vue` 按需引入，**不要**全量注册：

```typescript
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
```

## 覆盖组件样式

- 使用 scoped + 嵌套选择器覆盖，不要全局覆盖
- 优先用主题 token 调整（见下节），CSS 覆盖是兜底

## 主题 token（ConfigProvider）

统一用 `<a-config-provider>` 的 `theme` 定制，改主题只动一处，避免 CSS hack 散落：

```vue
<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'ant-design-vue'

// token: 设计变量（色板/圆角/间距）；algorithm: 暗色算法（亮色为默认，不传）
const themeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 4,
  },
  algorithm: theme.darkAlgorithm,
}
</script>
```

- **换主题色只改 `token.colorPrimary`**，组件自动跟随，不逐组件改色
- **暗色模式**传 `algorithm: theme.darkAlgorithm`；亮色为默认，不传
- token 覆盖不了的定制（布局、遮罩层级）才用 scoped CSS 覆盖

---

## 相关文档

- 技术栈/vue-core.md（Vue 3 基础约定）
- 07-组件设计规范（组件分类、Props/Emits 设计）
- 03-代码约束（样式相关约束）
