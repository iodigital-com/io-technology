---
title: 'Benefits of functional programming'
date: '2022-12-27'
tags: ['frontend', 'functional programming', 'javascript']
images: ['/articles/benefits-of-functional-programming/pexels-pixabay-270557.jpg']
summary: [
    'Writing code in a functional way can help to solve complex problems in a efficient and in a reusable manner,
    for creating clean and maintainable software.',
  ]
authors: ['ravindre-ramjiawan']
theme: 'blue'
---

## Table of Contents

<TOCInline toc={props.toc} exclude={["Table of Contents"]} toHeading={2} />

## Background

The functional programming[^1] paradigm[^2] has been around since the early 1930s.
It has its roots in a mathematical theory named lambda calculus[^3], a notation for describing mathematical functions and programs.
In lambda calculus functions are first-class citizens[^4], meaning functions can be used as input and returned as output.
JavaScript also treats functions as first-class citizens which is the reason why we can apply functional programming in JavaScript.

## Imperative vs. Declarative

The benefit of writing code in a functional way is that functional programming focuses on what should be done rather than on how it should be done.
This is also known as imperative[^5] and declarative[^6] programming, where imperative does it in a procedural[^7] style and declarative in a functional style.
It can also be described as explicit and implicit programming.

### Imperative

```javascript
// Focuses on how it is done
const imperativeDoubleMap = (numbers) => {
  // Create a new array to push our numbers to
  const doubledNumbers = []
  // Loop through the numbers array
  for (let i = 0; i < numbers.length; i += 1) {
    // Push the doubled number to our new array
    doubledNumbers.push(numbers[i] * 2)
  }
  // Return the doubled numbers array
  return doubledNumbers
}

// Results in our numbers being doubled
console.log(imperativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

### Declarative

```javascript
// Focuses on what should be done
// The map function loops over the numbers array for us
// and creates a new array based on what is returned
// Arrow functions have an implicit return
const declarativeDoubleMap = (numbers) => numbers.map((number) => number * 2)

// Results in our numbers being doubled
console.log(declarativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

As shown above, both programming paradigms yield the same result but which one is easier to understand?

## Reuse

In functional programming the focus on the reuse[^8] of logic is a very important concept.
Reusing functions avoids writing code from scratch and adheres to the DRY principle[^23].

### Before

```javascript
const imperativeDoubleMap = (numbers) => {
  const doubledNumbers = []

  for (let i = 0; i < numbers.length; i += 1) {
    // The logic for doubling numbers is inside the for loop
    // Not reusable unless you put it in a (you guessed it) function
    doubledNumbers.push(numbers[i] * 2)
  }

  return doubledNumbers
}

// The logic of doubling numbers is already inside a function which map accepts
// Meaning we can now extract it to its own reusable function
const declarativeDoubleMap = (numbers) => numbers.map((number) => number * 2)
```

### After

```javascript
// Reusable function for doubling a number
const double = (number) => number * 2

const imperativeDoubleMap = (numbers) => {
  const doubledNumbers = []

  for (let i = 0; i < numbers.length; i += 1) {
    // Logic of doubling numbers is now handled through the reusable function
    doubledNumbers.push(double(numbers[i]))
  }

  return doubledNumbers
}

// Same idea but making this a lot more concise
const declarativeDoubleMap = (numbers) => numbers.map((number) => double(number))

// As expected our numbers are still doubled
console.log(imperativeDoubleMap([2, 3, 4])) // [4, 6, 8]
console.log(declarativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

## Point-free

Functional programming allows for the ability to write code in point-free[^9] programming style.
This means that you can omit function arguments if they match the parameters of the function you pass it to.

```javascript
const double = (number) => number * 2

// The map function expects a function that accepts a value argument
// on its first parameter position
// Since our double function does exactly that, we can just pass it in directly
// and map will call the double function for us
const declarativeDoubleMap = (numbers) => numbers.map(double)

// As expected we get the same results
console.log(declarativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

## Higher-order function

Functional programming has the concept of higher-order functions[^10].
This means a function that takes a function as an argument and/or returns a function as its output.

```javascript
const double = (number) => number * 2

// The array function "map" is a higher-order function
// because it takes in a function as argument
const numbersMap = (numbers) => numbers.map(double)
```

```javascript
// Multiply is a higher-order function because it returns a function
const multiply = (a) => (b) => a * b

// By calling multiply with the first argument
// we get our final function back to be used
const multiplyBy3 = multiply(3)

console.log(multiplyBy3(4)) // 12
```

## Purity

In functional programming functions are expected to be pure[^11].
This means a function that has no external dependencies other than its given inputs and always produces the same output.
This makes pure functions deterministic[^12] and are easier to test.

```javascript
// Pure function
const double = (number) => number * 2

// No matter how often this function is called with the same arguments
// it will always produce the same result
console.log(double(2)) // 4
console.log(double(2)) // 4
console.log(double(2)) // 4
```

### Impure

A function that has side effects[^13] is called impure.
This means a function that relies on external dependencies such as global variables or shared states and mutates or produces randomized values.
This makes impure functions nondeterministic[^14] and are harder to test.
Side effects can lead to unexpected results, frustrations, and bugs.

```javascript
// Some global state
const globalState = { number: 0 }

// Impure function
const double = (number) => (globalState.number += number * 2)

// No matter how often this function is called with the same arguments
// it will always produce a different result
console.log(double(2)) // 4
console.log(double(2)) // 8
console.log(double(2)) // 12
```

## Referential Transparency

Another positive aspect of functional programming are referentially transparent[^15] functions.
This means that the output of a function can be replaced by its value directly without having any influence on the program.
This is only possible if a function is pure. This allows for compilers[^16] to perform code optimizations[^24]
by swapping out function calls with their return values.

```javascript
// A pure function that is also referentially transparent
const add = (a, b) => a + b

const something = () => add(1, 2) + 5
// A compiler could swap out the add function call for its return value
const something2 = () => 3 + 5

// Both functions return the same output
console.log(something()) // 8
console.log(something2()) // 8
```

## Recursion

Another benefit of functional programming is a concept called recursion[^17].
This means a function that keeps calling itself until the desired result is achieved.
Recursion is a form of looping also known as the recursive loop.

```javascript
// Factorial
const factorial = (number) => {
  // Base case
  if (number < 2) return 1
  // Here we call ourselves to enter recursion
  // Until the base case is hit it will keep calling itself
  // Hence it being called the recursive loop
  return number * factorial(number - 1)
}

console.log(factorial(10)) // 3628800
```

## Memoization

Functional programming allows for a technique called memoization[^18].
Since functions are expected to be pure and therefore deterministic we can cache the output of computationally expensive function calls.

```javascript
// The memoize function will normally be provided
// by a functional programming library
// Memoize is a higher-order function since it accepts a function as argument
// and also returns a function as output
const memoize = (func) => {
  // The cache is simply an object which will be populated by key value pairs
  const cache = {}
  // Return a function that can accept any amount of arguments
  return (...args) => {
    // To create a unique key we simply turn them into a string
    const key = JSON.stringify(args)
    // If the key exists in the cache we take can return value
    if (cache[key]) return cache[key]
    // Otherwise we call the function and store its output in the cache
    return (cache[key] = func(args))
  }
}

// Function to measure execution time
// measureTime is also a higher order function just like memoize
const measureTime = (func) => {
  return (...args) => {
    // Start track of time
    const startTime = performance.now()
    // Execute function
    const result = func(args)
    // End track of time
    const endTime = performance.now()
    // Log the difference in time taken
    console.log(`Time taken: ${endTime - startTime} milliseconds`)
    return result
  }
}

// Fibonacci sequence
const fibonacci = (number) => {
  // Base case
  if (number < 2) return number
  // Fibonacci enters recursion twice
  return fibonacci(number - 1) + fibonacci(number - 2)
}

// Memoize our fibonacci function
const memoizedFibonacci = measureTime(memoize(fibonacci))

// On our first call fibonacci has to be calculated
// Subsequent calls with the same arguments will not recalculate fibonacci
// since it will return the already calculated value from the cache
console.log(memoizedFibonacci(40)) // 102334155 - Time taken: 700 milliseconds
console.log(memoizedFibonacci(40)) // 102334155 - Time taken: 0 milliseconds
console.log(memoizedFibonacci(40)) // 102334155 - Time taken: 0 milliseconds
```

## Intermediate values

Functional programming enables us to eliminate intermediate values.
An intermediate value is often a temporary variable created to store partial results for the next step in a process leading up to the final output.
Often these intermediate values are not used further in the program and just add syntactic noise[^19] to the code.

### Before

```javascript
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

const calculateNumber = (number) => {
  // As you can see we are storing each part of the process in a temporary variable
  // To be used by the next step in the process
  const doubledNumber = double(number)
  const squaredNumber = square(doubledNumber)
  const finalResult = subtract(squaredNumber)
  return finalResult
}

console.log(calculateNumber(4)) // 63
```

### After

```javascript
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Instead we can let the intermediate results be represented by the inputs and outputs of functions instead
// by passing functions to each other producing the same result but more succinct
const calculateNumber = (number) => subtract(square(double(number)))

console.log(calculateNumber(4)) // 63
```

This demonstrates the flow of intermediate values going from input to output from one function to the next.
This is also known as function composition[^20].
The downside is that this can quickly become unreadable and can lead to callback hell[^25] if we keep adding more functionality.

## Pipe & Compose

In functional programming there is the concept of piping and composing. Pipe executes functions in succession from left to right.
This allows for a natural reading experience (at least in the western hemisphere) when trying to follow the execution[^21] flow.
Compose executes functions in succession from right to left. Compose reflects exactly how functions would execute if you would not use compose at all,
namely from the innermost function to the outermost function as seen in the previous example.

### Pipe

```javascript
// The pipe function will normally be provided by a functional programming library
// Pipe is a higher-order function
// Pipe accepts any amount of functions which will return a function that accepts a value
// By using reduce we accumulate the outputs of function starting from the left
// and pass to the next function to the right
// Until the last function is called
const pipe =
  (...funcs) =>
  (value) =>
    funcs.reduce((currentValue, func) => func(currentValue), value)
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Pipe flows from left to right
const calculateNumber = pipe(double, square, subtract)

console.log(calculateNumber(4)) // 63
```

### Compose

```javascript
// The compose function will normally be provided by a functional programming library
// Compose is a higher-order function
// Compose accepts any amount of functions which will return a function that accepts a value
// By using reduceRight we accumulate the outputs of function starting from the right
// and pass to the next function to the left
// Until the first function is called
const compose =
  (...funcs) =>
  (value) =>
    funcs.reduceRight((currentValue, func) => func(currentValue), value)
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Compose flows from right to left
const calculateNumber = compose(double, square, subtract)

console.log(calculateNumber(4)) // 18
```

As shown, this allows us to have the benefits of function composition and not sacrifice any readability.

## Curry

Another benefit of functional programming is a concept called currying[^22].
Currying can be useful when you want to create a new function that has some arguments already fixed,
or when you want to pass a function with a smaller number of arguments to another function that expects a function with a larger number of arguments.

```javascript
// The curry function will normally be provided by a functional programming library
// Curry is a higher-order function and keeps returning functions until the final
// argument is passed
const curry = (func) =>
  function curried(...args) {
    if (args.length >= func.length) return func(...args)
    return (...moreArgs) => curried(...args, ...moreArgs)
  }

// Add function with multiple arguments
const add = (a, b, c) => a + b + c

// Curried version of add
const curriedAdd = curry(add)

console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6
console.log(curriedAdd(1)(2, 3)) // 6
console.log(curriedAdd(1, 2, 3)) // 6
```

## Conclusion

I hope this gives a better understanding of how functional programming can help reduce code complexity in a code base and allow for reliable, efficient, reusable, and maintainable code.
For further insight on the topic, I highly recommend checking out some popular functional programming libraries such as [Lodash](https://lodash.com) or [Ramda](https://ramdajs.com)
which provide a large number of utility functions that are optimized for performance and conciseness.
More information about the theoretical side of functional programming can be found by checking out [this website](https://sanderv1992.github.io/fp/).

[^1]: https://en.wikipedia.org/wiki/Functional_programming
[^2]: https://en.wikipedia.org/wiki/Programming_paradigm
[^3]: https://en.wikipedia.org/wiki/Lambda_calculus
[^4]: https://en.wikipedia.org/wiki/First-class_citizen
[^5]: https://en.wikipedia.org/wiki/Imperative_programming
[^6]: https://en.wikipedia.org/wiki/Declarative_programming
[^7]: https://en.wikipedia.org/wiki/Procedural_programming
[^8]: https://en.wikipedia.org/wiki/Code_reuse
[^9]: https://en.wikipedia.org/wiki/Tacit_programming
[^10]: https://en.wikipedia.org/wiki/Higher-order_function
[^11]: https://en.wikipedia.org/wiki/Pure_function
[^12]: https://en.wikipedia.org/wiki/Deterministic_algorithm
[^13]: https://en.wikipedia.org/wiki/Side_effect_(computer_science)
[^14]: https://en.wikipedia.org/wiki/Nondeterministic_algorithm
[^15]: https://en.wikipedia.org/wiki/Referential_transparency
[^16]: https://en.wikipedia.org/wiki/Compiler
[^17]: https://en.wikipedia.org/wiki/Recursion_(computer_science)
[^18]: https://en.wikipedia.org/wiki/Memoization
[^19]: https://en.wikipedia.org/wiki/Syntactic_noise
[^20]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
[^21]: https://en.wikipedia.org/wiki/Execution_(computing)
[^22]: https://en.wikipedia.org/wiki/Currying
[^23]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[^24]: https://en.wikipedia.org/wiki/Program_optimization
[^25]: https://en.wiktionary.org/wiki/callback_hell
