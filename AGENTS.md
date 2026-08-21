# iframeMode-template

Vue 3 + TypeScript + Ant Design Vue 企业级前端模板（iframeMode-template）。

## 技术栈

- Vue 3（`<script setup>` + Composition API）+ TypeScript（strict）
- Ant Design Vue 4 + `@ant-design/icons-vue`（图标按需引入）
- Pinia（Composition API 风格 store）+ Vue Router（Hash 模式）
- Vite 5 + vue-tsc + ESLint 9（perfectionist 排序）+ Stylelint + Prettier + commitlint + husky/lint-staged
- ECharts 5（按需注册，见 `src/utils/echarts.ts`）+ less（scoped）
- Vitest + @vue/test-utils（单元/组件测试，测试文件放 `src/**/__tests__/`）+ Playwright（E2E，`e2e/` 目录）

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

| 命令                                  | 用途                                              |
| ------------------------------------- | ------------------------------------------------- |
| `npm run dev`                         | 开发服务器（vite proxy `/api` → localhost:8080）  |
| `npm run build`                       | vue-tsc 类型检查 + vite build                     |
| `npm run lint`                        | ESLint + Stylelint 修复                           |
| `npm run lint:style`                  | Stylelint 修复（样式）                            |
| `npm run format`                      | Prettier 格式化                                   |
| `npm run type-check`                  | vue-tsc 类型检查                                  |
| `npm run gen:api -- <模块>`           | 生成 `src/api/xxx.ts` + `src/types/xxx.ts`        |
| `npm run gen:page -- <页面>`          | 生成 `src/views/xxx/` 页面骨架 + components       |
| `npm run gen:component -- <组件>`     | 生成 `src/components/Xxx.vue`                     |
| `npm run test`                        | 单元/组件测试（vitest watch 模式）                |
| `npm run test:run`                    | 单元/组件测试（单次执行）                         |
| `npm run test:coverage`               | 单元/组件测试 + 覆盖率（v8）                      |
| `npm run type-check:test`             | 测试文件类型检查（tsconfig.vitest.json）          |
| `npm run test:e2e`                    | Playwright E2E（首次需 `npx playwright install`） |
| `node create.js <name> [--stack xxx]` | 从模板初始化新项目                                |

## 规范与文档索引

- SOP 通用规范：`.claude/sop/通用/02-命名规则.md` ~ `09-自动校验规范.md`
- 技术栈规范：`.claude/sop/技术栈/vue-core.md`、`vue-antd.md`、`vue-pinia.md`、`vue-echarts.md`
- 项目文档：`docs/技术文档.md`、`docs/前端开发分享演讲稿.md`
- 脚手架模板：`templates/`（api、component、page 的 hbs 骨架）

### 按场景引用（按需读）

> 表格是保底起点，不是白名单。实际执行时按「你实际创建/修改了哪些文件」动态补充——例如新建页面时如果同时创建了 API、类型、组件文件，就要额外读对应规范。

| 你的任务                  | 至少读这些（起点，非白名单）                                                |
| ------------------------- | --------------------------------------------------------------------------- |
| 首次接项目 / 不熟悉规则   | 02-命名规则 → 03-代码约束 → 技术栈/vue-core（vue-pinia、vue-antd 按需触发） |
| 新建模块 / 页面           | 03-代码约束（类型继承规则）→ 技术栈/vue-core（目录结构）                    |
| 给模块加 API              | 06-api设计规范 → 03-代码约束（类型约束）                                    |
| 改动组件                  | 07-组件设计规范 → 技术栈/vue-core（组件写法）→ 技术栈/vue-antd（AntD 用法） |
| 设计新组件 / 判断是否该抽 | 07-组件设计规范 → 技术栈/vue-core（组件写法）→ 技术栈/vue-antd（AntD 用法） |
| 设计数据流 / 决定状态放哪 | 08-状态管理规范 → 技术栈/vue-pinia（实施写法）                              |
| 输出代码后                | 05-自检清单                                                                 |
| 提交代码前                | 04-提交规范                                                                 |
| 修复 bug / 排查问题       | 涉及什么读什么（组件→07、接口→06、数据流→08）→ 完成后跑 05-自检清单         |
| 想了解哪层拦截哪层放过    | 09-自动校验规范                                                             |

组合场景（同时涉及多个任务类型时叠加读）：

| 组合任务                       | 读哪些                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| 新建页面 + API + 类型          | "新建模块/页面" + "给模块加 API" + 输出后自检清单                                    |
| 新建组件 + 涉及数据流          | "改动组件" + "设计数据流/决定状态放哪"                                               |
| 新建页面 + 组件 + API + 数据流 | "新建模块/页面" + "改动/设计新组件" + "给模块加 API" + "设计数据流" + 输出后自检清单 |

### 文件索引

| 文件                                  | 用途                                         |
| ------------------------------------- | -------------------------------------------- |
| `.claude/sop/通用/02-命名规则.md`     | 文件/组件/变量/类型命名约定                  |
| `.claude/sop/通用/03-代码约束.md`     | 禁止事项、类型安全、代码组织                 |
| `.claude/sop/通用/04-提交规范.md`     | commit message、分支命名                     |
| `.claude/sop/通用/05-自检清单.md`     | Agent 输出后逐条自我检查                     |
| `.claude/sop/通用/06-api设计规范.md`  | API 命名、请求/响应结构、错误处理、类型组织  |
| `.claude/sop/通用/07-组件设计规范.md` | 组件分类决策、职责边界、Props/Emits 设计原则 |
| `.claude/sop/通用/08-状态管理规范.md` | 状态分层决策、local vs store、Store 设计原则 |
| `.claude/sop/通用/09-自动校验规范.md` | 拦截地图、自动化 vs 自检、CI 推荐配置        |
| `.claude/sop/技术栈/vue-core.md`      | Vue 3 基础约定（目录/组件/路由/HTTP/样式）   |
| `.claude/sop/技术栈/vue-antd.md`      | Ant Design Vue 4 专属（Icon/主题 token）     |
| `.claude/sop/技术栈/vue-pinia.md`     | Pinia 状态管理规范（组合式 API 风格）        |
| `.claude/sop/技术栈/vue-echarts.md`   | ECharts 按需注册、图表类型、option 构造约定  |

### 脚手架对应 SOP

| 命令                             | 生成内容                               | 对应 SOP                                 |
| -------------------------------- | -------------------------------------- | ---------------------------------------- |
| `npm run gen:api <模块名>`       | `src/api/xxx.ts` + `src/types/xxx.ts`  | 06-api设计规范 + 03-代码约束（类型继承） |
| `npm run gen:page <页面名>`      | `src/views/xxx/` 页面骨架 + components | 技术栈/vue-core（目录结构）              |
| `npm run gen:component <组件名>` | `src/components/Xxx.vue`               | 07-组件设计规范 + 技术栈（组件写法）     |

### 规范演进

当 Agent 反复犯同一类错时，把错误抽象成一条新规则补进对应 SOP（例如：组件内直接写 `fetch` → 在 `03-代码约束.md` 补"组件内禁止直接 fetch/axios"）。让规范随使用持续进化，而不是写一次就落灰。

## 关键约定（摘要，详见 SOP）

- 组件/API 层编码规范由 SOP 约束，ESLint + commitlint + husky 自动拦截
- 组件 class 采用简化 BEM（块 `__` 元素 `--` 修饰），scoped 优先
- 类型统一 `type` + `T` 前缀，类型继承模块公共基类，禁止 `any`
- 提交信息：中文描述 + type 前缀（feat/fix/docs/style/refactor/perf/test/chore/ci/revert）
- 分支命名：`feat/xxx`、`fix/xxx`、`refactor/xxx`
