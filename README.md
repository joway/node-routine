# node-routine

node-routine is a library to implement [Goroutine-Like API](https://gobyexample.com/goroutines) with [worker_threads](https://nodejs.org/api/worker_threads.html).

## Requirement

- Nodejs >= 11.7 or using `--experimental-worker` flag

## Quick Example

```javascript
const { routine, initWorkerPool } = require('./lib')

// init a worker threads pool
initWorkerPool({
  maxWorkerThreads: 2,
})

async function calc() {
  // every routine will be executed in worker threads pool
  const num = await routine(() => {
    const count = 10000
    let total = 0
    for (let i = 0; i < count; ++i) {
      total += i
    }
    return total
  })

  return num
}

calc()
```



