import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeader } from '../helpers/headers'
import { transformResponse } from '../helpers/data'
import { createError } from '../helpers/error'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  //自定义的返回数据类型，一个promise类型的
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()

    //给请求ajax请求对象配置responseType类型
    if (responseType) {
      request.responseType = responseType
    }

    //给请求ajax请求对象配置timeout类型，超时时间
    if (timeout) {
      request.timeout = timeout
    }
    request.open(method.toUpperCase(), url!, true)

    //对headers中的每一项进行请求头设置
    Object.keys(headers).forEach(item => {
      if (data === null && headers[item].toLowerCase() === 'content-type') {
        delete headers[item]
        //当data为null时 ，不需要设置content-type
        //因为没用内容进行发送
      } else {
        request.setRequestHeader(item, headers[item])
      }
    })
    request.send(data)

    request.onreadystatechange = function handleload() {
      if (request.readyState !== 4) {
        return
      }
      //将请求的结果以指定类型的对象进行返回

      if (request.status === 0) {
        //当网络错误或者超时的时候，status即为0，直接return
        return
      }

      const responseHeaders = parseHeader(request.getAllResponseHeaders())
      //获取所有的响应头getAllResponseHeaders()返回的是一个字符串
      //但是获得的是一段字符串，不是对象
      //字符串分为多行，每行以key：value的形式展示
      //故 需要进行解析

      const responseData = responseType === 'text' ? request.responseText : request.response
      //另一个问题，当我们不去设置responseType类型时，返回的数据是一个字符串的问题，需将其转成json对象
      //对其进行尝试JSON.parse()

      const response: AxiosResponse = {
        data: transformResponse(responseData),
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders, //需要将 响应头 转为  对象类型
        config,
        request
      }
      return handleResponse(response)
    }

    request.onerror = function handleError() {
      //网络错误处理
      // reject(new Error('Network Error'))
      reject(createError('Network Error', config, null, request))
    }
    request.ontimeout = function handleTimeout() {
      //请求超时错误处理
      reject(createError('Timeout of' + timeout + 'ms Error', config, null, request))
    }
    //不在200-300之间de 状态码，即不成功的状态码，我们默认也是错误的
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          reject(
            createError(`Request failed with status code${response.status}`, config, null, request)
          )
        )
      }
    }
  })
}
