const cp = require('child_process')
const { v4: uuid_v4 } = require('uuid')

function fork(modulePath) {
  const isTS = modulePath.endsWith('.ts')
  const options = isTS ? { execArgv: ['-r', 'ts-node/register'] } : null
  return cp.fork(modulePath, [], options)
}

const workers = {}
const waitingForResolve = {}

if (process.send !== undefined) {
  process.on('message', async (payload) => {
    const worker = workers[payload.name]
    const rv = await worker(payload.args)
    process.send({
      uuid: payload.uuid,
      result: rv,
    })
  })
}

exports.start = (filename) => {
  const sub = fork(filename)
  sub.on('message', (payload) => {
    const cb = waitingForResolve[payload.uuid]
    cb(payload.result)
  })
  return sub
}

exports.createHandler = (name, worker) => {
  const caller = (sub) => (args) => {
    const uuid = uuid_v4()
    sub.send({ name, uuid, args })
    return new Promise((r) => (waitingForResolve[uuid] = r))
  }
  workers[name] = worker
  return caller
}
