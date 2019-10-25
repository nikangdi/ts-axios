import { ResolvedFn, RejectFn } from '../types'
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected: RejectFn | undefined
}

export default class InterceptorManager<T> {
  //目的是为了将各个拦截器放到数组中
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }
  use(resolved: ResolvedFn<T>, rejected?: RejectFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })

    return this.interceptors.length - 1
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    //intorceptor为私有数据，用foreach暴露给外面其他调用
    this.interceptors.forEach(intorceptor => {
      if (intorceptor) {
        fn(intorceptor)
      }
    })
  }
}
