import { message, Modal } from 'ant-design-vue'
import { ref } from 'vue'

import type {
  TDataFlowDetailResp,
  TDataFlowInfo,
  TDataFlowListReq,
  TFlowEdge,
  TFlowNode,
  TFlowSaveReq,
} from '@/types/data-flow'

import {
  getDataFlowDetail,
  getDataFlowList,
  removeDataFlow,
  updateDataFlow,
} from '../services/dataFlow'

/** 数据流向列表页逻辑 */
export function useDataFlow() {
  const loading = ref(false)
  const list = ref<TDataFlowInfo[]>([])
  const total = ref(0)
  const queryParams = ref<TDataFlowListReq>({
    keyword: undefined,
    page: 1,
    pageSize: 10,
    status: undefined,
  })

  /** 获取列表 */
  async function fetchList() {
    loading.value = true
    try {
      const resp = await getDataFlowList(queryParams.value)
      list.value = resp.data
      total.value = resp.totalSize
    } finally {
      loading.value = false
    }
  }

  /** 搜索/筛选 */
  function onSearch(keyword: string | undefined) {
    queryParams.value.keyword = keyword || undefined
    queryParams.value.page = 1
    void fetchList()
  }

  /** 分页变化 */
  function onPageChange(page: number, pageSize: number) {
    queryParams.value.page = page
    queryParams.value.pageSize = pageSize
    void fetchList()
  }

  /** 删除 */
  async function onDelete(id: number) {
    try {
      await removeDataFlow(id)
      message.success('删除成功')
      void fetchList()
    } catch {
      message.error('删除失败')
    }
  }

  return {
    fetchList,
    list,
    loading,
    onDelete,
    onPageChange,
    onSearch,
    queryParams,
    total,
  }
}

/** 数据流向详情弹窗逻辑 */
export function useDataFlowDetail() {
  const visible = ref(false)
  const detailLoading = ref(false)
  const currentRecord = ref<null | TDataFlowInfo>(null)
  const nodes = ref<TFlowNode[]>([])
  const edges = ref<TFlowEdge[]>([])

  /** 打开详情弹窗 */
  async function openDetail(record: TDataFlowInfo) {
    currentRecord.value = record
    visible.value = true
    detailLoading.value = true
    try {
      const resp: TDataFlowDetailResp = await getDataFlowDetail(record.id)
      nodes.value = resp.nodes
      edges.value = resp.edges
    } catch {
      message.error('获取数据流向详情失败')
    } finally {
      detailLoading.value = false
    }
  }

  /** 关闭详情弹窗 */
  function closeDetail() {
    visible.value = false
    currentRecord.value = null
    nodes.value = []
    edges.value = []
  }

  return {
    closeDetail,
    currentRecord,
    detailLoading,
    edges,
    nodes,
    openDetail,
    visible,
  }
}

/** 数据流向编辑逻辑 */
export function useDataFlowEdit() {
  const editing = ref(false)
  const editLoading = ref(false)
  const editRecord = ref<null | TDataFlowInfo>(null)
  const editNodes = ref<TFlowNode[]>([])
  const editEdges = ref<TFlowEdge[]>([])

  /** 打开编辑模式 */
  async function openEditor(record: TDataFlowInfo) {
    editRecord.value = record
    editing.value = true
    editLoading.value = true
    try {
      const resp: TDataFlowDetailResp = await getDataFlowDetail(record.id)
      editNodes.value = resp.nodes
      editEdges.value = resp.edges
    } catch {
      message.error('获取编辑数据失败')
    } finally {
      editLoading.value = false
    }
  }

  /** 更新节点（由 DataFlowGraph 编辑时触发） */
  function onNodesUpdate(nodes: TFlowNode[]) {
    editNodes.value = nodes
  }

  /** 更新边（由 DataFlowGraph 编辑时触发） */
  function onEdgesUpdate(edges: TFlowEdge[]) {
    editEdges.value = edges
  }

  /** 保存编辑 */
  async function saveFlow() {
    if (!editRecord.value) return
    editLoading.value = true
    try {
      const params: TFlowSaveReq = {
        edges: editEdges.value,
        id: editRecord.value.id,
        nodes: editNodes.value,
      }
      await updateDataFlow(params)
      message.success('保存成功')
      editing.value = false
      editRecord.value = null
    } catch {
      message.error('保存失败')
    } finally {
      editLoading.value = false
    }
  }

  /** 取消编辑 */
  function cancelEdit() {
    Modal.confirm({
      cancelText: '继续编辑',
      content: '确认取消编辑？未保存的修改将丢失。',
      okText: '确认取消',
      onOk() {
        editing.value = false
        editRecord.value = null
        editNodes.value = []
        editEdges.value = []
      },
      title: '提示',
      type: 'warning',
    })
  }

  return {
    cancelEdit,
    editEdges,
    editing,
    editLoading,
    editNodes,
    editRecord,
    onEdgesUpdate,
    onNodesUpdate,
    openEditor,
    saveFlow,
  }
}
