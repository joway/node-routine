import { init, go, shutdown } from '../dist/src'


beforeAll(() => {
  init({ maxWorkerThreads: 2 })
})

afterAll(async () => {
  await shutdown()
})

test('sync', async () => {
  for (let i = 0; i < 100; i++) {
    const total = await go(() => {
      let all = 0
      for (let i = 0; i < 10000; i++) {
        all += i
      }
      return all
    })
    expect(total).toBe(49995000)
  }
})

test('async', async () => {
  const data: any = await go(async () => {
    const request = require('request-promise')
    const resp = await request.get('https://httpbin.org/get')
    return JSON.parse(resp)
  })
  expect(data.url).toBe('https://httpbin.org/get')
})

test('with context.int', async () => {
  const int = 1000
  const got = await go(() => {
    return int
  }, { int })
  expect(got).toBe(int)
})

test('with context.str', async () => {
  const str = 'hello'
  const got = await go(() => {
    return str
  }, { str })
  expect(got).toBe(str)
})

test('with context.obj', async () => {
  const obj = { int: 1, str: 'hi', obj: { int: 1 } }
  const got = await go(() => {
    return obj
  }, { obj })
  expect(got).toEqual(obj)
})
