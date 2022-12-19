---
title: 'A modern dark mode - part one'
date: '2022-12-19'
tags: ['a11y', 'accessibility']
summary: 'I’ve wanted to implement dark mode for quite a while now. But, I just didn’t want to ship a part of it. I had to include a perfect dark theme, together with the perfect accessible toggle. However, two things have happened last month that changed my perspective on this approach.'
authors: ['frank-van-eldijk']
canonicalUrl: 'https://beingfrankly.nl/blog/a-modern-dark-mode/'
---

I’ve wanted to implement dark mode for quite a while now. But, I just didn’t want to ship a part of it. I had to include a perfect dark theme, together with the perfect accessible toggle. I might be a perfectionist.

However, two things have happened last month that changed my perspective on this approach.

The **first thing** was a conversation with a colleague who has a rare vision impairment called [Achromatopsia](https://en.wikipedia.org/wiki/Achromatopsia) , which includes multiple conditions, but primarily it means a total colour blindness and that looking at bright lights causes pain. Through talking with him about it, I learned that dark mode greatly improves his experience on the web.

The **second thing** was a great article about [progress over perfection](https://meryl.net/accessibility-progress-over-perfection/), published by Meryl Evans. In the article she writes about the importance of taking small steps to improve accessibility, instead of a doing a big bang.

Knowing that dark mode is such a hard requirement for some, I can’t allow myself to wait to get everything perfect.

## So, should we go dark mode all the way?

That’s what I thought at first. Because if you search for “dark mode”, you’ll probably see a list of advantages about it.

But after reading about it more and more, I found out that a lot of people have a vision condition called [Astigmatism](https://en.wikipedia.org/wiki/Astigmatism) that doesn’t go well with dark mode. What happens with Astigmatism is that **white text** on a **black background** will create a visual fuzzing efect called [halation](https://www.dictionary.com/browse/halation). In short, this causes text to get **blurry** and this causes terrible headaches.

Now we know that only having a light or a dark theme doesn’t work, we have to provide both themes and let our users decide.

## A modern and flexible light and a dark theme implementation

What I really like about [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), is that they can inherit from other CSS variables. This allows us to create “functional” CSS variables with a clear name and purpose, which keeps our CSS clean. Here, I’ll show you!

```css
@import './colors.css';

:root {
  color-scheme: dark light;

  --background-base-color: var(--color-gray-50);
  --text-heading-color: var(--color-gray-900);
  --text-body-color: var(--color-gray-700);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background-base-color: var(--color-gray-900);
    --text-heading-color: var(--color-gray-200);
    --text-body-color: var(--color-gray-400);
  }
}

body {
  background-color: var(--background-color);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--text-heading-color);
}

p {
  color: var(--text-body-color);
}
```

To summarise what’s happening here:

- The `color-scheme` property tells the browser to render **each element** (this even includes scrollbars) with either a light or dark theme. The styling comes from the browser’s default styles.
- The same `color-scheme` property allows us to add a custom dark theme piece by piece, since the browser already provides default styling for us.
- The order of the values `dark` and `light`, which are used for the `color-scheme`, will determine the theme if the user doesn’t have any preference.

There’s one last thing that I want to mention. And that’s that our themes are declared only inside CSS. While **usually** this isn’t a problem, but in this case it could lead to a bad user experience.

## The flash of inaccurate theme, or FART

What happens when the user visits our website and can’t download the CSS in time? The flash of inaccurate color theme — or [FART](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) as Chris Coyier coined it — will happen.

Imagine that you’re browsing the web, in a dark environment, and suddenly a bright light flashes you for a split second. That’s what the **flash of inaccurate color theme** means.

Thankfully, it’s easy to solve. We only have to move the `color-scheme` property out of CSS and use the meta tag of the same name:

```html
<head>
  <meta name="color-scheme" content="dark light" />
</head>
```

There, problem solved! Now we don’t flash our users with a bright white screen in the middle of the night.

## Wait, what about a toggle?

Well, as I mentioned before, I believe in the progress over perfection approach. So I haven’t implemented the toggle part yet, but I’m working on it. You can definitely expect an article on this subject in the future.

## Conclusion

- We should provide both a dark and a light theme, because people have different needs. For some a dark theme could be a requirement, while for others it just doesn’t work.
- Using CSS variables gives us a lot of flexibility and it keeps our CSS clean and easy to adapt.
- The `color-scheme` property gives us a good baseline to start with. We’re able to create our own dark theme piece by piece.
- To avoid the [FART](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) we should use `<meta name="color-scheme" content="dark light">` inside the `<head>`
- It’s better to improve accessibility step by step, instead of waiting for the perfect solution.
