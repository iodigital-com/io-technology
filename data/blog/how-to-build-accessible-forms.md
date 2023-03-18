---
title: 'How to build accessible forms?'
date: '2023-03-01'
tags: ['frontend', 'a11y', 'accessibility']
summary: 'Within our data-driven world, forms are essential in gathering information. Filling in that information should be easy, straightforward and accessible to everyone.'
authors: ['tim-dujardin']
theme: 'rouge'
serie: 'how-to-build-accessible-components'
---

## Introduction

16% of the world's population (1.3 billion people) experience significant disability, that is 1 in 6 of us.
Can you imagine how many important data you would miss when your form is not accessible? Making your form accessible
will help those 16% ànd your business to thrive by sharing and collecting more quality data.

In this article, I will be using
[VoiceOver](https://support.apple.com/en-gb/guide/voiceover/vo2682/mac), the default screen reader on Mac, to illustrate
examples. If you need more information concerning screen readers or assistive technology, please read the introduction
of the first blog post in this series: <a href="/articles/how-to-build-accessible-main-navigation">"How to build
accessible main navigation?"</a>.

These are some terms I use alternatively throughout the article:

| Abbreviation | Term                 |
| ------------ | -------------------- |
| a11y         | Accessibility        |
| AT           | Assistive Technology |
| SR           | Screen reader        |

## Accessible in 4 steps

This article will guide you through the most important aspects of form accessibility in 4 steps:

1. Labels and input types
2. Form field attributes
3. Structuring a form
4. Form validation

### 1. Labels and input types

This step shouldn't even be in this guide, since it is that straightforward.
Yet, we sometimes manage to make this overcomplicated and inaccessible.

For example: I need to collect a full name and username.

#### 1.1 No labels

Can you make a distinction between the 'Full name' and the 'Username' field when using only placeholders and no labels?

> AT info: When focusing on an `<input>` field with a `placeholder` attribute, not all screen readers mention the
> placeholder value in the announcement, so you should always use a `<label>`. Next to that, accessibility is about
> equality so users without a visual impairment and/or screen reader should also be able to distinguish these 2 fields.

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Inaccessible form: no label" src="https://codepen.io/timdujardin/embed/BaOPZGJ?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/timdujardin/pen/BaOPZGJ">
  Inaccessible form: no label</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

#### 1.2 Labels but no association

I guess you would prefer labels for each field? Looks much better now, but this only solves the visual context.
Accessible form fields also need programmatic context, which means correct associations between label and form field.

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Accessible form: with label" src="https://codepen.io/timdujardin/embed/oNPMwRz?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/timdujardin/pen/oNPMwRz">
  Inaccessible form: with label but no association</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

#### 1.3 Accessible form field with label association

To associate a label programmaticaly with a form field, you need 2 things.

1. An `id` attribute on the `<input>` element
2. A `for` attribute on the `<label>` element, using the input `id`.

```HTML
<form>
    <div class="form-item">
        <label for="username">Username</label>
        <input id="username" type="text" />
    </div>
    <div class="form-item">
        <label for="full-name">Full name</label>
        <input id="full-name" type="text" />
    </div>
</form>
```
