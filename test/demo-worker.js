const { createHandler, start } = require('../src/worker')

const test = createHandler('test', (name) => {
  return `hello ${name}`
})

const echo = createHandler('echo', (args) => {
  return args
})

const asyncJob = createHandler('async', () => {
  return 1
})

module.exports = function main() {
  const worker = start(__filename)
  return {
    test: test(worker),
    echo: echo(worker),
    async: asyncJob(worker),
    close: () => worker.terminate(),
  }
}
