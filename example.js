const { worker, initWorker } = require('./lib')

initWorker({
  maxThreads: 2,
})

async function calc() {
  const num = await worker(() => {
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
  process.exit(0)
})
