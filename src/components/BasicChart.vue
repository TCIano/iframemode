<template>
  <a-spin :spinning="spinning" size="large">
    <div id="comChart" ref="comChart" :style="style" />
  </a-spin>
</template>

<script lang="ts" setup>
import {
  dispose,
  type ECharts,
  type ElementEvent,
  type SetOptionOpts,
} from 'echarts/core'
import { type CSSProperties, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { TChartOption } from '@/types/echarts'

import useEcharts from '@/hooks/useEcharts'

interface BasicChartProps {
  option: TChartOption
  styleOp?: CSSProperties
}

interface BasicChartEmit {
  (e: 'onAxisClick', params: ElementEvent): void
}

const props = withDefaults(defineProps<BasicChartProps>(), {
  option: () => ({}),
  styleOp: () => ({}),
})
const emit = defineEmits<BasicChartEmit>()
const style = ref<CSSProperties>(props.styleOp)
const comChart = ref<HTMLDivElement | null>(null)
const spinning = ref<boolean>(true)

let echartInstance: ECharts | null = null
let resizeHandler: (() => void) | null = null
let timer: null | ReturnType<typeof setTimeout> = null

watch(
  () => props.option,
  (value) => {
    if (echartInstance) {
      echartInstance.setOption(value, true)
    } else {
      init()
    }
  },
)

const init = () => {
  if (!comChart.value) return
  echartInstance = useEcharts(comChart.value)
  echartInstance.on('finished', () => {
    timer = setTimeout(() => {
      spinning.value = false
    }, 100)
  })

  echartInstance.getZr().on('click', (params: ElementEvent) => {
    const pointInPixel = [params.offsetX, params.offsetY]
    if (echartInstance?.containPixel('grid', pointInPixel)) {
      emit('onAxisClick', params)
    }
  })
  resizeHandler = () => {
    echartInstance?.resize()
  }
  window.addEventListener('resize', resizeHandler)
  echartInstance.setOption(props.option)
}

const disposeDom = () => {
  if (comChart.value && echartInstance) {
    dispose(comChart.value)
  }
  echartInstance = null
}

const updateOption = (data: TChartOption, opt: SetOptionOpts = {}) => {
  echartInstance?.setOption(data, opt)
}

const resize = () => {
  echartInstance?.resize()
}

defineExpose({
  disposeDom,
  echartInstance,
  init,
  resize,
  updateOption,
})

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (echartInstance) {
    disposeDom()
  }
})
</script>

<style lang="less" scoped></style>
