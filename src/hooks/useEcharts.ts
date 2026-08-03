import echarts from '../utils/echarts'

/** 获取 DOM 对应的 ECharts 实例，不存在则初始化 */
export default function useEcharts(dom: HTMLElement, theme?: string) {
  let instance = echarts.getInstanceByDom(dom)
  if (!instance) {
    instance = echarts.init(dom, theme, { renderer: 'canvas' })
  }
  return instance
}
