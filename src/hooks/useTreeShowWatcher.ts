import { inject, nextTick, type Ref, watch } from 'vue'

import type BasicChart from '@/components/BasicChart.vue'

/**
 * 混入echarts手动更新布局方法
 * @param chart echarts实例
 */
export const useTreeShowWatcher = (
  chart: Ref<InstanceType<typeof BasicChart> | undefined>,
) => {
  const isShowTree: Ref<boolean> | undefined = inject('isShowTree')
  watch(
    () => isShowTree?.value,
    () => {
      nextTick(() => {
        if (Array.isArray(chart.value)) {
          chart.value?.map((item) => {
            item.resize()
          })
        } else {
          chart.value?.resize()
        }
      })
    },
  )
}
