import type {
  TDataFlowDetailResp,
  TDataFlowInfo,
  TDataFlowListReq,
  TDataFlowListResp,
  TFlowSaveReq,
} from '@/types/data-flow'

import {
  deleteDataFlow,
  fetchDataFlowDetail,
  fetchDataFlowList,
  saveDataFlow,
} from '@/api/data-flow'

/** 获取数据流向列表 */
export async function getDataFlowList(params: TDataFlowListReq) {
  return await fetchDataFlowList(params)
}

/** 获取数据流向详情（含流程图数据） */
export async function getDataFlowDetail(id: number) {
  return await fetchDataFlowDetail(id)
}

/** 删除数据流向记录 */
export async function removeDataFlow(id: number) {
  return await deleteDataFlow(id)
}

/** 保存流向图编辑 */
export async function updateDataFlow(params: TFlowSaveReq) {
  return await saveDataFlow(params)
}

/** 将列表数据转换为表格所需格式（此处直接透传，留扩展点） */
export function transformListData(data: TDataFlowInfo[]) {
  return data
}

/** 导出类型，方便 hook 中引用 */
export type {
  TDataFlowDetailResp,
  TDataFlowInfo,
  TDataFlowListReq,
  TDataFlowListResp,
  TFlowSaveReq,
}
