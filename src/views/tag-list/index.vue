<script setup lang="ts">
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

import type { TCreateTagReq, TTagInfo } from '@/types/tag'

import TagForm from '@/components/TagForm.vue'

import { useTagList } from './hooks/useTagList'

/** state */
const keyword = ref('')
const showForm = ref(false)
const editingTag = ref<TTagInfo | undefined>(undefined)

const { data, fetchData, handleDelete, loading, pagination } = useTagList()

/** search */
function onSearch() {
  void fetchData({ keyword: keyword.value, page: 1, pageSize: 10 })
}

/** create */
function openCreate() {
  editingTag.value = undefined
  showForm.value = true
}

/** edit */
function openEdit(record: TTagInfo) {
  editingTag.value = record
  showForm.value = true
}

/** form submit */
function onFormSubmit(formData: TCreateTagReq) {
  // TODO: call createTag / updateTag API when backend ready
  message.success(editingTag.value ? '更新成功' : '创建成功')
  showForm.value = false
  void onSearch()
}

/** delete confirm */
function onDelete(record: TTagInfo) {
  void handleDelete(record.id)
  void onSearch()
}

/** table columns definition */
const columns = [
  { dataIndex: 'id', title: 'ID', width: 80 },
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'color', slots: { customRender: 'color' }, title: '颜色' },
  { dataIndex: 'status', slots: { customRender: 'status' }, title: '状态' },
  { dataIndex: 'createdAt', title: '创建时间' },
  {
    key: 'action',
    slots: { customRender: 'action' },
    title: '操作',
    width: 160,
  },
]

/** lifecycle — 首屏加载 */
void fetchData()
</script>

<template>
  <div class="tag-list_wrapper">
    <a-card>
      <div class="tag-list_toolbar">
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索标签名称"
          style="width: 280px"
          @search="onSearch"
        />
        <a-button type="primary" @click="openCreate">
          <PlusOutlined /> 新建标签
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total: number) => `共 ${total} 条`,
        }"
        row-key="id"
        @change="fetchData"
      >
        <template #color="{ text }">
          <div class="tag-list_color-cell">
            <div
              class="tag-list_color-swatch"
              :style="{ backgroundColor: text }"
            />
            <span>{{ text }}</span>
          </div>
        </template>
        <template #status="{ text }">
          {{ text === 'active' ? '启用' : '禁用' }}
        </template>
        <template #action="{ record }">
          <a-button size="small" @click="openEdit(record)">
            <EditOutlined /> 编辑
          </a-button>
          <a-button size="small" danger @click="onDelete(record)">
            <DeleteOutlined /> 删除
          </a-button>
        </template>
      </a-table>
    </a-card>

    <TagForm
      :visible="showForm"
      :tag="editingTag"
      @update:visible="showForm = $event"
      @submit="onFormSubmit"
    />
  </div>
</template>

<style scoped lang="less">
.tag-list_wrapper {
  padding: 16px;
}

.tag-list_toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tag-list_color-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-list_color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
