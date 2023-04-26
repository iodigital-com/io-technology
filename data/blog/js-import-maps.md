---
title: 'Import maps in JavaScript'
date: '2023-04-25'
tags: ['frontend', 'web-capabilities', 'javascript']
images: ['/articles/project-fugu/header.webp']
summary:
authors: ['sander-borgman']
theme: 'rouge'
---

Traditionally, developers have used build tools like Webpack or Rollup to bundle and optimize their code for production. These build processes can be time-consuming to set up and make development more complicated. With native JavaScript modules now widely supported in modern web browsers, there is a need to map JavaScript packages to their source files.

Let's say we have the following JavaScript module on our page:

```html
<script type="module">
  import moment from 'moment'
  // ...
</script>
```

Without a bundler, the browser will not be able to resolve the `moment` package.

In this blog post, we'll explore import maps to solve this problem and show you how to get started with this powerful tool for managing JavaScript dependencies.

## Import maps

Introduced in the ECMAScript proposal stage in 2019 and added to the ECMAScript standard in 2021, import maps offer a new way to manage JavaScript modules without the need for a build process.

Import maps allow you to map modules to URLs, enabling JavaScript modules to be loaded directly in the browser.

### An example

The `imports` property maps module specifiers to URLs. You can use relative or absolute URLs for the module URLs, and define multiple mappings in an import map.

```html
<script type="importmap">
  {
    "imports": {
      "my-module": "./mymodule.js",
      "another-module/": "./another-module/"
    }
  }
</script>
```

### Packages

In JavaScript it's common to have packages consisting of multiple modules and files. In such cases, you can map all the files of a package to a single identifier.

```html
<script type="importmap">
  {
    "imports": {
      "my-module": "./mymodule.js",
      "moment/": "https://cdn.jsdelivr.net/npm/moment@2.29.4/src/"
    }
  }
</script>
<script type="module">
  import moment from 'moment/moment.js'

  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
</script>
```

Note that we're using a trailing `/` in the identifier to indicate that we want to map all the files of the package.

### Remote sources

In this example, we're using import maps to import the Moment.js library from a remote source.

```html
<script type="importmap">
  {
    "imports": {
      "moment": "https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.js"
    }
  }
</script>
<script type="module">
  import moment from 'moment'

  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
</script>
```

### Scoping

Import maps also allow you to define scoping for your module mappings. Scoping allows you to restrict the use of certain module mappings to specific parts of your application.

To define a scope, you can use the `scopes` property in your import map. The scopes property is an object that maps URL patterns to nested import maps.

```html
<script type="importmap">
  {
    "imports": {
      "moment": "https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.js"
    },
    "scopes": {
      "/legacy/": {
        "imports": {
          "moment": "https://cdn.jsdelivr.net/npm/moment@2.18.1/moment.js"
        }
      }
    }
  }
</script>
```

In this example we have defined a scope for the `/legacy/` path. For any modules loaded from this path we are importing an older version of Moment.js.

## Can I use them already?

It's important to note that import maps are still a relatively new technology and may not be suitable for all projects. However, they are supported in most recent versions of the major browsers: Chrome, Firefox, and Safari. Let's explore some use cases.

### Prototyping

For prototyping and during development, import maps can be an excellent choice as they allow developers to quickly experiment with different libraries and packages without the need for a build process. This can be useful in the early stages of a project when you're exploring different options and need to move quickly.

### Buildless development
