---
title: 'Code Is For Humans And Humans Alone'
date: '2023-07-19'
tags: ['clean-code', 'dx', 'code-quality', 'productivity']
images: ['/articles/code-is-for-humans-and-humans-alone/JavaScript-58acbb8a3df78c345bad32c2.webp']
summary: 'Write code for human beings to improve developer experience, readability and maintainability'
authors: ['remy-parzinski']
theme: 'blue'
---

# Code Is For Humans And Humans Alone

Code is for humans and humans alone. There, I said it. The computer/<wbr />parser/<wbr />translator/<wbr />transpiler/<wbr />compiler/<wbr />_engine_ will understand anyway. More important is the human being reading it after you. Or even you in a few days/<wbr />weeks/<wbr />months time. The code's intent should be clear at first glance. This helps the reader navigate the code when adding a new feature, fixing a bug, refactoring it, or moving it around. &lt;rant&gt;This is the main reason why I personally don't like atomic CSS&lt;/rant&gt;

> “Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. Code for readability”
>
> ― [John F. Woods](https://groups.google.com/g/comp.lang.c++/c/rYCO5yn4lXw/m/oITtSkZOtoUJ), September 1991

All of us have seen pieces of code which you had to read 7 times to understand its purpose. A monstrous condition for an if statement using 9 variables over 4 lines. We've written these as well, including code you didn't understand a few weeks later. Don't lie.

But, I concur: we've all done it perfectly correctly more times than not. Keep it going!

## How Humans Read Code

Everything we read is translated into a natural language. In programming this is often based on the English language. It all starts with writing code. You are translating requirements from natural language into code. With this knowledge it makes sense to write code that is as close to English as possible. Within the boundaries of the programming language, of course. I'll use the terms English and JavaScript from here on while it can be applied to any natural language and programming language, respectively.

Usually when reading code you are scanning the file for anything that is related to the problem you're solving. You want to see the logic and not be bothered with irrelevant details. Your purpose is to identify the intent of these statements. If you can't understand the intention of the statement, you're stopped in your tracks, which is annoying and might end up wasting your time. That's why it is important to write code that people can read and understand.

Although JavaScript's keywords are in English, its syntax doesn't look like it. Its readability is in your own hands. Thankfully, there are a lot of tools we can use for that. By changing the way we write our code we can help our future readers understand what they're looking at.

### SQL

Take a look at SQL (Structured Query Language). Its initial name was SEQUEL (Structured English Query Language). The idea behind the syntax was to make it as similar to English as possible so anyone could read it. Even people who are unfamiliar with the language. I'm not going into details about SQL but nearly anybody can read these CRUD operations and understand their intent at first glance.

```sql
-- CREATE
INSERT INTO authors
(name, occupation)
VALUES
('Remy Parzinski', 'Frontend Developer');

-- READ
SELECT name, occupation FROM authors;

-- UPDATE
UPDATE authors
SET occupation='Front end Developer'
WHERE name='Remy Parzinski';

-- DELETE
DELETE FROM authors WHERE name='Remy Parzinski';
```

### Gherkin

The same principle was applied to [Gherkin](https://cucumber.io/docs/gherkin/), a language for testing software. It allows people to use its syntax to write feature requirements in a scenario-like way, which developers could directly use in their tests. The language perfectly describes the software's [behaviour](https://cucumber.io/docs/bdd/). But more importantly, its intent. Unfortunately, it is only usable in a testing environment.

## Examples and Tips

```js
// Let there be light
let there = 'light'
```

Here are a few examples of "unreadable" code and tips on how to make them readable.

### Use Proper Naming

The name of your variables, functions, classes, interface, types, etc. should describe their intent. Be aware that your code is probably subject to [minification](<https://en.wikipedia.org/wiki/Minification_(programming)>), so the length of your variables doesn't matter to the engine. One is short, the other is very much readable. (I know, we should use `Array.prototype.reduce` here)

```js
const cart = [
  { name: 'foo', amount: 18 },
  { name: 'bar', amount: 24 },
]
// Instead of
let sum = 0
for (let i = 0; i < cart.length; i++) {
  sum += cart[i].amount
}

// Use
let itemsInCart = 0
for (let index = 0; index < cart.length; index++) {
  const item = cart[index]
  itemsInCart += item.amount
}

// Both get minified to
// let c=[/*...*/],i=0;for(let j=0;j<cart.length;j++)i+=c[j].amount
```

So you see, the engine will read the same thing regardless. So why not write it for a human being to read?

```js
// Instead of
const x = {
  // ...
}
somePackage.configure(x)

// Use
const defaultConfig = {
  //...
}
somePackage.configure(defaultConfig)
```

If the `defaultConfig` object becomes too big you can move it into a distinct file and import it. That way we don't have to scan past the configuration and be distracted by it.

Sometimes it's just better to make a variable out of a statement so you can name it and describe its intent.

```js
// Instead of
const fortyTwoDaysAgo = new Date(chosenDate - 1000 * 60 * 60 * 24 * 42)

// Use
const fortyTwoDays = 1000 * 60 * 60 * 24 * 42
const fortyTwoDaysAgo = new Date(chosenDate - fortyTwoDays)
```

### Conditionals

For starters: [Please don't write confusing conditionals](https://dev.to/somedood/please-dont-write-confusing-conditionals-2n32). _Don't stay not affirmative_.

> "What?"
>
> ― You, seconds ago

**Stay affirmative**.

#### The incomprehensible multiline if-statement

```js
const file = new File(/* upload from an input field */)
if (
  file.type !== 'PDF' ||
  (file.type === 'PDF' && file.size <= 42) ||
  (file.type === 'DOCX' && file.lastModified <= new Date(fortyTwoDaysAgo)) ||
  (await file.text()).indexOf('42') !== -1
) {
  doSomething()
}
```

We've seen this (and probably even worse) before. You probably had to look a few times to understand it. The markup helps you read it just a bit and there are even some sugary parentheses but you were still stopped in your tracks while scanning. In plain English, this is what happens:

> "If it's NOT a PDF or a PDF no larger than 42 bytes OR it's a Word document which was touched in the last 42 days OR its contents don't contain the string '42'"

Even in English that's hard to grasp. We can make this more readable by introducing variables per section.

```js
const file = new File(/* upload from an input field */)
const isPDF = file.type === 'PDF'
const isSmallPDF = isPDF && file.size <= 42
const isRecentWordDocument = file.type === 'DOCX' && file.lastModified <= new Date(fortyTwoDaysAgo)
const fileContains42 = (await file.text()).indexOf('42') !== -1

if (!isPDF || isSmallPDF || isRecentWordDocument || fileContains42) {
  doSomething()
}
```

In English

> If it's NOT a PDF or a small PDF OR it's a recent Word document OR the file contains '42'

This is way more readable. Both in code and in a natural language. The details are now "hidden" in variables with names that make sense. You don't need to know the specifics when scanning the code. Since the variables are still around, you can easily access them when necessary. But what if I told you we can go even further?

```js:utils.js
export const isFileValid = async (file) => {
  const isPDF = file.type === 'PDF'
  const isSmallPDF = isPDF && file.size <= 42
  const isRecentWordDocument =
    file.type === 'DOCX' && file.lastModified <= new Date(fortyTwoDaysAgo)
  const fileContains42 = (await file.text()).indexOf('42') !== -1

  return !isPDF || isSmallPDF || isRecentWordDocument || fileContains42
}
```

```js:app.js
import { isFileValid } from './utils'
const myFile = new File(/* upload from an input field */)

if (isFileValid(myFile)) {
  doSomething()
}
```

In English:

> "If `myFile` is valid"

Now this almost looks like English! You only need the details when something is wrong with the file validation. By moving the validation logic away in a sensibly named function we've made it easy to identify its intent and you are no longer slowed down. **Bonus**: the function is reusable and testable!

I recommend going through all these steps when writing your code. First make it verbose, because as a writer you _need_ to know all the specifics. Make the code work, test the implementation and allow it to be unreadable. Then improve the readability.

#### Ternary statements

Ternary statements are great! ...as long as you keep them ~~on 1 line~~ simple. ...and they are not nested.

```js
// Instead of
const className = isActive ? 'element--active' : (isFocused ? 'element--focused' : 'element')

// Use
const focusClass = isFocused ? 'element--focused' : 'element'
const className = isActive ? 'element--active' : focusClass

// Or
const getFocusClass = (...args) => /* heavy operation */
const className = isActive ? 'element--active' : getFocusClass(...args)
```

**Don't ever use logical operators** in ternary statements. The mental load to follow this code is too damn high! Instead, apply the solution mentioned above and make the `else` value a variable with a sensible name.

```js
const fileNameString =
  files.length === 1
    ? files[0].name
    : files?.length > 1 &&
      Array.from(files)
        ?.map((file) => file.name)
        .join(', ')
```

Yuck! The `else` statement has a [logical operator](https://codeburst.io/javascript-what-is-short-circuit-evaluation-ff22b2f5608c) when truthiness is evaluated. This expression is perfectly fine, albeit not easy to read. There's even a case which is not supported in here. What if `files` holds no items?

The idea behind this whole expression is to create a comma separated string of all file names in the `files` array-like. Because the `Array.prototype.map` function will iterate over each and every element - even if it's just 1 - we don't need to check for the array-like's length beforehand. Let's make this a bit more readable and in the meantime cover all cases.

```js
// The more performant way (with 10.000.000+ items (arbitrary high number, perf test it first))
const fileNameString = Array.from(files, (file) => file.name).join(', ') || ''

// The more readable way
const fileNameString =
  Array.from(files)
    .map((file) => file.name)
    .join(', ') || ''
```

#### Switch cases

Most `switch` cases I've seen had the exact same operation with a different value based on its `case`. The same applies to multiple `else if` blocks. Unless you have actually different operations per `case`/`else if`. Then you can use a `switch`.

```js
// Instead of
function getValueByType(type) {
  switch (type) {
    case 'type1':
      return value1
    case 'type2':
      return value2
    case 'typeN':
      return valueN
    default:
      return valueDefault
  }
}
const value = getValueByType(/* some type */)

// Use
const typeValues = {
  type1: value1,
  type2: value2,
  typeN: valueN,
}
function getValueByType(type) {
  return typeValues[type] ?? valueDefault
}
const value = getValueByType(/* some type */)
```

### Iterations

JavaScript provides useful methods to loop over [iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration). Use them.

```js
const fruits = [
  /* items */
]

// Instead of
for (let i = 0; i < fruits.length; i++) {
  // ...
}

// Or
for (let fruit of fruits) {
  // ...
}

// Use
fruits.forEach(() => {
  // ...
})
```

Also make sure to use proper names in your loops. Don't use `item` if the iterable holds a specific type of item. Use the type's name instead.

```js
// Instead of
fruits.every((item) => {
    // ...
})

// Use
fruits.every((fruit) => {
    // ...
})

// Both are compiled to
f.every(g => /* */)
```

## There are always exceptions

"Yeah, that's nice and all but what about ...?"

Yes. You are right. There are always exceptions. Sometimes the problem you're solving is so complex it requires you to write unreadable code. Maybe the performance is way more important so you again write code that is perceivably repulsive. If that's the case, which is perfectly reasonable, always use comments to describe the case. Never assume that "they will understand". In these cases you'd rather use too many comments instead of the next developer spending 5+ minutes trying to figure it out.

### Bitwise operators

Prime example. JavaScript's [bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_operators) (`&`, `|`, `~`, etc) can do some real good magic. Usually they're way faster than non-numerical counterparts. The problem with these is that they are numerical. Both operands are first coerced into a decimal number and then the operator is applied, leaving a new decimal number.

```js
// A common use was
const containsApples = ~fruitBasket.indexOf('apple')

// Instead of
const containsApples = fruitBasket.indexOf('apple') !== -1
```

Not a lot of people understand what is happening here (because nobody needs to use them) and it takes a few sentences in English to explain. The result of both expressions is exactly the same. So, when would you use the bitwise operators? When you need to operate on bits. And in some cases they're more performant than the alternatives, so when that's more important use them and add a comment.

## Summary

Code Is For Humans And Humans Alone. Write it for humans to read. Take the mental load off. Help thyself. Help thy neighbour!
