---
title: 'Promises and async/await'
date: '2022-08-08'
tags: ['frontend', 'js']
images: []
summary: 'The Promise, a fundamental tool in the asynchronous language that is javascript.'
authors: ['ralph-leermakers']
theme: 'orange'
canonicalUrl: 'https://www.iodigital.com/en/history/isaac/promises-and-async-await'
---

# Promises and async/await

Javascript is widely known for it's asynchronous nature, meaning we differentiate between blocking code and non-blocking code. Promises exist to help you deal with non-blocking code in an effective way, on this page I will try to explain what they are and how to work with them. At the end of this post I'll show some common promise problems and how to overcome them. Throughout this blogpost I'm assuming you're familiar with [general asynchronous programming concepts](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Concepts 'general asynchronous programming concepts').

## What are promises

A promise represents the eventual result of an asynchronous operation, so it basically provides a way to continue after an asynchronous operation.

Since the operation can obviously also fail a promise has 3 internal states.

- pending: The promise is in it's initial state, it has not completed it's operation nor has it failed.
- fulfilled: The operation has completed successfully.
- rejected: The operation has failed.

In the browser API's promises are also used, for example fetch returns a promise to return the result of a network request. When you start the request the promise is in it's pending state. When the resource has returned successfully the promise changes to the fulfilled state, When it fails, for example when the server cannot be reached, the state becomes rejected.

## How do they work

Besides using an API that returns a promise, there are several ways to create a promise, this is the most basic one:

```javascript
const myPromise = new Promise((resolve, reject) => {
  doAsynchronousThings(() => {
    if (allIsGood) {
      resolve('my data')
    } else {
      reject(new Error('things failed'))
    }
  })
})
```

The `new Promise` call accepts a function which received 2 functions as arguments, the first resolves the promise and the second rejects it. A promise's strength is it's chainability, to continue when the promise is done (resolved or rejected) you can chain it with `then(fulfilledFn, rejectedFn)`, `catch(rejectedFn)` or `finally(fn)`, any of these returns a new promise which can be chained again.

### then(fulfilledFn, rejectedFn)

Most of the time you will use then without the second argument but you can use it with either or both. You can use then to continue a promise chain when the previous promise has fulfilled.

```javascript
myPromise.then((data) => {
  return doSomething(data)
})
```

The next part in the chain will receive whatever you return from this function.

### catch(rejectedFn)

Used for when the promise has rejected, it is exactly the same as `then(undefined, rejectedFn)`. When a promise is rejected it will find the next part in the chain that can handle the error, the rest is skipped. A `catch` handles the error so the chain can continue normally (unless you throw an error in the catch itself).

```javascript
new Promise((resolve, reject) => reject())
  .then(() => {
    // skipped
  })
  .catch((err) => {
    // handling error
  })
  .then(() => {
    // executed
  })
```

### finally(fn)

The finally call can be placed in the chain and will always run, it is however very different from the other two. The function you pass to finally receives no arguments and it's return value is also not used. you can see the finally call as something that is in between the chain but does not alter it in any way with one exception, if you throw an error in it.

## Promise chain

The promise flow basically works like the chart below.

![Schema of the promise flow](/articles/promises-and-async-await/promise-flow.png)

_[Image by MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)_

It can sometimes be difficult how one progresses through a promise chain if you do not completely understand it so let's play around with the different things that can happen.

Try to figure out what will be logged in the console for the following examples before checking in the console.

### Example 1 (Resolve)

[Test it out](https://jsfiddle.net/68mqkdje/ 'Resolve')

```javascript
new Promise((resolve, reject) => {
  resolve(3)
})
  .finally(() => {
    console.log('finally')
  })
  .then((result) => {
    console.log('then', result)
  })
  .catch((err) => {
    console.log('catch', err)
  })
```

### Example 2 (Reject)

[Test it out](https://jsfiddle.net/68mqkdje/1/ 'Reject')

```javascript
new Promise((resolve, reject) => {
  reject(new Error(3))
})
  .finally(() => {
    console.log('finally')
  })
  .then((result) => {
    console.log('then', result)
  })
  .catch((err) => {
    console.log('catch', err)
  })
```

### Example 3 (Error)

[Test it out](https://jsfiddle.net/68mqkdje/2/ 'Error')

```javascript
new Promise((resolve, reject) => {
  throw new Error(3)
})
  .finally(() => {
    console.log('finally')
  })
  .then((result) => {
    console.log('then', result)
  })
  .catch((err) => {
    console.log('catch', err)
  })
```

### Example 4 (setTimeout #1)

[Test it out](https://jsfiddle.net/68mqkdje/3/ 'setTimeout #1')

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(3)
  }, 1000)
})
  .finally(() => {
    console.log('finally')
  })
  .then((result) => {
    console.log('then', result)
  })
  .catch((err) => {
    console.log('catch', err)
  })
```

### Example 5 (setTimeout #1)

[Test it out](https://jsfiddle.net/68mqkdje/4/ 'setTimeout #2')

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    throw new Error(3)
  }, 1000)
})
  .finally(() => {
    console.log('finally')
  })
  .then((result) => {
    console.log('then', result)
  })
  .catch((err) => {
    console.log('catch', err)
  })
```

## Helper methods

There are several static helper methods on the Promise object.

### Promise.resolve(data)

This is a shorthand for the following.

```javascript
new Promise((resolve) => resolve(data))
```

### Promise.reject(data)

Basically the same as the previous one but with a rejected promise.

```javascript
new Promise((resolve, reject) => reject(data))
```

### Promise.all(iterable)

This will create a promise that will resolve if all the promises that are passed are resolved. You can pass promises or any other data, data not wrapped in a promise will act like an immediately resolved promise.

When the promise.all resolves because all of it's arguments have resolved it will pass the data as an array to the next chain part.

```javascript
Promise.all([Promise.resolve(1), 2, Promise.resolve(3)]).then((data) => {
  console.log(data) // [1, 2, 3]
})
```

If one of the passed promises rejects the promise.all is immediately rejected with the corresponding error, the result of the other promises are ignored.

```javascript
Promise.all([Promise.resolve(1), 2, Promise.reject(3)]).catch((err) => {
  console.log(err) // 3
})
```

### Promise.race(iterable)

This will create a promise that will resolve or reject with the first promise that does. If already resolved/rejected promises or data are passed it will settle with the first value that does.

## Unwrapping

When a promise returns data, that data will never be a promise itself. if the data returned from a promise would also be a promise then it will wait for that promise as well.

```javascript
new Promise(resolve => {
  resolve(new Promise(innerResolve => innerResolve(3))
}).then(data => {
  console.log(data) // 3, not a promise wrapping the value 3
})
```

## Promise syntax can be problematic

When doing certain things with promises you find they can be annoying to deal with, for example when you need variables from previous promises.

```javascript
promise1().then((value1) => {
  // do something
  return promise2(value1).then((value2) => {
    // do something
    return promise3(value1, value2)
  })
})
```

Normally we would like promise3 to be executed in a toplevel .then, in this case that would not be easily doable because to execute promise3, we need value1 and value2 which are both gotten from promises. The problem is that you can only return a single value in a promise, you could fix this using a Promise.all but the readability would suffer just as it does right now.

Promises can also be difficult to deal with when the flow of the promise chain you are trying to create can go a different way depending on the returned data. To create an if/else structure you will need to create nested promises, this can get out of hand rather quickly.

```javascript
promise1()
  .then((value1) => {
    if (value1 === 3) {
      return value1
    } else if (value1 > 3) {
      return promise2(value1).then((value2) => {
        if (value2 === value1) {
          return promise3(value2)
            .then((value3) => transform(value3))
            .catch(() => true)
            .finally(() => console.log('did a thing'))
        } else {
          return true
        }
      })
    }

    return promise4(value1).then((value4) => {
      return promise3(value1, value4)
    })
  })
  .catch((err) => {
    console.error(err)
  })
```

## async/await

To resolve the previous problems a new feature was added in the spec of ES2017, async/await. This is merely syntax sugar for things we already did with promises but it can add a lot to readability and brevity. The basic concept is to make asynchronous promise code read like synchronous code. Two keywords are added to make this possible, async and await.

```javascript
async function init() {
  await new Promise(resolve(1))
  await new Promise(resolve(2))
}
init()
```

### async

This is a keyword you place before a function you are creating, it will make the function return a promise. The value returned from your function will be the resolved value. You can throw an error in the normal way to reject the promise.

### await

This keyword you can only use in an async function, you can place it before a promise or data to wait for that statement before moving to the next part/line. As this is waiting on a statement instead of a function you can see that it will read more like synchronous code, just remember that it's actually not.

Since a promise unwraps its return value until it's not a promise and async makes the function return a promise, it does not make sense to await your return value, so don't use `return await myPromise`, just return it.

## Fixing promise problems with async/await

If you rewrite the problem where you need variables from previous promises with async/await, you would get somethig like this:

```javascript
;async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```

You can do the same with the other problem where readability was suffering because of nested promises.

```javascript
;async () => {
  try {
    const value1 = await promise1()
    if (value1 === 3) {
      return value1
    } else if (value1 > 3) {
      const value2 = await promise2(value1)
      if (value2 === value1) {
        try {
          const value3 = await promise3(value2)
          return transform(value3)
        } catch (err) {
          return true
        } finally {
          console.log('did a thing')
        }
      } else {
        return true
      }
    }

    const value4 = await promise4(value1)
    return promise3(value1, value4)
  } catch (err) {
    console.error(err)
  }
}
```

This reads a lot easier since it looks more like synchronous code.

## Common promise problems and tips & tricks

### Call stack problem

Take the following example:

```javascript
;async () => {
  setTimeout(() => {
    throw new Error('bla')
  }, 1000)
}
```

At first glance you might say that this would result in a rejected promise since the function in setTimeout is in a different call stack. That is not the case. The promise is resolved before the timeout is done and the error thrown will eventually be unhandled. To learn more about call stacks and why asynchronous code has a new call stack, I recommend watching this. In this case it would be more suited to use a normal promise because you can determine when the promise is done using the resolve and reject callbacks.

```javascript
;() =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('bla'))
    }, 1000)
  })
```

### Slow awaits

So you have this code:

```javascript
;async () => {
  const a = await promise1()
  const b = await promise2()
  const c = await promise3()
  const d = await promise4()
  return a + b + c + d
}
```

These promises that you are awaiting here have no reason to be waiting for each other and should run in parallel without a problem. To fix this you can wrap the promises in a Promise.all and await the result from that.

```javascript
;async () => {
  const [a, b, c, d] = await Promise.all([promise1(), promise2(), promise3(), promise4()])
  return a + b + c + d
}
```

### Mixing promises with async/await

You can mix promises with async/await without a problem and this can lead to some interesting solutions. One example of this would be to make the execution function of a new Promise call async, that way you can write the code inside with awaits for readability and you can use the resolve/reject callbacks for more control.

```javascript
new Promise(async (resolve) => {
  await doStuff()
  await doOtherStuff()
  setTimeout(() => {
    resolve()
  }, 1000)
})
```
