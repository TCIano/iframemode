# iframeMode-template

Vue 3 + TypeScript + Ant Design Vue 企业级前端模板（iframeMode-template）。

## 技术栈

- Vue 3（`<script setup>` + Composition API）+ TypeScript（strict）
- Ant Design Vue 4 + `@ant-design/icons-vue`（图标按需引入）
- Pinia（Composition API 风格 store）+ Vue Router（Hash 模式）
- Vite 5 + vue-tsc + ESLint 9（perfectionist 排序）+ Prettier + commitlint + husky/lint-staged
- ECharts 5（按需注册，见 `src/utils/echarts.ts`）+ less（scoped）

## 目录结构

```
src/
├── api/              API 接口（按模块拆分，plop 生成）
├── assets/           静态资源
├── components/       通用组件（PascalCase.vue）
├── hooks/            组合式函数（useXxx.ts）
├── router/
│   ├── index.ts              创建路由实例（Hash 模式）
│   └── router.config.ts      路由表定义
├── stores/           Pinia store（useXxxStore，camelCase 文件）
├── types/            全局类型定义（T 前缀，统一 type 声明）
├── utils/
│   ├── request.ts    Axios 封装（code/message/data 契约、401/403 拦截）
│   └── echarts.ts    ECharts 按需注册
└── views/            页面组件（一个路由一个文件夹，plop 生成）
```

## 命令

| 命令                                  | 用途                                             |
| ------------------------------------- | ------------------------------------------------ |
| `npm run dev`                         | 开发服务器（vite proxy `/api` → localhost:8080） |
| `npm run build`                       | vue-tsc 类型检查 + vite build                    |
| `npm run lint`                        | ESLint 修复（`eslint . --fix`）                  |
| `npm run format`                      | Prettier 格式化                                  |
| `npm run type-check`                  | vue-tsc 类型检查                                 |
| `npm run gen:api -- <模块>`           | 生成 `src/api/xxx.ts` + `src/types/xxx.ts`       |
| `npm run gen:page -- <页面>`          | 生成 `src/views/xxx/` 页面 + hooks               |
| `npm run gen:component -- <组件>`     | 生成 `src/components/Xxx.vue`                    |
| `node create.js <name> [--stack xxx]` | 从模板初始化新项目                               |

## 规范与文档索引

- SOP 通用规范：`.claude/sop/通用/01-对话规范.md` ~ `09-自动校验规范.md`
- 技术栈规范：`.claude/sop/技术栈/vue-ant-design.md`、`vue-pinia.md`
- 项目文档：`docs/技术文档.md`、`docs/前端开发分享演讲稿.md`
- 脚手架模板：`templates/`（api、component、page 的 hbs 骨架）

## 关键约定（摘要，详见 SOP）

- 组件/API 层编码规范由 SOP 约束，ESLint + commitlint + husky 自动拦截
- 组件 class 采用简化 BEM（块 `__` 元素 `--` 修饰），scoped 优先
- 类型统一 `type` + `T` 前缀，接口继承模块公共基类，禁止 `any`
- 提交信息：中文描述 + type 前缀（feat/fix/docs/style/refactor/perf/test/chore/ci/revert）
- 分支命名：`feat/xxx`、`fix/xxx`、`refactor/xxx`
