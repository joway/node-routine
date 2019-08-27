const { go, init, shutdown } = require('./dist/src')

// init a worker threads pool
init({
  maxWorkerThreads: 2,
})

async function calc() {
  // every routine will be executed in worker threads pool
  const num = await go(() => {
    const count = 10000
    let total = 0
    for (let i = 0; i < count; ++i) {
      total += i
    }
    return total
  })

  return num
}

async function main() {
  const workers = []
  for (let i = 0; i < 1000; i++) {
    workers.push(calc())
  }
  const items = await Promise.all(workers)
  console.log(items)
}

main().then(() => {
  console.log('Finished')
  shutdown()
})
