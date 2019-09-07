import { init, go, shutdown } from '../dist/src'
import { job, start, stop } from 'microjob'

beforeAll(async () => {
  init({ maxWorkerThreads: 2 })
  await start({ maxWorkers: 2 })
})

afterAll(async () => {
  await shutdown()
  await stop()
})

test('CPU intensive task using microjob', async () => {
  const promises: Promise<any>[] = []
  for (let i = 0; i < 100; i++) {
    promises.push(job(() => {
      let all = 0
      for (let i = 0; i < 10000; i++) {
        all += i
      }
      return all
    }))
  }
  await Promise.all(promises)
})

test('CPU intensive task using node-routine', async () => {
  const promises: Promise<any>[] = []
  for (let i = 0; i < 100; i++) {
    promises.push(go(() => {
      let all = 0
      for (let i = 0; i < 10000; i++) {
        all += i
      }
      return all
    }))
  }
  await Promise.all(promises)
})

test('IO intensive task using microjob', async () => {
  const promises: Promise<any>[] = []
  for (let i = 0; i < 32; i++) {
    promises.push(job(async () => {
      const request = require('request-promise')
      const resp = await request.get('https://httpbin.org/get')
      return JSON.parse(resp)
    }))
  }
  await Promise.all(promises)
})

test('IO intensive task using node-routine', async () => {
  const promises: Promise<any>[] = []
  for (let i = 0; i < 32; i++) {
    promises.push(go(async () => {
      const request = require('request-promise')
      const resp = await request.get('https://httpbin.org/get')
      return JSON.parse(resp)
    }))
  }
  await Promise.all(promises)
})
