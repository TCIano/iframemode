# 技术栈规则：ECharts

> 目标：图表相关写法统一。按需注册，避免全量引入导致包体膨胀。

---

## 按需注册

- 通过 `src/utils/echarts.ts` 按需注册组件
- 不要直接 `import * as echarts from 'echarts'`

## 类型与封装

- 图表类型定义用 `src/types/echarts.ts` 中的 `TChartOption`
- 图表 option 的构造逻辑封装在 `src/hooks/` 中

---

## 相关文档

- 技术栈/vue-core.md（Vue 基础约定）
- 技术栈/vue-antd.md（AntD 专属）
