<template>
  <div class="tree-wrapper">
    <a-row :gutter="1" style="height: 100%; width: 100%">
      <a-col :span="isShowTree ? 5 : 0">
        <div v-show="isShowTree" class="tree-wrapper__tree">
          <a-card
            :body-style="{
              padding: '0px 0px',
            }"
            class="tree-wrapper__tree-card"
          >
            <slot name="tree"></slot>
          </a-card>
        </div>
      </a-col>
      <a-col :span="isShowTree ? 19 : 24">
        <div class="tree-wrapper__detail">
          <div
            v-if="isShowBtn"
            class="tree-wrapper__toggle"
            style="position: absolute; top: 50%; left: 0; z-index: 99"
          >
            <a-button
              v-if="isShowTree"
              :icon="h(LeftOutlined)"
              @click="onShowTree"
            ></a-button>
            <a-button
              v-else
              :icon="h(RightOutlined)"
              @click="onShowTree"
            ></a-button>
          </div>
          <a-card
            :body-style="{
              padding: '0px 0px',
            }"
            class="tree-wrapper__detail-card"
          >
            <slot name="content"></slot>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { h, provide, ref } from 'vue'

withDefaults(
  defineProps<{
    isShowBtn?: boolean
  }>(),
  {
    isShowBtn: false,
  },
)

const isShowTree = ref<boolean>(true)
provide('isShowTree', isShowTree)
const onShowTree = () => {
  isShowTree.value = !isShowTree.value
}
</script>

<style lang="less" scoped>
.tree-wrapper__tree {
  position: relative;
}

.tree-wrapper__tree-card {
  height: calc(100vh - 20px);
}

.tree-wrapper__detail-card {
  height: calc(100vh - 20px);
}
</style>
