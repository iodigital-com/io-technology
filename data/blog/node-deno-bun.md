---
title: 'Portability of applications between
Node, Deno & Bun'
date: '2022-09-30'
tags: ['backend', 'fullstack', 'node', 'deno', 'bun', 'express', 'nuxt', 'next', angular]
summary: 'Ever since the introduction of Bun there are three runtimes to choose from when wanting to develop and run a JavaScript server. Node was the one that started it all and most applications are designed to run on that, but how would those applications fare running on the other runtimes, are they really a drop-in replacement?'
authors: ['luuk-rijnbende']
---

Now while Deno was never designed as a drop-in replacement, that is the intention of Bun. Thus both of them are tested to see how easy or difficult it is to switch to a different and potentially faster runtime. Both Deno and Bun also offer developer tools, but since this article is about the portability of existing applications, those tools are not covered.

## Test setup

The test is spread over multiple applications to test common usage. While nearly not as extensive or complex as real-world applications, it should give a basic idea of how portable they are and how much effort is required to switch to a different runtime.

Because Deno requires file extensions to be present whenever importing modules, code is kept in a single file where possible for this test.

### Applications

1. Simple script reading some numbers from a file and adding them together with a small delay between each addition.
2. Simple HTTP server using the built-in HTTP module.
3. Simple HTTP server using Express.
4. Nuxt 2
5. Nuxt 3
6. Next
7. Angular Universal

### Runtime versions at the time of writing

|      |               |
| ---- | ------------- |
| Node | 16.17.0 (LTS) |
| Deno | 1.25.0        |
| Bun  | 0.1.10 (Beta) |

## Node

Node is the JavaScript runtime that started it all back in 2009 and was built on the Google V8 JavaScript engine. Now it goes without saying that all test applications work on Node, since they were designed to. The behavior of the applications on Node will serve as a baseline for the other runtimes.

### Portability

|                   |     |
| ----------------- | --- |
| Simple script     | ✅  |
| Native HTTP       | ✅  |
| Express           | ✅  |
| Nuxt 2            | ✅  |
| Nuxt 3            | ✅  |
| Next              | ✅  |
| Angular Universal | ✅  |

## Deno

Deno is a runtime created in 2018 aiming to solve the ‘mistakes’ made along the way with Node. Like Node, Deno makes use of the Google V8 JavaScript engine.

Deno, by default, was built to not use the NPM ecosystem and its module loading differs from that of Node. This also means that any library that accesses native Node functionality will ‘never’ work on Deno. But how does that work for any dependencies that are installed in the project? Deno downloads and includes dependencies by providing a URL as the source of an import statement, which means the code using external dependencies has to be rewritten to run on Deno.

In order to work with applications written for Node, Deno provides a [compatibility mode](https://deno.land/manual@v1.25.0/node/compatibility_mode) that allows the use of Node specific APIs such as `path` or `fs`. This also enables using modules that were installed using NPM or Yarn instead of importing them directly from a URL.

Since the test applications were built to run on Node, they are started on Deno in Node compatibility mode by passing the flags ` --unstable --compat`.

### Results

#### Script

Works without issues in compatibility mode.

#### Native HTTP

Works without issues in compatibility mode.

#### Express

|          |                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| Error    | `SyntaxError: Unexpected strict mode reserved word`                                                                     |
| Cause    | Express defines the following line `exports.static = require(‘serve-static’);`                                          |
| Solution | Change the line to `exports.statik = require(‘serve-static’);`, though this might break code using the `static` export. |
| Link     | https://github.com/denoland/deno/issues/14852                                                                           |

#### Nuxt 2

|          |                                                                                              |
| -------- | -------------------------------------------------------------------------------------------- |
| Error    | `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading: ‘columns’).` |
| Cause    | -                                                                                            |
| Solution | -                                                                                            |
| Link     | -                                                                                            |

#### Nuxt 3

|          |                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------- |
| Error    | `[ERR_PACKAGE_PATH_NOT_EXPORTED] Package subpath ‘.runtime/fetch/index’ is not defined by “exports”` |
| Cause    | Likely the underlying Nitro engine that bundles specifically for Node                                |
| Solution | A Deno specific preset for Nitro                                                                     |
| Link     | https://github.com/unjs/nitro/issues/422                                                             |

#### Next

|          |                                                     |
| -------- | --------------------------------------------------- |
| Error    | `ReferenceError: document is not defined`           |
| Cause    | -                                                   |
| Solution | -                                                   |
| Link     | https://github.com/vercel/next.js/discussions/26428 |

#### Angular Universal

|          |                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Error    | `TypeError: Cannot read properties of undefined (reading: ‘encrypted’)` as soon as a request is done                                                                                        |
| Cause    | -                                                                                                                                                                                           |
| Solution | There is an experimental SSR rendered for using Angular Universal on Deno, but that involves changing the code and is also very limited in support. https://github.com/alosaur/angular_deno |
| Link     | https://github.com/angular/universal/issues/2338                                                                                                                                            |

### Portability

|                   |     |
| ----------------- | --- |
| Simple script     | ✅  |
| Native HTTP       | ✅  |
| Express           | ❌  |
| Nuxt 2            | ❌  |
| Nuxt 3            | ❌  |
| Next              | ❌  |
| Angular Universal | ❌  |

## Bun

Bun is the new kid on the block, created in 2021 to be a drop-in replacement for Node. It uses the JavaScriptCore engine by Apple instead of the Google V8 JavaScript engine, which supposedly makes it faster than Node and Deno.

Bun focuses on three main things, fast startup times, new levels of performance (thanks to the JavaScriptCore engine) and being a complete tool for the developer. It natively implements most of the APIs available in Node, so changing an application from using Node to using Bun should be a piece of cake.

### Results

#### Script

Works, but `fileURLToPath` doesn’t work the same as it does on Node and Deno. `process.cwd()` is used to go around this and just read from the source file. Also when reading from a file, the encoding is required for Bun to read correctly.

#### Native HTTP

Works, but `Content-Type` response header is required, otherwise, the response will be downloaded.

#### Express

Works, but there is an open issue on Express support, so more advanced use cases might not work yet. https://github.com/oven-sh/bun/issues/496

#### Nuxt 2

Works, but still uses Node under the hood because of the usage of the Nuxt CLI. In environments without Node, such as a purpose-built Docker container, the Nuxt CLI cannot start because it’s missing Node.

#### Nuxt 3

|          |                                                                       |
| -------- | --------------------------------------------------------------------- |
| Error    | `Could not resolve: “node-fetch-native/polyfill”`                     |
| Cause    | Likely the underlying Nitro engine that bundles specifically for Node |
| Solution | A Bun specific preset for Nitro                                       |
| Link     | https://github.com/oven-sh/bun/issues/159                             |

#### Next

Works, but just like Nuxt 2, still uses Node under the hood because of the usage of the Next CLI. In environments without Node, such as a purpose-built Docker container, the Next CLI cannot start because it’s missing Node.

Through the use of https://www.npmjs.com/package/bun-framework-next Next can be started in development mode with just Bun, though trying to run that in production mode will still use Node.

#### Angular Universal

|          |                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| Error    | `Expected scope (src.js_ast.Scope.Kind.function_args, 556073), found scope (src.js_ast.Scope.Kind.block, 556020)` |
| Cause    | -                                                                                                                 |
| Solution | -                                                                                                                 |
| Link     | -                                                                                                                 |

### Portability

|                   |     |
| ----------------- | --- |
| Simple script     | ✅  |
| Native HTTP       | ✅  |
| Express           | ✅  |
| Nuxt 2            | ❌  |
| Nuxt 3            | ❌  |
| Next              | ✅  |
| Angular Universal | ❌  |

## Conclusion

The idea of running any application that was designed for Node on another runtime such as Deno or Bun is amazing as it might bring performance or workflow improvements. Sadly it is not as simple as switching out Node for Deno or Bun. Only simple applications and scripts will work on all three runtimes, but more advanced use cases designed for Node still only run on Node.

Deno was created as an alternative for Node but not a replacement, so it isn’t strange to see that only the really simple applications work. Even with the recently introduced compatibility mode more advanced use cases don’t work and likely never will unless explicitly implemented by Deno. Applications wanting to use Deno as runtime instead of Node would have to be adapted specifically for Deno and then there might still be a framework or library that is not compatible.

Bun on the other hand was created as a replacement for Node and shows promising results when running the test applications. Because of little differences between the JavaScriptCore and V8 engine, there might be some code changes required to make it work, but nothing compared to the changes necessary for Deno. Also, there’s still the case of applications starting, but using Node under the hood because of the usage of a CLI. There are efforts to make this work, such as the Next compatibility layer, but it’s going to take some time for that to be production ready.

For now, Bun is definitely a runtime to keep an eye on, as it might really become a production-ready replacement for Node. Hopefully, it will spark an effort to improve performance as much as possible in Node as well, so that even applications that don’t work on Bun in the future can still benefit from a performance increase.
