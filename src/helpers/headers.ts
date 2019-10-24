//对请求头进行处理
import { isPlainObject } from './util'
function normalizeHeaderName(headers: any, normalizedName: 'Content-Type'): void {
  //设置成为Content-Type
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  //根据data是否为普通对象 进行判断
  //data是普通对象，
  //则需对data进行json处理，
  //此时就要对header中的content-type进行处理
  if (isPlainObject(data)) {
    if (
      (headers && !headers['Content-Type']) ||
      !headers['Content-Type'].includes('application/json')
    ) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeader(headers: string): any {
  //getAllResponseHeader获取的是一个字符串形式的，需要转为对象类型
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
}
