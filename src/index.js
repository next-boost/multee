const cp = require('child_process')
const wt = require('worker_threads')
const { v4: uuidv4 } = require('uuid')

const handlers = {}
const waitingForResolve = {}

function buildWorker(filename) {
  let worker
  if (filename.endsWith('.ts')) {
    worker = new wt.Worker(require.resolve('./ts-wrap.js'), {
      workerData: filename,
    })
  } else {
    worker = new wt.Worker(filename)
  }
  worker.send = worker.postMessage

  return worker
}

function fork(modulePath) {
  const isTS = modulePath.endsWith('.ts')
  const options = isTS ? { execArgv: ['-r', 'ts-node/register'] } : null
  const sub = cp.fork(modulePath, [], options)
  sub.terminate = sub.kill
  return sub
}

const start = (buildSub) => (script) => {
  const sub = buildSub(script)
  sub.on('message', (payload) => {
    const cb = waitingForResolve[payload.uuid]
    delete waitingForResolve[payload.uuid]
    cb(payload.result)
  })
  return sub
}

const createHandler = (name, handler) => {
  const caller = (sub) => (args) => {
    const uuid = uuidv4()
    sub.send({ name, uuid, args })
    return new Promise((r) => (waitingForResolve[uuid] = r))
  }
  handlers[name] = handler
  return caller
}

const listen = (isSub, bridge) => {
  if (!isSub) return
  bridge.on('message', async (payload) => {
    const worker = handlers[payload.name]
    const rv = await worker(payload.args)
    bridge.send({
      uuid: payload.uuid,
      result: rv,
    })
  })
}

module.exports = (type) => {
  let isSub, buildSub, bridge
  if (type === 'worker') {
    isSub = !wt.isMainThread
    buildSub = buildWorker
    bridge = wt.parentPort
    if (bridge) bridge.send = bridge.postMessage
  } else if (type === 'child') {
    isSub = process.send !== undefined
    buildSub = fork
    bridge = process
  }

  listen(isSub, bridge)
  return { start: start(buildSub), createHandler }
}
