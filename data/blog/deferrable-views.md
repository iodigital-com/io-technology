---
title: 'Deferrable Views, skeletons and named chunks in Angular'
date: '2023-11-24'
tags: ['frontend', 'angular']
images: ['/articles/deferrable-views/deferrable-views-cover.webp']
summary: 'The most exciting feature of Angular 17 might be Deferrable Views. It makes it possible to lazy load specific Angular standalone components or show a placeholder as the component is loading. It seems like this feature should go well with Skeletons. Stay around to find out.'
authors: ['alexey-ses']
theme: 'default'
---

## Deferrable Views

To be fair lazy-loading is not a new thing in Angular. It has been provided for modules, based on the routes a long time ago. This feature still exists. But since the moment the Angular team presented standalone components that don't require modules at all, it looks like the next logical step is to provide lazy-loading for them as well. So they did and called it Deferrable Views.

Another feature of Deferrable Views is the opportunity to show a placeholder as the component is loaded. To avoid the fast flickering of the placeholder in the case that the deferred component was fetched quickly, it's possible to provide a `minimum` timer.

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

To prevent the content of the screen from moving as the placeholder would be replaced with the component (so called layout shift), we need to pass the height of the skeleton. That height needs to be equal to the component height.

Suppose that component height is 200px. This is how you can implement skeleton with the same height:

```typescript:wrapper.component.html {4}
@defer {
    <app-huge />
} @placeholder (minimum 1s) {
    <ngx-skeleton-loader [theme]="{height: '200px'}" />
}
```

I found that one more step is required to adjust default styling for NGX Skeleton loader. It contains redundant margin and it's displayed as inline-block. Let's fix that in order to have consistent height of all skeletons in the app:

```typescript:app.module.ts {13-19}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AppComponent } from './app.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { HugeComponent } from './huge/huge.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxSkeletonLoaderModule.forRoot({
      theme: {
        extendsFromRoot: true,
        display: 'block',
        margin: 0,
      },
    }),
    WrapperComponent,
    HugeComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

## Named chunks

The last thing that goes well together with Deferrable Views is named chunks. By default, the lazy-loaded modules and components are shown in dev tools as `.js` files with non-human-readable names. For example `chunk-IVE23K2G.js` is a terrible name for debugging purposes.

![Example of default JS chunk](/articles/deferrable-views/deferrable-views-default-js-chunks.gif)

Let's fix that by adding `"namedChunks": true` into `angular.json` file:

```typescript:angular.json {12}
  content omitted
  ...
  "projects": {
    "angular-defer-test": {
      "architect": {
        "build": {
          "configurations": {
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
  ...

```

After that chunk names would look like that: `huge.component-HRZM3FTC.js`

## Final result

Here's how final result looks like:

![Final example of Deferrable Views](/articles/deferrable-views/deferrable-views-final-example.gif)

And here's the code if you would like to play with it:

https://stackblitz.com/~/github.com/GanjaGanja/angular-defer-test
