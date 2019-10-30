import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}
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

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let paramsSerialize: string
  const parts: string[] = [] //存放每个的最终结果name=xiaoming
  if (paramsSerializer) {
    paramsSerialize = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    paramsSerialize = params.toString()
  } else {
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
        if (isDate(item)) {
          item = item.toISOString()
        } else if (isPlainObject(item)) {
          item = JSON.stringify(item)
        }
        //拼接key和处理后的values，即每段name=abc
        parts.push(`${encode(key)}=${encode(item)}`)
      })
    })
    paramsSerialize = parts.join('&')
  }
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

export function isAbsoluteURL(url: string): boolean {
  //判断是否为绝对地址
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
export function combineURL(baseURL: string, relativeURL: string): string {
  //绝对地址和相对地址进行拼接
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export function isURLSameOrigin(requestURL: string): boolean {
  //判断是否同源
  const parseOrigin = resolveURL(requestURL)
  return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host
}
const urlParseingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  //********************************* */
  //利用a节点来解析url地址
  urlParseingNode.setAttribute('href', url)
  const { protocol, host } = urlParseingNode
  return {
    protocol,
    host
  }
}
