/** 后端统一响应格式（主流：code + message + data） */
type TApiResponse<T = unknown> = {
  /** 业务状态码，200 表示成功 */
  code: number
  /** 响应数据（成功时承载业务数据，失败时可为 null） */
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
