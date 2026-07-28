import type { TTagHistoryItem } from '@/types/report'

import request from '@/utils/request'

const PREFIX = '/report'

export function getTagHistoryTrendApi(params: {
  endTime: string
  startTime: string
  tagName: string
}) {
  return request.get<TTagHistoryItem[]>(`${PREFIX}/tag-history`, { params })
}
