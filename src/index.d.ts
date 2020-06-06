/// <reference types="node" />

declare type SubWorker = {
  send: (payload: any) => void
  terminate: () => void
}

declare type Handler<T, R> = (args?: T) => R | Promise<R>

declare type Runner<T, R> = (sub: SubWorker) => Handler<T, R>

declare function Multee(
  type: 'worker' | 'child'
): {
  start: (filename: string) => SubWorker
  createHandler: <T, R>(name: string, worker: Handler<T, R>) => Runner<T, R>
}

export = Multee
