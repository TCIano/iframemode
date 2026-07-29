<script setup lang="ts">
import type { TableProps } from 'ant-design-vue'

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import { Tag } from 'ant-design-vue'
import { onMounted, ref } from 'vue'

import type { TFlowStatus } from '@/types/data-flow'

import DataFlowGraph from '@/components/DataFlowGraph.vue'

import {
  useDataFlow,
  useDataFlowDetail,
  useDataFlowEdit,
} from './hooks/useDataFlow'

const {
  fetchList,
  list,
  loading,
  onDelete,
  onPageChange,
  onSearch,
  queryParams,
  total,
} = useDataFlow()
const {
  closeDetail,
  currentRecord,
  detailLoading,
  edges,
  nodes,
  openDetail,
  visible,
} = useDataFlowDetail()
const {
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
} = useDataFlowEdit()

const searchKeyword = ref<string>('')
const selectedStatus = ref<TFlowStatus | undefined>(undefined)

onMounted(() => {
  void fetchList()
})

/** 搜索 */
function handleSearch() {
  onSearch(searchKeyword.value)
}

/** 重置 */
function handleReset() {
  searchKeyword.value = ''
  selectedStatus.value = undefined
  onSearch(undefined)
}

/** 状态筛选变化 */
function handleStatusChange(val: TFlowStatus | undefined) {
  selectedStatus.value = val
  onSearch(searchKeyword.value)
}

/** 表格分页变化 */
const handleTableChange: TableProps['onChange'] = (pag) => {
  if (pag.current && pag.pageSize) {
    onPageChange(pag.current, pag.pageSize)
  }
}

/** rowKey */
const rowKey = (record: { id: number }) => record.id

/** 获取状态标签配置 */
function getStatusConfig(status: TFlowStatus) {
  return STATUS_MAP[status]
}

/** 状态标签颜色映射 */
const STATUS_MAP: Record<TFlowStatus, { color: string; text: string }> = {
  // 审批状态
  approved: { color: 'success', text: '已通过' },
  // 数据流旧状态（兼容）
  failed: { color: 'error', text: '失败' },
  pending: { color: 'default', text: '待审批' },
  processing: { color: 'processing', text: '审批中' },
  rejected: { color: 'error', text: '已驳回' },
  running: { color: 'processing', text: '运行中' },
  success: { color: 'success', text: '成功' },
}

/** 表格列定义 */
const columns = [
  { dataIndex: 'id', key: 'id', title: '审批编号', width: 80 },
  { dataIndex: 'name', key: 'name', title: '审批流程', width: 180 },
  { dataIndex: 'status', key: 'status', title: '审批状态', width: 100 },
  {
    dataIndex: 'source',
    ellipsis: true,
    key: 'source',
    title: '申请人',
    width: 160,
  },
  {
    dataIndex: 'destination',
    ellipsis: true,
    key: 'destination',
    title: '所属部门',
    width: 160,
  },
  { dataIndex: 'createdAt', key: 'createdAt', title: '创建时间', width: 140 },
  { dataIndex: 'action', key: 'action', title: '操作', width: 180 },
]
</script>

<template>
  <div class="data-flow_wrapper">
    <!-- 搜索栏 -->
    <a-card style="margin-bottom: 16px">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input
            v-model:value="searchKeyword"
            placeholder="搜索任务名称 / 数据来源 / 目标存储"
            @press-enter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="selectedStatus"
            placeholder="状态筛选"
            style="width: 100%"
            allow-clear
            @change="handleStatusChange"
          >
            <a-select-option value="processing">审批中</a-select-option>
            <a-select-option value="approved">已通过</a-select-option>
            <a-select-option value="rejected">已驳回</a-select-option>
            <a-select-option value="pending">待审批</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- 表格 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="{
          current: queryParams.page,
          pageSize: queryParams.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (t: number) => `共 ${t} 条`,
          total,
        }"
        :row-key="rowKey"
        bordered
        size="middle"
        @change="handleTableChange"
      >
        <!-- 状态列 + 操作列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="getStatusConfig(record.status).color">
              {{ getStatusConfig(record.status).text }}
            </Tag>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-tooltip title="查看数据流向">
                <a-button size="small" type="link" @click="openDetail(record)">
                  <template #icon><EyeOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑流向图">
                <a-button size="small" type="link" @click="openEditor(record)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button
                  size="small"
                  type="link"
                  danger
                  @click="onDelete(record.id)"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 数据流向详情弹窗 -->
    <a-modal
      :footer="null"
      :open="visible"
      :width="900"
      destroy-on-close
      title="数据流向详情"
      @cancel="closeDetail"
    >
      <template v-if="currentRecord">
        <a-descriptions
          :column="2"
          bordered
          size="small"
          style="margin-bottom: 16px"
        >
          <a-descriptions-item label="任务名称" :span="2">
            {{ currentRecord.name }}
          </a-descriptions-item>
          <a-descriptions-item label="数据来源">
            {{ currentRecord.source }}
          </a-descriptions-item>
          <a-descriptions-item label="目标存储">
            {{ currentRecord.destination }}
          </a-descriptions-item>
          <a-descriptions-item label="状态" :span="2">
            <Tag :color="getStatusConfig(currentRecord.status).color">
              {{ getStatusConfig(currentRecord.status).text }}
            </Tag>
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">
            {{ currentRecord.description }}
          </a-descriptions-item>
        </a-descriptions>

        <h4 style="margin-bottom: 12px">数据流向图</h4>
        <DataFlowGraph :edges="edges" :loading="detailLoading" :nodes="nodes" />
      </template>
    </a-modal>

    <!-- 编辑流向图弹窗 -->
    <a-modal
      :confirm-loading="editLoading"
      :open="editing"
      :width="960"
      cancel-text="取消"
      destroy-on-close
      ok-text="保存"
      title="编辑数据流向图"
      @cancel="cancelEdit"
      @ok="saveFlow"
    >
      <template v-if="editRecord">
        <a-descriptions :column="2" size="small" style="margin-bottom: 16px">
          <a-descriptions-item label="任务名称" :span="2">
            {{ editRecord.name }}
          </a-descriptions-item>
          <a-descriptions-item label="数据来源">
            {{ editRecord.source }}
          </a-descriptions-item>
          <a-descriptions-item label="目标存储">
            {{ editRecord.destination }}
          </a-descriptions-item>
        </a-descriptions>

        <DataFlowGraph
          :edges="editEdges"
          :loading="editLoading"
          :nodes="editNodes"
          editable
          @update:edges="onEdgesUpdate"
          @update:nodes="onNodesUpdate"
        />
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.data-flow_wrapper {
  padding: 16px;
}
</style>
