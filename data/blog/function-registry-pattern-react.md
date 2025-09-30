---
title: 'From If-Else Hell to Clean Architecture with Function Registry Pattern'
date: '2025-09-30'
tags: ['JavaScript', 'React', 'TypeScript', 'Architecture', 'Design Patterns']
authors: ['mohsen-mahabadi']
summary: 'Stop writing giant if-else blocks for data transformation. Build clean, extensible code with the Function Registry pattern instead.'
theme: 'blue'
---

> **Note:** While I'll use React examples throughout this article, this pattern works beautifully in Vue, Angular, vanilla JavaScript, Node.js, or any JavaScript environment where you need clean data transformation.

As developers, we deal with this all the time - transforming JSON data to fit our project's type structure. Sometimes it gets way more complicated than it should.

### The Common Problem: The Giant If-Else Nightmare

Here's how it usually goes: You get some JSON data from an API, or a config file, or some schema definition, and you need to turn it into something your app can actually use. Sounds simple enough, right? But somehow, that 'quick transformation function' you wrote last month has turned into a 200-line that nobody wants to touch.

**Let me show you what I mean with a real example.**

Picture this: you're building a form generator that takes JSON schemas and creates React forms. Each schema type needs to become the right component - strings become text inputs, numbers become number fields, booleans become switches.

You start simple:

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

  if (
    typeof props === 'object' &&
    props !== null &&
    'type' in props &&
    typeof props.type === 'string' &&
    props.type === 'text'
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

**Problems with this approach**:

- **Adding features is scary**: Want a new field type like color-picker, upload field and so on? Better pray you don't break the existing ones
- **Nobody wants to touch it**: Come back after a few months and it's like reading hieroglyphics
- **Repetitive conditions**: That `typeof props === 'object' && props !== null && 'type' in props` check appears in every single condition
- **Difficult to test**: You need to test boolean logic AND number logic AND object logic all in one massive test suite
- **Violates SOLID principles**: This one function does type checking, creates components, handles validation, AND manages defaults
- **Poor scalability**: Started with 4 field types, now you have 15+ and counting

---

### Let's Improve the Code

**"Okay, this is getting messy..."** you think to yourself.

The first instinct most of us have is to clean this up with type guards. Let's extract those repetitive type checks:

#### Step 1: Adding Type Guards

**Improvement: Type Safety**

Instead of repeating the same type-checking logic everywhere, let's create reusable type guards:

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

export const isTextSchema = (schema: unknown): schema is TextSchema => {
  return isPrimitiveSchema(schema) && (schema as any).type === 'text'
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

Now our main function is much more readable:

```ts
export const transformJson = (props: unknown) => {
  if (isBooleanSchema(props)) {
    // return ...
  }

  if (isNumberSchema(props)) {
    // return ...
  }

  if (isTextSchema(props)) {
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

This feels better, right? The conditions are readable, TypeScript is happy, and we've eliminated that repetitive type-checking code.

**_But here's the thing - we're still not quite there yet..._**

#### Step 2: Extracting Transformer Functions

**Improvement: Single Responsibility**

**"I can do better than this,"** you think. So you take it a step further - why not extract each transformation into its own function?

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

**Now we're talking!**

Each transformation has its own home, the main function is cleaner, and everything feels more organized.

**But if you've been coding for a while, you might be getting that familiar feeling that something's still not quite right...**

#### What's Still Bothering Us?

Here's the thing - even with our improvements, we've actually created some new problems. Let me show you what I mean:

SOLID Principle Violations in our `transformJson` function:

- **Single Responsibility Principle (SRP)**: Our function is trying to be the dispatcher, type checker, AND error handler all at once
- **Open/Closed Principle (OCP)**: Want to add date fields? Time to crack open that main function again 😅
- **Dependency Inversion Principle (DIP)**: We're tightly coupled to specific transformer implementations

And that's not all:

- **Testability**: You can't test number validation without setting up the entire dispatch logic
- **Extensibility**: Adding types requires modifying existing, working code
- **Code Duplication**: Similar conditional patterns repeat across transformers

---

#### The Solution: Function Registry Design Pattern

**Now here's where it gets exciting!** 🎉

What if I told you there's a way to solve all these problems AND make your code more maintainable? There's a pattern that turns this transformation chaos into something elegant.

Enter the **Function Registry Design Pattern** - think of it as the "smart dispatcher" for your transformations.

**So what exactly is this pattern?**

Instead of one function trying to handle everything, the Function Registry pattern creates a system where:

- **Each transformer knows exactly what it can handle**
- **A smart registry automatically finds the right transformer**
- **Adding new transformers doesn't touch existing code**
- **Everything becomes testable in isolation**

![The image shows function registry pattern's diagram](/articles/function-registry-pattern/diagram.png)

**The workflow:** Input data flows to the registry, which automatically routes it to the right transformer, then returns the clean output.

### Why This Pattern Actually Matters

- **Extensibility**: Want to add file upload fields? Just write a new transformer and register it. Zero changes to existing code.
- **Single Responsibility**: Each transformer has one job. The boolean transformer only worries about switches, the number transformer only handles numeric inputs.
- **Testability**: Testing becomes easy - test your date transformer without worrying about boolean logic breaking.
- **Maintainability**: Six months later, you'll actually understand what each piece does instead of struggling through a 200-line conditional maze.
- **Reusability**: That date picker transformer you built? Works perfectly in your next project.
- **Performance**: Instead of checking 15 conditions every time, the registry stops at the first match.

### Implementation Guide

Let's build this step by step. Here's the file structure I recommend:

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

First, let's define some types to secure our code. This creates the contract that every transformer will follow:

```ts
// utils/fieldTransformers/types.ts
export type TransformRegistry = (params: unknown) => FieldSchema
export type TransformFunction = (params: unknown, registry: TransformRegistry) => FieldSchema
export type CanHandleFunction = (params: unknown) => boolean

export interface Transformer {
  name: string // Unique identifier for debugging
  canHandle: CanHandleFunction // "Can I process this data?"
  transform: TransformFunction // "Here's how I transform it"
}

export type CommonFieldProps = {
  name: string
  label: string
  description: string
  required: boolean
  type: string
}

export type FieldSchema = {
  name: string
  type: string
  component: string
  label?: string
  description?: string
  required?: boolean
  defaultValue?: any
}
```

**What's happening here:**

- **FieldSchema**: The standardized output format that all transformers return
- **TransformRegistry**: The main function signature that processes any input
- **Transformer interface**: The contract every transformer must follow - just three simple methods
- **CanHandleFunction**: Returns true/false based on whether this transformer can process the input
- **TransformFunction**: Does the actual transformation work

### Step 2: Create the Registry System

Now we build the "smart dispatcher":

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

**Explanation of Step 2**:

- **transformers**: Stores all registered transformer functions
- **registerTransformer**: Adds a new transformer to the registry
- **findTransformer**: Finds the first transformer that `canHandle` matches
- **createTransformRegistry**: Creates the main `registry` function that:
  - Picks the correct transformer for the input
  - Falls back to a default when none match
  - Passes the registry itself for recursive transformations

**The recursive part is key**: when a transformer encounters nested data (like object properties), it can call the registry again to handle those nested pieces.

#### Step 3: Create Individual Transformers

Now let's build our transformers. Each one handles a specific data type:

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

**Explanation of Step 3**:

Each transformer follows a consistent pattern:

- **name**: Unique identifier for debugging and logging
- **canHandle**: Type guard function that determines if this transformer can process the given data
- **transform**: Implements transformation logic and can call `registry` for recursion

**Key insight**: when `objectTransformer` finds nested properties, it calls the registry again for each one. So if you have an object with arrays containing more objects, everything just works automatically.

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

**Explanation of Step 4**:

This step brings everything together:

- **Order matters**: Transformers are registered from most specific to most general. The registry will use the first transformer whose `canHandle` returns true
- **Single export**: We export one main `transformField` function that encapsulates all the complexity
- **Type exports**: We export the types so other parts of the application can create their own transformers if needed

**Why order matters**: If you put a general transformer first, it might catch data that a more specific transformer should handle.

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

**That's it!** Clean, memoized, and it just works. Notice how simple the usage is, just call transformField and let the registry handle all the complexity.

### Conclusion

The Function Registry Design Pattern transforms messy, hard-to-maintain transformation logic into clean, extensible architecture. By breaking down monolithic functions into specialized, registered transformers, we achieve:

**Technical benefits:**

- **Better maintainability** through separation of concerns
- **Enhanced extensibility** without modifying existing code
- **Improved testability** with isolated transformer functions
- **Cleaner architecture** that follows SOLID principles
- **Better performance** with first-match-wins lookup

**Real-world impact:**

- Adding new field types becomes straightforward instead of risky
- Code reviews focus on individual transformers, not complex conditionals
- New team members can contribute transformers without understanding the entire system
- Bugs are isolated to specific transformers, making debugging faster

This pattern is especially valuable when you frequently transform API responses, configuration objects, or schema definitions. It provides a solid foundation that can grow with your application's complexity while maintaining code quality.

**Next step**: Find that complex transformation function in your codebase and try converting just 2-3 conditions into transformers. You'll immediately see the difference in clarity and maintainability.
