# awesome-imperative-promise

[![NPM](https://img.shields.io/npm/dm/awesome-imperative-promise.svg)](https://www.npmjs.com/package/awesome-imperative-promise) 
[![Build Status](https://travis-ci.com/slorber/awesome-imperative-promise.svg?branch=master)](https://travis-ci.com/slorber/awesome-imperative-promise)


Offer an imperative API on top of promise, with cancellation support

## Install

```bash
npm install --save awesome-imperative-promise
// or
yarn add awesome-imperative-promise
```

## Features

- Imperative methods to trigger promise resolve/reject
- Imperative method to trigger promise cancellation (the promise will never resolve/reject)
- Can wrap an existing promise or simply create a new one
- Typescript native support

## Usage

```js

import { createImperativePromise } from "awesome-imperative-promise";

const wrappedPromise = fetch("url");

// Wrap an existing promise and expose some additional imperative methods
// The existingPromise paramter is optional and the returned promise with resolve/reject when the existing promise do
const { promise, resolve, reject, cancel } = createImperativePromise(wrappedPromise);

// will make the returned promise resolved (not the wrapped one)
resolve("some value");

// will make the returned promise reject (not the wrapped one)
reject(new Error(":s"));

// will ensure the returned promise never resolves or reject
cancel();
```

## Important note:

The returned promise can only resolve/reject/cancel once and will ignore further imperative calls like regular promises do.
If you call `cancel()` and then call `resolve("val")` (or if the wrapped promise resolves), the returned promise will never resolve because it has been cancelled first.

## Why

I find this useful to be able to cancel the resolution of promises, and use this lib as an implementation detail in other libs I build, like [awesome-debounce-promise](https://github.com/slorber/awesome-debounce-promise).

This is particularly useful in React apps where you want to ensure an async process is cancelled when component unmounts, to avoid triggering a setState and get a warning. See [isMounted() is an antipattern]
(https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html)

## License

MIT © [slorber](https://github.com/slorber)

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
