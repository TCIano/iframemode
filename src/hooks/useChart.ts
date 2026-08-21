import { useEventListener } from '@vueuse/core'
import {
  dispose,
  type ECharts,
  type ElementEvent,
  type SetOptionOpts,
} from 'echarts/core'
import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'

import type { TChartOption } from '@/types/echarts'

import { getEchartsInstance } from '@/utils/echarts'

/** 图表生命周期事件回调 */
type ChartEventHandlers = {
  /** 点击图表网格（grid）区域时触发，参数为 ECharts 原生事件对象（仅对含 grid 的图表生效） */
  onAxisClick?: (params: ElementEvent) => void
  /** 图表渲染完成（finished 事件）后触发，通常用于隐藏 loading 状态 */
  onFinished?: () => void
}

/**
 * 管理 ECharts 实例的生命周期：初始化、option 更新、resize、销毁。
 * 图表 option 的构造逻辑见各业务 hook（如 useTrendOpt），此处只负责实例。
 * 当前契约针对直角坐标系（grid）图表，onAxisClick 依赖 grid 区域判定。
 *
 * @param domRef 图表容器 DOM 引用（模板 ref）
 * @param getOption 获取图表 option 的 getter，传入 `() => props.option` 即可随 props 变化自动更新
 * @param events 生命周期事件回调
 */
export function useChart(
  domRef: Ref<HTMLElement | null>,
  getOption: () => TChartOption,
  events: ChartEventHandlers = {},
) {
  const chart = ref<ECharts | null>(null)

  const resize = () => {
    chart.value?.resize()
  }

  // resize 监听由 useEventListener 注册，setup 作用域销毁时自动解绑
  const stopResize = useEventListener(window, 'resize', resize)

  const init = () => {
    if (!domRef.value || chart.value) return
    chart.value = getEchartsInstance(domRef.value)

    chart.value.on('finished', () => {
      events.onFinished?.()
    })

    chart.value.getZr().on('click', (params: ElementEvent) => {
      const pointInPixel = [params.offsetX, params.offsetY]
      if (chart.value?.containPixel('grid', pointInPixel)) {
        events.onAxisClick?.(params)
      }
    })

    chart.value.setOption(getOption())
  }

  const updateOption = (data: TChartOption, opt: SetOptionOpts = {}) => {
    chart.value?.setOption(data, opt)
  }

  const destroy = () => {
    stopResize()
    if (domRef.value && chart.value) {
      dispose(domRef.value)
    }
    chart.value = null
  }

  watch(
    getOption,
    (value) => {
      chart.value?.setOption(value, true)
    },
    { flush: 'post' },
  )

  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    destroy()
  })

  return { chart, destroy, init, resize, updateOption }
}
