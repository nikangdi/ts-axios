import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequest'
export default class Axios {
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'get',url}))
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'delete',url}))
    return this._requestMethodWithoutData('options', url, config)
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'get',url}))
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'delete',url}))
    return this._requestMethodWithoutData('delete', url, config)
  }
  //这两段代码有逻辑重复，故抽离
  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'delete',url}))
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    // return this.request(Object.assign(config||{},{method:'delete',url}))
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }
  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}
