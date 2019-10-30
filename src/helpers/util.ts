const toString = Object.prototype.toString
// export function isData(val:any):boolean{
//     // return Object.prototype.toString.call(val)==='[object Date]'
//     //进行优化，后面要不断用到Object.prototype.tostring.call()
//     return toString.call(val)==='[object Date]'
// }
// export function isObject(val:any):boolean{
//     return val !==null && typeof val ==='object'
// }

/*
    问题  若这样声明函数，调用时会认为所传参数是一个any类型，不能直接向对象那样调用方法
    解决  使用类型保护，此时如下isdata为true的val就可以进行调用Date中的方法
*/
export function isDate(val: any): val is Date {
  // return Object.prototype.toString.call(val)==='[object Date]'
  //进行优化，后面要不断用到Object.prototype.tostring.call()
  return toString.call(val) === '[object Date]'
}
// export function isObject(val:any):val is Object{
//     return val !==null && typeof val ==='object'

// }
export function isPlainObject(val: any): val is Object {
  //普通对象的判断方法
  return toString.call(val) === '[object Object]'
  //在，params及data的处理中，只对普通对象进行手动处理，formdata等对象自身可以被直接发送，不许被处理

  //这样只会通过普通的对象，像URLSearchParams这些就不包含在其中
  //比如formData 返回的是一个[object FormData]
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
