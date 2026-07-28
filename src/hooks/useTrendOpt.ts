import dayjs from 'dayjs'

import type { TTagHistoryItem } from '@/types/report'

import { getTagHistoryTrendApi } from '@/api/report'

const getTagHistory = async (
  tagName: string,
  startTime: string,
  endTime: string,
) => {
  return await getTagHistoryTrendApi({
    endTime,
    startTime,
    tagName: encodeURI(tagName),
  })
}
export const useGetTrendOpt = async (
  tag: string[],
  name: string,
  tagObj: Record<string, string> | undefined,
  startTime: string,
  endTime: string,
) => {
  const promises = tag.map(async (item) => {
    const tag = tagObj![item] || ''
    try {
      const res = tag.length ? await getTagHistory(tag, startTime, endTime) : []
      return {
        areaStyle: {
          color: '#dae3f5',
        },
        data:
          res?.map((item: TTagHistoryItem) => [
            dayjs(item.timeStamp).format('YYYY-MM-DD HH:mm:ss'),
            item.data,
          ]) || [],
        name: tagObj![item],
        smooth: true,
        symbol: 'none',
        type: 'line',
      }
    } catch {
      return
    }
  })
  const series = await Promise.all(promises).catch(() => {
    throw new Error('获取趋势图失败')
  })
  return {
    dataZoom: [
      {
        end: 100,
        show: true,
        start: 95,
        type: 'slider',
        xAxisIndex: [0],
      },
      {
        show: true,
        type: 'slider',
        yAxisIndex: [0],
      },
      // {
      //   type: 'inside',
      //   xAxisIndex: [0],
      // },
      {
        type: 'inside',
        yAxisIndex: [0],
      },
    ],
    grid: {
      bottom: '25%',
      left: '11%',
      right: '8%',
      top: '15%',
    },
    legend: {
      show: true,
      type: 'scroll',
      // left: '20%',
    },
    series,
    title: {
      // text: name,
      textStyle: {
        fontSize: 13,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
  }
}
