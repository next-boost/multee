const { createHandler, start } = require('../src/child')

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
  const child = start(__filename)
  return {
    test: test(child),
    echo: echo(child),
    async: asyncJob(child),
    close: () => child.kill(),
  }
}
