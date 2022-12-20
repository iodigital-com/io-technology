---
title: 'Benefits of functional programming'
date: '2022-12-20'
tags: ['frontend', 'functional programming', 'javascript']
images: ['/articles/benefits-of-functional-programming/pexels-pixabay-270557.jpg']
summary:
  [
    'Writing code in a functional way can help to solve complex problems in a efficient and in a reusable manner, for creating clean and maintainable software.',
  ]
authors: ['ravindre-ramjiawan']
theme: 'blue'
---

## Background

The [functional programming](https://en.wikipedia.org/wiki/Functional_programming) [paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) has been around since the early 1930s.
It has its roots in a mathematical theory called [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) which is a notation for describing mathematical functions and programs.
In lambda calculus functions are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen), meaning functions can be used as input or returned as output.
JavaScript also treats functions as first-class citizens which is the reason why we can apply functional programming in JavaScript.

## Imperative vs Declarative

One benefit of writing code in a functional way is that functional programming focuses on what should be done rather than on how it should be done.
You may also know this as [imperative](https://en.wikipedia.org/wiki/Imperative_programming) and [declarative](https://en.wikipedia.org/wiki/Declarative_programming) programming, where imperative does it in a [procedural](https://en.wikipedia.org/wiki/Procedural_programming) style and declarative in a functional style.
You may also have heard of it as explicit and implicit programming.

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
// The map function loops over the numbers array for us and creates a new array based on what is returned
// Arrow functions have an implicit return
const declarativeDoubleMap = (numbers) => numbers.map((number) => number * 2)

// Results in our numbers being doubled
console.log(declarativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

As shown above, both programming paradigms yield the same result but which one is easier to understand?

## Reuse

Another benefit of functional programming is the [reuse](https://en.wikipedia.org/wiki/Code_reuse) of logic.

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

Another benefit of functional programming is the [point-free](https://en.wikipedia.org/wiki/Tacit_programming) programming style.
This means that you can omit function arguments if they match the parameters of the function you pass it to.

```javascript
const double = (number) => number * 2

// The map function expects a function that accepts a value argument on its first parameter position
// Since our double function does exactly that, we can just pass it in directly and map will call the double function for us
const declarativeDoubleMap = (numbers) => numbers.map(double)

// As expected we get the same results
console.log(declarativeDoubleMap([2, 3, 4])) // [4, 6, 8]
```

## Higher-order function

Another benefit of functional programming is the concept of a [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function).
This means a function that takes a function as an argument and/or returns a function as its output.

```javascript
const double = (number) => number * 2

// The array function map is a higher-order function because it takes in a function as callback
const numbersMap = (numbers) => numbers.map(double)
```

```javascript
// Multiply is a higher-order function because it returns a function
const multiply = (a) => (b) => a * b

const multiplyBy3 = multiply(3)

console.log(multiplyBy3(4)) // 12
```

## Purity

Another benefit of functional programming is that functions are expected to be [pure](https://en.wikipedia.org/wiki/Pure_function).
This means a function that has no external dependencies other than its given inputs and always produces the same output.
This makes pure functions [deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) and are easier to test.

```javascript
// Pure function
const double = (number) => number * 2

// No matter how often this function is called with the same arguments it will always produce the same result
console.log(double(2)) // 4
console.log(double(2)) // 4
console.log(double(2)) // 4
```

### Impure

A function that has [side effects](<https://en.wikipedia.org/wiki/Side_effect_(computer_science)>) is called impure.
This means a function that relies on external dependencies such as global variables or shared states and mutates or produces randomized values.
This makes impure functions [nondeterministic](https://en.wikipedia.org/wiki/Nondeterministic_algorithm) and are harder to test.
Side effects can lead to unexpected results, frustrations, and bugs.

```javascript
// Some global state
const globalState = { number: 0 }

// Impure function
const double = (number) => (globalState.number += number * 2)

// No matter how often this function is called with the same arguments it will always produce a different result
console.log(double(2)) // 4
console.log(double(2)) // 8
console.log(double(2)) // 12
```

## Referential Transparency

Another benefit of functional programming are [referentially transparent](https://en.wikipedia.org/wiki/Referential_transparency) functions.
This means that the output of a function can be replaced by its value directly without having any influence on the program.
This is only possible if a function is pure. This allows for [compilers](https://en.wikipedia.org/wiki/Compiler) to perform code optimizations
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

Another benefit of functional programming is a concept called [recursion](<https://en.wikipedia.org/wiki/Recursion_(computer_science)>).
This means a function that keeps calling itself until the desired result is achieved.
Recursion is a form of looping also known as the recursive loop.

```javascript
// Fibonnaci sequence
const fibonacci = (number) => {
  // Log to keep track of what's happening inside
  console.log(number)
  // Base case of the recursion
  if (number < 2) return number
  // Here we the call fibonacci to enter recursion
  return fibonacci(number - 1) + fibonacci(number - 2)
}

fibonacci(3) // Logs 3, 2, 1, 0, 1 respectively
```

## Memoization

Another benefit of functional programming is called [memoization](https://en.wikipedia.org/wiki/Memoization).
Since functions are expected to be pure and therefore deterministic we can cache or store the output of computationally expensive function calls.

```javascript
// The memoize function will normally be provided by a functional programming library
const memoize = (func) => {
  const cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache[key]) return cache[key]
    return (cache[key] = func(args))
  }
}

// Function to measure execution time
const measureTime = (func) => {
  return (...args) => {
    const startTime = performance.now()
    const result = func(args)
    const endTime = performance.now()
    console.log(`Time taken: ${endTime - startTime} milliseconds`)
    return result
  }
}

// Fibonacci function
const fibonacci = (number) => {
  if (number < 2) return number
  return fibonacci(number - 1) + fibonacci(number - 2)
}

// Memoize our fibonacci function
const memoizedFibonacci = measureTime(memoize(fibonacci))

// On our first call fibonacci has to be calculated
// Subsequent calls with the same arguments will not recalculate fibonacci
// since it will return the already calculated value from the cache
console.log(memoizedFibonacci(40)) // 102334155 - Measured time (depending on your hardware) 700 milliseconds
console.log(memoizedFibonacci(40)) // 102334155 - Measured time 0 milliseconds
console.log(memoizedFibonacci(40)) // 102334155 - Measured time 0 milliseconds
```

## Intermediate values

Another benefit of functional programming is that it can eliminate intermediate values.
An intermediate value is often a temporary variable created to store partial results for the next step in a process leading up to the final output.
Often these intermediate values are not used further in the program and just add [syntactic noise](https://en.wikipedia.org/wiki/Syntactic_noise) to the code.

### Before

```javascript
// Some functions comprising our program
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

const numberMapper = (numbers) =>
  numbers.map((number) => {
    // As you can see we are storing each part of the process in a temporary variable
    // To be used by the next step in the process
    const doubledNumber = double(number)
    const squaredNumber = square(doubledNumber)
    const finalResult = subtract(squaredNumber)
    return finalResult
  })

console.log(numberMapper([2, 3, 4])) // [15, 35, 63]
```

### After

```javascript
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Instead we can let the intermediate results be represented by the input and output of functions instead
// by passing functions to each other producing the same result but more succinct
const numberMapper = (numbers) => numbers.map((number) => subtract(square(double(number))))

console.log(numberMapper([2, 3, 4])) // [15, 35, 63]
```

This demonstrates the flow of intermediate values going from input to output from one function to the next.
This is also known as [function composition](<https://en.wikipedia.org/wiki/Function_composition_(computer_science)>).
The downside is that this can quickly become unreadable and can lead to nesting hell if we keep adding more functionality.

## Pipe

Another benefit of functional programming is the concept of piping. Pipe executes functions in succession from left to right.
This allows for a natural reading experience (at least in the western hemisphere) when trying to follow the [execution](<https://en.wikipedia.org/wiki/Execution_(computing)>) flow.

```javascript
// The pipe function will normally be provided by a functional programming library
const pipe =
  (...funcs) =>
  (value) =>
    funcs.reduce((currentValue, func) => func(currentValue), value)
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Pipe flows from left to right
// Notice I also wrote it point-free since pipe returns a function
const numberMapper = (numbers) => numbers.map(pipe(double, square, subtract))

console.log(numberMapper([2, 3, 4])) // [15, 35, 63]
```

## Compose

Another benefit of functional programming is the concept of composing. Compose executes functions in succession from right to left.
Compose reflects exactly how functions would execute if you would not use compose, namely from the innermost function to the outermost function.

```javascript
// The compose function will normally be provided by a functional programming library
const compose =
  (...funcs) =>
  (value) =>
    funcs.reduceRight((currentValue, func) => func(currentValue), value)
const double = (number) => number * 2
const square = (number) => number * number
const subtract = (number) => number - 1

// Compose flows from right to left
// Notice I also wrote it point-free since compose returns a function
const numberMapper = (numbers) => numbers.map(compose(double, square, subtract))

console.log(numberMapper([2, 3, 4])) // [2, 8, 18]
```

As shown, this allows us to have the benefits of function composition and not sacrifice any readability.

## Curry

Another benefit of functional programming is a concept called [currying](https://en.wikipedia.org/wiki/Currying).
Currying can be useful when you want to create a new function that has some arguments already fixed,
or when you want to pass a function with a smaller number of arguments to another function that expects a function with a larger number of arguments.

```javascript
// The curry function will normally be provided by a functional programming library
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

## In closing

I hope this gives a better understanding of how functional programming can help reduce code complexity in a code base and allow for reliable, efficient, reusable, and maintainable code.
For further insight on the topic, I highly recommend checking out some popular functional programming libraries such as [Lodash](https://lodash.com) or [Ramda](https://ramdajs.com)
which provide a large number of utility functions that are optimized for performance and conciseness.
More information about the theoretical side of functional programming can be found by checking out [this website](https://sanderv1992.github.io/fp/).
