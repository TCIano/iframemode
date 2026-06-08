# iframeMode Template — 快速工程化优化设计

> 日期: 2026-06-08
> 项目: `D:\project\iframeMode-template`
> 现状: Vue 3 + TypeScript + Vite 5 + Ant Design Vue 4 + Pinia + ECharts 5 + Axios + Less

## 背景

当前模板项目定位为 iframe 内嵌前端模板，核心诉求是**快速开发**。经分析发现以下短板:

- **无 ESLint** — 仅 Prettier，代码无自动检查
- **无 Git hooks** — 无 pre-commit 检查，无 commit message 规范
- **Options API 混用** — ModalDialog/DrawerDialog 使用 Options API，与项目主流 `<script setup>` 不一致
- **明确 Bug** — BasicChart resize 监听泄漏、lodash 未声明、devtools 未注册
- **配置缺失** — 无 Vite proxy、无 .env 文件、无 Node 版本锁定

## 方案范围

采用**轻量规范套件**路线 — 最小化侵入，加规范不加重量，保留模板轻量本质。

### 1. ESLint 规范体系

**新增依赖**: `eslint` ^9.x, `@eslint/js`, `typescript-eslint` ^8.x, `eslint-plugin-vue` ^9.x, `eslint-config-prettier`, `eslint-plugin-perfectionist`

**新建 `eslint.config.js`** (扁平配置):

- `@eslint/js` recommended
- `tseslint.configs.recommendedTypeChecked`
- `plugin:vue/vue3-recommended`
- `perfectionist` import ordering
- `prettier` 兼容层

**package.json 脚本**:

```json
"lint": "eslint . --fix",
"format": "prettier --write src/"
```

**build 脚本简化**: 去掉 `npm-run-all2` 依赖，`build` 改为 `vue-tsc --build --force && vite build`

### 2. Git Hooks + Commit 规范

**新增依赖**: `husky` ^9.x, `lint-staged` ^15.x, `@commitlint/cli` ^19.x, `@commitlint/config-conventional`

**Hooks**:

- `.husky/pre-commit`: `npx lint-staged`
- `.husky/commit-msg`: `npx --no -- commitlint --edit $1`
- `lint-staged.config.js`: `*.{ts,vue}` → `eslint --fix`, `*.{ts,vue,css,less,md}` → `prettier --write`

**Commit 规范**: `commitlint.config.js` extends `@commitlint/config-conventional`, 严格模式

### 3. Options API → Composition API 统一

重构 `ModalDialog.vue` 和 `DrawerDialog.vue` 从 `defineComponent({...})` 为 `<script setup lang="ts">`:

- `defineProps` 替代 `props: {}`
- `defineEmits` 替代 `emits: []`
- `ref()` 替代 `data()`
- `defineExpose` 暴露 show/close/toggle

### 4. Bug 修复

- **BasicChart.vue**: resize 监听器改为命名函数引用，确保 `removeEventListener` 有效
- **useTreeShowWatcher.ts**: 用内联 `debounce` 工具函数替代未声明的 `lodash` 依赖
- **vite.config.ts**: 注册 `VueDevTools()` 插件 (已安装但未使用)
- **Vite proxy 配置**: 增加 `server.proxy` 指向开发后端

### 5. 配置补全

- 新建 `.env.development`: `VITE_BASE_URL=/api`
- `package.json` 增加: `"engines": { "node": ">=18.0.0" }`
- 删除无用依赖 `npm-run-all2`，`build` 脚本改为 `vue-tsc --build --force && vite build`
- ESLint 需配置 `parserOptions.project` 指向 `tsconfig.app.json`，支持类型检查规则

## 改动文件清单

| 文件                              | 操作 | 说明                         |
| --------------------------------- | ---- | ---------------------------- |
| `package.json`                    | 修改 | 增删依赖、脚本、engines      |
| `eslint.config.js`                | 新建 | ESLint 扁平配置              |
| `.husky/pre-commit`               | 新建 | Git pre-commit hook          |
| `.husky/commit-msg`               | 新建 | Git commit-msg hook          |
| `commitlint.config.js`            | 新建 | commitlint 配置              |
| `lint-staged.config.js`           | 新建 | lint-staged 规则             |
| `vite.config.ts`                  | 修改 | 注册 VueDevTools、添加 proxy |
| `.env.development`                | 新建 | 开发环境变量                 |
| `src/components/ModalDialog.vue`  | 修改 | Options → Composition API    |
| `src/components/DrawerDialog.vue` | 修改 | Options → Composition API    |
| `src/components/BasicChart.vue`   | 修改 | 修复 resize 监听泄露         |
| `src/hooks/useTreeShowWatcher.ts` | 修改 | 替换 lodash 为内联实现       |

## 验证方式

1. `npm install` 成功无报错
2. `npm run lint` 通过 (0 error, 0 warning)
3. `npm run type-check` 通过
4. `npm run dev` 正常启动, 开发工具栏可见
5. `git commit -m "test: verify commit hook"` → commitlint 校验生效
6. `npm run build` 成功
