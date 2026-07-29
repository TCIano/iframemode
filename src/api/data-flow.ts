import type { TApiResponse } from '@/types/common'
import type {
  TDataFlowDetailResp,
  TDataFlowInfo,
  TDataFlowListReq,
  TDataFlowListResp,
  TFlowEdge,
  TFlowNode,
  TFlowSaveReq,
} from '@/types/data-flow'

import request from '@/utils/request'

const PREFIX = '/data-flow'

// ===================================================================
// Mock 开关 — 后端未就绪时设为 true，就绪后改为 false 并删除 MOCK_* 块
// ===================================================================
const USE_MOCK = true

// ===================================================================
// 真实 API 实现
// ===================================================================

export function fetchDataFlowList(params: TDataFlowListReq) {
  if (USE_MOCK) return mockFetchDataFlowList(params)
  return request.get<TDataFlowListResp>(`${PREFIX}/list`, { params })
}

export function fetchDataFlowDetail(id: number) {
  if (USE_MOCK) return mockFetchDataFlowDetail(id)
  return request.get<TDataFlowDetailResp>(`${PREFIX}/${id}`)
}

export function deleteDataFlow(id: number) {
  if (USE_MOCK) return mockDeleteDataFlow(id)
  return request.delete(`${PREFIX}/${id}`)
}

export function saveDataFlow(params: TFlowSaveReq) {
  if (USE_MOCK) return mockSaveDataFlow(params)
  return request.put<TApiResponse>(`${PREFIX}/${params.id}`, params)
}

// ===================================================================
// Mock 数据 — 审批流程树（多层级）
// ===================================================================

const MOCK_LIST: TDataFlowInfo[] = [
  {
    createdAt: '2026-07-20 09:15:00',
    description: 'Q3 市场活动预算 50 万，需逐级审批',
    destination: '市场部',
    id: 1,
    name: '市场活动预算审批',
    source: '张伟',
    status: 'success',
    updatedAt: '2026-07-20 11:30:00',
  },
  {
    createdAt: '2026-07-21 14:30:00',
    description: '采购 20 台 MacBook Pro 用于新员工',
    destination: '技术部',
    id: 2,
    name: '设备采购审批',
    source: '李娜',
    status: 'processing',
    updatedAt: '2026-07-22 10:15:00',
  },
  {
    createdAt: '2026-07-22 10:00:00',
    description: '与 AWS 签订年度企业合同，金额 120 万',
    destination: '技术部',
    id: 3,
    name: 'AWS 企业合同审批',
    source: '王强',
    status: 'approved',
    updatedAt: '2026-07-25 16:45:00',
  },
  {
    createdAt: '2026-07-23 08:00:00',
    description: '招聘 5 名高级前端工程师，P6-P7 级别',
    destination: '技术部',
    id: 4,
    name: '前端岗位招聘审批',
    source: 'HR 赵敏',
    status: 'approved',
    updatedAt: '2026-07-24 17:00:00',
  },
  {
    createdAt: '2026-07-24 16:20:00',
    description: '全员年度体检项目，预算 30 万',
    destination: '行政部',
    id: 5,
    name: '年度体检方案审批',
    source: '陈静',
    status: 'failed',
    updatedAt: '2026-07-25 09:10:00',
  },
  {
    createdAt: '2026-07-25 11:10:00',
    description: 'SaaS 数据平台项目立项，投入 8 人 · 3 个月',
    destination: '产品部',
    id: 6,
    name: '数据平台立项审批',
    source: '刘洋',
    status: 'success',
    updatedAt: '2026-07-28 14:20:00',
  },
  {
    createdAt: '2026-07-26 07:30:00',
    description: '北京 → 上海 · 7 月 28-30 日 · 拜访客户',
    destination: '销售部',
    id: 7,
    name: '出差申请审批',
    source: '孙雨',
    status: 'pending',
    updatedAt: '2026-07-26 07:30:00',
  },
  {
    createdAt: '2026-07-27 13:45:00',
    description: '投标用公章 + 法人章，期限 30 天',
    destination: '销售部',
    id: 8,
    name: '投标用印审批',
    source: '周磊',
    status: 'processing',
    updatedAt: '2026-07-28 09:30:00',
  },
  {
    createdAt: '2026-07-28 09:00:00',
    description: '个人借款 5 万元用于出差备用金',
    destination: '销售部',
    id: 9,
    name: '备用金借款审批',
    source: '吴婷',
    status: 'success',
    updatedAt: '2026-07-28 16:55:00',
  },
  {
    createdAt: '2026-07-29 06:15:00',
    description: '员工张三试用期通过，转为正式员工',
    destination: '技术部',
    id: 10,
    name: '试用期转正审批',
    source: '主管 黄伟',
    status: 'failed',
    updatedAt: '2026-07-29 06:45:00',
  },
  {
    createdAt: '2026-07-29 10:00:00',
    description: '报废 15 台 Dell 旧服务器，已过保',
    destination: '运维部',
    id: 11,
    name: '服务器报废审批',
    source: '林峰',
    status: 'processing',
    updatedAt: '2026-07-29 11:20:00',
  },
  {
    createdAt: '2026-07-29 12:30:00',
    description: '高级工程师 P7 薪资上调 15%',
    destination: '技术部',
    id: 12,
    name: '薪资调整审批',
    source: '部门经理 何明',
    status: 'pending',
    updatedAt: '2026-07-29 12:30:00',
  },
]

/* eslint-disable perfectionist/sort-objects */

// ========== 审批流程树数据 ==========

/** 生成审批树节点 */
function N(
  id: string,
  label: string,
  nodeType: TFlowNode['data']['nodeType'],
  approver: string,
  description: string,
  x = 0,
  y = 0,
): TFlowNode {
  return {
    data: { approver, description, label, nodeType },
    id,
    position: { x, y },
    type: 'process-node',
  }
}

/** 生成边 */
function E(id: string, source: string, target: string): TFlowEdge {
  return { id, source, target }
}

/** 水平树：单向链 */
function chain(
  prefix: string,
  labels: string[],
  types: TFlowNode['data']['nodeType'][],
  approvers: string[],
  descs: string[],
): { edges: TFlowEdge[]; nodes: TFlowNode[] } {
  const nodes = labels.map((l, i) =>
    N(
      `${prefix}-n${i}`,
      l,
      types[i] ?? types[types.length - 1],
      approvers[i] ?? '',
      descs[i] ?? '',
    ),
  )
  const edges = nodes
    .slice(0, -1)
    .map((n, i) => E(`${prefix}-e${i}`, n.id, nodes[i + 1].id))
  return { edges, nodes }
}

const FLOW_MAP: Record<number, { edges: TFlowEdge[]; nodes: TFlowNode[] }> = {
  // 1. 市场活动预算审批（6 层线性）
  1: chain(
    'f1',
    ['申请人', '直属主管', '部门经理', '市场总监', 'VP', 'CEO'],
    ['applicant', 'supervisor', 'manager', 'director', 'vp', 'ceo'],
    ['张伟', '李明', '王芳', '陈志军', '刘总', '张总'],
    [
      '提交市场活动预算申请',
      '确认活动必要性',
      '评估部门预算额度',
      '审批市场策略合规',
      '审批预算合理性',
      '最终批准',
    ],
  ),

  // 2. 设备采购审批（6 层 + 法务分支）
  2: {
    nodes: [
      N('f2-n0', '申请人', 'applicant', '李娜', '提交设备采购申请'),
      N('f2-n1', '直属主管', 'supervisor', '赵刚', '确认人员需求'),
      N('f2-n2', '部门经理', 'manager', '周明', '审批部门预算'),
      N('f2-n3', '财务审核', 'finance', '吴会计', '审核采购预算'),
      N('f2-n4', '技术总监', 'director', '钱总', '审批技术规格'),
      N('f2-n5', 'CFO', 'vp', '孙总', '审批采购金额'),
      N('f2-n6', 'CEO', 'ceo', '张总', '最终批准'),
      N('f2-n7', '法务会签', 'legal', '郑律师', '合同合规审查'),
    ],
    edges: [
      E('f2-e1', 'f2-n0', 'f2-n1'),
      E('f2-e2', 'f2-n1', 'f2-n2'),
      E('f2-e3', 'f2-n2', 'f2-n3'),
      E('f2-e4', 'f2-n3', 'f2-n4'),
      E('f2-e5', 'f2-n4', 'f2-n5'),
      E('f2-e6', 'f2-n5', 'f2-n6'),
      E('f2-e7', 'f2-n4', 'f2-n7'), // 法务分支
    ],
  },

  // 3. AWS 企业合同审批（5 层）
  3: chain(
    'f3',
    ['申请人', '直属主管', '法务审核', '技术总监', 'VP'],
    ['applicant', 'supervisor', 'legal', 'director', 'vp'],
    ['王强', '李伟', '王律师', '钱总', '刘总'],
    [
      '提交 AWS 合同申请',
      '确认技术需求',
      '审查合同条款',
      '审批技术方案',
      '审批商务条款',
    ],
  ),

  // 4. 招聘审批（5 层）
  4: chain(
    'f4',
    ['HR 招聘', '用人部门主管', 'HR 总监', 'VP', 'CEO'],
    ['hr', 'manager', 'director', 'vp', 'ceo'],
    ['赵敏', '周明', '李总', '刘总', '张总'],
    [
      '提交招聘需求',
      '确认岗位职责',
      '审批编制预算',
      '审批招聘计划',
      '最终批准',
    ],
  ),

  // 5. 年度体检方案审批（5 层）
  5: chain(
    'f5',
    ['申请人', '直属主管', '行政经理', '财务总监', 'VP'],
    ['applicant', 'supervisor', 'manager', 'director', 'vp'],
    ['陈静', '刘芳', '王经理', '孙总', '刘总'],
    ['提交体检方案', '确认员工需求', '评估供应商方案', '审批预算', '最终审批'],
  ),

  // 6. 数据平台立项审批（6 层）
  6: chain(
    'f6',
    ['产品经理', '部门经理', '技术总监', 'VP 产品', 'VP 技术', 'CEO'],
    ['applicant', 'manager', 'director', 'vp', 'vp', 'ceo'],
    ['刘洋', '周明', '钱总', '刘总', '王总', '张总'],
    [
      '提交立项申请书',
      '评估资源投入',
      '审批技术方案',
      '审批产品战略',
      '评估技术架构',
      '最终批准',
    ],
  ),

  // 7. 出差申请审批（4 层线性）
  7: chain(
    'f7',
    ['申请人', '直属主管', '部门经理', 'HR 备案'],
    ['applicant', 'supervisor', 'manager', 'hr'],
    ['孙雨', '赵刚', '周明', 'HR 系统'],
    ['提交出差申请', '确认出差必要性', '审批预算', '系统备案'],
  ),

  // 8. 投标用印审批（5 层）
  8: chain(
    'f8',
    ['申请人', '直属主管', '法务审核', '部门总监', 'VP'],
    ['applicant', 'supervisor', 'legal', 'director', 'vp'],
    ['周磊', '赵刚', '王律师', '陈志军', '刘总'],
    ['提交用印申请', '确认项目真实性', '审查投标文件', '审批授权', '最终批准'],
  ),

  // 9. 备用金借款审批（5 层 + 财务分支）
  9: {
    nodes: [
      N('f9-n0', '申请人', 'applicant', '吴婷', '提交借款申请'),
      N('f9-n1', '直属主管', 'supervisor', '赵刚', '确认借款用途'),
      N('f9-n2', '部门经理', 'manager', '周明', '审批部门预算'),
      N('f9-n3', '财务审核', 'finance', '吴会计', '审核借款额度'),
      N('f9-n4', 'CFO', 'vp', '孙总', '审批放款'),
      N('f9-n5', '出纳确认', 'finance', '刘出纳', '确认到账'),
    ],
    edges: [
      E('f9-e1', 'f9-n0', 'f9-n1'),
      E('f9-e2', 'f9-n1', 'f9-n2'),
      E('f9-e3', 'f9-n2', 'f9-n3'),
      E('f9-e4', 'f9-n3', 'f9-n4'),
      E('f9-e5', 'f9-n4', 'f9-n5'),
    ],
  },

  // 10. 试用期转正审批（5 层）
  10: chain(
    'f10',
    ['申请人', '直属主管', 'HR 审核', '部门总监', 'VP'],
    ['applicant', 'supervisor', 'hr', 'director', 'vp'],
    ['黄伟（主管代提）', '黄伟', '赵敏', '陈志军', '刘总'],
    ['提交转正申请', '评估试用期绩效', '审核入职材料', '审批转正', '最终批准'],
  ),

  // 11. 服务器报废审批（6 层）
  11: chain(
    'f11',
    ['申请人', '直属主管', '运维经理', '技术总监', '财务审批', 'VP'],
    ['applicant', 'supervisor', 'manager', 'director', 'finance', 'vp'],
    ['林峰', '赵刚', '王经理', '钱总', '吴会计', '刘总'],
    [
      '提交报废申请',
      '确认资产状态',
      '评估数据迁移',
      '审批技术方案',
      '核销资产',
      '最终批准',
    ],
  ),

  // 12. 薪资调整审批（6 层）
  12: chain(
    'f12',
    ['部门经理（发起）', 'HR 审核', 'HR 总监', 'VP', 'CEO'],
    ['manager', 'hr', 'director', 'vp', 'ceo'],
    ['何明', '赵敏', '李总', '刘总', '张总'],
    [
      '提交薪资调整建议',
      '审核职级匹配度',
      '审批预算额度',
      '审批调薪方案',
      '最终批准',
    ],
  ),
}
/* eslint-enable perfectionist/sort-objects */

function mockFetchDataFlowList(params: TDataFlowListReq) {
  const { keyword, page, pageSize, status } = params
  let filtered = MOCK_LIST

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) ||
        item.source.toLowerCase().includes(kw) ||
        item.destination.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw),
    )
  }

  if (status) {
    filtered = filtered.filter((item) => item.status === status)
  }

  const totalSize = filtered.length
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)
  const resp: TDataFlowListResp = { data, result: 0, totalSize }

  return new Promise<TDataFlowListResp>((resolve) => {
    setTimeout(() => resolve(resp), 300)
  })
}

function mockFetchDataFlowDetail(id: number) {
  const info = MOCK_LIST.find((item) => item.id === id)
  const flow = FLOW_MAP[id]
  const resp: TDataFlowDetailResp = {
    data: null,
    edges: flow?.edges ?? [],
    info: info ?? MOCK_LIST[0],
    nodes: flow?.nodes ?? [],
    result: info ? 0 : 1,
  }

  return new Promise<TDataFlowDetailResp>((resolve) => {
    setTimeout(() => resolve(resp), 500)
  })
}

function mockDeleteDataFlow(id: number) {
  const index = MOCK_LIST.findIndex((item) => item.id === id)
  if (index !== -1) {
    MOCK_LIST.splice(index, 1)
  }
  const resp: TApiResponse<null> = { data: null, result: 0 }

  return new Promise<TApiResponse<null>>((resolve) => {
    setTimeout(() => resolve(resp), 200)
  })
}

function mockSaveDataFlow(params: TFlowSaveReq) {
  FLOW_MAP[params.id] = { edges: params.edges, nodes: params.nodes }
  const resp: TApiResponse<null> = { data: null, result: 0 }

  return new Promise<TApiResponse<null>>((resolve) => {
    setTimeout(() => resolve(resp), 300)
  })
}
