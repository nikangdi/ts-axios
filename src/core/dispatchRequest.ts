//入口

//引入定义的数据类型
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  //在请求前检测一下，检测canceltoken是否被使用过，即之前有没有使用token调用过请求的取消

  processConfig(config)
  return xhr(config) //模块化编程
    .then(res => {
      return transformResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
  //对config进行处理
  config.url = transformURL(config)

  // config.data = transformRequestData(config)
  // config.headers = transformHeaders(config)
  //transform会调用config.transformRequest
  //其中默认的就是  transformRequestData(config) transformHeaders(config)
  // 这两个处理
  config.data = transform(config.data, config.headers, config.transformRequest)

  //重点！！！！！！！！！！！！！
  // config.headers = transformHeaders(config);//顺序保证必须先处理headers在处理data
  //否则 data已经被处理成了 json格式的字符串，便没法进行判断并处理请求头的contenttype了

  //dispatchRequest是在最后执行
  config.headers = flattenHeaders(config.headers, config.method!)
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
// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
//   //将 要传递的数据编码成json字符串
// }
// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  //如果已经请求直接抛出错误
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
