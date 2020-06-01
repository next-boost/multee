const { createHandler, start } = require('../src/worker')

const test = createHandler('test', (name) => {
  return `hello ${name}`
})

const echo = createHandler('test', (args) => {
  return args
})

module.exports = function main() {
  const worker = start(__filename)
  return {
    test: test(worker),
    echo: echo(worker),
    close: () => worker.terminate(),
  }
}
