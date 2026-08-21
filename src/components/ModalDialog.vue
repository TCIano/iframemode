<template>
  <a-modal
    v-model:open="visible"
    :title="props.title"
    :width="props.width || undefined"
    class="modal-dialog"
    cancel-text="取消"
    ok-text="确定"
    @ok="onConfirm"
    @cancel="onCancel"
  >
    <div
      class="modal-dialog__content"
      :style="{ '--modal-content-height': props.contentHeight }"
    >
      <slot name="content"></slot>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'ModalDialog' })

const props = withDefaults(
  defineProps<{
    contentHeight?: string
    title?: string
    width?: string
  }>(),
  {
    contentHeight: '80vh',
    title: '操作',
    width: '',
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
.modal-dialog__content {
  max-height: var(--modal-content-height);
}
</style>
