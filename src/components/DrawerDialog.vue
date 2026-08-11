<template>
  <a-drawer
    v-model:visible="visible"
    :width="width"
    :title="title"
    class="drawer-dialog"
    @close="onCancel"
  >
    <template #extra>
      <a-space>
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onConfirm">确定</a-button>
      </a-space>
    </template>
    <div class="drawer-dialog__content">
      <slot name="content"></slot>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'DrawerDialog' })

withDefaults(
  defineProps<{
    title?: string
    width?: number
  }>(),
  {
    title: '操作',
    width: 378,
  },
)

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const visible = ref(false)

function toggle() {
  visible.value = !visible.value
  return Promise.resolve(visible.value)
}

function show() {
  visible.value = true
  return Promise.resolve(true)
}

function close() {
  visible.value = false
  return Promise.resolve(false)
}

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  visible.value = false
  emit('cancel')
}

defineExpose({ close, show, toggle })
</script>

<style lang="less" scoped>
.drawer-dialog {
  :deep(.ant-drawer-body) {
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -moz-scrollbar: none;
    -ms-overflow-style: none;
  }
}
</style>
