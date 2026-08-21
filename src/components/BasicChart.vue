<template>
  <a-spin :spinning="spinning" size="large">
    <div id="comChart" ref="comChart" :style="style" />
  </a-spin>
</template>

<script lang="ts" setup>
import { type ElementEvent } from 'echarts/core'
import { type CSSProperties, ref } from 'vue'

import type { TChartOption } from '@/types/echarts'

import { useChart } from '@/hooks/useChart'

type BasicChartProps = {
  option: TChartOption
  styleOp?: CSSProperties
}

type BasicChartEmit = {
  (e: 'onAxisClick', params: ElementEvent): void
}

const props = withDefaults(defineProps<BasicChartProps>(), {
  option: () => ({}),
  styleOp: () => ({}),
})
const emit = defineEmits<BasicChartEmit>()
const spinning = ref(true)
const style = ref<CSSProperties>(props.styleOp)
const comChart = ref<HTMLDivElement | null>(null)

const { chart, destroy, init, resize, updateOption } = useChart(
  comChart,
  () => props.option,
  {
    onAxisClick: (params) => emit('onAxisClick', params),
    onFinished: () => {
      spinning.value = false
    },
  },
)

defineExpose({
  chart,
  destroy,
  init,
  resize,
  spinning,
  updateOption,
})
</script>

<style lang="less" scoped></style>
