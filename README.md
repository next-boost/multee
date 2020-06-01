[![CI](https://github.com/rjyo/multee/workflows/CI/badge.svg)](https://github.com/rjyo/multee/actions)

# multee

multee is a "battery" API. It turns node's multitasking modules, namingly `child_process` and `worker_threads`, into simple async functions.

## API

The worker is the wrapper for `worker_threads`.

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

Call the worker

```javascript
const worker = require('./worker.js')

const rv = await worker.test('Steve')
// rv = 'hello Steve'
```

There's also a wrapper for child_process, just change the line from

    const { createHandler, start } = require('multee/worker')

to

    const { createHandler, start } = require('multee/child')

## Out-of-the-box Typescript support

`multee` works with Typescript. As you can't directly start worker_threads from Typescript, `multee` includes the battery to handle that. When using Typescript, `ts-node` is needed as a peer dependency.
