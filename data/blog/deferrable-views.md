---
title: 'Deferrable Views, skeletons and named chunks in Angular'
date: '2023-11-21'
tags: ['frontend', 'angular']
images: ['/articles/deferrable-views/deferrable-views-cover.webp']
summary: 'The most exciting feature of Angular 17 might be Deferrable Views. It makes it possible to lazy load specific Angular standalone components or show skeletons as the component is loaded. It seems like this feature should go well with Skeletons. Stay around to find out.'
authors: ['alexey-ses']
theme: 'default'
---

## Deferrable Views

To be fair lazy-loading is not a new thing in Angular. It has been provided for modules, based on the routes a long time ago. This feature still exists. But since the moment the Angular team presented standalone components that don't require modules at all, it looks like the next logical step is to provide lazy-loading for them as well.

Another feature of Deferrable Views is the opportunity to show a placeholder as the component is loaded. To avoid the fast flickering of the placeholder in the case that the deferred component was fetched quickly, it's possible to provide a `minimum` timer for the `@placeholder` block to be shown.

This is how to implement that using standalone wrapper component template, `@defer` block and `@placeholder` block:

```typescript:wrapper.component.html
@defer {
    <app-huge />
} @placeholder (minimum 1s) {
    <p>Loading...</p>
}
```

## Skeletons

The next thing that could improve user experience is the skeleton shown as the placeholder. Instead of building it from scratch, I would recommend using the package called [NGX Skeleton loader](https://github.com/willmendesneto/ngx-skeleton-loader).

This package is easy to configure and it supports ARIA attributes to keep it accessible.

```typescript:wrapper.component.html {4}
@defer {
    <app-huge />
} @placeholder (minimum 1s) {
    <ngx-skeleton-loader [theme]="{height: '200px', background: 'lightblue'}" />
}
```

## Named chunks
