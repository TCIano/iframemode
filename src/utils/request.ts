import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { message } from 'ant-design-vue'
import Axios from 'axios'

import type { TApiResponse } from '@/types/common'

const axiosInstance = Axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL, // 后端地址就绪后放开
  timeout: 15000,
  withCredentials: true, // 跨域请求时发送 cookie
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<TApiResponse>) => {
    if (response.data.code !== 200) {
      message.error(response.data.message || '请求失败')
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
    return response
  },
  (error: unknown) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    return Promise.reject(new Error('服务器异常，请稍后重试…'))
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
