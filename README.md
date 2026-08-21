# iframeMode-template

Vue 3 + TypeScript + Ant Design Vue 企业级前端项目模板，解决"从 0 到 1 搭项目"的重复劳动问题。

## 特性

- **标准化的八层目录架构**：`views / components / hooks / api / stores / types / utils / router`，职责边界清晰、数据流向固定
- **完整的工程化配置**：ESLint / Prettier / Husky / lint-staged / commitlint 开箱即用
- **代码生成脚手架**：一条命令生成符合规范的 API 模块 / 页面骨架 / 组件骨架
- **一键建项目**：`create.js` 复制模板、改名、初始化 git、自动装依赖
- **SOP 规范体系**：`.claude/sop/` 沉淀团队规范，让 AI 也能按统一标准产出代码

## 快速开始

### 方式一：从模板初始化新项目（推荐）

```bash
node <模板路径>/create.js my-new-project

cd my-new-project
npm run dev
```

### 方式二：直接在模板目录开发

```bash
npm install
npm run dev
```

## 常用命令

| 命令                                | 用途                                           |
| ----------------------------------- | ---------------------------------------------- |
| `npm run dev`                       | 启动开发服务器                                 |
| `npm run build`                     | 类型检查 + 构建                                |
| `npm run type-check`                | TypeScript 类型检查                            |
| `npm run lint`                      | ESLint 检查并自动修复                          |
| `npm run gen:api -- <模块名>`       | 生成 API 模块（`api/xxx.ts` + `types/xxx.ts`） |
| `npm run gen:page -- <页面名>`      | 生成页面骨架（`views/xxx/` + components）      |
| `npm run gen:component -- <组件名>` | 生成通用组件（`components/Xxx.vue`）           |

## 目录结构

```
├── src/                  # 业务代码（主要开发目录）
│   ├── api/              # 接口调用层（所有后端请求函数）
│   ├── components/       # 通用组件（跨模块可复用）
│   ├── hooks/            # 组合式函数（可复用逻辑）
│   ├── router/           # 路由（index.ts 实例 + router.config.ts 路由表）
│   ├── stores/           # 全局状态（Pinia）
│   ├── types/            # 类型定义（与后端数据结构的契约）
│   ├── utils/            # 纯函数工具（request.ts / echarts.ts）
│   └── views/            # 页面组件（一个路由对应一个文件夹）
├── templates/            # 脚手架模板（Plop 生成代码的源头）
├── .claude/              # SOP 规范体系 + 根目录 CLAUDE.md 导入桥
└── docs/                 # 技术文档
```

## 技术文档

架构分层、接口规范、代码生成、SOP 体系的完整说明见 **[docs/技术文档.md](docs/技术文档.md)**。

> 文档版本：1.0.0 ｜ Vue 3 + TypeScript + Ant Design Vue
