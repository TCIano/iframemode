<template>
  <a-upload
    v-model:file-list="fileList"
    :accept="accept"
    :before-upload="beforeUpload"
    @remove="handleRemove"
  >
    <a-button size="small">
      <UploadOutlined />
      点击上传
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { UploadOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import { ref } from 'vue'

interface BasicUploadProps {
  accept?: string
}

interface BasicUploadEmit {
  (e: 'handleUpload', fileList: FormData): void
}

const props = withDefaults(defineProps<BasicUploadProps>(), {
  accept: 'image/*',
})
const emit = defineEmits<BasicUploadEmit>()
const fileList = ref<UploadProps['fileList']>([])

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const accept = props.accept.split(',').map((item) => item.trim()) // 去除每项空格
  const typeOk = accept.includes(file.type)
  if (!typeOk) {
    message.warning('接受的文件类型为' + props.accept)
  } else {
    // 上传
    const formData = new FormData()
    fileList.value = [file]
    formData.append('file', file)
    emit('handleUpload', formData)
  }
  return false
}
const handleRemove = () => {
  fileList.value = []
}
defineExpose({ handleRemove })
</script>

<style lang="less" scoped></style>
