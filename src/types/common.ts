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

export type { TApiResponse, TPageResult, TPaginationReq }
