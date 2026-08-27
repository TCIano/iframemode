# 技术栈规则：ECharts

> 目标：图表相关写法统一。按需注册，避免全量引入导致包体膨胀。

---

## 按需注册

- 运行时代码通过 `src/utils/echarts.ts` 从 `echarts/core` 按需注册组件
- 类型文件可使用 ECharts 的 type-only 导入组合 option 类型，但不得引入运行时全量模块

## 类型与封装

- 图表类型定义用 `src/types/echarts.ts` 中的 `TChartOption`
- 图表 option 的构造逻辑封装在 `src/hooks/` 中（如 `useTrendOpt`，返回 `TChartOption`）
- 实例获取用 `src/utils/echarts.ts` 的 `getEchartsInstance(dom, theme?)`：懒初始化，同 DOM 幂等
- 实例生命周期管理用 `src/hooks/useChart.ts` 的 `useChart`：
  - 入参：`useChart(domRef, () => option, { onFinished?, onAxisClick? })`
  - 接管：init、option 变化自动 `setOption`、window resize、销毁清理
  - 返回：`{ chart, init, resize, updateOption, destroy }`

分层约定：`utils/echarts.ts` 只做注册 + 实例获取（无状态工具），`hooks/useChart.ts` 管实例生命周期（有状态），业务侧只需提供 option 构造函数。

---

## 相关文档

- 技术栈/vue-core.md（Vue 基础约定）
- 技术栈/vue-antd.md（AntD 专属）
