/*
 *项目中所有的公共的类型定义文件
 */

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
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType //响应的数据类型
}

export interface AxiosResponse {
  data: any //响应数据
  status: number
  statusText: string
  headers: any //响应头
  config: AxiosRequestConfig //请求配置对象
  request: any //xhr
}

export interface AxiosPromise extends Promise<AxiosResponse> {
  //axios需要返回一个promise对象，Promise泛型引用
}
