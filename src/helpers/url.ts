import { isData, isPlainObject } from './util'

export function encode(val: string): string {
  return (
    encodeURIComponent(val)
      //全部特殊符号都已经被重新编码，但是axios请求中可能不要求被重新编码
      //所以进行正则，替换回去
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = [] //存放每个的最终结果name=xiaoming
  Object.keys(params).forEach(key => {
    const val = params[key]
    //值为undefined或者null的情况
    if (val === null || typeof val === 'undefined') {
      return //foreach中使用return只能跳出本级循环，进入下一次
    }
    let values = [] //将该key下所有的v值统计到values数组中
    if (Array.isArray(val)) {
      //数组的情况下对键名进行拼接加长 key+='[]'
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(item => {
      if (isData(item)) {
        item = item.toISOString()
      } else if (isPlainObject(item)) {
        item = JSON.stringify(item)
      }
      //拼接key和处理后的values，即每段name=abc
      parts.push(`${encode(key)}=${encode(item)}`)
    })
  })
  let paramsSerialize: string = parts.join('&')
  if (paramsSerialize) {
    if (url.includes('#')) {
      let index = url.indexOf('#')
      url = url.slice(0, index)
    }
    if (url.includes('?')) {
      url = `${url}&${paramsSerialize}`
    } else {
      url = `${url}?${paramsSerialize}`
    }
  }
  return url
}
