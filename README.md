[![CI](https://github.com/rjyo/multee/workflows/CI/badge.svg)](https://github.com/rjyo/multee/actions) [![Maintainability](https://api.codeclimate.com/v1/badges/a30197a15f88eb66c546/maintainability)](https://codeclimate.com/github/rjyo/multee/maintainability)

# multee

multee is a "battery" API. It turns node's multitasking modules, namingly `child_process` and `worker_threads`, into simple async functions.

## Why multee helps

Without `multee`, you need to listen to messages from your threads/processes, and it is hard to integrate the listener to other part of your code. Also, when there are multiple operations inside the worker, we have to implement the dispatching logic inside the message listener.

The code will look like below without `multee`

```javascript
// worker.js
process.on('message', (msg) => {
  // do heavy load job
  let result = 0
  for (let i = 0; i < 100000000; i++) {
    result += heavy_and_return_same(i)
  }
  process.send(result)
})

// master.js
const child = fork('./worker')

process.on('message', (msg) => {
  // if is job result
  part2(msg)
})

function part1() {
  child.send(payload_for_worker)
}

function part2(result) {
  // do the rest with result
}
```

And with `multee`, it's just as easy as calling an async function.

```javascript
// worker.js
const Multee = require('multee')
const multee = Multee('worker') // 'worker' for worker_threads | 'child' for child_process

const jobA = multee.createHandler('jobA', () => {
  // do the heavy load here
  console.log('jobA')
  return 'jobA'
});

module.exports = {
  start: () => {
    const worker = multee.start(__filename)
    return {
      test: jobA(worker),
      worker: worker
    }
  }
}

// master.js
async function partA() {
  const worker = require('./worker')
  const test = worker.start()
  const result = await worker.test()
  // do the rest with result
  console.log(result)
  // { result: 'jobA' }
  test.worker.terminate()
}
```

## Out-of-the-box Typescript support

`multee` works with Typescript. As you can't directly start worker_threads from Typescript, `multee` includes the battery to handle that. note: `ts-node` needed as a peer dependency when using Typescript.


## License

MIT
