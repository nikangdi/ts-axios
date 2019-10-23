//入口

//引入定义的数据类型
import { AxiosRequestConfig, AxiosPromise } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config) //模块化编程
}

function processConfig(config: AxiosRequestConfig): void {
  //对config进行处理
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  //重点！！！！！！！！！！！！！
  // config.headers = transformHeaders(config);//顺序保证必须先处理headers在处理data
  //否则 data已经被处理成了 json格式的字符串，便没法进行判断并处理请求头的contenttype了
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}

export default axios
