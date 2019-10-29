import { AxiosRequestConfig } from '../types'
import { isPlainObject } from '../helpers/util'
import { deepMerge } from '../helpers/util'

//默认合并策略，从config2中有该值就直接使用config2中的配置
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
//另一种合并，不考虑val1中的值，比如url和data等，也就是defaultStart（）方法中三元表达式去掉val1
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
//复杂对象的合并
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2) //两个header深拷贝
  } else if (typeof val2 !== 'undefined') {
    //存在，但不是普通对象也不是undefiend
  }

  //接下来判断在val2是undefined基础上，
  //即config2中没给出header，也就是请求的config中没给出header
  else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}
//创建一个map来存储config中不同属性的处理函数
const strats = Object.create(null)

const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig) {
  //config1为默认defaults，config2为config
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    //对config2做遍历
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      config[key] = config1[key]
    }
  }
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    //取得对应key的处理方法
    //starts这个map中有该属性，就存有该属性的处理方法
    config[key] = strat(config1[key], config2![key]) //这里会报错，是应为config1中找不到key属性，
    //需在AxiosRequestConfig接口中加一个索引形式的声明
  }
  return config
}
