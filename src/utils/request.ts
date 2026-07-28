import type { AxiosResponse } from 'axios'

import { message } from 'ant-design-vue'
import Axios from 'axios'

export interface Response {
  data: any
  errMsg: string
  result: boolean
  totalSize: 0 | number
}

const baseURL = import.meta.env.VITE_BASE_URL
const axiosInstance = Axios.create({
  // baseURL,
  timeout: 15000,
  withCredentials: true, // 跨域请求时发送cookie
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data
    } else {
      message.error(response.data.errMsg)
      throw new Error(response.status.toString())
    }
  },
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    return Promise.reject({ code: 500, msg: '服务器异常，请稍后重试…' })
  },
)

/**
 * 包装 axios 实例，修正返回类型。
 * 拦截器已把 AxiosResponse 解包为裸 body，所以 request.get<T> 直接返回 Promise<T>。
 */
const request = {
  delete: (url: string, config?: any) => axiosInstance.delete(url, config),
  get: <T = any>(url: string, config?: any): Promise<T> =>
    axiosInstance.get(url, config),
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    axiosInstance.post(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    axiosInstance.put(url, data, config),
}

export default request
