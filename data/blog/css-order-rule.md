---
title: 'TIL: The CSS `order` Property Requires Each Grid/Flex Item to be `order`ed'
date: '2023-09-06'
tags: ['css']
summary: 'To use order on one element means using order on each of its siblings, too.'
authors: ['remy-parzinski']
theme: 'blue'
---

I was today years old when I learned something new about the CSS `order` property. I didn't learn about the existence of the property today, mind you. I just learned about a constriction which, in my opinion, makes it less usable. You see... when you want to `order` a `flex` or `grid` item, you have to `order` all of them. You can't just `order` one of them. Let me show you what I mean.

According to its [formal definition on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/order#formal_definition), its inital value is `0` (zero), meaning it does have a value. When you `order` an item, it will be visually ordered according to its value compared to its siblings's `order` value. Any item with the same `order` value will be visually ordered by its place in the DOM. Have a look at this example:

```html
<style>
  .flex-container {
    display: flex;
  }
</style>
<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item" style="order: 1">Item 3</div>
</div>
```

You would expect `Item 2` and `Item 3` to be vissually swapped. They are not, though. Both `Item 1` and `Item 2` have an implicit/default `order: 0`. Because `Item 3` has an `order: 1`, it is ordered after `Item 1` and `Item 2`. The `order` property is not additive. It is not relative. It is absolute. If you want to `order` one item, you have to `order` all of them. This is true for both `flex` and `grid`.

To order any element, you have to order all of them. This is not a big problem, as usually you wil generate lists of items with a loop (like `v-for` in Vue or `*ngFor` in Angular or `Array.prototype.map` in JSX). You can easily retrieve the current iteration index and use that for `order`. It's just weird to me that it is necessary. I would expect `order` to have a default value of `auto`, making the visual order default to the DOM order.

So, to make sure that `Item 3` is visually ordered _before_ `Item 2`, you have to explicitly set `order: 2` on `Item 2` (or any value higher than `1`).

```html
<div class="flex-container">
  <div class="flex-item" style="order: 1">Item 1</div>
  <div class="flex-item" style="order: 2">Item 2</div>
  <div class="flex-item" style="order: 1">Item 3</div>
</div>
```

No big deal, but something to keep in mind when you want to use the `order` property.
