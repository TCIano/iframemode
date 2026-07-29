import type { TApiResponse, TPaginationReq } from './common'

/** 模块公共基类 */
type TDataFlowBase = {
  createdAt: string
  id: number
  updatedAt: string
}

/** 数据流向/审批状态 */
type TFlowStatus =
  | 'approved'
  | 'failed'
  | 'pending'
  | 'processing'
  | 'rejected'
  | 'running'
  | 'success'

/** 审批状态（TFlowStatus 子集 — 仅审批上下文用） */
type TApprovalStatus = 'approved' | 'pending' | 'processing' | 'rejected'

/** 数据/审批单条记录 */
type TDataFlowInfo = {
  description: string
  destination: string
  name: string
  source: string
  status: TFlowStatus
} & TDataFlowBase

/** 列表查询参数 */
type TDataFlowListReq = {
  keyword?: string
  status?: TFlowStatus
} & TPaginationReq

/** 列表响应 */
type TDataFlowListResp = {
  data: TDataFlowInfo[]
  totalSize: number
} & TApiResponse

/** 流程节点类型（含审批角色） */
type TFlowNodeType =
  | 'applicant'
  | 'ceo'
  | 'director'
  | 'etl'
  | 'finance'
  | 'hr'
  | 'legal'
  | 'load'
  | 'manager'
  | 'sink'
  | 'source'
  | 'supervisor'
  | 'transform'
  | 'vp'

/** 节点数据 */
type TFlowNodeData = {
  /** 审批时间 */
  approvedAt?: string
  /** 审批人姓名 */
  approver?: string
  /** 子节点数（仅根节点标记用） */
  childCount?: number
  /** 审批意见 */
  comment?: string
  description: string
  label: string
  nodeType: TFlowNodeType
}

/** 流程节点 */
type TFlowNode = {
  data: TFlowNodeData
  id: string
  position: {
    x: number
    y: number
  }
  type: string
}

/** 流程边 */
type TFlowEdge = {
  id: string
  label?: string
  source: string
  target: string
}

/** 数据流向详情（含流程图数据） */
type TDataFlowDetailResp = {
  edges: TFlowEdge[]
  info: TDataFlowInfo
  nodes: TFlowNode[]
} & TApiResponse

/** 保存流向图请求 */
type TFlowSaveReq = {
  edges: TFlowEdge[]
  id: number
  nodes: TFlowNode[]
}

export type {
  TApprovalStatus,
  TDataFlowBase,
  TDataFlowDetailResp,
  TDataFlowInfo,
  TDataFlowListReq,
  TDataFlowListResp,
  TFlowEdge,
  TFlowNode,
  TFlowNodeData,
  TFlowNodeType,
  TFlowSaveReq,
  TFlowStatus,
}
