import * as echarts from 'echarts/core'
// 按需引入各模块
import {
  BarChart,
  CustomChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  TitleComponent,
  LabelLayout,
  LegendComponent,
  MarkLineComponent,
  CustomChart,
  PolarComponent,
  ToolboxComponent,
  VisualMapComponent,
  GraphicComponent,
  DataZoomComponent,
])

export default echarts
