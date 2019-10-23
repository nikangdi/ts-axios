import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeader } from './helpers/headers'
import { transformResponse } from './helpers/data'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  //自定义的返回数据类型，一个promise类型的

  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()

    //给请求ajax请求对象配置responseType类型
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method.toUpperCase(), url, true)

    //对headers中的每一项进行请求头设置
    Object.keys(headers).forEach(item => {
      if (data === null && headers[item].toLowerCase() === 'CONTENT-TYPE') {
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
      return resolve(response)
    }
  })
}
