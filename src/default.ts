import { AxiosRequestConfig } from './types'
import { transformResponse, transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN', //默认值
  xsrfHeaderName: 'X-XSRF-TOKEN', //默认值

  //transformRequest 使用的是默认的合并方法，只要有自定义的处理方法，就会覆盖默认的惹下所示的方法
  transformRequest: [
    //数组中的各个函数方法管道执行，前者输出作为后者的输入
    function(data: any, headers: any): any {
      //默认处理
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    //数组中的各个函数方法管道执行，前者输出作为后者的输入
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options']
methodsNoData.forEach(item => {
  defaults.headers[item] = {}
})
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(item => {
  defaults.headers[item] = { 'Content-Type': 'application/x-www-form-urlencoded' }
})

export default defaults
