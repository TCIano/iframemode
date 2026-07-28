<script setup lang="ts">
import { reactive, watch } from 'vue'

import type { TCreateTagReq, TTagInfo } from '@/types/tag'

/** props */
interface TagFormProps {
  tag?: TTagInfo
  visible: boolean
}

const props = withDefaults(defineProps<TagFormProps>(), {
  tag: undefined,
  visible: false,
})

/** emits */
const emit = defineEmits<{
  (e: 'submit', data: TCreateTagReq): void
  (e: 'update:visible', val: boolean): void
}>()

/** form state */
const form = reactive<TCreateTagReq>({
  color: '#1890ff',
  name: '',
  status: 'active',
})

/** watch visible open — reset or populate form */
watch(
  () => props.visible,
  (val) => {
    if (val && props.tag) {
      form.name = props.tag.name
      form.color = props.tag.color
      form.status = props.tag.status
    } else if (val) {
      form.name = ''
      form.color = '#1890ff'
      form.status = 'active'
    }
  },
)

function handleOk() {
  emit('submit', { ...form })
}

function handleCancel() {
  emit('update:visible', false)
}
</script>

<template>
  <a-modal
    :title="tag ? '编辑标签' : '新建标签'"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item label="名称" required>
        <a-input v-model:value="form.name" placeholder="请输入标签名称" />
      </a-form-item>
      <a-form-item label="颜色">
        <a-input v-model:value="form.color" type="color" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="form.status">
          <a-select-option value="active">启用</a-select-option>
          <a-select-option value="disabled">禁用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less"></style>
