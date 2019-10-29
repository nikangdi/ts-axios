import { transformRequest } from '../helpers/data'
import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    //若不是数组类型的话直接放到数组中
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
    //这样每次的data会作为 下一次的data传入
    //    fn中会处理headers以及data
  })
}
