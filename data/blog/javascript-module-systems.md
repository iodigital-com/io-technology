---
title: 'JavaScript Module Systems'
date: '2023-10-11'
tags: ['JavaScript', 'Module Systems', 'Frontend']
authors: ['mohsen-mahabadi']
summary: 'In this article, we are going to talk about different JS module systems, such as CommonJs, AMD, UMD, and ES Modules.'
theme: 'blue'
---

## What is a JavaScript module?

In JavaScript, a module system allows developers to organize code into reusable pieces or components, which can be imported and used in other application parts. The module system provides a way to encapsulate code, manage dependencies, and control the scope of variables and functions.

## Why do we need module systems?

Using a module system in JavaScript, or in any programming language, is crucial for several reasons, especially as applications grow in complexity. Here are some of the key reasons why a module system is essential:

### 1. Code Organization:

Modules allow developers to split their code into smaller, more manageable pieces, each responsible for a specific feature or functionality. This makes the codebase more **organized, readable, and maintainable**.

![The image shows an example of organizing code](/articles/javascript-module-systems/code-organization.webp)

### 2. Scope Management and Collision Avoidance

Each module has its own scope, meaning variables and functions defined in a module are not globally accessible unless explicitly exported. This helps in avoiding variable conflicts and polluting the global namespace.

![The image shows an example of organizing code](/articles/javascript-module-systems/scope-management.png)

### 3. Dependency Management

Dependency management is clearer with modules, as dependencies are explicitly imported, making it easier to track and manage the relationships between different parts of an application.

Suppose you have three JavaScript files: `utility.js`, `dataProcessor.js`, and `app.js`. The `dataProcessor.js` file depends on a function from `utility.js`, and `app.js` depends on a function from `dataProcessor.js`.

![The image shows an example of dependency management](/articles/javascript-module-systems/code-organization-Dependency.png)

## Available module systems in JavaScript

In JavaScript, there are several module systems that allow developers to organize and structure their code. Here are the most commonly used module systems:

1. CommonJS (CJS)
2. Asynchronous Module Definition (AMD)
3. Universal Module Definition (UMD)
4. ES6 Modules (ESM)
5. SystemJS

### 1. CommonJS (CJS)

CommonJS is a module system implemented by [Node.js](https://nodejs.org/) for organizing and sharing JavaScript code. Before the advent of ES6 modules, CommonJS was the primary way to include and manage dependencies in Node.js applications. While browsers primarily use the ES6 module system, tools like [Browserify](https://browserify.org/) and [Webpack](https://webpack.js.org/) can transform CommonJS modules to be browser-compatible.

#### Key Concepts:

- **_Module Definition:_** In CommonJS, every file is its own module. The variables, functions, and objects you define in a file are local to that file unless explicitly exported.
- **_Export:_** To make parts of your code available for use in other files, you use `module.export`.
- **_Import:_** To use a module in another file, you use the `require` function. This function returns whatever the target module exported.
- **_Synchronous Loading:_** Modules are loaded synchronously, meaning the program waits for the module to be fully loaded and executed before moving on.
- **_[Module Caching](https://medium.com/@mahabadi/understanding-the-statefulness-of-js-modules-2bc353af0e8e):_** Modules are cached after the first time they are loaded, improving performance and ensuring that module initialization only happens once.
- **_No tree shaking:_** because when you import a module you get an object.

#### How to use CommonJS?

**_Setting up:_**  
Ensure you have Node.js installed. If not, download and install it from [Node.js official website](https://nodejs.org/).

**_Step 1:_**  
Create a file named `counter.js`:

```js
let count = 0

function increment() {
  count++
}

function getCount() {
  return count
}

module.exports = {
  increment,
  getCount,
}
```

**_Step2:_**  
Create a file named `app.js`:

```js
const counter = require('./counter.js')

console.log(counter.getCount()) // Outputs: 0
counter.increment()
console.log(counter.getCount()) // Outputs: 1
```

**_Running the Code:_**  
In your terminal, run the file using Node.js `node app.js`.
You’ll see that the `count` variable in the `counter.js` module retains its state between function calls.

### 2. Asynchronous Module Definition (AMD)

It is a specification for the modular development of JavaScript applications and libraries. It allows developers to define modules and their dependencies **asynchronously**, making it particularly well-suited for the **browser environment** where synchronous loading of modules can result in performance issues. The most popular implementation of AMD is the [RequireJS](https://requirejs.org/) library.

#### Key Concepts:

- **_Define a Module:_** Use the `define` function to specify a module, its dependencies, and a factory function that returns the module's exports.
- **_Load and Use a Module:_** Use the `require` function to load a module and its dependencies.
- **_Asynchronous Loading:_** One of the primary benefits of AMD is its support for asynchronous module loading. This means that modules and their dependencies can be fetched in parallel, which can lead to faster page loads in a browser environment.
- **_Module ID:_**
  Each module can have a unique module ID, which is typically its file path (minus the `.js` extension). This ID is used when specifying dependencies.

#### How to use AMD?

**_Setting up:_**  
Include RequireJS in your HTML file:

```html
<script data-main="scripts/app" src="path/to/require.js"></script>
```

The `data-main` attribute points to the main script of your application.

**_Step 1:_**  
Create a file named `scripts/math.js`:

```js
// math.js

define([], function () {
  function add(a, b) {
    return a + b
  }

  function subtract(a, b) {
    return a - b
  }

  return {
    add: add,
    subtract: subtract,
  }
})
```

Here, we’ve defined a module without any dependencies (empty array) and exported two functions.

**_Step 2:_**  
Create a file named `scripts/app.js` (your main script):

```js
// app.js

require(['math'], function (math) {
  console.log(math.add(5, 3)) // Outputs: 8
  console.log(math.subtract(5, 3)) // Outputs: 2
})
```

Here, we’re loading the `math` module and using its functions. Once the `math` module is loaded, the function will be called.

**_Running the Code:_**  
Simply open the HTML file containing the RequireJS script tag in a browser. The main script (`app.js`) will be executed, and it will asynchronously load the `math.js` module.

### 3. Universal Module Definition (UMD)

It is a pattern for writing JavaScript modules that can work **both in the browser and on the server**. The idea behind UMD is to make a module compatible with the most popular script loaders of the day. In fact, it is a combination of **CommonJs + AMD**.

#### Key Concepts:

1. **_Compatibility:_** UMD aims to support the three most popular module formats:  
   _AMD (Asynchronous Module Definition):_ Used by browsers and includes libraries like RequireJS.  
   _CommonJS (CJS):_ Used primarily on the server side, especially with Node.js.  
   _Global variable definition:_ For browsers without any module loader.

2. **_Flexibility:_** UMD allows developers to write a module once and have it work in many environments without modification.

3. **_Wrapper Pattern:_** UMD typically wraps the module definition inside a function that can detect the module system in use and act accordingly.

#### How to use UMD?

Here’s a basic example of how you might define a module using UMD:

**_1. Define a UMD module:_**  
Create a file named `my-umd.js`:

```javascript
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.myModule = factory()
  }
})(this, function () {
  return {
    hello: function () {
      return 'Hello, World!'
    },
  }
})
```

**_2. Running the UMD module:_**

_a. In the Browser:_  
Include the UMD module in a script tag:

```html
<script src="my-umd.js"></script>
<script>
  console.log(myModule.hello()) // Outputs: "Hello, World!"
</script>
```

_b. Using AMD (e.g., RequireJS):_  
First, set up RequireJS and then define the module:

```html
<script src="path_to_require.js"></script>
<script>
  require(['my-umd'], function (myModule) {
    console.log(myModule.hello()) // Outputs: "Hello, World!"
  })
</script>
```

_c. In Node.js:_  
First, set up Node.js and then just require the file:

```js
const myModule = require('./my-umd.js')
console.log(myModule.hello()) // Outputs: "Hello, World!"
```

### 4. ES6 Modules (ESM)

It is the native module system introduced in ECMAScript 6 (ES6), also known as ECMAScript 2015 (ES2015). ESM allows you to modularize your JavaScript code, making it more maintainable, scalable, and organized for **both the browser and the server**. With its native support in modern environments and tools, it’s become an essential part of the JavaScript ecosystem.

#### Key Concepts:

- **_Export & Import:_** The core of ESM is the ability to export and import functions, objects, or primitives from one module to another.
- **_Static Analysis:_** Imports and exports are determined statically at compile time, rather than runtime. This means tools can analyze a module’s dependencies without executing it.
- **_File-based Modules:_** In ESM, each file is its own module. Anything not exported remains private to that module.
- **_Dynamic Imports:_** Introduced later, dynamic imports allow you to load modules on the fly using promises.
- **_Static Structure:_** One of the defining characteristics of ESM is its static structure. This means you can’t conditionally import/export inside functions or conditionals. The structure is determined at compile time, not runtime.
- **_Cyclic Dependencies:_** ESM handles cyclic (or circular) dependencies between modules. If module A imports from module B, and module B imports from module A, the language has mechanisms to handle this without causing errors.
- **_[Module Caching:](https://medium.com/@mahabadi/understanding-the-statefulness-of-js-modules-2bc353af0e8e)_** If multiple modules import from a single module, that module will only be executed once. This ensures that side effects in a module (like setting up an event listener) don’t occur multiple times.
- **_Tree shakeable:_** because of `static analysis` supported by ES6.

#### ES6 Modules Syntax

**_Exporting and importing a module:_**

```js
// math.js
export const PI = 3.14
export const power = (a, b) => a ** b

// Importing into another module:
// app.js
import { PI, power } from './math.js'
console.log(power(2, 3)) // Outputs: 8
```

**_Using Default Exports:_**  
Each module can have one default export, which can be imported without curly braces.

```js
// greet.js
export default function () {
  return 'Hello!'
}
//or
const greeting = () => {
  return 'Hello!'
}
export default greeting

// app.js
import greet from './greet.js'
console.log(greet()) // Outputs: Hello!
```

**_Combining Imports:_**

```js
// app.js
import greet, { add, subtract } from './module.js'
```

**_Renaming Imports:_**

```js
// app.js
import { add as addition } from './math.js'
console.log(addition(2, 3)) // Outputs: 5
```

**_Dynamic Imports:_**  
Useful for `code-splitting` and `lazy-loading` modules.

```js
const loadModule = async () => {
  const module = await import('./dynamicModule.js')
  module.someFunction()
}
```

#### How to use ESM?

**_Step 1:_**  
Let's say you have a `math.js` file structured as follows:

```js
// math.js
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b
```

**_Step 2:_**  
You then utilize these functions in your `index.js`:

```js
import { add, subtract } from 'math'
console.log(add(2, 3)) // Outputs: 5
```

**_Running the Code:_**  
To execute this in a browser, you'll need to include the `index.js` script in your html file. It's crucial to specify `type="module"` within the script tag to inform the browser to treat our file as a module. Additionally, the `importmap` is necessary to facilitate the direct loading of JavaScript modules in the browser.

```html
<script type="importmap">
  {
    "imports": {
      "math": "./math.js"
    }
  }
</script>

<script type="module" src="./index.js"></script>
```

### 5. SystemJS

SystemJS is a dynamic module loader that provides a way to load ES6 modules, CommonJS, AMD, and global scripts. It’s a powerful tool that bridges the gap between different module formats and allows developers to write code that can be loaded in various environments without modification.

#### Where do we use SystemJs?

SystemJS is primarily designed for **the browser** to handle module loading in environments that may not natively support certain module formats. However, **it's not limited to just the browser**. You can use SystemJS on the server side, particularly with Node.js, but there are some considerations to keep in mind:

1. **_Native Module Support in Node.js:_** Node.js has built-in support for CommonJS modules, and recent versions of Node.js also support ES6 modules natively. This often reduces the need for a module loader like SystemJS on the server side.

2. **_Use Cases on the Server:_** One potential use case for SystemJS on the server is when you have a mixed module environment (e.g., a combination of CommonJS, AMD, and ES6 modules) and you want a unified way to load them. Another scenario might be dynamically loading modules at runtime based on certain conditions.

3. **_Integration with Other Tools:_** If you’re considering using SystemJS on the server side, you might also want to look into how it integrates with other server-side tools and frameworks you’re using.

#### Key Concepts:

1. **_Universal Module Loading:_** can load multiple module formats, including:
   — ES6 modules  
   — CommonJS  
   — AMD  
   — UMD  
   — Global scripts (non-modular scripts)
2. **_Dynamic Loading:_** allows for the dynamic loading of modules at runtime. This is particularly useful for applications that load modules based on certain conditions or user interactions.
3. **_Transpilation Support:_** can be integrated with transpilers like Babel or TypeScript. This means you can write code in modern ES6 or TypeScript and have SystemJS load and transpile it on the fly in browsers that only support ES5.
4. **_Plugin System:_** supports plugins, enabling it to load not just JavaScript modules but also other resources like JSON, CSS, text, and images as modules.
5. **_Configuration and Flexibility:_** provides a rich configuration system, allowing developers to specify paths, aliases, default extensions, and other settings to control how modules are loaded and resolved.
6. **_Production Optimizations:_** Because of its dynamic loading features, SystemJS thrives in development contexts, but it also gives options to optimize for production. Tools like `systemjs-builder` can be used to bundle modules into fewer files, reducing the number of HTTP requests and improving load times.
7. **_Compatibility:_** provides a way to use modules in environments that don't natively support them. For instance, before ES6 module support was widespread in browsers, SystemJS allowed developers to use ES6 module syntax and load them effectively.
8. **_Production Bundles:_** While SystemJS is great for development with its dynamic loading capabilities, for production, it's often recommended to create bundles to reduce the number of requests and improve performance.

#### How to use it?

**_Installation:_**  
You can include SystemJS via a script tag or install it via npm `npm install systemjs`.

```html
<script src="path-to-systemjs/dist/system.js"></script>
```

**_Configuration:_**  
Set up a configuration for SystemJS. This tells SystemJS where to find modules and how to load them.

```js
SystemJS.config({
  map: {
    jquery: 'path-to-jquery',
  },
  packages: {
    app: {
      defaultExtension: 'js',
    },
  },
})
```

**_Loading Modules:_**  
Use SystemJS to load your main module.

```js
SystemJS.import('app/main.js').then(function (module) {
  // Use the module here
})
```

## Conclusion

JavaScript has seen various module systems over the years, each with its unique strengths. However, ESM Modules stand out due to their efficiency and widespread adoption in modern frameworks. For developers aiming for streamlined and future-ready applications, using ESM Modules is a clear choice.
