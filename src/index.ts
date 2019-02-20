export type ResolveCallback<T> = (value: T | PromiseLike<T>) => void
export type RejectCallback = (reason?: any) => void
export type CancelCallback = () => void

export type ImperativePromise<T> = {
  promise: Promise<T>
  resolve: ResolveCallback<T>
  reject: RejectCallback
  cancel: CancelCallback
}

export function createImperativePromise<T>(promiseArg?: Promise<T> | null | undefined): ImperativePromise<T> {
  let resolve: ResolveCallback<T> | null = null
  let reject: RejectCallback | null = null

  const wrappedPromise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  promiseArg && promiseArg.then(
    val => {
      resolve && resolve(val)
    },
    error => {
      reject && reject(error)
    }
  )

  return {
    promise: wrappedPromise,
    resolve: (value: T | PromiseLike<T>) => {
      resolve && resolve(value)
    },
    reject: (reason?: any) => {
      reject && reject(reason)
    },
    cancel: () => {
      resolve = null
      reject = null
    }
  }
}


