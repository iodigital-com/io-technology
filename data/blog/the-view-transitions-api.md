---
title: 'The View Transitions API: Enhancing the feel of the web'
date: '2023-04-06'
tags: ['frontend']
images: ['/articles/view-transitions-api/view-transitions-api-demo.webp']
summary: 'The View Transitions API has landed in Chrome. Let’s have a look at how the API works and why it will change the feel of the web.'
authors: ['dave-bitter']
theme: 'black'
---

As a developer, I am always on the lookout for new tools and technologies to make my work easier and more efficient, but simultaneously increase the user experience of it. That's why I was excited to explore the View Transitions API, which is now stable in Chrome and see how it could simplify the process of creating view transitions on the web.

## What is the View Transitions API?

The View Transitions API is a powerful tool that simplifies the process of creating view transitions on the web. It provides a set of built-in transition effects that can be easily customized and combined to create more complex transitions to transition from one page to another.

I love how this API can easily improve the user experience by adding a small layer to a website. It's a great way to create dynamic and interactive web experiences that will take the websites you build to the next level.

## A practical use case

For my demo of the View Transitions API, I created a fictitious sneaker company in the future called _Neon Sole Society_. All content, including the company name, product brands, product pricing, product descriptions, and even product images, are generated with AI. This is a fun way to make your demo’s more realistic.

<div style={{display: 'flex', justifyContent: 'center'}}>
<img src='/articles/view-transitions-api/view-transitions-api-demo.gif' alt='Screen recording of the demo showing an overview with sneakers and a transition to a detailed view of a pair of sneakers'  />
</div>

I created a page that displays different types of futuristic sneakers, and when a user clicks on a pair , the page seamlessly transitions to a detailed view of that shoe. I used the built-in transition effects provided by the View Transitions API without any tweaking to see how well it does. Throughout this article, I show simplified code examples that are focused solely on the View Transitions API, making it easy for you to understand how to implement these transitions in their own projects. If you’d like to see all of the code, you can [view the project on GitHub](https://github.com/DaveBitter/view-transitions-api-demo). If you’d like to see the demo in action, head over [here](https://view-transitions-api-demo.davebitter.com/). Keep in mind that at the time of writing, only Chrome has support for this.

## Creating the view transition

To create a view transition, I first added a unique value for the CSS property `view-transition-name` for every product on the overview page. Here's an example of how this might look in the HTML for the demo’s sake:

```html {3}
<li
  class="product"
  style="view-transition-name: waverider-pro-flytech-details"
  data-product="waverider-pro-flytech"
>
  <div class="product__details" data-product-details>
    <p class="product__name" data-product-name>WaveRider Pro</p>
    <p class="product__brand" data-product-brand>FlyTech</p>
    <p class="product__price" data-product-price>$170</p>
    <a class="product__link" data-product-link>View</a>
    <p class="product__description" data-product-description>
      Introducing FlyTech's WaveRider Pro - the ultimate sneaker for runners and athletes. With a
      sleek and aerodynamic design, it offers unparalleled speed and comfort. Made with the latest
      FlyTech materials for durability and performance, it features a wave-shaped sole for
      unbeatable traction and advanced sensors for real-time feedback on performance. With built-in
      GPS and Bluetooth connectivity, it's perfect for achieving your personal best. Get yours today
      and experience the ultimate in futuristic footwear!
    </p>
  </div>
  <div class="product__image-wrapper">
    <img
      src="./images/products/waverider-pro-flytech.png"
      class="product__image"
      data-product-image
    />
  </div>
</li>
```

Next, I added an event listener to each product’s link to the detail page. I can then call `preventDefault` and implement the logic for the transition. If the View Transitions API is not supported, I call the `handleViewProduct` function directly, which takes care of updating the route and DOM in a single-page application (SPA) way. If the API is supported, I call the function in the callback function provided to `document.startViewTransition`. Here's an example:

```jsx {7-13}
const addEventListenersForProduct = (productElement, product) => {
  const productLinkElement = productElement.querySelector('[data-product-link]')

  productLinkElement.addEventListener('click', (e) => {
    e.preventDefault()

    if (!document.startViewTransition) {
      handleViewProduct(product)
    } else {
      document.startViewTransition(() => {
        handleViewProduct(product)
      })
    }
  })
}
```

Finally, in the `handleViewProduct` function, you can set the `view-transition-name` of the clicked product as the `view-transition-name` of the detail page's product element and render the page. Here's an example:

```jsx {18}
const handleViewProduct = (product) => {
  renderProductDetail()

  window.history.pushState(
    product.slug,
    `${product.name} - ${product.brand}`,
    `/product/${product.slug}`
  )

  const productDetailElement = document.querySelector('[data-product-detail]')
  const { name, brand, price, description, image, slug } = product

  productDetailElement.querySelector('[data-product-name]').innerHTML = name
  productDetailElement.querySelector('[data-product-brand]').innerHTML = brand
  productDetailElement.querySelector('[data-product-price]').innerHTML = price
  productDetailElement.querySelector('[data-product-description]').innerHTML = description
  productDetailElement.querySelector('[data-product-image]').src = image
  productDetailElement.style.viewTransitionName = `${slug}-details`
}
```

And that’s all! The element will now use sensible defaults to animate between the two views. From here on out, you can tweak the animations to your liking with CSS.

## What will this mean for the web?

Before the View Transitions API, creating smooth and visually appealing view transitions on the web was a difficult and complex process. You had to rely on custom code or third-party libraries to achieve the desired effect, which often led to bloated code and slower page load times. Additionally, the process of creating these transitions was often time-consuming and required a deep understanding of complex CSS animations and JavaScript.

With the View Transitions API, creating seamless view transitions is now easier and more accessible than ever before. By providing a set of built-in transition effects and a simple API for applying these effects to elements on the page, you can create dynamic and engaging user interfaces without the need for custom code or third-party libraries. This not only simplifies the development process but also leads to faster page load times and a more seamless user experience overall.

As more developers begin to incorporate the View Transitions API into their projects, we can expect to see a shift towards more engaging and interactive web experiences, ultimately changing the way we navigate and interact with websites and web applications.
