import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/data'

function createInstance(): AxiosInstance {
  const context = new Axios() //只是在其中存放着那些属性方法进行调用
  const instance = Axios.prototype.request.bind(context) //class中定义的方法都是在原型上的
  extend(instance, context)
  //返回的方法就是一个对象，
  //本身可以传参直接请求axios（）
  //也可以通过其属性方法进行传参请求axios.get()
  return instance as AxiosInstance
}
const axios = createInstance()
//其实就相当于在原来的那个axios函数上添加一些方法属性，调用的处理完参数之后还是axios方法进行请求
//ts无非用了面向对象的编程思路

export default axios
