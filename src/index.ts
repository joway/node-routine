import * as path from 'path'
import { EventEmitter } from 'events'
import { Worker } from 'worker_threads'
import * as crypto from 'crypto'

export interface WorkerPoolSetting {
  maxWorkerThreads?: number,
}

export interface WorkerState {
  id: number,
  instance: Worker,
  active: number,
  achieved: number,
}

const eventBus = new EventEmitter()
const workerPool: WorkerState[] = []
const workerPoolSetting: WorkerPoolSetting = {
  maxWorkerThreads: 4,
}

export function init(setting: WorkerPoolSetting = {}) {
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
      id: i,
      instance: w,
      active: 0,
      achieved: 0,
    })
  }
}

export async function go(handler: Function, context: Object = {}) {
  let definition = ''
  for (const key in context) {
    if (!context.hasOwnProperty(key)) continue

    definition += `const ${key} = ${JSON.stringify(context[key])};\n`
  }
  const routineStr = `
async () => {
  ${definition}
  return await (${handler.toString()})()
}
`
  const worker = selectWorker()
  const uid = genUid()
  worker.active += 1
  worker.instance.postMessage({
    uid,
    workerId: worker.id,
    handler: routineStr,
  })

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

export async function shutdown() {
  for (const { instance } of workerPool) {
    await instance.terminate()
  }
}

function selectWorker() {
  workerPool.sort((a, b) => (a.active - b.active))
  return workerPool[0]
}

function genUid() {
  return crypto.randomBytes(12).toString('hex')
}
