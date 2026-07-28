/** 后端统一返回格式（与 request.ts 拦截器对齐） */
type TApiResponse<T = unknown> = {
  data: T
  errMsg?: string
  result?: number
  totalSize?: number
}

/** 分页请求通用参数 */
type TPaginationReq = {
  page: number
  pageSize: number
}

export type { TApiResponse, TPaginationReq }
