import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  deepMerge
} from '../../src/helpers/util'

describe('helpers:util', () => {
  //内部可以多个describe
  describe('isXX', () => {
    //一个discribe下面可以有多个test测试
    test('should validate Date', () => {
      //expect()断言
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })
    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })
    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })
  describe('deepMerge', () => {
    test('should be immutable', () => {
      //首先测试deepmerge不改变参数对象
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })
    test('should deepMerge properties', () => {
      //拷贝普通属性,并测试覆盖普通属性
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)
      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })
    test('should deepMetge recursively', function() {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })
    //对比toBe()和toEqual()
    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123
        }
      })
      //toBe()对比两个对象是不同的，但toEqual()对比的方式类似immutable
      expect(c.foo).not.toBe(a.foo)
    })
    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    })
  })
})

//测试 若对应的文件中export导出的方法都通过实例测试，才会达到四个100%
