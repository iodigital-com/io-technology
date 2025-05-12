---
title: 'Quick Tip: Generate Types Based on OpenAPI (Swagger)'
date: '2025-05-09'
tags: ['frontend']
images: ['/articles/generate-types-with-swagger/header.jpg']
summary: "No more manual type generation! In this article, I'll show you how to generate types based on a OpenAPI (Swagger) file using a simple npm package."
authors: ['steve-jonk']
theme: 'green'
---

As front-end developers, we often work with APIs that provide data in a structured format. One of the most common formats for describing APIs is OpenAPI (Swagger).
A very common task is to create TypeScript types based on the API specification. This can be a tedious and error-prone process if done manually, especially when the API changes frequently.
In this article, I'll show you how to generate TypeScript types based on a Swagger file using a simple npm package.

### How to generate types

For this example, we will use the openAPI specs from a sample pet store server. You can find the Swagger UI [here](https://petstore.swagger.io/) and the Swagger file [here](https://petstore.swagger.io/v2/swagger.json).
The package we will use is called [swagger-typescript-api](https://www.npmjs.com/package/swagger-typescript-api). It is a command-line tool that generates TypeScript types and API clients from OpenAPI (Swagger) specifications.
The package can be installed locally or used directly in your CLI, for this example, we will install start with the CLI option.

The most basic command to generate types is:

```
npx swagger-typescript-api generate --path https://petstore.swagger.io/v2/swagger.json"
```

Here we simply run the `generate` command from the package and pass the URL of the Swagger file. This will generate a file called `Api.ts` in the current directory with all the types defined in the Swagger file.

#### Generated file (or at least a part of it)

The generated file from our example will look something like this (I purposely left out a part of the file to keep it short and clear):

```typescript
export interface ApiResponse {
  /** @format int32 */
  code?: number
  type?: string
  message?: string
}

export interface Category {
  /** @format int64 */
  id?: number
  name?: string
}

export interface Pet {
  /** @format int64 */
  id?: number
  category?: Category
  /** @example "doggie" */
  name: string
  photoUrls: string[]
  tags?: Tag[]
  /** pet status in the store */
  status?: 'available' | 'pending' | 'sold'
}

export interface Tag {
  /** @format int64 */
  id?: number
  name?: string
}
```

### How to implement in your project

To implement this in your project, you can follow these steps:

1. Install the package:
   ```bash
   npm install swagger-typescript-api --save-dev
   ```
2. Create a script in your `package.json` file to generate the types:
   ```json
    "scripts": {
      "generate-types": "npx swagger-typescript-api generate --path https://petstore.swagger.io/v2/swagger.json --name generated --output ./generated"
    }
   ```

The key differences with the example script (besides installing the package locally) are the flags `--name` and `--output`:

- The `--name` flag allows you to specify the name of the generated file
- The `--output` flag allows you to specify the output directory. In this case, we are generating a file called `generated-prod-types.ts` in the `src/types/generated` directory.

### Some closing words

I really hope this article is helpful to you. I know that creating types based on a Swagger file or API endpoint can be a tedious task, but with this package, it became a breeze in some of the projects I work on.
