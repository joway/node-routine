const { go, init, shutdown } = require('./dist/src')

// init a worker threads pool
init({
  maxWorkerThreads: 2,
})

async function calc() {
  // every routine will be executed in worker threads pool
  const count = 10000
  const num = await go(() => {
    let total = 0
    for (let i = 0; i < count; ++i) {
      total += i
    }
    return total
  }, { count })

  return num
}

calc().then((total) => {
  console.log('Got', total)
  shutdown()
})
