# iframeMode-template 约定上下文

本模板的"业务领域"是它自身的工程约定。本文件是这些约定的唯一术语源：SOP 文档与代码使用同一套词汇，定义冲突时以本文件为准。

## Language

**业务模块（模块）**:
`src/api/` + `src/types/` 中按业务划分的独立单元（user、report、dashboard）。
_Avoid_: 功能组、services

**模块基类（`T{X}Base`）**:
模块内公共字段的类型基类，供该模块所有派生类型继承，字段单一来源。
_Avoid_: 公共 Model、BaseType

**类型前缀（`T`）**:
业务类型统一 `T` 前缀 + `type` 声明（`TUserInfo`），Props/Emits 类型例外（不加 `T`）。
_Avoid_: `I` 前缀、无前缀

**统一响应契约（契约）**:
后端统一 `{ code, message, data }`；成功（`code === 200`）时 `data` 必存在，失败在拦截器层 reject。
_Avoid_: 信封、包装格式

**拦截器层**:
`src/utils/request.ts` 中对统一响应做 401 / 403 / 业务错误统一处理的 Axios 拦截。
_Avoid_: request 封装、http client

**深模块**:
小接口 × 深实现的设计形态；组件 / hook 的接口含 Props、Emits、`defineExpose` 与不变量。见 SOP 07 §2。
_Avoid_: 微组件、过度拆分

**seam（接口缝）**:
模块接口所在位置；两个真实、不同的适配器跨过才算真 seam。
_Avoid_: 边界（与 DDD bounded context 混淆）

**展示组件 / 容器组件**:
展示组件纯渲染（props + emits 通信），容器组件管数据与状态。通用组件尽量写成展示组件。
_Avoid_: 智能组件 / 哑组件

**简化 BEM**:
`.block__element--modifier` 三层 CSS 类名，配合 scoped，避免纯 BEM 冗长。
_Avoid_: 驼峰类名、纯下划线类名

**单一事实源**:
每条规则 / 术语只在一个权威位置维护：规范索引在 `.claude/sop/README.md`，术语定义在本文件。
_Avoid_: 双份清单、文档缓存
