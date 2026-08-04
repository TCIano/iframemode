import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { message } from 'ant-design-vue'
import Axios from 'axios'

import type { TApiResponse } from '@/types/common'

/** 登录态 token 在 localStorage 中的 key */
const TOKEN_KEY = 'token'
/** 401 未登录跳转地址（登录页就绪后改为实际路径，配合 hash 路由使用） */
const LOGIN_PATH = '#/login'

/** 业务错误：携带后端业务码/HTTP 状态码，调用方可按 code 区分处理 */
export class ApiError extends Error {
  code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 与 vite proxy / 后端网关前缀保持一致
  timeout: 15000,
  withCredentials: true, // 跨域请求时发送 cookie
})

// 请求拦截器：注入登录态
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<TApiResponse>) => {
    const body = response.data
    if (body.code !== 200) {
      message.error(body.message || '请求失败')
      return Promise.reject(new ApiError(body.message || '请求失败', body.code))
    }
    return response
  },
  (error: AxiosError<TApiResponse>) => {
    const status = error.response?.status
    // 401 未登录：清除登录态并跳转登录页
    if (status === 401) {
      clearToken()
      window.location.hash = LOGIN_PATH
      return Promise.reject(new ApiError('登录已过期，请重新登录', 401))
    }
    // 403 无权限
    if (status === 403) {
      message.error('无权限访问')
      return Promise.reject(new ApiError('无权限访问', 403))
    }
    if (import.meta.env.DEV) {
      console.error('[request]', error)
    }
    return Promise.reject(
      new ApiError(
        status ? `请求失败（HTTP ${status}）` : '网络异常，请稍后重试…',
        status,
      ),
    )
  },
)

/**
 * 包装 axios 实例：AxiosResponse 携带后端统一结构 TApiResponse，
 * 方法层解包 .data 后按 TBody（完整响应体）返回。
 */
const request = {
  delete: <TBody = TApiResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TBody> =>
    axiosInstance
      .delete<TApiResponse>(url, config)
      .then((response) => response.data as TBody),
  get: <TBody = TApiResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TBody> =>
    axiosInstance
      .get<TApiResponse>(url, config)
      .then((response) => response.data as TBody),
  post: <TBody = TApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TBody> =>
    axiosInstance
      .post<TApiResponse>(url, data, config)
      .then((response) => response.data as TBody),
  put: <TBody = TApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TBody> =>
    axiosInstance
      .put<TApiResponse>(url, data, config)
      .then((response) => response.data as TBody),
}

export default request
