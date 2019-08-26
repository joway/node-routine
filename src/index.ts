import * as path from 'path'
import { EventEmitter } from 'events'
import { Worker } from 'worker_threads'
import * as crypto from 'crypto'

export interface WorkerPoolSetting {
  maxWorkerThreads?: number,
}

export interface WorkerState {
  worker: Worker,
  active: number,
  achieved: number,
}

const eventBus = new EventEmitter()
const workerPool: WorkerState[] = []
const workerPoolSetting: WorkerPoolSetting = {
  maxWorkerThreads: 4,
}

export function initWorkerPool(setting: WorkerPoolSetting = {}) {
  workerPoolSetting.maxWorkerThreads = setting.maxWorkerThreads || workerPoolSetting.maxWorkerThreads

  if (workerPoolSetting.maxWorkerThreads! <= 0) {
    throw new Error('maxWorkerThreads should not <= 0!')
  }

  for (let i = 0; i < workerPoolSetting.maxWorkerThreads!; i++) {
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

export async function routine(handler: Function) {
  const routineStr = `
async () => {
  return await (${handler.toString()})()
}
`
  const worker = selectWorker()
  const uid = randomStr()
  worker.active += 1
  worker.worker.postMessage({ handler: routineStr, uid })

  return new Promise((resolve, reject) => {
    eventBus.on(`uid-${uid}`, (resp) => {
      worker.active -= 1
      worker.achieved += 1

      if (resp.error) {
        reject(resp.error)
      } else {
        resolve(resp.data)
      }
    })
  })
}

function selectWorker() {
  workerPool.sort((a, b) => (a.active - b.active))
  return workerPool[0]
}

function randomStr(len: number = 12) {
  return crypto.randomBytes(len / 2).toString('hex')
}