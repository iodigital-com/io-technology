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

[16% of the world's population (1.3 billion people)](https://www.who.int/news-room/fact-sheets/detail/disability-and-health#:~:text=An%20estimated%201.3%20billion%20people%20%E2%80%93%20or%2016%25%20of%20the%20global,diseases%20and%20people%20living%20longer.) experience significant disability, that is 1 in 6 of us.
Can you imagine how many important data you would miss when your form is not accessible? Making your form accessible
will help those 16% ànd your business to thrive by sharing and collecting more quality data.

In this article, I will be using
[VoiceOver](https://support.apple.com/en-gb/guide/voiceover/vo2682/mac), the default screen reader on Mac, to illustrate
screen reader examples. If you need more information concerning screen readers or assistive technology, please read the introduction
of the first blog post in this series: <a href="/articles/how-to-build-accessible-main-navigation">"How to build
accessible main navigation?"</a>.

These are some terms I use alternatively throughout the article:

| Abbreviation | Term                 |
| ------------ | -------------------- |
| a11y         | Accessibility        |
| AT           | Assistive Technology |
| SR           | Screen reader        |

## Accessible in 5 steps

I will guide you through the most important aspects of form accessibility in 5 steps:

1. Labelling
2. Data input types
3. Form field attributes
4. Structuring a form
5. Form validation

## 1. Labelling

This step shouldn't even be in this guide, since it is that straightforward.
Yet, we sometimes manage to make this overcomplicated and inaccessible.

For example: I need to collect a full name and username.

### 1.1 No labels

Can you make a distinction between the 'Full name' and the 'Username' field when using only placeholders and no labels?

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Inaccessible form: no label" src="https://codepen.io/timdujardin/embed/BaOPZGJ?default-tab=result&theme-id=dark" frameBorder="no" loading="lazy" allowTransparency={true} allowFullScreen={true}>
  See the Pen <a href="https://codepen.io/timdujardin/pen/BaOPZGJ">
  Inaccessible form: no label</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The reason why you shouldn't use placeholders as labels:

- Placeholders disappear when the user starts typing, which makes it hard for the user to review (especially for users with
  cognitive disabilities)
- The default placeholder styling in most browsers doesn't meet the [minimum contrast requirements](https://www.w3.org/TR/WCAG22/#contrast-minimum)

> AT info: When focusing on an `<input>` field with a `placeholder` attribute, not all screen readers read out the
> placeholder value, thus not providing the right context for the user.

### 1.2 Labels without association

By just adding `<label>` elements, the visual context for each field is clearly defined. The problem here is that the visual
context is different from the programmatic context. These labels are not associated with the corresponding form fields.

You can verify this visually by clicking on a label, this interaction should move focus to the associated
form field. If nothing happens, the association is missing.

You can verify this programmaticaly by activating your screen reader and focusing on a form field. If the label value is
read aloud together with the type of input field, the association is correct.

> AT info: Always make sure that the visual representation is equal to the programmatic representation, since
> accessibility is focused on equal experience.

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Accessible form: with label" src="https://codepen.io/timdujardin/embed/oNPMwRz?default-tab=html%2Cresult&theme-id=dark" frameBorder="no" loading="lazy" allowTransparency={true} allowFullScreen={true}>
  See the Pen <a href="https://codepen.io/timdujardin/pen/oNPMwRz">
  Inaccessible form: with label but no association</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 1.3 Labels correctly associated

To associate a label programmaticaly with a form field, you need 2 things.

1. An `id` attribute on the `<input>` element
2. A `for` attribute on the `<label>` element, using the input `id`

You can test accessible labelling with the 2 verifications mentioned in section ["1.2 Labels without association"](#12-labels-without-association).

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Accessible form: correct label association" src="https://codepen.io/timdujardin/embed/mdGzyGp?default-tab=html%2Cresult%2Cresult&theme-id=dark" frameBorder="no" loading="lazy" allowTransparency="true" allowFullScreen="true">
  See the Pen <a href="https://codepen.io/timdujardin/pen/mdGzyGp">
  Accessible form: correct label association</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 2. Data input types

I will illustrate some input types through an example of a ticket booking form:

<iframe height="300" style={{ width: '100%' }} scrolling="no" title="Accessible form: ticket booking" src="https://codepen.io/timdujardin/embed/xxaJjXR?default-tab=result&theme-id=dark" frameBorder="no" loading="lazy" allowTransparency={true} allowFullScreen={true}>
  See the Pen <a href="https://codepen.io/timdujardin/pen/xxaJjXR">
  Accessible form: ticket booking</a> by djrdn (<a href="https://codepen.io/timdujardin">@timdujardin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 2.1 General

#### 2.1.1 The right type

Whether you need an email address, a telephone number or just plain text, using the right input type is essential. This will make life easier for the individual filling in the form and will improve data quality for the
business hosting the form.

##### 2.1.1.1 Email address

When a user needs to submit an email address, don't just use `<input type="text">` but use `<input type="email">`
instead. Simply replacing `type="text"` by `type="email"` will bring along a couple of native mechanisms you were probably
missing out.

- On mobile devices a specific email input keyboard is shown
- Native HTML email input validation is shown when submitting the form. More info in section ["5. Form validation"](#5-form-validation)

> AT info: Using a `type="email"` will be announced as "edit text email" which is a clear distinction with the default
> "edit text" announcement when using `type="text"`.

##### 2.1.1.2 Ticket type

When a user needs to select 1 specific value from a predefined dataset larger than 7 items, use a `<select>` element.

If you hesitate when to use radio buttons instead of a select element, take a look at [Miller's
Law](https://lawsofux.com/millers-law/). This UX law means basically: "If the dataset contains more than 7 items, use a
`<select>`, otherwise use `<input type="radio">`".

##### 2.1.1.3 Amount of tickets

When a user needs to input an amount, the easiest way to set up this form field is by using `<input type="number">`, just like other input types this `type="number"` will activate specific mechanisms such as:

- On mobile devices a numeric keyboard is shown
- Native HTML number input validation is shown when submitting the form. More info in section ["5. Form validation"](#5-form-validation)

**Important remark**: When the numeric value doesn't represent an amount, don't use `type="number"` but `type="text"`
instead!

> More info in the ['Why the GOV.UK Design System team changed the input type for numbers'](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/) article.

#### 2.1.2 Attributes

I have a couple of attributes that I want to highlight:

- `autocomplete`
- `pattern`
- `required`

##### 2.1.2.1 Autocomplete

The `autocomplete` attribute is really useful for people with cognitive disabilities, as mentioned in WCAG 2.1 -
[Technique H98: Using HTML 5.2 autocomplete attributes](https://www.w3.org/WAI/WCAG21/Techniques/html/H98).

It provides form field pre-population by the browser and allows third party plugins and software to make form fields
more accessible by for example:

- Use of icons as visual representation: `autocomplete="email"` will be accompanied by a mail/envelope icon
- Label replacement by a more familiar text: `autocomplete="given-name"` can change "Given name" to "First name"

> There are a lot of `autocomplete` attribute values, you can consult them in the [HTML attribute: autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) article on MDN.

##### 2.1.2.2 Pattern

### 2.2 Text input type

#### 2.2.1 Basics

The input type most used in forms is probably `type="text"`, since it is the most generic solution when a form needs textual data
without a predefined type. If you know the type of textual data and that `type` attribute option is available, please
use it.

#### 2.2.2 Attributes

FIXME: To Do
Lorem ipsum

### 2.3 Email input type

#### 2.3.1 Basics

#### 2.3.2 Attributes

FIXME: To Do
Lorem ipsum

### 2.4 Single select

When a user needs to select 1 specific value from a predefined dataset larger than 7 items, use a `<select>` element.

> If you hesitate when to use radio buttons instead of a select element, take a look at [Miller's
> Law](https://lawsofux.com/millers-law/). This UX law means basically: "If the dataset contains more than 7 items, use a
> `<select>`, otherwise use `<input type="radio">`".

## 5. Form validation

FIXME: To Do
Lorem ipsum
