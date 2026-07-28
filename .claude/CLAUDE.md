# iframeMode-template

Vue 3 + TypeScript + Ant Design Vue 企业级模板。

技术栈规则见 @.claude/sop/技术栈/vue-ant-design.md

## SOP — 方法论

本项目内置了一套 SOP（标准作业流程），约束人与 Agent 的协作方式。

### 按场景引用（按顺序读）

| 你的任务                  | 先读这些                                                        |
| ------------------------- | --------------------------------------------------------------- |
| 首次接项目 / 不熟悉规则   | 01-对话规范 → 02-命名规则 → 03-代码约束 → 技术栈/vue-ant-design |
| 新建模块 / 页面           | 03-代码约束（类型继承规则）→ 技术栈/vue-ant-design（目录结构）  |
| 给模块加 API              | 06-api设计规范 → 03-代码约束（类型约束）                        |
| 改动组件                  | 07-组件设计规范 → 技术栈/vue-ant-design（组件写法）             |
| 设计新组件 / 判断是否该抽 | 07-组件设计规范                                                 |
| 设计数据流 / 决定状态放哪 | 08-状态管理规范                                                 |
| 输出代码后                | 05-自检清单                                                     |
| 提交代码前                | 04-提交规范                                                     |
| 想了解哪层拦截哪层放过    | 09-自动校验规范                                                 |

### 文件索引

| 文件                                  | 用途                                         |
| ------------------------------------- | -------------------------------------------- |
| @.claude/sop/通用/01-对话规范.md      | 人与 Agent 的协作协议                        |
| @.claude/sop/通用/02-命名规则.md      | 文件/组件/变量/类型命名约定                  |
| @.claude/sop/通用/03-代码约束.md      | 禁止事项、类型安全、代码组织                 |
| @.claude/sop/通用/04-提交规范.md      | commit message、分支命名                     |
| @.claude/sop/通用/05-自检清单.md      | Agent 输出后逐条自我检查                     |
| @.claude/sop/通用/06-api设计规范.md   | API 命名、请求/响应结构、错误处理、类型组织  |
| @.claude/sop/通用/07-组件设计规范.md  | 组件分类决策、职责边界、Props/Emits 设计原则 |
| @.claude/sop/通用/08-状态管理规范.md  | 状态分层决策、local vs store、Store 设计原则 |
| @.claude/sop/通用/09-自动校验规范.md  | 拦截地图、自动化 vs 自检、CI 推荐配置        |
| @.claude/sop/技术栈/vue-pinia.md      | Pinia 状态管理规范（组合式 API 风格）        |
| @.claude/sop/技术栈/vue-ant-design.md | 当前技术栈其它规则                           |

## 工程载体 — 脚手架

文字约束 → 工具执行。以下命令可以一键生成规范骨架：

| 命令                             | 生成内容                              | 对应 SOP                                 |
| -------------------------------- | ------------------------------------- | ---------------------------------------- |
| `npm run gen:api <模块名>`       | `src/api/xxx.ts` + `src/types/xxx.ts` | 06-api设计规范 + 03-代码约束（类型继承） |
| `npm run gen:page <页面名>`      | `src/views/xxx/` + hooks + services   | 技术栈/vue-ant-design（目录结构）        |
| `npm run gen:component <组件名>` | `src/components/Xxx.vue`              | 07-组件设计规范 + 技术栈（组件写法）     |

示例：

```bash
npm run gen:api -- report
# → 生成 src/api/report.ts + src/types/report.ts（含 TReportBase、Omit/Pick 继承骨架）

npm run gen:page -- user-list
# → 生成 src/views/user-list/index.vue + hooks + services

npm run gen:component -- BasicTable
# → 生成 src/components/BasicTable.vue（含 Props/Emits/WithDefaults 骨架）
```

## 工程化命令

| 命令                 | 用途             |
| -------------------- | ---------------- |
| `npm run dev`        | 开发服务器       |
| `npm run build`      | 类型检查 + 构建  |
| `npm run lint`       | ESLint 修复      |
| `npm run format`     | Prettier 格式化  |
| `npm run type-check` | vue-tsc 类型检查 |

## 新建项目

用 `create.js` 从模板初始化：

```bash
node create.js my-project-name
cd my-project-name
npm run dev
```

支持 `--stack` 参数指定技术栈规范：

```bash
node create.js my-api --stack node-express
```
