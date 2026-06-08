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
const request = Axios.create({
  // baseURL,
  timeout: 15000,
  withCredentials: true, // 跨域请求时发送cookie
})

request.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200) {
      if (response.data.result) {
        return response.data
      } else {
        return response.data
      }
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

export default request
