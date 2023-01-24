---
title: 'Real live example of OpenAPI in a front-end project'
date: '2023-01-12'
tags: ['frontend', 'API', 'Architecture']
summary: ''
authors: ['maarten-van-hoof']
serie: 'frontend-loves-openapi'
---

I've created a [demo repository](https://github.com/vanhoofmaarten/openapi-monorepo-demo) showing the power of OpenAPI and automation in a front-end project.

[vanhoofmaarten/openapi-monorepo-demo](https://github.com/vanhoofmaarten/openapi-monorepo-demo) (github.com)

## Project structure

The project is set up as a monorepo. Each domain lives as a separate entity in the packages folder, but because they are very much interdependent, they are within the same repository.

```
.
├── packages/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── ...
│   ├── mock/
│   │   └── ...
│   ├── openapi/
│   │   ├── petstore.yml
│   │   └── ...
│   └── sdk/
│       ├── (generated API client)
│       └── ...
├── package.json
└── ...
```

### OpenAPI document

The OpenAPI document is fetched from a different repository using [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules). It contains its own linting rules and own automation. We include it in our project to refer to the OpenAPI document itself.

### SDK

The `sdk` folder only contains the configuration and scripts for generating a TypeScript-based API client by [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen/). Git ignores generated files.

```json
"scripts": {
  "dev": "npm run generate",
  "generate": "openapi --input ../openapi/petstore.yml --output ./src && tsc"
},
```

### Mocks

The `mocks` folder contains the configuration and scripts to run the [Prism](https://github.com/stoplightio/prism) mocking server.

```json
"scripts": {
  "dev": "prism mock -d ../openapi/petstore.yml"
}
```

### Front-end

The `front-end` folder contains a Vite application dependent on the SDK folder. In the main.ts file, we import the `PetsService`, set the SDK base URL, and fetch data with the `listPets` method. The retrieved data will be outputted in the HTML element with the id `preview`.

```ts
// Import the generated API client
import { OpenAPI, PetsService } from '../sdk/dist'

// Set the base URL of the API client
OpenAPI.BASE = 'http://localhost:4010'

// Fetch data
const data = await PetsService.listPets(3243)

// Output the data in the HTML
const preview = document.getElementById('preview')

if (preview) {
  preview.innerHTML = JSON.stringify(data, null, 2)
}
```

## Orchestration

With the help of Lerna, a tool to orchestrate monorepo tasks, when running `npm run dev`, our entire development will start with just one command. First, it will generate the SDK. Then it will start the Vite dev environment and the mocking server in parallel.

```sh
➜ npm run dev

> dev
> lerna run --parallel --scope @mrtnvh/*-sdk dev && lerna run --parallel --scope @mrtnvh/*-frontend --scope @mrtnvh/*-mock dev

lerna notice cli v5.1.6
lerna notice filter including "@mrtnvh/*-sdk"
lerna info filter [ '@mrtnvh/*-sdk' ]
lerna info Executing command in 1 package: "npm run dev"
@mrtnvh/frontend-loves-openapi-demo-sdk: > @mrtnvh/frontend-loves-openapi-demo-sdk@0.0.0 dev
@mrtnvh/frontend-loves-openapi-demo-sdk: > npm run generate
@mrtnvh/frontend-loves-openapi-demo-sdk: > @mrtnvh/frontend-loves-openapi-demo-sdk@0.0.0 generate
@mrtnvh/frontend-loves-openapi-demo-sdk: > openapi --input ../openapi/petstore.yml --output ./src && tsc
lerna success run Ran npm script 'dev' in 1 package in 2.0s:
lerna success - @mrtnvh/frontend-loves-openapi-demo-sdk

lerna notice cli v5.1.6
lerna notice filter including ["@mrtnvh/*-frontend","@mrtnvh/*-mock"]
lerna info filter [ '@mrtnvh/*-frontend', '@mrtnvh/*-mock' ]
lerna info Executing command in 2 packages: "npm run dev"
@mrtnvh/frontend-loves-openapi-demo-frontend: > @mrtnvh/frontend-loves-openapi-demo-frontend@0.0.0 dev
@mrtnvh/frontend-loves-openapi-demo-frontend: > vite

@mrtnvh/frontend-loves-openapi-demo-mock: > @mrtnvh/frontend-loves-openapi-demo-mock@0.0.0 dev
@mrtnvh/frontend-loves-openapi-demo-mock: > prism mock -d ../openapi/petstore.yml

@mrtnvh/frontend-loves-openapi-demo-frontend:   vite v2.9.13 dev server running at:
@mrtnvh/frontend-loves-openapi-demo-frontend:   > Local: http://localhost:3000/
@mrtnvh/frontend-loves-openapi-demo-frontend:   > Network: use `--host` to expose
@mrtnvh/frontend-loves-openapi-demo-frontend:   ready in 81ms.

@mrtnvh/frontend-loves-openapi-demo-mock: [2:51:01 PM] › [CLI] …  awaiting  Starting Prism…
@mrtnvh/frontend-loves-openapi-demo-mock: [2:51:01 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4010/Pets
@mrtnvh/frontend-loves-openapi-demo-mock: [2:51:01 PM] › [CLI] ℹ  info      POST       http://127.0.0.1:4010/Pets
@mrtnvh/frontend-loves-openapi-demo-mock: [2:51:01 PM] › [CLI] ℹ  info      GET        http://127.0.0.1:4010/pets/similique
@mrtnvh/frontend-loves-openapi-demo-mock: [2:51:01 PM] › [CLI] ▶  start     Prism is listening on http://127.0.0.1:4010
```

When we visit the front-end development server on the provided address, typically at `http://localhost:3000`, we see our list of mocked data, verifying that our solution works.

## Wrap-up

Using this project structure as default in all our projects has helped us reduce project setup time significantly. We can now focus on the end-user, building features that will improve the final product, rather then having to spend time on bootstrapping it.

If you'd made it here so far, thank you for reading! I hope you enjoyed this and that OpenAPI help you improve your API development workflow.
