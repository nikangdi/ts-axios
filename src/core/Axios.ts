import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  Method,
  RejectFn,
  ResolvedFn
} from '../types'

import dispatchRequest from './dispatchRequest'
import mergeConfig from './mergeConfig'

import InterceptorManager from './interceptormanager' //引入类型
import defaults from '../default'

//为了保证在应用外边axios调用时可以进行推断不报错，ying向外暴露接口Axios中暴露接口interface
//另外，还需注意的是，此处Interceptor接口是供内部使用的，使用的是类来声明request，response
//Axios接口中的 interceptor接口定义的是共外部使用的，使用的是AxiosInterceptorManager进行的声明
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
  //用于定义chain数组接口
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise) //加一层括号就不会报错了((config:AxiosRequestConfig)=>AxiosPromise)
  rejected?: ResolvedFn<T>
}

export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig
  //axios.interceptor.request.use()
  constructor(initConfig: AxiosRequestConfig) {
    this.interceptors = {
      //初始化interceptor对象
      request: new InterceptorManager<AxiosRequestConfig>(), //传入config入类，初始化化request对象
      response: new InterceptorManager<AxiosResponse>() //传入response 入类，初始化化response对象
      //即 当调用 axios.interceptor.request.use()会添加一个请求拦截器，在InterceptorManager类中的interceptors中
    }
    this.defaults = initConfig
  }

  //defaults和config的合并需要区分不同字段使用不同方式

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    //请求之前拦截处理,defaluts等默认值
    mergeConfig(defaults, config)

    //做链式调用逻辑
    //用于存储一堆拦截器，此处也就可以用到InterceptorManager中定义的foreach方法,将所有拦截器取出添加到chain中
    //初始值就是最后调用dispatchRequest的意思
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    //添加时注意，request是后添加的先执行
    this.interceptors.request.forEach(intorceptor => {
      chain.unshift(intorceptor)
    })
    //response 是先添加的先执行
    this.interceptors.response.forEach(intorceptor => {
      chain.push(intorceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      //这里会有个报错，是因为chain.shift类型它推断不出来是否包含resolved，rejected，但我们知道，他一定包含，故加个叹号
      promise.then(resolved, rejected)
    }
    return promise
    // return dispatchRequest(config) //注释掉即可，因为链的最后一个就是初始值一种的resolve就会调用dispatchRequest
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
