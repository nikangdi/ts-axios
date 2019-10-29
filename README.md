# ts-axios
使用Typescript来实现axios（不含node端）
作者：Kangdi
https://github.com/nikangdi/ts-axios.git
使用 Typescript-library-starter快速搭建typescript环境


目录结构src下
    index.ts //向外同时向外抛出axios及types
    axios.ts//生成axios
    types/index.ts  公共的数据类型定义，包括请求和响应的interface
    helpers/辅助函数等
            headers.ts  对headers对象进行处理，处理请求头
            url.ts  拼接url，处理params等
            util.ts  
            data.ts   对提交的数据进行处理
            error.ts   error类及实例化工厂函数
    types// 供外部应用使用的接口
    core
        Axios.ts //Axios类
        dispatchRequest.ts//对config进行处理
        interceptormanager.ts//拦截器类，主要根据传入的参数生成interceptor
        xhr.ts //模块化分割处理请求逻辑

    
    






function resolveURL(url:string):URLOrigin{
  //********************************* */
  //利用a节点来解析url地址
  urlParseingNode.setAttribute('href',url)
  const {protocol,host} = urlParseingNode
  return{
    protocol,
    host
  }
}

//第三方nprogress进度条效果

