import { Modal } from 'ant-design-vue'
import { ref } from 'vue'

import type { TTagInfo } from '@/types/tag'

import { deleteTag, fetchTagList } from '@/api/tag'

export function useTagList() {
  const loading = ref(false)
  const data = ref<TTagInfo[]>([])
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  async function fetchData(params?: {
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    loading.value = true
    try {
      const resp = await fetchTagList({
        keyword: params?.keyword,
        page: params?.page ?? pagination.value.current,
        pageSize: params?.pageSize ?? pagination.value.pageSize,
      })
      data.value = resp.data ?? []
      pagination.value.total = resp.totalSize ?? 0
      if (params?.page) pagination.value.current = params.page
      if (params?.pageSize) pagination.value.pageSize = params.pageSize
    } finally {
      loading.value = false
    }
  }

  function handleDelete(id: number) {
    Modal.confirm({
      content: '确认删除该标签？',
      onOk: () => deleteTag(id),
    })
  }

  return {
    data,
    fetchData,
    handleDelete,
    loading,
    pagination,
  }
}
