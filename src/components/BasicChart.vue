<template>
  <a-spin :spinning="spinning" size="large">
    <div ref="comChart" :style="styleOp" />
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
  (e: 'axisClick', params: ElementEvent): void
}

const props = withDefaults(defineProps<BasicChartProps>(), {
  option: () => ({}),
  styleOp: () => ({}),
})
const emit = defineEmits<BasicChartEmit>()
const spinning = ref(true)
const comChart = ref<HTMLDivElement | null>(null)

const { updateOption } = useChart(comChart, () => props.option, {
  onAxisClick: (params) => emit('axisClick', params),
  onFinished: () => {
    spinning.value = false
  },
})

/** 手动强制重绘（如容器尺寸变化后）；chart 实例由 useChart 内部自管，不对外暴露 */
function refresh() {
  updateOption(props.option)
}

defineExpose({ refresh, spinning })
</script>

<style lang="less" scoped></style>
