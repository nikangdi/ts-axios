//对 config中的data进行处理
import { isPlainObject } from './util'
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
    //在，data及params的处理中，只对普通对象进行手动处理，formData等对象自身可以被直接发送

    //data转成json格式之后，另一个问题就是header中的content-type仍是text/plain，需要改变成application/json
    //否则，向后端请求，提交的是空的{}
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      //do nothing
    }
    return data
  }
}
