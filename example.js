const { worker, initWorker } = require('./lib')

initWorker()

async function main() {

  const num = await worker(() => {
    const count = 1000
    let total = 0
    for (let i = 0; i < count; ++i) {
      total += i
    }
    return total
  })

  console.log('num', num)
}

main()
