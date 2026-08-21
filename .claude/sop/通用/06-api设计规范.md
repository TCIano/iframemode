# API 设计规范（前端侧）

> 目标：前端 API 调用层的写法统一，减少"同一个接口五种写法"的问题。
> 适用范围：仅约束 `src/api/` 和 `src/types/` 中的前端代码。

---

## 1. API 函数命名

### 前端方法命名（与后端 URL 无关）

```
fetch{Resource}{Action}  — 资源名 + 操作，camelCase

✅ fetchUserListApi, fetchUserDetailApi, createUserApi, updateUserApi, deleteUserApi
❌ getUserData, api_user_list, requestForUsers
```

| 操作      | 前缀                                         |
| --------- | -------------------------------------------- |
| 查询列表  | `fetch{Resource}List`                        |
| 查询详情  | `fetch{Resource}Detail`                      |
| 新增      | `create{Resource}`                           |
| 编辑      | `update{Resource}`                           |
| 删除      | `delete{Resource}`                           |
| 批量操作  | `{Action}{Resource}`（如 `batchDeleteUser`） |
| 导出/下载 | `export{Resource}`                           |

---

## 2. 类型定义规范

### 命名约定（前端侧）

- 请求参数类型统一加 `Req` 后缀：`TUserListReq`
- 后端响应体类型统一加 `Resp` 后缀：`TUserListResp`
- 后端响应中的单条数据类型不加后缀：`TUserInfo`
- api 层请求函数统一加 `Api` 后缀：`fetchUserListApi`（与 hooks / store action 同名区分）
- 统一响应契约（见 CONTEXT.md；文档用，非强制约定）：

```typescript
// src/types/common.ts
/** 统一响应契约（主流：code + message + data，见 CONTEXT.md） */
type TApiResponse<T = unknown> = {
  /** 业务状态码，200 表示成功 */
  code: number
  /** 响应数据（业务层拿到的均为成功响应，data 必存在；失败响应在拦截器层被 reject） */
  data: T
  /** 状态描述 */
  message: string
}

/** 分页结果（独立于基础响应，仅列表接口使用） */
type TPageResult<T> = {
  /** 当前页数据 */
  list: T[]
  /** 当前页（回显请求参数） */
  page: number
  /** 每页条数（回显请求参数） */
  pageSize: number
  /** 总条数 */
  total: number
  /** 总页数（后端计算） */
  totalPage: number
}

/** 分页请求通用参数 */
type TPaginationReq = {
  page: number
  pageSize: number
}
```

### 文件结构

```
src/types/
├── user.ts       ← 用户模块：TUserBase, TUserInfo, TUserListReq, TUserListResp
├── report.ts     ← 报表模块：TReportBase, TReportItem, TReportListReq
└── common.ts     ← 全局通用：TPaginationReq, TApiResponse, TPageResult
```

### 类型继承（与 03-代码约束.md 对齐）

```typescript
// 模块基类（与后端数据字段对齐）
type TUserBase = {
  id: number
  createdAt: string
  updatedAt: string
}

// 派生类型用交叉类型
type TUserInfo = TUserBase & {
  name: string
  email: string
  role: 'admin' | 'user'
}

// 新增/编辑入参：从 TUserInfo 提取可编辑字段，避免重复
type TCreateUserReq = Pick<TUserInfo, 'name' | 'email' | 'role'>

type TUserListReq = TPaginationReq & {
  keyword?: string
}

type TUserListResp = TApiResponse<TPageResult<TUserInfo>>
```

---

## 3. API 文件组织

```
src/api/
├── user.ts       ← 用户模块所有接口
├── report.ts     ← 报表模块
└── dashboard.ts  ← 仪表盘
```

### 模块 URL 前缀提取

**每个模块统一提取一个前缀常量**，URL 路径变化时只改一处：

```typescript
// src/api/user.ts
import request from '@/utils/request'

const PREFIX = '/user'

export function fetchUserListApi(params: TUserListReq): Promise<TUserListResp> {
  return request.get<TUserListResp>(`${PREFIX}/list`, { params })
}

export function fetchUserDetailApi(
  id: number,
): Promise<TApiResponse<TUserInfo>> {
  return request.get<TApiResponse<TUserInfo>>(`${PREFIX}/${id}`)
}

export function createUserApi(
  data: TCreateUserReq,
): Promise<TApiResponse<TUserInfo>> {
  return request.post<TApiResponse<TUserInfo>>(PREFIX, data)
}

export function updateUserApi(
  id: number,
  data: Partial<TCreateUserReq>,
): Promise<TApiResponse<TUserInfo>> {
  return request.put<TApiResponse<TUserInfo>>(`${PREFIX}/${id}`, data)
}

export function deleteUserApi(id: number): Promise<TApiResponse> {
  return request.delete<TApiResponse>(`${PREFIX}/${id}`)
}
```

> 注：`PREFIX` 值以实际后端接口为准，此处仅为示例。前缀提取后，后端换路径时只改一行。

---

## 4. 错误处理策略（前端侧）

| 场景                       | 前端处理方式                                                     |
| -------------------------- | ---------------------------------------------------------------- |
| 网络错误                   | `request.ts` 统一拦截，全局提示                                  |
| 401 未登录                 | `request.ts` 统一拦截，跳转登录页                                |
| 403 无权限                 | 调用方自行 catch，提示"无权限"                                   |
| 业务错误（`code !== 200`） | `request.ts` 统一提示 message 并 reject，调用方可 catch 补充分支 |
| 表单提交错误               | 调用方 catch，回填表单错误信息                                   |

- API 层（`src/api/xxx.ts`）不 catch 错误
- 只在需要特殊处理的页面/组件内 catch

---

## 相关文档

- 03-代码约束（类型继承、禁止 any）
- 技术栈/vue-core.md（Axios 实例用法）
