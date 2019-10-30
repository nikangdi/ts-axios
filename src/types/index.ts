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
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredenrials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  baseURL?: string

  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void

  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string

  [propName: string]: any
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
  defaults: AxiosRequestConfig
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  getUri(config: AxiosRequestConfig): string
}
export interface AxiosInstance extends Axios {
  //继承之后，该接口既有上述的一些属性，又有该方法
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
//就是axios（）直接请求，也可以axios.get()等请求

export interface AxiosStatic extends AxiosInstance {
  //实现interface（）合并config请求
  //以及axios.create（）等功能
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}
export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios //constructor
}

export interface AxiosInterceptorManager<T> {
  //想定义use（），因为response和request都会用到use
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

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  // reason?:string
  reason?: Cancel

  throwIfRequested(): void
}
export interface Canceler {
  (message?: string): void
  //将取消原因传给reason
}
export interface CancelExecutor {
  //CancelExecutor是一个方法，接收另一个方法，另一个方法传入message进行处理（如上Canceler）
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}
export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  //Authorization
  username: string
  password: string
}
