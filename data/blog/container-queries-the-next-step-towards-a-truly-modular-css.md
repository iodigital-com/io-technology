---
title: 'Container Queries, the next step towards a truly modular CSS'
date: '2022-06-15'
tags: ['frontend', 'css']
images:
  [
    '/articles/container-queries-the-next-step-towards-a-truly-modular-css/hero.svg',
    '/articles/container-queries-the-next-step-towards-a-truly-modular-css/container-queries-hero.jpg',
  ]
summary: 'Container queries enables encapsulation of adaptive styling based on the size, style or state of a parent element. This allows responsive component-based architectures, like design systems and component libraries, to provide the most optimal responsive styling within a component itself.'
authors: ['maarten-van-hoof']
---

**\*TL;DR** Container queries enables encapsulation of adaptive styling based on the size, style or state of a parent element. This allows responsive component-based architectures, like design systems and component libraries, to provide the most optimal responsive styling within a component itself.\*

---

<div className="p-4 bg-io_blue-100 font-serif">The [container query specification](https://drafts.csswg.org/css-contain-3/) is a Working Draft and under active development. Be aware that the information in the article below is prone to change.</div>

---

Have you ever developed reusable components or a design system? If so, how did you ensure that the components were able to have the most optimal layout across different viewport sizes? Through media queries or by providing configuration options?

If my former questions are not ringing any bells: No worries. I'll share with you, how in the near future, you can develop robust, reusable, responsive component styles with something that I personally have been waiting for since I started developing responsive websites and - applications: container queries.

## Towards a truly modular CSS

With having seen the evolution of front-end over the last couple of years, having contributed to several design systems and component libraries, and heck having even maintained a personal Bootstrap fork with alternate naming convention for half a decade, I believe container queries are one of the most exciting new features coming to the CSS standard. Something that will enable you to optimize responsive styling for your components. Let me give you an example.

<div className="md:-mx-32">
![A mockup of a dashboard of a webapplication](/articles/container-queries-the-next-step-towards-a-truly-modular-css/dashboard-default.svg)
</div>

## Widgets

Let's say we're part of a project and our goal is to build this dashboard-page. If we take out of account the header and the sidebar for a second and look at the page's main content, we see a handful of widgets. A weather widget, a pie-chart showing our favourite bars, a bar graph showing our favourite pies, a weather widget and user list widget.

The following user stories have to implemented in this page:

1. As a user, I should be able to customize my dashboard by resizing widgets.
1. As a user, I want to see more information in larger widgets and less in smaller widgets. They should contain more or less information, depending on their available internal space.

If we choose a prioritize the weather widget for instance, next to only show todays weather, we could show additional information like the expected precipitation or the expected temperature for upcoming days.

Let's look at some other possible factors that could come in to play. Additional customizations options like a collapsible sidebar, for instance. What if we want to reuse these widgets or make them available to other teams or projects where we can't author the parent or final result these widgets will be part of?

How would we translate these requirements, with possible side-effects, to code?

<div className="md:-mx-32">
![A mockup of a dashboard of a webapplication with the viewport highlighted](/articles/container-queries-the-next-step-towards-a-truly-modular-css/dashboard-global-highlight.svg)
</div>

First thing to we'd might take in to consideration is using media queries. However, media queries give us the ability to style responsively according to the viewport and doesn't offer us enough flexibility to create modular styling.

## Possible solutions

<div className="md:-mx-32">
![A mockup of a dashboard of a webapplication with the separate components highlighted](/articles/container-queries-the-next-step-towards-a-truly-modular-css/dashboard-weather-highlighted.svg)
</div>

How can each component be responsible for it's own adaptive styling?

### Custom selectors

We could create custom classes or attributes per size. .component--large, .component--small, setting a attribute on the element and targeting that attribute with a selector in your CSS. With this solution however, the final application is responsible for declaring the correct styling of the widget. We have to create extra styling in the dashboard application It's still not possible to automatically provide the most optimal layout to the end-user. The end-user has to implement their own logic to handle this.

```html
<internal-dashboard>
  <external-widget type="bar" />
  <external-widget type="pie" />
  <external-widget type="weather" />
  <external-widget type="users" />
</internal-dashboard>
```

```css
internal-dashboard {
}

external-widget {
}

external-widget[type='gauge'] {
}
external-widget[type='pie'] {
}
external-widget[type='weather'] {
}
external-widget[type='users'] {
}
```

### ResizeObserver

Or we could use ResizeObserver API, a browser API that through JavaScript can take an elements size into account and act accordingly. But, with this solution, we have to wait until the JavaScript is evaluated. Without the proper measures, like some form of loading screen and making sure this solution is loaded before every other piece of JavaScript is ready, it can cause a Flash of Unstyled Content.

```js
const $widget = document.querySelector('.widget')

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.target.width > entry.contentBoxSize.inlineSize) {
      entry.target.classList.add('widget--large')
    } else {
      entry.target.classList.remove('widget--large')
    }
  }
})

resizeObserver.observe($widget)
```

A CSS solution however, that is if we use the recommendation of loading critical styles upfront and avoiding render-blocking JavaScript on page load, is evaluated before JavaScript. Therefore, we'll receive the correct layout on first paint.

Luckily for us, something's cooking!

## History

Container Queries, element queries, ... The possibility of querying each element its own dimensions is something we've been looking for since modular front-end architecture met responsive web design and has been on the discussion radar for over almost a decade now. Thanks to recent improvements to browser rendering engines and the advent of the CSS containment specification, container queries, which can lead to heavy layout calculations, can finally be implemented in a performant way without sacrificing anything of the user experience.

With container queries, the component itself owns all of its responsive styles. It's the optimal solution for responsive component-based architectures, like design systems and component libraries. It splits up responsibilities for styling our layout. For example, the larger parts of your webpage, things where a media query makes more sense, will be responsible for the larger layout, like grids and the smaller parts, like individual components will have their own responsibility for their own layout based on the available space they will have in the larger layout.

## One single class to rule them all

In this example, created by the great [Una Kravets](https://una.im), we see a page of an ecommerce platform where we can order several kinds of plants to spruce up our home offices. Each product component is implemented using the same CSS class. Using Container Queries, each product component will adapt to its most optimal layout according to the space available.

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/vanhoofmaarten/full/vYWYKLP" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

<small>Source available on https://codepen.io/vanhoofmaarten/pen/vYWYKLP (Forked from to [Una Kravets](https://codepen.io/una/pen/mdOgyVL))</small>

## Syntax

Container Queries are a part of the [CSS Containment Module Level 3](https://drafts.csswg.org/css-contain-3/), and the specification is currently a Working Draft, which means that the CSS working group is actively working on the feature. A basis has already been set and details are being ironed out as we speak. CSS containment allows us to improve rendering performance by isolation of a DOM subtree or in other words indicating that an element and its contents rendering should be handled independently of the rest of the document tree. That isolation is what enables us to query elements using container queries. CSS containment consists of four types: size, layout, style and paint. Containment can be set with a single type or multiple types at the same time.

### Declaring containment

#### Old syntax

In the first proposed syntax for container queries, we had to set containment on size, layout and style.

```css
.product {
  contain: size layout style;
}
```

#### Current syntax

Currently the container query specification settles at more distinct property like container, which is a shorthand for container-type and container-name.

```css
.product {
  container: product / inline-size;

  /* Shorthand for */
  container-name: product;
  container-type: inline-size;
}
```

#### Container-type

```css
.product {
  container-name: product;
  container-type: inline-size;
}
```

With the container-type you can establish an element as a query container. Currently the following container types are in discussion:

##### Size container features

```css
@container (inline-size > 400px) {
  .product-body {
  }
}
```

Size container feature are:

- **size**, to query both horizontal and vertical axis,
- **inline-size** or **block-size**, the logical properties for width and height for respectively only the horizontal or vertical axis,
- **aspect/ratio**
- **orientation**

<div className="p-4 bg-io_blue-100 font-serif mb-4">Browser vendors have indicated to first focus and ship the inline-size container feature. Other container features will follow later.</div>
<br />

##### Style container features

Style container features can be used for querying computed values. With this, we can query the container's computed values. For example, if the background-colour of the container is red, we can act and style appropriately.

```css
.product {
  container-type: style;
}

@container style(background: red) {
  .product-body {
  }
}
```

<div className="p-4 bg-io_blue-100 font-serif mb-4">The style container queries proposal might be deferred to the next level of the contain specification. See: https://github.com/w3c/csswg-drafts/issues/7020</div>
<br />

##### State container features

State container features can be used for querying miscellaneous container states. This will allow us to query certain states of a container. One example is querying if a container with the property position: sticky is in its sticky state. Do keep in mind that the syntax shown here, again, is a proposal and is likely bound to change.

```css
header {
  container: is-stuck is-visible / header;
  position: sticky;
  top: 0;
}

@container header (is-stuck) {
  /* … */
}
@container header (is-visible) {
  /* … */
}
```

<div className="p-4 bg-io_blue-100 font-serif mb-4">The state container queries proposal has been deferred to the next level of the contain specification. See: https://github.com/w3c/csswg-drafts/issues/6402</div>
<br />

#### Container-name

The container-name property enables us to implement multi-level container queries. With container names you can target specific containers to query.

```css
.product-list {
  container-type: inline-size;
  container-name: list;
}

.page {
  container-type: inline-size;
  container-name: folio;
}

@container list (inline-size > 800px) {
  .product {
    /* … */
  }
}

@container folio (inline-size > 400px) and (inline-size < 800px) {
  .product {
    /* … */
  }
}
```

Here our first query will target `.product-list` through the `list` container-name and the second query will target `.page` through the `folio` container-name.

### Querying the container

The actual container query is declared using the `@container` rule, which has a similar syntax to the `@media` rule or media query with the [addition of also declaring the container-type](https://github.com/w3c/csswg-drafts/issues/6393). In this example, the query will match if the inline-size, the logical property of width, is larger than 400 pixels. Like media queries, we can use multiple conditions. Here, the query will match if the inline-size exceeds 400 pixels and block-size exceeds 200 pixels.

```css
@container (inline-size > 400px) {
  .product-body {
    /* … */
  }
}
```

To make use of container-names, we need to declare the container-name. In the example below, we filter the query to the container with `container-name` `list`.

```css
@container list (inline-size > 800px) {
  .product {
    /* … */
  }
}
```

An important note with using container queries is that container cannot query themselves. Containment always has to be set on an ancestor, in order for container queries to match.

```css
.ancestor {
  container-type: inline-size;
}

@container (inline-size > 800px) {
  .ancestor {
    /* NOPE */
  }
}
```

### Container Relative units

Similar to viewport relative units, we have container relative units, which allow you to use dimensions of a container as a unit. Like where 1 v double-u equals one percent of the viewport width, we could have one 'cee que double-u' that would equal one percent of the container's width

<table className="mt-1">
  <thead>
    <tr>
      <th>unit</th>
      <th>relative to</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cqw</td>
      <td>1% of a query container’s width</td>
    </tr>
    <tr>
      <td>cqh</td>
      <td>1% of aquery container’s height</td>
    </tr>
    <tr>
      <td>cqi</td>
      <td>1% of a query container’s inline size</td>
    </tr>
    <tr>
      <td>cqb</td>
      <td>1% of a query container’s block size</td>
    </tr>
    <tr>
      <td>cqmin</td>
      <td>The smaller value of cqi or cqb</td>
    </tr>
    <tr>
      <td>cqmax</td>
      <td>The larger value of cqi or cqb</td>
    </tr>
  </tbody>
</table>

## Our widgets with container queries

With the knowledge of container queries in our possession, we can refactor the use of custom classes or ResizeObserver to container queries. Keep in mind, we do have to add an extra wrapper if we want to style the base of the widget, as container queries can only query ancestors.

```html
<!-- external-widget-component -->
<div className="widget">
  <div className="widget-body">
    <!-- widget-content -->
  </div>
</div>
```

```css
.widget {
  container: inline-size;
}

@container (inline-size > 500px) {
  .widget-body {
    /* … */
  }
}
```

## Experiment today!

Although the specification is still in active development, which means the syntax still subject to possible change, you can experiment with Container Queries today. Chrome Canary has experimental support for Container Queries behind the enable-container-queries flag and there is a JavaScript polyfill availble to enable the Container Query functionality in other browsers.

However, knowing the disadvantages of using JavaScript as a solution for this particular problem, like the Flash of unstyled content, I personally would not recommend using this in production just yet.

## Examples

### Shopping cart component

A good use case for container queries, I believe, is a shopping cart component, where we have declared all our shopping cart business logic in one single place, like the calculated subtotal of the quantity and price of a product and the calculation of the grand total. With container queries, we can then re-use that single component, for example, on the actual shopping cart page or in the header as a mini cart. Depending on the size given to the component, it will adapt its styling. The larger desktop version of this component is, thanks to container queries, also immediately optimized for mobile devices.

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/vanhoofmaarten/full/mdWBMGb" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

<small>Source available on https://codepen.io/vanhoofmaarten/pen/mdWBMGb</small>

### Responsive inline SVGs and SVG sprites

We can even go as far as using container queries in our SVGs, and by extension SVG-sprites. SVGs support CSS and will also support container queries. By declaring responsive styles in a SVG or SVG-sprite, we can create truly responsive SVG and SVG-sprites. In this experiment, we see SVG images of a stegosaurs and a diplodocus, both are part of the same SVG-sprite, declared at the top of the document and are used in the main part of the document.

If I enlarge the image of the stegosaurus, we see the outline disappear and the same goes for the diplodocus, only at a larger size. Container queries tailored to each image and which are declared once in the SVG-sprite make this possible. Go check out the CodePen later on for more information.

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/vanhoofmaarten/full/WNpJoGq" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

<small>Source available on https://codepen.io/vanhoofmaarten/pen/WNpJoGq</small>

## #TIL

Let's bring this to a close, shall we? What did we learn today?

With container queries, we can encapsulate adaptive styling in elements. It's the optimal solution for responsive component-based architectures, like design systems and component libraries.

The Container Queries umbrella is not limited to only querying dimensions. Querying computed styles, certain element states, new container relative units and several more features, will be part of the specification.

Current state is that the specification is a Working Draft and under active development. It's available for experimentation in Chrome Canary behind a feature flag or with the container-query-polyfill. With that, I would not recommend it using it in production just yet.

Have fun!

### Resources

- [CSS Containment Module Level 3](https://drafts.csswg.org/css-contain-3/)
- [Container Queries [css-contain] GitHub Project](https://github.com/w3c/csswg-drafts/projects/18#card-58266104)
- [Awesome-Container-Queries](Awesome-Container-Queries)
- [Shopping Cart example](https://codepen.io/vanhoofmaarten/full/mdWBMGb)
- [Responsive SVG sprite example](https://codepen.io/vanhoofmaarten/full/WNpJoGq)
