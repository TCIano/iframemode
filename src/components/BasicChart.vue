<template>
  <a-spin :spinning="spinning" size="large">
    <div id="comChart" ref="comChart" :style="style" />
  </a-spin>
</template>

<script lang="ts" setup>
import { dispose } from 'echarts/core'
import {
  type HTMLAttributes,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  withDefaults,
} from 'vue'

import type { chartOption } from '@/types/echarts'

import useEcharts from '@/hooks/useEcharts'

interface Props {
  option: any | chartOption
  styleOp?: any
}

interface Emit {
  (e: 'onAxisClick', params: any): void
}

const props = withDefaults(defineProps<Props>(), {
  option: () => {
    return {}
  },
  styleOp: () => {
    return {}
  },
})
const emit = defineEmits<Emit>()
const style = ref<HTMLAttributes>(props.styleOp)
const comChart = ref<HTMLDivElement | null>(null)
const spinning = ref<boolean>(true)

// watch(
//   () => props.styleOp,
//   (value) => {
//     style.value = value
//     nextTick(() => {
//       echartInstance && echartInstance.resize()
//     })
//   },
//   {
//     immediate: true,
//   },
// )
watch(
  () => props.option,
  (value) => {
    if (echartInstance) {
      echartInstance.setOption(value, true)
    } else {
      init()
    }
    // disposeDom()
    // init()
    //数据改变时候也重新触发
    // resize()
  },
)

let echartInstance: any = null
let resizeHandler: (() => void) | null = null
let timer: null | ReturnType<typeof setTimeout> = null
const init = async () => {
  echartInstance = useEcharts(comChart.value as HTMLDivElement)
  echartInstance.on('finished', () => {
    setTimeout(() => {
      spinning.value = false
    }, 100)
  })

  //触发点击事件
  echartInstance.getZr().on('click', (params: any) => {
    //获取点击位置的像素坐标
    const pointInPixel = [params.offsetX, params.offsetY]
    if (echartInstance.containPixel('grid', pointInPixel)) {
      emit('onAxisClick', params)
    }
  })
  resizeHandler = () => {
    echartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)
  echartInstance.setOption(await props.option)
}
const disposeDom = () => {
  if (echartInstance) {
    dispose(comChart.value as HTMLElement)
  }
  echartInstance = null
}
const updateOption = (data: any | chartOption, opt = {}) => {
  echartInstance?.setOption(data, opt)
}
const resize = () => {
  echartInstance.resize()
}
const setWidth = () => {
  const dom = document.querySelector('#comChart')
  //修改宽度
  // if (dom) {
  //   dom.style.width = '300px'
  // }
}
defineExpose({
  disposeDom,
  echartInstance,
  init,
  resize,
  setWidth,
  updateOption,
})

onMounted(() => {
  init()
})
//缓存过后重新设置样式
onActivated(() => {
  // resize()
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
