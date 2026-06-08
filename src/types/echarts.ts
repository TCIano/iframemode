import * as echarts from 'echarts'
// import * as echarts from 'echarts/core'
//按需引入
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

type chartOption = echarts.ComposeOption<
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
//按需引入

//全部引入
// type chartOption = echarts.SeriesOption &
//   echarts.EChartOption &
//   echarts.VisualMapComponentOption

export type { chartOption }
