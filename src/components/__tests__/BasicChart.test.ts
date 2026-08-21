import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import type { TChartOption } from '@/types/echarts'

/** mock 数据集中管理：useChart 注册的 echarts 实例与事件 handler */
const { handlers, mockInstance, zrHandlers } = vi.hoisted(() => {
  const handlers: Record<string, (...args: unknown[]) => void> = {}
  const zrHandlers: Record<string, (...args: unknown[]) => void> = {}
  const mockInstance = {
    containPixel: vi.fn(() => true),
    getZr: () => ({
      on: (event: string, cb: (...args: unknown[]) => void) => {
        zrHandlers[event] = cb
      },
    }),
    on: (event: string, cb: (...args: unknown[]) => void) => {
      handlers[event] = cb
    },
    resize: vi.fn(),
    setOption: vi.fn(),
  }
  return { handlers, mockInstance, zrHandlers }
})

vi.mock('@/utils/echarts', () => ({
  getEchartsInstance: () => mockInstance,
}))

vi.mock('echarts/core', () => ({
  dispose: vi.fn(),
}))

import BasicChart from '../BasicChart.vue'

/** BasicChart defineExpose 暴露的成员（无 *.vue shim，显式声明类型） */
interface ChartVm {
  spinning: boolean
}

function mountChart(option: TChartOption) {
  return mount(BasicChart, { props: { option } })
}

describe('BasicChart', () => {
  it('mount 后 spinning 为 true，渲染完成（finished）后关闭', async () => {
    const wrapper = mountChart({})
    await flushPromises()
    expect((wrapper.vm as ChartVm).spinning).toBe(true)

    handlers.finished?.()
    await nextTick()
    expect((wrapper.vm as ChartVm).spinning).toBe(false)
    wrapper.unmount()
  })

  it('props.option 变化时自动 setOption', async () => {
    const wrapper = mountChart({ xAxis: { data: ['a'] } })
    await flushPromises()

    await wrapper.setProps({
      option: { xAxis: { data: ['a', 'b'] } },
    })
    await nextTick()

    expect(mockInstance.setOption).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('点击 grid 区域触发 axisClick 事件', async () => {
    const wrapper = mountChart({})
    await flushPromises()

    zrHandlers.click?.({ offsetX: 10, offsetY: 10 })
    await nextTick()

    expect(wrapper.emitted('axisClick')).toBeTruthy()
    wrapper.unmount()
  })
})
