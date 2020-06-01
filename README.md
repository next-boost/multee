[![CI](https://github.com/rjyo/multee/workflows/CI/badge.svg)](https://github.com/rjyo/multee/actions)

# multee

multee is a "battery" API. It turns node's multitasking modules, namingly `child_process` and `worker_threads`, into simple async functions.

## Why multee helps

Without `multee`, you need to listen to messages from your threads/processes, and it is hard to integrate the listener to other part of your code. Also, when there are multiple operations inside the worker, we have to implement the dispatching logic inside the message listener.

The code will look like below without `multee`

```javascript
process.on('message', (msg) => {
  if (msg.type === 'result_job_a') {
    partA2(msg.data)
  } else if (msg.type === 'result_job_b') {
    partB2(msg.data)
  }
})

const child = fork('./worker')

function partA1() {
  child.send(args_for_job_a)
}

function partA2(result) {
  // do the rest with result
}
```

And with `multee`, it's just as easy as calling an async function.

```javascript
async function partA() {
  const worker = require('./worker')
  const result = await worker.jobA()
  // do the rest with result
}
```

## API

`multee/worker` is a wrapper for `worker_threads`.

```javascript
// in worker.js
const { createHandler, start } = require('multee/worker')

const test = createHandler('test', (name) => {
  // do some CPU heavy tasks here
  return `hello ${name}`
})

module.exports = function main() {
  const worker = start(__filename)
  return {
    test: test(worker),
  }
}
```

at where the worker is called

```javascript
const worker = require('./worker.js')

const rv = await worker.test('Steve')
// rv = 'hello Steve'
```

`multee/child` is the wrapper for `child_process`, just change the line from

    const { createHandler, start } = require('multee/worker')

to

    const { createHandler, start } = require('multee/child')

## Out-of-the-box Typescript support

`multee` works with Typescript. As you can't directly start worker_threads from Typescript, `multee` includes the battery to handle that. note: `ts-node` needed as a peer dependency when using Typescript.


## License

MIT