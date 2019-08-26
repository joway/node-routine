# worker.js

## Example

```js
const { worker, initWorker } = require('worker.js')

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
```
