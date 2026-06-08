<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    class="modal-dialog-wrapper"
    cancel-text="取消"
    ok-text="确定"
    @ok="onConfirm"
    @cancel="onCancel"
  >
    <div :style="{ maxHeight: '80vh' }">
      <slot name="content"></slot>
    </div>
    <template v-for="(value, name) in slots" #[name]="slotData">
      <slot v-if="name !== 'content'" :name="name" v-bind="slotData"></slot>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue'

defineOptions({ name: 'ModalDialog' })

withDefaults(
  defineProps<{
    contentHeight?: string
    title?: string
    width?: string
  }>(),
  {
    contentHeight: '30vh',
    title: '操作',
    width: '',
  },
)

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const slots = useSlots()
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
