import { init, go, shutdown } from '../dist/src'

beforeAll(async () => {
  init({ maxWorkerThreads: 4 })
})

afterAll(async () => {
  await shutdown()
})

function workload(data: any) {
  console.log(data)
}

test('Real world workload with node-routine', async () => {
  const promises: Promise<any>[] = []
  const data = require('./search.json')
  for (let i = 0; i < 1000; i++) {
    promises.push(go(() => {
      data.hits.map(item => {
        for (let i = 0; i < 1000; ++i) {
          item.points += 1
        }
      })
    }, { data }))
  }
  await Promise.all(promises)
})

test('Real world workload without node-routine', async () => {
  const data = require('./search.json')
  for (let i = 0; i < 1000; i++) {
    data.hits.map(item => {
      for (let i = 0; i < 1000; ++i) {
        item.points += 1
      }
    })
  }
})
