/*
 *项目中所有的公共的类型定义文件
 */

//在做任何一部分在操作之前，都要先定义接口。

//字符串字面量类型来定义method
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'DELETE'
  | 'delete'
  | 'head'
  | 'HEAD'
  | 'OPTIONS'
  | 'options'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType //响应的数据类型
  timeout?: number //超时时间
}

// export interface AxiosResponse {
//   data: any //响应数据(对象形式方便后续调用)
//   status: number
//   statusText: string
//   headers: any //响应头
//   config: AxiosRequestConfig //请求配置对象
//   request: any //xhr
// }
export interface AxiosResponse<T = any> {
  //返回数据类型泛型，默认any.
  //使用泛型可以在函数调用时定义函数的输出接口形式
  data: T //响应数据(对象形式方便后续调用)
  status: number
  statusText: string
  headers: any //响应头
  config: AxiosRequestConfig //请求配置对象
  request: any //xhr
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
  //axios需要返回一个promise对象，Promise泛型引用
}

//继承自 Error类，
//接下来需要实现一个class来实现该接口，方便之后new出新的实例,
//此接口的目的是定义好new AxiosError实例时传入的数据对象
export interface AxiosError extends Error {
  //错误数据接口
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any //xmlhttprequest实例
  response?: AxiosResponse
}

export interface Axios {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosInstance extends Axios {
  //继承之后，该接口既有上述的一些属性，又有该方法
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
//就是axios（）直接请求，也可以axios.get()等请求

//想定义use（），因为response和request都会用到use
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectFn): number //返回这个拦截器的id
  eject(id: number): void
}
export interface ResolvedFn<T> {
  //request输入config输出config，response输出请求返回地promise
  (val: T): T | Promise<T>
}
export interface RejectFn {
  (error: any): any
}
