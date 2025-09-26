---
title: 'From If-Else Hell to Clean Architecture: Implementing Function Registry Pattern in React'
date: '2025-09-26'
tags: ['JavaScript', 'React', 'TypeScript', 'Architecture', 'Design Patterns']
authors: ['mohsen-mahabadi']
summary: 'Escape conditional chaos in React by replacing giant if-else trees with a clean, extensible Function Registry pattern for transforming JSON schemas into UI components.'
theme: 'blue'
---

### Introduction

> As developers, in our daily life, most of the time we have to transform JSON data to our project's type structure and sometimes it's too complicated.

One of the most common challenges in React development is transforming complex JSON data structures into our application's type system. Whether it's API responses, configuration files, or schema definitions, we often find ourselves writing transformation logic that becomes increasingly difficult to maintain.

### The Common Problem: The Giant If-Else Monster

We usually start with a transformer file that includes a lot of if-else statements.

> Suppose we want to create a dynamic form generator in React that takes a JSON schema and converts it into form fields. Each schema type (string, number, boolean, object, array) needs to be transformed into its corresponding React form component.

```ts
export const transformJson = (props: unknown) => {
  if (typeof props === 'object' && props !== null && 'type' in props && props.type === 'boolean') {
    // return ...
  }

  if (
    typeof props === 'object' &&
    props !== null &&
    'type' in props &&
    typeof props.type === 'string' &&
    props.type === 'number'
  ) {
    // return ...
  }

  if (typeof props === 'object' && props !== null && 'type' in props && props.type === 'object') {
    // return ...
  }

  if (typeof props === 'object' && props !== null && 'type' in props && props.type === 'array') {
    // return ...
  }

  // and so on ....
}
```

⚠️ Problems with this approach:

- **Confusing after time**: Hard to reason about after months
- **Poor maintainability**: Core logic sprawls and is hard to change
- **Bug-prone**: Fixes are risky and time-consuming
- **Unscalable**: Gets unwieldy as more conditions are added

### Evolution Step 1: Adding Type Guards

🔄 Improvement: Type Safety

We can add some type guards to make the code more clear and type-safe:

```ts
export const isPrimitiveSchema = (schema: unknown): schema is PrimitiveSchema => {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'type' in schema &&
    typeof (schema as any).type === 'string' &&
    ['text', 'number', 'boolean'].includes((schema as any).type)
  )
}

export const isNumberSchema = (schema: unknown): schema is NumberSchema => {
  return isPrimitiveSchema(schema) && (schema as any).type === 'number'
}

export const isBooleanSchema = (schema: unknown): schema is BooleanSchema => {
  return isPrimitiveSchema(schema) && (schema as any).type === 'boolean'
}

export const isArraySchema = (schema: unknown): schema is ArraySchema => {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'type' in schema &&
    (schema as any).type === 'array'
  )
}

export const isObjectSchema = (schema: unknown): schema is ObjectSchema => {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'type' in schema &&
    (schema as any).type === 'object'
  )
}
```

Now we have cleaner code with type guards:

```ts
export const transformJson = (props: unknown) => {
  if (isBooleanSchema(props)) {
    // return ...
  }

  if (isNumberSchema(props)) {
    // return ...
  }

  if (isObjectSchema(props)) {
    // return ...
  }

  if (isArraySchema(props)) {
    // return ...
  }

  // and so on ....
}
```

### Evolution Step 2: Extracting Transformer Functions

🔄 Improvement: Single Responsibility

We can even make our function cleaner by moving each transformation logic to its own function.

```ts
export const transformJson = (props: unknown) => {
  if (isPrimitiveSchema(props)) {
    return primitiveTransformer(props)
  }

  if (isObjectSchema(props)) {
    return objectTransformer(props)
  }

  if (isArraySchema(props)) {
    return arrayTransformer(props)
  }

  // and so on ....
}
```

#### The Remaining Problems

🚫 SOLID Principle Violations in `transformJson`:

- **Single Responsibility Principle (SRP)**: The function handles multiple transformation types instead of focusing on one responsibility
- **Open/Closed Principle (OCP)**: Adding new transformation types requires modifying the existing function
- **Dependency Inversion Principle (DIP)**: The function depends on concrete transformer implementations rather than abstractions

Additional issues:

- **Maintainability**: Hard to understand and modify as it grows
- **Testability**: Difficult to test individual transformation logic in isolation
- **Extensibility**: Adding new types requires modifying the core function
- **Code Duplication**: Similar conditional patterns repeat across transformers

#### The Solution: Function Registry Design Pattern

So to avoid these violations and make it maintainable and extensible, we can use the Function Registry Design Pattern.

### What is the Function Registry design pattern?

The Function Registry Design Pattern is a behavioral pattern that maintains a registry of functions (transformers) that can handle specific types of data. Instead of a monolithic function with multiple conditions, the pattern allows you to:

- **Register** specialized transformer functions
- **Select** the appropriate transformer based on data type
- **Execute** the transformation using the selected transformer

#### Benefits of the Function Registry Pattern

- **Extensibility**: Easy to add new transformers without modifying existing code
- **Single Responsibility**: Each transformer handles only one specific data type
- **Testability**: Individual transformers can be unit tested in isolation
- **Maintainability**: Clear separation of concerns makes code easier to understand
- **Reusability**: Transformers can be reused across different projects
- **Performance**: No need to check all conditions - registry finds the right transformer directly

### Implementation Guide

To implement the Function Registry pattern, I recommend creating a file structure like this:

```txt
utils/fieldTransformers/
├── index.ts                 # Main exports
├── registry.ts              # Transformer registry
├── types.ts                 # Shared types
├── utils/                   # Helper functions
│   ├── commonProps.ts
│   └── defaultField.ts
└── transformers/            # Individual transformers
    ├── primitiveTransformer.ts
    ├── objectTransformer.ts
    └── arrayTransformer.ts
```

### Step 1: Define Types

First of all, let's define some types to secure our code.

```ts
// utils/fieldTransformers/types.ts
export type TransformRegistry = (params: unknown) => FieldSchema
export type TransformFunction = (params: unknown, registry: TransformRegistry) => FieldSchema
export type CanHandleFunction = (params: unknown) => boolean

export interface Transformer {
  name: string
  canHandle: CanHandleFunction
  transform: TransformFunction
}

export type CommonFieldProps = {
  name: string
  label: string
  description: string
  required: boolean
  type: string
}
```

### Step 2: Create the Registry System

```ts
// utils/fieldTransformers/registry.ts
import type { Transformer, TransformRegistry } from './types'
import { createDefaultField } from './utils/defaultField'

const transformers: Transformer[] = []

export const registerTransformer = (transformer: Transformer): void => {
  transformers.push(transformer)
}

export const findTransformer = (props: unknown): Transformer | null => {
  return transformers.find((t) => t.canHandle(props)) || null
}

export const createTransformRegistry = (): TransformRegistry => {
  const registry: TransformRegistry = (params) => {
    const transformer = findTransformer(params)

    if (!transformer) {
      return createDefaultField(params)
    }

    return transformer.transform(params, registry)
  }

  return registry
}
```

Explanation of Step 2:

- **transformers**: Stores all registered transformer functions
- **registerTransformer**: Adds a new transformer to the registry
- **findTransformer**: Finds the first transformer that `canHandle` matches
- **createTransformRegistry**: Creates the main `registry` function that
  - Picks the correct transformer for the input
  - Falls back to a default when none match
  - Passes the registry itself for recursive transformations

#### Step 3: Create Individual Transformers

```ts
// utils/fieldTransformers/transformers/primitiveTransformer.ts
import { createSwitchField, createNumberField } from '../../../components/FormFields'
import { isBooleanSchema, isNumberSchema } from '../../typeGuards'
import type { Transformer } from '../types'
import { createCommonProps } from '../utils/commonProps'

export const booleanTransformer: Transformer = {
  name: 'boolean',
  canHandle: isBooleanSchema,
  transform: (params: any) => {
    const common = createCommonProps(params)

    return createSwitchField({
      ...common,
      defaultValue: false,
    })
  },
}

export const numberTransformer: Transformer = {
  name: 'number',
  canHandle: isNumberSchema,
  transform: (params: any) => {
    const common = createCommonProps(params)

    return createNumberField({
      ...common,
      min: params.minimum,
      max: params.maximum,
    })
  },
}
```

```ts
// utils/fieldTransformers/transformers/objectTransformer.ts
import { createObjectField } from '../../../components/FormFields'
import { isObjectSchema } from '../../typeGuards'
import type { Transformer, TransformRegistry } from '../types'
import { createCommonProps } from '../utils/commonProps'

export const objectTransformer: Transformer = {
  name: 'object',
  canHandle: isObjectSchema,
  transform: (params: any, registry: TransformRegistry) => {
    const common = createCommonProps(params)
    const { properties } = params

    const fields = Object.entries(properties).map(
      ([fieldName, fieldProps]) => registry(fieldProps) // Recursive transformation
    )

    return createObjectField({
      ...common,
      fields,
    })
  },
}
```

Explanation of Step 3:

Each transformer follows a consistent pattern:

- **name**: Unique identifier for debugging and logging
- **canHandle**: Type guard function that determines if this transformer can process the given data
- **transform**: Implements transformation logic and can call `registry` for recursion

**Key insight**: the `objectTransformer` shows how the pattern handles recursion—calling the registry for each nested property enables deeply-nested structures to be processed automatically.

#### Step 4: Register and Export

```ts
// utils/fieldTransformers/index.ts
import { registerTransformer, createTransformRegistry } from './registry'
import {
  booleanTransformer,
  numberTransformer,
  objectTransformer,
  arrayTransformer,
} from './transformers'

// Register transformers in priority order (most specific first)
registerTransformer(booleanTransformer)
registerTransformer(numberTransformer)
registerTransformer(objectTransformer)
registerTransformer(arrayTransformer)

// Create and export the main transform function
export const transformField = createTransformRegistry()

// Export types for external use
export type { Transformer, TransformFunction } from './types'
```

Explanation of Step 4:

This step brings everything together:

- **Order matters**: Transformers are registered from most specific to most general. The registry will use the first transformer whose `canHandle` returns true
- **Single export**: We export one main `transformField` function that encapsulates all the complexity
- **Type exports**: We export the types so other parts of the application can create their own transformers if needed

#### Step 5: Usage in React Components

Now you can use the clean, extensible transformer in your React components:

```tsx
import React, { useMemo, useCallback } from 'react'
import { transformField } from '../utils/fieldTransformers'

interface FormProps {
  schema: Record<string, unknown>
  onSubmit: (data: Record<string, any>) => void
}

const DynamicForm: React.FC<FormProps> = ({ schema, onSubmit }) => {
  // Memoize field transformations
  const fields = useMemo(() => {
    if (!schema) return [] as any[]

    return Object.entries(schema).map(([fieldName, fieldSchema]) =>
      transformField({
        name: fieldName,
        ...(fieldSchema as object),
      })
    )
  }, [schema])

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      const data = Object.fromEntries(formData as any)
      onSubmit(data)
    },
    [onSubmit]
  )

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field: any) => (
        <FieldComponent key={field.name} schema={field} />
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Conclusion

The Function Registry Design Pattern transforms complex, hard-to-maintain transformation logic into a clean, extensible architecture. By breaking down monolithic functions into specialized, registered transformers, we achieve:

- **Better maintainability** through separation of concerns
- **Enhanced extensibility** without modifying existing code
- **Improved testability** with isolated transformer functions
- **Cleaner architecture** that follows SOLID principles
- **Better performance** in React with proper memoization

This pattern is especially valuable in React projects where you frequently transform API responses, configuration objects, or schema definitions. It provides a solid foundation that can grow with your application's complexity while maintaining code quality and performance.
