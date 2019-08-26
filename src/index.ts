import * as path from 'path'
import { EventEmitter } from 'events'
import { Worker } from 'worker_threads'

export interface WorkerSetting {
  MaxThreads?: number,
}

export interface WorkerState {
  worker: Worker,
  active: number,
  achieved: number,
}

const eventBus = new EventEmitter()
const workerSetting: WorkerSetting = {
  MaxThreads: 4,
}
const workerPool: WorkerState[] = []

export function initWorker(setting: WorkerSetting = {}) {
  workerSetting.MaxThreads = setting.MaxThreads || workerSetting.MaxThreads

  for (let i = 0; i < workerSetting.MaxThreads!; i++) {
    const w = new Worker(path.resolve(__dirname, './worker.js'))
    w.on('message', (response) => {
      const { uid } = response
      eventBus.emit(`uid-${uid}`, response)
    })

    workerPool.push({
      worker: w,
      active: 0,
      achieved: 0,
    })
  }
}

export async function worker(handler: Function) {
  const workerStr = `
async () => {
  return await (${handler.toString()})()
}
`
  const thread = selectWorker()
  const uid = randomStr()
  thread.worker.postMessage({ handler: workerStr, uid })

  return new Promise((resolve, reject) => {
    eventBus.on(`uid-${uid}`, (resp) => {
      if (resp.error) {
        reject(resp.error)
      } else {
        resolve(resp.data)
      }
    })
  })
}

function selectWorker() {
  return workerPool[0]
}

function randomStr() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
