/// <reference types="node" />

import cp from 'child_process'

declare type Handler<T, R> = (args?: T) => R | Promise<R>

declare type Runner<T, R> = (sub: cp.ChildProcess) => Handler<T, R>

export declare const start: (filename: string) => cp.ChildProcess

export declare const createHandler: <T, R>(
  name: string,
  worker: Handler<T, R>
) => Runner<T, R>

export {}
