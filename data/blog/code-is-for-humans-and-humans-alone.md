---
title: 'Code Is For Humans And Humans Alone'
date: '2023-07-18'
tags: ['clean-code', 'dx', 'code-quality', 'productivity']
images: ['/articles/code-is-for-humans-and-humans-alone/JavaScript-58acbb8a3df78c345bad32c2.webp']
summary: 'Write code for human beings to improve developer experience, readability and maintainability'
authors: ['remy-parzinski']
theme: 'blue'
---

# Code Is For Humans And Humans Alone

Code is for humans and humans alone. There, I said it. The computer/parser/translater/transpiler/compiler/_engine_ will understand anyway. More important is the human being reading it after you. Or even you in a few days/weeks/months time. The code's intent should be clear at first glance. This helps the reader navigate the code when adding a new feature, fix a bug, refactor it, or move it around. &lt;rant&gt;This is the main reason why I personally don't like atomic CSS&lt;/rant&gt;

> “Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. Code for readability”
>
> ― [John F. Woods](https://groups.google.com/g/comp.lang.c++/c/rYCO5yn4lXw/m/oITtSkZOtoUJ), September 1991

We've all read pieces of code which you had to read 7 times to understand its purpose. We've all seen this monstrous condition for an if statement using 9 variables over 4 line. We've all written these as well. Don't lie. All of us have written code which even you couldn't read anymore after a few weeks.

But, I concur: we've all done it perfectly right more times than not. Keep it going!

## How Humans Read Code

Everything we read is translated into a natural language. Usually in the natural language the programming language is based on, which, in most cases, is English. This starts when writing code. In that case you are "translating" the requirements, written in a natural language, into code. Knowing that, it would make sense to write code as close to English as possible. Within the boundaries of the programming language, of course. I'll use the terms English and JavaScript from here on while it can be applied to any natural language and programming language, respectively.

Usually when reading code you are scanning the file for anything that is related to the problem you're solving. You want to see the logic and not be bothered with the details which are applied by the logic. You want to keep scanning untill you've found what you're looking for. Scanning a file means identifying the intent of each statement. If you can't identify the intent of the statement you are stopped in your tracks to see if it relates to your goal. Being stopped in your tracks is annoying and wasted time. That's why it is important to write code as how you would read it.

Although JavaScript's keywords are in English, its syntax doesn't look like it. Its readability is in your own hands. Thankfully, there are a lot of everyday tools we can use for that. By changing the way we write our code we can help our future readers understand what they're looking at. Maybe, by the off chance, even make it comprehensible for them.

### SQL

Take a look at SQL (Structured Query Language). Its initial name was SEQUEL (Structured English Query Language). The idea behind the syntax was to make it as close to English as possible so anyone could read it. Even people that don't know the language. I'm not going into details about SQL but nearly anybody can read these CRUD operations and understand their intent at first glance.

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

The same principle was applied to [Gherkin](https://cucumber.io/docs/gherkin/). Gherkin is a testing language for testing software. The idea behind it is that the people who write the software's requirements write them in a specific syntax which the developers use to test the code they write. The language perfectly describes the software's [behaviour](https://cucumber.io/docs/bdd/). But more importantly, its intent. Unfortunately, it is only usable in a testing environment.

## Examples and Tips

Here are a few examples of "unreadable" code and tips on how to make them readable.

```js
// Let there be light
let there = 'light'
```

### Use Proper Naming

The name of your variables, functions, classes, interface, types, etc. should describe their intent. Be aware that your code is probably subject to [minification](<https://en.wikipedia.org/wiki/Minification_(programming)>), so the length of your variables don't matter to the engine. One is short, the other is very much readable. (I know, we should use `Array.prototype.reduce` here)

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
let c = [
    /*...*/
  ],
  i = 0
for (let j = 0; j < cart.length; j++) i += c[j].amount
```

So you see, the engine will read the same thing regardless. So why not write it for a human being to read?

```js
// Instead of
const x = {
  // ...
}
somePackage.configure(x)

// Use
const somePackageConfig = {
  //...
}
somePackage.configure(somePackageConfig)
```

If the `somePackageConfig` object becomes too big you can move it into a distinct file and import it. Thtat we don't have to scan past the configuration and be distracted by it.

Sometimes it's just better to make a variable out of a statement so you can name it and describe its intent.

```js
// Instead of
const fourtyTwoDaysAgo = new Date(chosenDate - 1000 * 60 * 60 * 24 * 42)

// Use
const fourtyTwoDays = 3628800000 // 1000 * 60 * 60 * 24 * 42
const fourtyTwoDaysAgo = new Date(chosenDate - fourtyTwoDays)
```

### Conditionals

For starters: [Please don't write confusing conditionals](https://dev.to/somedood/please-dont-write-confusing-conditionals-2n32). _Don't stay not affirmattive_.

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
  (file.type === 'DOCX' && file.lastModified <= new Date(fourtyTwoDaysAgo)) ||
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
const isSmallPDF = file.type === 'PDF' && file.size <= 42
const isRecentWordDocument = file.type === 'DOCX' && file.lastModified <= new Date(fourtyTwoDaysAgo)
const fileContains42 = (await file.text()).indexOf('42') !== -1

if (file.type !== 'PDF' || isSmallPDF || isRecentWordDocument || fileContains42) {
  doSomething()
}
```

In English

> "If it's NOT a PDF or a small PFD OR it's a recent Word document OR the file contains '42'"

This is way more readable. Both in code and in a natural language. The details are now "hidden" in variables with names that make sense. You don't need to know the specifics when scanning the code. Since the variables are still around, you can easily access them when necessary. But what if I told you we can go even further?

```js
// utils.js
export const isFileValid = async (file) => {
  const isSmallPDF = file.type === 'PDF' && file.size <= 42
  const isRecentWordDocument =
    file.type === 'DOCX' && file.lastModified <= new Date(fourtyTwoDaysAgo)
  const fileContains42 = (await file.text()).indexOf('42') !== -1

  return file.type === 'PDF' || isSmallPDF || isRecentWordDocument || fileContains42
}
```

```js
// app.js
import { isFileValid } from './utils'
const myFile = new File(/* upload from an input field */)

if (isFileValid(myFile)) {
  doSomething()
}
```

In English:

> "If `myFile` is valid"

Now this almost looks like English. As mentioned above, you don't need to know about the details when scanning the code, only if there is something wrong with the file validation. By hiding the validation logic away in a function with a sensible name we've made it easy to identify its intent and you are no longer stopped in your tracks. **Bonus**: the function is reuseable!

I do recommend going through all these steps when writing your code. First make it verbose. As a writer you _need_ to know the specifics. When it works, is unreadable, and you've properly tested it try and make it more readable.

#### Ternary statements

Ternary statements are great! ...as long as you keep them ~~on 1 line~~ simple. ...and they are not nested.

```js
// Instead of
const className = isActive ? 'element--active' : (isFocussed ? 'element--focussed' : 'element')

// Use
const focusClass = isFocussed ? 'element--focussed' : 'element'
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

Yuck! The `else` statement has a [logical operator](https://codeburst.io/javascript-what-is-short-circuit-evaluation-ff22b2f5608c) when truthiness is evaluated. This expression is perfectly fine, albeit not easy to read. There's even a case which is not supported in here. What about `files.length === 0`?

The idea behind this whole expression is to create a comma separated string of all file names in the `files` array-like. Because of the `Array.prototype.map` function will iterate over each and every element - even if it's just 1 - we don't need to check for the array-like's length before hand. Lets make this a bit more readable and in the mean time cover all cases.

```js
// The more performant way
const fileNameString = Array.from(files, (file) => file.name).join(', ') || ''

// The more readable way
const fileNameString =
  Array.from(files)
    .map((file) => file.name)
    .join(', ') || ''
```

#### Switch cases

Most `switch` cases I've seen had the exact same operation with a different value based its `case`. The same applies to multiple `else if` blocks. Unless you have actually different operations per `case`/`else if`. Then you can use a `switch`.

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

Yes. You are right. There are always exceptions. Sometimes the problem you're solving is so complex it requires you write unreadable code. Or sometimes performance is way more important that you need to write something which is percievably repulsive. If that's your case, which is perfectly reasonable, always use comments to describe it. Never think that "they will understand". In these cases you'd rather use a comment too many than that the next one spends 5+ minutes trying to figure it out.

### Bitwise operators

Prime example. JavaScript's [bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_operators) (`&`, `|`, `~`, etc) can do some real good magic. Usually they're way faster than non-numerical counterparts. The problem with these is that they are numerical. Both operands are first coerced into a decimal number and then the oparator is applied, leaving a new decimal number.

```js
// A common use was
const containsApples = ~fruitBasket.indexOf('apple')

// Instead of
const containsApples = fruitBasket.indexOf('apple') !== -1
```

Not a lot of people understand what is happening here (because nobody needs to use them) and it takes a few sentences in English to explain. The result of both expression is exactly the same, though. So, when would you use the bitwise operators? When you need to oparate on bits. And in some cases they're more performant then the alternatives, so when that's more important use them and add a comment.

## Summary

Code Is For Humans And Humans Alone. Write it for humans to read. Take the mental load off. Help thy self. Help thy neighbour!
