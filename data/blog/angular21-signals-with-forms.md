---
title: 'Angular 21 — Signal with Forms — Why Sometimes Waiting Is The Better Choice'
date: '2025-12-09'
tags: ['Angular', 'Angular21', 'Signals', 'Signal Forms']
images: ['/articles/angular21-signals-with-forms/angular21-signals-with-forms.png']
summary: 'In the rapidly evolving landscape of Angular 21, this guide provides a practical overview of the current state of form handling in Angular.'
authors: ['susan-fulop']
theme: 'beige'
---

## Introduction

In the fast-paced world of software development, teams often feel continuous pressure to keep their codebases modern. Technologies evolve quickly, and developers are encouraged — sometimes expected — to update frameworks and architectures as soon as possible to avoid falling behind. But behind these expectations, sometimes not rushing ahead, rather waiting out is the better choice.

Angular has been undergoing a substantial transformation (since the version 16), leading many teams to consider gradually refactoring or rewriting parts of their applications. This shift is slow and very unusual compared to traditional Angular upgrades. Rather than introducing new features on top of the existing foundation, the core of Angular’s evolution now focuses on a new reactivity and change-detection model.

Some of Angular’s newest edition, the Signal features have already reached stability. Core state-management primitives such as `signal()`, `computed()`, `effect()`, and `toSignal()` are fully production-ready and can be used in real-world applications.
However, waiting to adopt new features is not always a poor strategy.

The current situation with Signals demonstrates this well: while many signal-based APIs are stable, others — particularly Signal Forms remain experimental. For many teams, this makes a full migration premature.

## Angular’s Shift in Change Detection: What It Means for Developers

Over the past few years, Angular has started to shift its change detection mechanism, moving away from the approach that relied heavily on _zone.js_. Previously, _zone.js_ automatically tracked changes and, with the `OnPush` strategy, selectively checked components only when necessary. While this sometimes resulted in the entire component tree being checked, it formed the backbone of many widely-used Angular libraries. We are currently still using _zone.js_ and in an interesting transition era, where the old way is still the spine of the application, but the moving away possibility already started to appear in the newer versions.

With the new approach, Angular is adopting a signal-based system—components now update only when a signal explicitly indicates that an update is needed. This change is designed to improve performance and reduce unnecessary re-renders, but it also has implications for existing libraries and patterns.
Some of our most relied-upon libraries, such as the observable based _RxJS_ and _Reactive Forms_, will continue to exist and function. However, as Angular transitions to this signal-based paradigm, developers may need to gradually rethink how they integrate these tools, adapting to new patterns while maintaining compatibility with legacy code.

## How do we use forms without Signals?

Before the introduction of Angular Signals, developers primarily relied on _Reactive Forms_ — a system built around classes such as `FormGroup`, `FormControl`, `FormArray`, and `Validators`. _Reactive Forms_ provided a structured and predictable way to manage form state, apply validation rules, and react to user input. Features like tracking whether a control was _touched_, _dirty_, or _valid_ were built-in and became standard practices in Angular applications.
A key interaction pattern was subscribing to `valueChanges` or `statusChanges` observables to respond to form updates. Because these events relied on Angular’s change-detection mechanism, _Reactive Forms_ were tightly coupled to _zone.js_, which handled the automatic triggering of change detection. One of the goals of Signals in modern Angular is to reduce or eliminate this dependency by providing a more explicit and fine-grained reactivity model.

### Example for a Simple Reactive Form

<iframe width="100%" height="600" src="https://stackblitz.com/github/susanfulop/io-signal-form-article/tree/simple-reactive-form?embed=1&view=preview" frameBorder="0" allowFullScreen></iframe>

### Example for an Advanced Reactive form (most commonly used)

In practice, while Angular’s simple form examples are helpful, real-world applications—especially in enterprise environments—tend to rely on far more complex form structures. Instead of managing many individual controls separately, developers typically organize entire sections of related inputs under a single `FormGroup` (and often nested `FormGroups`).
This “umbrella” approach makes large forms easier to manage, validate, and maintain. It also allows teams to encapsulate logic, reuse form sections, and keep the form model consistent with the structure of the underlying business domain. As a result, FormGroup-centric architectures became the standard for building sophisticated, enterprise-grade forms in Angular.

<iframe width="100%" height="600" src="https://stackblitz.com/github/susanfulop/io-signal-form-article/tree/advanced-reactive-form?embed=1&view=preview" frameBorder="0" allowFullScreen></iframe>

## How do we use forms with Signals?

### Example for a simple signal based form

When discussing signal-based inputs, one of the most important points to understand is that Angular’s previous _Reactive Forms_ system was already an extremely powerful and mature tool. The shift toward Signals does not happen because _Reactive Forms_ were inadequate or needed replacement. Instead, the move is driven by a deeper architectural change. Hence, the new Signals-based form library must compete with an already mature and battle-tested solution. In real-world scenarios, what Signals currently offer is an advanced and efficient change-detection mechanism — but one that still **relies on manual validation and manual state management**. As a result, the present Signals-based form approach is questionably sufficient for most production use cases. Instead of simplifying development, it often introduces additional complexity, especially when compared to the robustness and convenience of traditional _Reactive Forms_. Therefore, thanks to Angular’s strong commitment to backward compatibility, many teams choose to upgrade their applications to a newer version while continuing to rely on _Reactive Forms_ for the time being. Other words: _waiting out_.

At the same time, it’s important to emphasize that Angular’s direction toward a Signals-based model is very promising. The foundation being built around Signal is solid, and once the form-related APIs mature, Signals are likely to provide a cleaner, more predictable, and more efficient way to handle reactivity across the entire framework.

<iframe width="100%" height="600" src="https://stackblitz.com/github/susanfulop/io-signal-form-article/tree/simple-signal-form?embed=1&view=preview" frameBorder="0" allowFullScreen></iframe>

### Hybrid model - technically _works_, but no benefits, not recommended

The current problem with forms with signals is that they lacked a fully mature API to organize complex forms in a grouped structure with all the capabilities we expect (nested grouping, dynamic validation, complex logic, etc.). Although a "cheat" workaround exists — re-using the old `FormGroup` (from _Reactive Forms_) inside a signal-based setup — but relies on the legacy _zone.js + observable & subscription model_, which undermines many of things advantages Signals aim to deliver. As a result, using Signals with `FormGroup` in this hybrid way often offers little to no real benefit. Therefore, it is generally not recommended to combine them this way.

<iframe width="100%" height="600" src="https://stackblitz.com/github/susanfulop/io-signal-form-article/tree/hybrid-form?embed=1&view=preview" frameBorder="0" allowFullScreen></iframe>

## The advanced solution is on the way, experimental API was released.

Angular recognized this exact problem and has been working on a solution. On 19 November 2025, Angular 21 was released.

One of the most significant additions is the **experimental** release is _Signal Forms_, which address the missing feature and hopefuly be the sucessor of _Reactive Forms_.

Validation can be done with the newly released `schemaPath`. Among many nishe validation this contains the classic `minLegth`, `maxLength`, `required` etc. validation. [The Signal Forms API](https://angular.dev/guide/forms/signals/overview 'Official documentation - Signal Forms API') is marked as experimental, meaning the API could evolve with future releases — so it is not yet recommended for production usage without caution. Based on the current version of the Signal Forms’ API, we can expect for a similarly elegant solution then _Reactive Forms_ in the future.

<iframe width="100%" height="600" src="https://stackblitz.com/github/susanfulop/io-signal-form-article/tree/experimental-advanced-signal-form?embed=1&view=preview" frameBorder="0" allowFullScreen></iframe>
