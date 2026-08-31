---
title: 'Temporal: JavaScript Finally Fixes Dates'
date: '2026-08-31'
tags: ['frontend', 'javascript']
images: ['/articles/temporal-javascript-finally-fixes-dates/hero.jpeg']
summary: "Temporal shipped in Chrome 144 and hit TC39 Stage 4. Immutable types, real timezone support, and no more zero-indexed months. Here's why it finally replaces Date."
authors: ['dave-bitter']
theme: 'blue'
---

Anyone who's shipped enough JavaScript has a `Date` story. Months indexed from zero, no real concept of a timezone, parsing behaviour that depends on the exact string format you happen to feed it. Some developers just learned to work around it with libraries like [date-fns](https://date-fns.org/), because fixing `Date` itself was never really on the table.

That's finally changing. `Temporal` shipped in [Chrome 144](https://developer.chrome.com/release-notes/144), and in March this year it hit [TC39 Stage 4](https://tc39.es/process-document/), meaning it's now a permanent, official part of the JavaScript language. Not a library. Not a polyfill you'll eventually rip out. The language itself.

## Why this matters

Let's start with the bug that gets everyone at some point:

```javascript
function addOneWeek(myDate) {
  myDate.setDate(myDate.getDate() + 7)
  return myDate
}

const today = new Date()
const oneWeekFromNow = addOneWeek(today)

console.log(today) // mutated. today is now oneWeekFromNow too.
```

`Date` is mutable, so calling a function on it can quietly change a value you're still holding a reference to elsewhere. This is exactly the kind of bug that survives code review and shows up three months later in production, and it's not something you're doing wrong. It's the API being genuinely hostile to how you'd expect objects to behave.

Here's the same thing with `Temporal`:

```javascript
const today = Temporal.Now.plainDateISO()
const oneWeekFromNow = today.add({ days: 7 })

console.log(today) // unchanged
console.log(oneWeekFromNow) // a new value
```

`add()` returns a new value instead of mutating in place. That's it. No more defensive `new Date(myDate)` cloning before you pass a date into a function you don't fully trust.

## The types

The other thing `Date` gets wrong is trying to be one object for every job: a moment in time, a calendar date, a wall-clock time, all mashed together with an implicit timezone that's whatever the user's machine happens to be set to. `Temporal` splits that into separate, purpose-built types instead:

- `Temporal.Instant`: a fixed point in time, no timezone attached
- `Temporal.ZonedDateTime`: a date and time that knows its timezone and calendar
- `Temporal.PlainDate` / `Temporal.PlainTime` / `Temporal.PlainDateTime`: a date, a time, or both, deliberately without timezone info
- `Temporal.Duration`: a length of time, for arithmetic and comparisons
- `Temporal.Now`: the entry point for "what time is it right now," in whichever of the above shapes you need

That sounds like more work up front. In my opinion, it's the opposite. "Is this a moment in time or a date on a calendar?" is a question `Date` never made you answer, which is exactly why timezone bugs keep sneaking through. `Temporal` forces the question up front, where it's cheap to get right, instead of in production, where it isn't.

Timezone-aware arithmetic is where this really pays off. Daylight saving transitions have always been a minefield with `Date`: add 24 hours to a time and you can land on the wrong wall-clock hour depending on the timezone. `Temporal.ZonedDateTime` handles that transition correctly by design, because it actually knows what timezone it's in.

## Where it stands right now

At the time of writing, browser support is real but not universal. Chrome and Edge have shipped it since version 144, [Firefox has had it since 139](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/139), and [Safari is still stuck at Technology Preview](https://webkit.org/blog/18194/release-notes-for-safari-technology-preview-251/), with active implementation work but nothing in a stable release. That's also why it's still not [Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility): the [tracker](https://web-platform-dx.github.io/web-features-explorer/features/temporal/) has had it blocked on Safari since January, seven months and counting. So it's not quite `Date`-levels of "just works everywhere" yet. If you need broad compatibility today, [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill) or the official [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill) will get you there.

In my opinion, that changes how you should treat it. Stage 4 means it's not a proposal that could still get reworked out from under you. So this isn't "an interesting new API" anymore. It's the thing you'll be using instead of `date-fns` in a year or two. Worth getting familiar with now.

## Let's try it

If you want to poke around, Chrome 144+ has it on by default, no flags needed. The [TC39 proposal repo](https://github.com/tc39/proposal-temporal) has the full docs for every type.
