---
title: 'How to create a modular and maintainable CSS setup with @layer'
date: '2025-11-02'
tags: ['frontend', 'css']
images: []
summary: 'Utilize @layer to create a solid modular foundation for styling. It helps the team to orgainize the order of styling.'
authors: ['valentijn-kap']
theme: 'blue'
---

# A look into the past

There was once a time when CSS alone wasn't enough to create dynamic, maintainable frontends. I came from an era where entire websites were styled in a single, massive style.css file a maintenance nightmare, as you can imagine. Later, I discovered Less, which allowed me to write CSS in a more modular way. Less would compile my files at runtime in the browser, which was convenient but inefficient. Eventually, I found Sass, which improved upon Less by compiling during the build process instead.of course I discovered Sass that improved on Less and was compiled on build.

CSS continues to evolve, consistently improving the developer experience. Modern CSS provides powerful tools for creating maintainable stylesheets with minimal friction. The `@layer` directive, introduced in 2022, enables teams to manage cascade hierarchy safely and predictably. This addresses a common pain point: developers struggling with style overrides and resorting to !important as a quick fix.

Let's dive into what these hierarchies actually look like. Each project is unique, but there's usually a baseline structure that works well for organizing your stylesheets. Here's what I typically use:

```
|_ settings // contains all the variables that builds up the design system.
|_ base // contains all the base styles that are used throughout the application.
|_ utilities // contains all the utility classes like visually-hidden, sr-only, etc.
|_ components // contains all the generic components.
|_ patches // contains all the edge cases and overrides.
```

Back in the days it looked like this in SASS:

```css
/* Within this example the inndex.scss is a list of impports of files that are within that corresponding folder */

/* Before Dart Sass 3.0.0. */
@import 'settings/index.scss';
@import 'base/index.scss';
@import 'utilities/index.scss';
@import 'components/index.scss';
@import 'patches/index.scss';

/* After Darts Sass 3.0.0. */
@use 'settings/index.scss' as *;
@use 'base/index.scss' as *;
@use 'utilities/index.scss' as *;
@use 'components/index.scss' as *;
@use 'patches/index.scss' as *;
```

The order in which you import these style also dictates which priority it has. That is sometimes difficult to debug in the browser. Lacking a clear architecture from the start, years of accumulated development will make it increasingly difficult to override styles and modify designs. I have encountered these situations before. Let me give you an example on how this looks.

```html
<!-- HTML DOC -->
<a class="component-button primary">...</a>
```

```css
/* button.scss */
a.component-button.primary {
  color: red;
}

/* Custom component.scss */
.custom-component {
	.component-button.primary {
		color: blue !important;
	}
}
```

Although this solution functions correctly, it becomes problematic in large-scale projects where maintenance grows complex and unpredictable styling behavior emerges. These issues frequently appear in parts of the application that weren't directly modified or thoroughly tested.

We can improve on this and use `@layer` to create a clear archtecture.

```css
@layer settings, initial, override;

@layer settings {
  :root {
    --primary-color: red;
    --secondary-color: purple;
  }
}

@layer initial {
  .parent--layered {
    .component--layered {
      .button.red {
        color: var(--primary-color);
      }
    }
  }
}

@layer override {
  .parent--layered {
    .component--layered {
      .button.red {
        color: var(--secondary-color);
      }
    }
  }
}
```

With the `@layer` on top we can maintain the order. Placing the styling in the correct layer will override properly and isolate it. You don’t have to order it chronology in your file. With that you are able to import css files and put it in the right layer like this:

```css
/* Define your order */
@layer settings, base, utilities, components, patches;

/* Import the files and asign to the corresponding layer */
@import url('variables/all.css') layer(settings);
@import url('base/all.css') layer(base);
@import url('utilities/all.css') layer(utilities);
@import url('components/all.css') layer(components);
@import url('patches/all.css') layer(patches);
```

New layers are easy to add and should have descriptive names that clearly indicate their purpose. This self-documenting approach eliminates the need to track individual styles, while proper layer ordering maintains clean architecture.

## Conclusion

The combination of `@layer` and `@import` provides native CSS cascade control, replacing the need for Sass preprocessing. All major browsers support this approach, with older browsers safely ignoring it. For projects requiring broad browser support, testing is crucial, or you may prefer to stick with traditional methods for guaranteed compatibility.

