import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })
  test('should return null if cooie name is not exist', () => {
    //cookie 字符串中不存在的 变量
    document.cookie = 'foo=baz'
    expect(cookie.read('bar')).toBeNull()
    //从cookie中取值，娶不到返回null
  })
})
