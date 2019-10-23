# ts-axios
使用Typescript来实现axios（不含node端）
作者：Kangdi
https://github.com/nikangdi/ts-axios.git
使用 Typescript-library-starter快速搭建typescript环境


目录结构src下
    index.ts
    types/index.ts  公共的数据类型定义，包括请求和响应的interface
    xhr.ts //模块化分割请求逻辑
    helpers/辅助函数等
            headers.ts  对headers对象进行处理，处理请求头
            url.ts  拼接url，处理params等
            util.ts  
            data.ts   对提交的数据进行处理
    
    

