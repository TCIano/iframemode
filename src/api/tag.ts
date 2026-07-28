import type { TCreateTagReq } from '@/types/tag'
import type { TTagInfo } from '@/types/tag'
import type { TTagListReq, TTagListResp } from '@/types/tag'

import request from '@/utils/request'

const PREFIX = '/tag'

export function fetchTagList(params: TTagListReq) {
  return request.get<TTagListResp>(`${PREFIX}/list`, { params })
}

export function fetchTagDetail(id: number) {
  return request.get<TTagInfo>(`${PREFIX}/${id}`)
}

export function createTag(data: TCreateTagReq) {
  return request.post<TTagInfo>(PREFIX, data)
}

export function updateTag(id: number, data: Partial<TCreateTagReq>) {
  return request.put<TTagInfo>(`${PREFIX}/${id}`, data)
}

export function deleteTag(id: number) {
  return request.delete(`${PREFIX}/${id}`)
}
