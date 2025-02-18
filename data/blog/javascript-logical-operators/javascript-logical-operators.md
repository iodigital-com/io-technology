---
title: 'JavaScript Logical Operators: A practical perspective in TypeScript'
date: '2024-07-22'
tags: ['JavaScript', 'TypeScript']
summary: 'This article approaches logical operators from a practical perspective by giving more real-life examples and describing guidelines on when to use what.'
authors: ['anthony-bendeler']
theme: 'green'
---

When you think about building applications, a big part of it revolves around rules. Your code needs to do, show, and or return something. Often, we have to compare values with each other and write behavior based on certain conditions. We have a few operators in JavaScript that can help us with this.

## The logical OR operator `||`

The logical OR operator comes in handy when you must choose between two expressions and choose either of the two that is truthy.

```typescript {16}
enum InvoiceStatus {
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  OPEN = 'open',
  PROCESSING = 'processing',
}

type Invoice = {
  // ...rest
  status: InvoiceStatus
}

const hasUnpaidInvoices = (invoices: Invoice[]): boolean =>
  invoices.some(
    (invoice) =>
      invoice.status === InvoiceStatus.OPEN || invoice.status === InvoiceStatus.PROCESSING
  )
```

## The logical AND operator `&&`

Given that `condition1` is true and `condition2` is true, evaluate to true. Otherwise, evaluate to false. I use it in conjunction with the logical OR operator to keep data consistent, because, without it, you get either what you evaluate or the boolean value false, which is not what you actually might want to work with further down the chain. In TypeScript you are warned, which saves you some unexpected behavior.

```typescript {16}
type Product = {
  id: string
  price: number
}

type Basket = {
  products: Product[]
}

type Customer = {
  savedPoints: number
}

function determineTotalPrice(savedPoints: number, products: Product[]): number {
  const discount = Math.floor(savedPoints / 100) * 5
  const totalPrice = products.reduce(
    (totalPrice, { price }) =>
      // you could also use a ternary operator here, but this is just an example
      (typeof price === 'number' && totalPrice + price) || totalPrice,
    0
  )
  return totalPrice - discount
}
```

Notice I did some type checking on something that I declared already as a number. There are cases where you don't have control over the data that you will work with (e.g. external api). If you don't have some validation layer in between your business logic and a data dependency, you might want to build in some defensive programming. For simplicity's sake, I used only the price of Product as an example of this.

## The nullish coalescing operator `??`

I personally am not a fan of using it and I avoid it as much as possible. It also helps that I am mostly a back-end developer (NestJS) and that I am using TypeScript.

As stated in the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#logical_operators), it is a special logical OR operator, but it evaluates any non-truthy value other than `null` and `undefined` as truthy: `''`, `0`, `NaN` and `false`.

The practical question is: when would I prefer those non-truthy values over a default value? I have scanned some front-end projects and I have seen other developers use the operator where for me it doesn't make any sense.

```typescript {16}
export enum EnergyTypes {
  Electricity = 'Electricity',
  Gas = 'Gas',
  Undefined = 'Undefined',
}

// data is undefined or an object
const data = useGetActiveEnergyType(ean).data
const activeEnergyType = data ?? EnergyTypes.Electricity
```

Since data can be `undefined`, you might as well use `||` instead of `??`.

```typescript {16}
<StyledMenu
  open={!!anchorElement}
  anchorEl={anchorElement}
  onClose={() => setAnchorElement(null)}
  defaultValue={locale ?? 'nl'}
  sx={{ left: { sx: '46px', lg: '-4px' } }}
>
  {children}
</StyledMenu>
```

Since locale can be `undefined` and maybe even an empty string, you don't want to keep the empty string, so you default to `'nl'`. Hence, `||`is a better candidate.

```typescript {16}
function someRenderFunction() {
  return (
    <TextField
      inputRef={ref}
      {...props}
      {...fieldProps}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? ' '}
      onChange={handleOnChange}
    />
  )
}
```

I am not sure if this is a typo, but the default value would be a string with a whitespace. This means that you would not want to keep an empty string in the first place. Again, `||` is the better choice.

```typescript {16}
const firstName = `${data?.firstName ?? ''}`
```

If for whatever reason firstName is false or an empty string and you default to an empty string, wouldn't `||` also just be the better choice?

My take on this operator is that it is heavily overused for cases where the OR operator is good enough when you make sure you can keep your data consistent.

## Short-circuiting

There is also a difference on how these logical operators proceed in processing your code.
The logical AND operator will not evaluate the expression on its right side if the expression on its left is already non-truthy.

The logical OR operator (and nullish coalescing operator) will not evaluate the expression on its right side if the left side is already truthy.

This might have a significant impact on your performance if an action or state depends on heavy calculations. Here is an example for the AND operator.

```typescript {16}
async function determineNextCourseofAction(customer) {
  const history = await getHistory(customer)
  if (customer.isReady && history.canContinue) {
    return ACTION.PROCEED
  }
  return ACTION.WAIT
}
```

Though the code is easy to read, it is also inefficient if :

- `getHistory` makes a heavy call;
- `getHistory` makes makes complex calculations with possibly a lot of data
- the flow depends firstly on whether the customer is ready or not.

A better way to write this would be (including the ternary operator):

```typescript {16}
async function determineNextCourseofAction(customer) {
  if (customer.isReady) {
    const history = await getHistory(customer)
    return history.canContinue ? ACTION.PROCEED : ACTION.WAIT
  }
  return ACTION.WAIT
}
```

## Spaghetti Code

You can make it quite hard for a fellow developer if you make complicated evaluations.

```typescript {16}
const determineNextCourseOfAction = (order, customer) => {
  return (order.status === 'open' && customer.balance > 0) || order.status === 'pending'
    ? 'sendOrder'
    : 'sendReminderEmail'
}
```

I am more in favour of being verbose and explain what everything means in human language, even though this will result in more declarations:

```typescript {16}
const determineNextCourseOfAction = (order, customer) => {
  const customerCanProceed = order.status === 'open' && customer.balance > 0
  const orderIsAlreadyPaid = order.status === 'pending'
  const canSendOrder = customerCanProceed || orderIsAlreadyPaid
  return canSendOrder ? 'sendOrder' : 'sendReminderEmail'
}
```

## Guidelines

- Use logical AND only for when you have simple scenarios where you want to check on whether a condition is met. If the expression on the left of the operator is true, then the expression on the right will also be evaluated. If the expression on the left is false, then the right will not be evaluated.

- Use logical OR for simple scenarios where your logic is dependent on either of the two expressions. If the expression on the left of the operator is true, then the expression on the right will not be evaluated.

- Use a combination of logical AND and OR for more complex scenarios. Consider also using the ternary operator where possible, as this makes it easier to read in most cases.

- Keep short circuiting in mind when you write your code. Make the least expensive evaluation the last one to evaluate if behaviour depends on either of the two.

- Do not use `??` when you could also use `||`. This depends on the scenarios where your default value would be meaningful, but where `false`, `''` or `0` should still be regarded as a valid and meaningful value as well. I would still recommend avoiding it, because `NaN` will also be kept using `??`.

- Do not explode your functions with complicated checks. Declare multiple variables that hold a specific value and combine them later. This will make your code more pleasant to read.
