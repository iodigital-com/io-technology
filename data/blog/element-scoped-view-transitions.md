---
title: 'Element-scoped View Transitions'
date: '2026-11-06'
tags: ['frontend', 'css', 'javascript']
images: []
summary: 'Document view transitions freeze the whole page while they run. Element-scoped view transitions in Chrome 147 keep the rest of the page interactive. Here is how they work and how to build a list that stays clickable.'
authors: ['dave-bitter']
theme: 'blue'
---

Every animation I added with `document.startViewTransition()` came with a cost I never mentioned: while it runs, the whole page stops listening.

In a demo with a list and a button you never feel it. In a real app you do. My [two lines of code article](/articles/view-transitions-api-animated-interactions) from 2023 didn't cover it, and Chrome 147 ([released on 7 April 2026](https://developer.chrome.com/blog/new-in-chrome-147/)) now fixes it with [element-scoped view transitions](https://developer.chrome.com/blog/element-scoped-view-transitions). Let's have a look at what changed.

## Why the whole page freezes

A document view transition takes a snapshot of the page and draws an overlay on `:root`. That overlay sits on top of everything for the duration of the animation, and it brings three problems.

Clicks don't get through, so a menu in your header is dead while a list shuffles. Only one transition can run at a time, so starting a second one skips the first. And `position: fixed` elements and open popovers can end up underneath the overlay, which Chrome's docs call the [z-index issue](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions).

For a 300ms shuffle that's tolerable. In a dashboard with a sticky header, toasts and three cards animating on their own, it isn't.

## One element, one scope

[Element-scoped view transitions](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions) give the animation a smaller stage. Instead of `document`, you call `startViewTransition()` on an element:

```javascript
const list = document.querySelector('ul')

list.startViewTransition(() => {
  // change the contents of the list
})
```

That's it! The element becomes the transition root.

Only its subtree is captured, and the overlay attaches to that element instead of `:root`. Everything outside stays interactive, and a popover that sits above your list stays above your list. The root also takes part in its own transition, and when it clips its overflow, its children are clipped with it. While the transition runs, the browser adds `contain: layout` and `view-transition-scope: all` to the root, which keeps your `view-transition-name` values from leaking into a transition on an outer element.

What I love about this is the naming. In 2023 every list item needed its own unique name, like `card-1`. Now you can write this:

```css
ul li {
  view-transition-name: match-element;
}
```

`match-element` names each element by identity. The catch is that you have to [move existing nodes](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions). Rebuild the list with `innerHTML` and the browser sees brand new elements, so there is nothing to animate between.

## A list that doesn't freeze the page

Let's build something small: a card with a task list, under a header with a popover menu. Sorting or removing a task shouldn't make that menu unclickable. Here is the markup:

```html
<header>
  <button popovertarget="menu">Menu</button>
  <div id="menu" popover>…</div>
</header>

<section class="card">
  <ul>
    <li><span>Write article</span> <button>Remove</button></li>
    <li><span>Review PR</span> <button>Remove</button></li>
    <li><span>Book travel</span> <button>Remove</button></li>
  </ul>
</section>
```

The CSS names the items and switches the animation off for people who prefer reduced motion:

```css
.card li {
  view-transition-name: match-element;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

Then the script. One helper runs an update inside a scoped transition, and falls back to a plain DOM update when the browser doesn't support it:

```javascript
const supportsScoped = 'startViewTransition' in Element.prototype

function runScoped(scopeEl, updateDOM) {
  if (!supportsScoped) {
    updateDOM()
    return
  }

  const transition = scopeEl.startViewTransition(() => updateDOM())

  // A new transition on the same element skips this one and rejects `ready`
  transition.ready.catch(() => {})
}

function sortByName(list) {
  const items = [...list.children].sort((a, b) =>
    a.querySelector('span').textContent.localeCompare(b.querySelector('span').textContent)
  )

  runScoped(list, () => items.forEach((li) => list.appendChild(li)))
}

function removeItem(list, li) {
  const hadFocus = li.contains(document.activeElement)
  const next = li.nextElementSibling ?? li.previousElementSibling

  runScoped(list, () => {
    li.remove()
    if (hadFocus) next?.querySelector('button')?.focus()
  })
}
```

Open the menu while the list sorts and it just works. With `document.startViewTransition()` it wouldn't. Notice that `removeItem` moves focus to a neighbouring button inside the callback. Without that, keyboard users lose their place when the focused item disappears.

Because scopes are independent, a second list can animate at the same moment, and names only need to be unique inside their own scope. For reusable components, [Chrome recommends](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions) putting `view-transition-scope: all` on the wrapper so an outer transition can't capture its internals.

## The bad

Naturally, there are some catches.

At the time of writing, this is Chrome and Edge only. [Chrome 147 shipped on 7 April 2026 and Edge 147 followed on 10 April](https://web-platform-dx.github.io/web-features-explorer/features/view-transitions-element-scoped/). Firefox and Safari don't support it, and Firefox only has an [open tracking bug](https://bugzilla.mozilla.org/show_bug.cgi?id=2075158). Baseline calls it "limited availability", and [Can I use](https://caniuse.com/wf-view-transitions-element-scoped) keeps the current numbers.

So treat it as an enhancement. Feature-detect on `Element.prototype`, not on `document`, because a check on `document.startViewTransition` says nothing about the scoped version. Without support, run the update right away. [Chrome's guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions) advises against falling back to `document.startViewTransition()` for isolated component updates. In my opinion that's the right call, since it brings back the page-wide freeze you were trying to get rid of.

There are a few smaller things too. Starting a transition on an element that already runs one skips the first, which is why the example catches `ready`. An element can only take part in one active transition at a time. Nested groups overlay classic scrollbars (tracked as [CrBug 475236700](https://crbug.com/475236700)). And whether a self-participating scope can join an outer transition is still an open CSS Working Group issue.

## What's next?

Two related features from [Chrome's I/O 2026 web UI round-up](https://developer.chrome.com/blog/new-in-web-ui-io26) are worth keeping an eye on. Two-phase view transitions are experimental and start a cross-document transition before the new DOM is ready. Scroll-triggered animations shipped in Chrome 146, again in Chrome and Edge only, and play a time-based animation once a scroll boundary is crossed. Both follow the same idea: animation that reacts to part of the page instead of taking over all of it.

## Let the page keep listening

Keep document-level transitions for navigating between pages: `document.startViewTransition()` for route changes in a single-page app, and a single `@view-transition` rule for multi-page apps, which I covered in [View Transitions for Multi-page Apps](/articles/view-transitions-for-multi-page-apps). For everything smaller, scope it. Your animation still runs, and the page keeps listening.

## Sources

- [Chrome 147 enables concurrent and nested view transitions with element-scoped view transitions](https://developer.chrome.com/blog/element-scoped-view-transitions)
- [Element-scoped view transitions (guide)](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions)
- [Scoped Component Transitions, Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scoped-component-transitions)
- [New in Chrome 147](https://developer.chrome.com/blog/new-in-chrome-147/)
- [What's new in web UI (I/O 2026)](https://developer.chrome.com/blog/new-in-web-ui-io26)
- [Element-scoped view transitions, web features explorer](https://web-platform-dx.github.io/web-features-explorer/features/view-transitions-element-scoped/)
- [Make awesome animated interactions with two lines of code](/articles/view-transitions-api-animated-interactions)
- [View Transitions for Multi-page Apps](/articles/view-transitions-for-multi-page-apps)
