import axios from './axios'
export * from './types' //将types中定义的接口全部导出去，给外部的应用使用这些类型
export default axios

//原本那种直接导出的方式不可以在一个地址外部应用引入，需要找到内部具体文件在进行导入
//这种方式更方便，一次性导出
