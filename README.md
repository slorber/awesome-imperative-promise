# awesome-imperative-promise

> Offer an imperative API on top of promise, with cancellation support

[![NPM](https://img.shields.io/npm/v/awesome-imperative-promise.svg)](https://www.npmjs.com/package/awesome-imperative-promise) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Build Status](https://travis-ci.com/slorber/awesome-imperative-promise.svg?branch=master)](https://travis-ci.com/slorber/awesome-imperative-promise)

## Install

```bash
npm install --save awesome-imperative-promise
```

## Usage

```js

import { createImperativePromise } from "./index";

const wrappedPromise = fetch("url");

// Wrap an existing promise and expose some additional imperative methods
// The existingPromise paramter is optional and the returned promise with resolve/reject when the existing promise do
const { promise, resolve, reject, cancel } = () => createImperativePromise(wrappedPromise);

// will make the returned promise resolved (not the wrapped one)
resolve("some value");

// will make the returned promise reject (not the wrapped one)
reject(new Error(":s"));

// will ensure the returned promise never resolves or reject
cancel();
```

### Important note:

The returned promise can only resolve/reject/cancel once and will ignore further imperative calls like regular promises do.
If you call `cancel()` and then call `resolve("val")` (or if the wrapped promise resolves), the returned promise will never resolve because it has been cancelled first.


## License

MIT © [slorber](https://github.com/slorber)
