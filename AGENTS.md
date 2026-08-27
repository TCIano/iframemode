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

| 命令                                 | 用途                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `npm run gen:api -- <模块>`          | 生成 `src/api/xxx.ts` + `src/types/xxx.ts`                   |
| `npm run gen:api -- <业务域>/<模块>` | 生成 `src/api/<业务域>/xxx.ts` + `src/types/<业务域>/xxx.ts` |
| `npm run gen:page -- <页面>`         | 生成 `src/views/xxx/` 页面骨架 + components                  |
| `npm run gen:component -- <组件>`    | 生成 `src/components/Xxx.vue`                                |
| `npm run test:run`                   | 单元/组件测试（单次执行）                                    |
| `npm run test:e2e`                   | Playwright E2E（首次需 `npx playwright install`）            |

> 其余脚本（`dev` / `build` / `lint` / `format` / `type-check` 等）见 `package.json`，不在此重复。
> `pre-commit` 不执行类型检查，提交前需手动 `npm run type-check`（详见 09-自动校验规范）。

## 规范文档

**按任务查规范 → 读 `.claude/sop/README.md`**（唯一入口：文件索引、按任务读取表、组合场景、脚手架对应、优先级）。任务地图与关键约定只在 README 及其指向的 SOP 维护

### 规范演进

当 Agent 反复犯同一类错时，把错误抽象成一条新规则补进对应 SOP（例如：组件内直接写 `fetch` → 在 `03-代码约束.md` 补"组件内禁止直接 fetch/axios"）。让规范随使用持续进化，而不是写一次就落灰。
