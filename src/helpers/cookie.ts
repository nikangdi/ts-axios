const cookie = {
  read(name: string): string | null {
    //从cookie中取出对应name的值
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    //开头或者分号为起始，
    //0个或多个空格
    //name
    //非分号结尾
    //最终匹配获得match[1]match[2]match[3]
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
