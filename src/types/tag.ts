import type { TApiResponse, TPaginationReq } from './common'

/** 模块公共基类 — 所有该模块接口继承此类型 */
type TTagBase = {
  createdAt: string
  id: number
  updatedAt: string
}

/** 单条数据 */
type TTagInfo = {
  color: string
  name: string
  status: 'active' | 'disabled'
} & TTagBase

/** 创建/更新请求 */
type TCreateTagReq = {
  color: string
  name: string
  status: 'active' | 'disabled'
}

/** 列表查询参数 */
type TTagListReq = {
  keyword?: string
  status?: string
} & TPaginationReq

/** 列表响应 */
type TTagListResp = {
  data: TTagInfo[]
  totalSize: number
} & TApiResponse

export type { TCreateTagReq, TTagBase, TTagInfo, TTagListReq, TTagListResp }
