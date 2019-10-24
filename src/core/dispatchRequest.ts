//入口

//引入定义的数据类型
import { AxiosRequestConfig, AxiosPromise } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
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

  //从新定义的config接口中 url不是必须在config中的
  //因为存在get（）请求等第一个参数传的就是url
  //若其第二个参数config中也有url的话会重复
  //此处给他加一个！
  //即 运行到此处可以确保 url存在,不为空
  //因为 接下来get等处理时会将 url，config等进行合并
  return buildURL(url!, params)
}
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
  //将 要传递的数据编码成json字符串
}
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}
