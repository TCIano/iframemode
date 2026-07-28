# API 设计规范（前端侧）

> 目标：前端 API 调用层的写法统一，减少"同一个接口五种写法"的问题。
> 适用范围：仅约束 `src/api/` 和 `src/types/` 中的前端代码。

---

## 1. API 函数命名

### 前端方法命名（与后端 URL 无关）

```
fetch{Resource}{Action}  — 资源名 + 操作，camelCase

✅ fetchUserList, fetchUserDetail, createUser, updateUser, deleteUser
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
- 后端返回格式假设（文档用，非强制约定）：

```typescript
// src/types/common.ts
/** 后端统一返回格式（与 request.ts 拦截器对齐） */
interface TApiResponse<T = unknown> {
  data: T
  errMsg?: string
  result?: number
  totalSize?: number
}

/** 分页请求通用参数 */
interface TPaginationReq {
  page: number
  pageSize: number
}
```

### 文件结构

```
src/types/
├── user.ts       ← 用户模块：TUserBase, TUserInfo, TUserListReq, TUserListResp
├── report.ts     ← 报表模块：TReportBase, TReportItem, TReportListReq
└── common.ts     ← 全局通用：TPaginationReq, TApiResponse
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

type TUserListReq = TPaginationReq & {
  keyword?: string
}

type TUserListResp = TApiResponse & {
  data: TUserInfo[]
  totalSize: number
}
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

export function fetchUserList(params: TUserListReq) {
  return request.get<TUserListResp>(`${PREFIX}/list`, { params })
}

export function fetchUserDetail(id: number) {
  return request.get<TUserInfo>(`${PREFIX}/${id}`)
}

export function createUser(data: TCreateUserReq) {
  return request.post<TUserInfo>(PREFIX, data)
}

export function updateUser(id: number, data: Partial<TCreateUserReq>) {
  return request.put<TUserInfo>(`${PREFIX}/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete(`${PREFIX}/${id}`)
}
```

> 注：`PREFIX` 值以实际后端接口为准，此处仅为示例。前缀提取后，后端换路径时只改一行。

---

## 4. 错误处理策略（前端侧）

| 场景                      | 前端处理方式                      |
| ------------------------- | --------------------------------- |
| 网络错误                  | `request.ts` 统一拦截，全局提示   |
| 401 未登录                | `request.ts` 统一拦截，跳转登录页 |
| 403 无权限                | 调用方自行 catch，提示"无权限"    |
| 业务错误（`errMsg` 存在） | 调用方按需处理或抛给统一提示      |
| 表单提交错误              | 调用方 catch，回填表单错误信息    |

- API 层（`src/api/xxx.ts`）不 catch 错误
- 只在需要特殊处理的页面/组件内 catch
