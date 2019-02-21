import { createImperativePromise } from "./index";

type promiseState = "pending" | "resolved" | "rejected";

const getPromiseState = async (promise: Promise<any>): promiseState => {
  const SecondResult = {};
  const secondPromise = new Promise<any>(resolve => resolve(SecondResult));

  let promiseState;
  try {
    const result = await Promise.race<any,any>([promise, secondPromise]);
    const isPending = result === SecondResult;
    promiseState = isPending ? "pending" : "resolved";
  } catch (e) {
    promiseState = "rejected";
  }
  // console.debug("promiseState", promiseState);
  return promiseState;
};

// Hacky way to know if a promise is resolved or not
const isPromiseResolved = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === "resolved";
};

const isPromiseRejected = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === "rejected";
};

const isPromisePending = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === "pending";
};

const expectPromiseResolved = async (promise: Promise<any>): boolean => {
  if (!(await isPromiseResolved(promise))) {
    throw new Error("Promise is expected to be resolved");
  }
};

const expectPromiseRejected = async (promise: Promise<any>): boolean => {
  if (!(await isPromiseRejected(promise))) {
    throw new Error("Promise is expected to be rejected");
  }
};

const expectPromisePending = async (promise: Promise<any>): boolean => {
  if (!(await isPromisePending(promise))) {
    throw new Error(
      "Promise is expected to be pending but is " +
        ((await isPromiseResolved(promise)) ? "resolved" : "rejected")
    );
  }
};

const delayPromise = (timeout: number) =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

const VALUE = { key: "val" };
const ERROR = new Error(":'(");

test("wrapped promise can resolve normally", async () => {
  // Given
  const initialPromise = new Promise(resolve => {
    setTimeout(() => resolve(VALUE), 100);
  });
  // When
  const { promise } = createImperativePromise(initialPromise);
  // Then
  await expectPromisePending(promise);
  await delayPromise(100);
  await expectPromiseResolved(promise);
  await expect(promise).resolves.toBe(VALUE);
});

test("wrapped promise can reject normally", async () => {
  // Given
  const initialPromise = new Promise((_resolve, reject) => {
    setTimeout(() => reject(ERROR), 100);
  }); // When
  const { promise } = createImperativePromise(initialPromise);
  // Then
  await expectPromisePending(promise);
  await delayPromise(100);
  await expectPromiseRejected(promise);
  await expect(promise).rejects.toThrow(ERROR);
});

test("wrapped promise cant resolve normally after cancel", async () => {
  // Given
  const initialPromise = new Promise(resolve => {
    setTimeout(() => resolve(VALUE), 100);
  });
  // When
  const { promise, cancel } = createImperativePromise(initialPromise);
  cancel();
  // Then
  await expectPromisePending(promise);
  await delayPromise(100);
  await expectPromisePending(promise);
});

test("wrapped promise cant reject normally after cancel", async () => {
  // Given
  const initialPromise = new Promise((_resolve, reject) => {
    setTimeout(() => reject(ERROR), 100);
  });
  // When
  const { promise, cancel } = createImperativePromise(initialPromise);
  cancel();
  // Then
  await expectPromisePending(promise);
  await delayPromise(100);
  await expectPromisePending(promise);
});

test("promise can resolve imperatively", async () => {
  // Given
  const { promise, resolve } = createImperativePromise();
  // When
  resolve(VALUE);
  // Then
  await expectPromiseResolved(promise);
  await expect(promise).resolves.toBe(VALUE);
});

test("promise can reject imperatively", async () => {
  // Given
  const { promise, reject } = createImperativePromise();
  // When
  reject(ERROR);
  // Then
  await expectPromiseRejected(promise);
  await expect(promise).rejects.toThrow(ERROR);
});

test("promise does not resolve imperatively after cancel", async () => {
  // Given
  const { promise, resolve, cancel } = createImperativePromise();
  // When
  cancel();
  resolve(VALUE);
  // Then
  await expectPromisePending(promise);
});

test("promise does not reject imperatively after cancel", async () => {
  // Given
  const { promise, reject, cancel } = createImperativePromise();
  // When
  cancel();
  reject(ERROR);
  // Then
  await expectPromisePending(promise);
});
