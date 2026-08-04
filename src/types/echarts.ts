import * as echarts from 'echarts'
// 按需引入各模块类型
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts'
import type {
  DatasetComponentOption,
  DataZoomComponentOption,
  GraphicComponentOption,
  GridComponentOption,
  LegendComponentOption,
  MarkLineComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

/** 图表配置项类型（按需引入各模块的组合） */
type TChartOption = echarts.ComposeOption<
  | BarSeriesOption
  | DatasetComponentOption
  | DataZoomComponentOption
  | GraphicComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
  | MarkLineComponentOption
  | PieSeriesOption
  | RadarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
>

export type { TChartOption }
