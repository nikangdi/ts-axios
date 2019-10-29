import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import { Cancel } from './Cancel'
interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    executor(message => {
      // export interface Canceler{
      //     (message?:string):void
      //     //将取消原因传给reason
      //   }
      //   export interface CancelExecutor{
      //     //CancelExecutor是一个方法，接收另一个方法，另一个方法传入message进行处理（如上Canceler）
      //     (cancel:Canceler):void
      //   }
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
      //异步分离与xhr的if（cancelToken）这部分代码逻辑
      // if(cancelToken){
      //     cancelToken.promise.then(reason=>{
      //       request.abort()
      //       reject(reason)
      //     })
      //   }
    })
    //此处并没有具体声明executor的具体函数体
    //新建cancelToken实例的时候需要传入executor
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
      //c就是executor的参数，也就是处理方法Cnaceler
    })
    return {
      cancel,
      token
    }
    //外部调用cancel方法的时候相当于调用
    // message=>{

    //     if(this.reason){return}
    //     this.reason = message
    //     resolvePromise(this.reason)
    //这段逻辑
  }
}
