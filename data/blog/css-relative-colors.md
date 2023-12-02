---
title: 'CSS Relative colors'
date: '2023-12-01'
tags: ['frontend', 'CSS']
images: ['/articles/css-relative-colors/color-spectrum.webp']
summary: 'Before the relative color syntax you had to rely on CSS variables or even worse: JavaScript to modify the parameters of a color. Using the from keyword the browser can convert the originating color to different color spaces and change the color properties.'
authors: ['lucien-immink']
theme: 'blue'
---

For a lot of websites and applications, there is a need for an accent color. This accent color is used on links and buttons for example and when
the user hovers over the button, or clicks the button to activate it the color should slightly change to reflect the state change.

As an example, I'm going to use iO's primary accent color `#0017ee` which translates into a lightness of `43.89` a chroma of `0.291` and a hue of `264.18`. How did I do that? Head over to [oklch.com](https://oklch.com/#43.89,0.291,264.18,100) and paste in the hex variable. `oklch` is a color space that attempts to mimic how color is perceived by the human eye. Determining relative colors based on `oklch` yields more natural results.

```css
:root {
  --accent-lightness: 43.89%;
  --accent-chroma: 0.291;
  --accent-hue: 264.18;

  --accent-oklch:
    var(--accent-lightness)
    var(--accent-chroma)
    var(--accent-hue)

  --accent-color: oklch(var(--accent-oklch));
}
```

With the separate properties set, I can now easily add new colors based on those properties:

```css
--accent-hover: 
  oklch(var(--accent-lightness + 10) var(--accent-chroma) var(--accent-hue));
```

Quite a lot of work and it's very error prone. Chrome 119 introduced CSS native relative colors which changes this syntax quite drastically.

```css
:root {
  --accent-color: oklch(43.89% 0.291 264.18);
  --accent-hover: oklch(from var(--accent-color) calc(l + 10) c h);
}
```

The keyword here is `from` which allows for a source color (any color space) which is then converted to the color of the given color space using the parameters and values.

## Deeper dive

Using the `from` keyword the browser can convert the `originating color` (the one after `from`) and break it apart into the parts as variables.
In the following example, the browser will create an `rgb` color from the named color `green` and copy over the `r`, `g` and `b` values. The browser will only convert the named color to the rgb color space but will not change any value, so the result is still the green color, but now in the rgb color space.

![Schema of the elements of a URL](/articles/css-relative-colors/rgb-from-green.webp)

and so we can use the `from` keyword to convert any color space to any color space:

```css
rgb(from rgb(0 23 238) r g b)     /*  r=0       g=23      b=238  */
hsl(from rgb(0 23 238) h s l)     /*  h=234     s=100%    l=93%  */
oklch(from rgb(0 23 238) l c h)   /*  l=43.89%  c=0.291   h=264.18  */
```

Converting color spaces can open up easier convertions. Changing lightness in `rgb` is harder than it is in `oklch` for example, but changing the `r` value directly is easier in `rgb`.

*Tip*: You can even clone, mix and omit properties when calculating a new color based on the originating color:

```css
rgb(from(var(--accent-color)) g g g)  /* r=23 g=23  b=23 */
rgb(from(var(--accent-color)) 0 b 0)  /* r=0  g=238 b=0 */
```

## Some useful examples

### Lighten a color

Since our accent color is already defined in `oklch` it's quite easy to lighten the color by, for example, 10:

```css
.lighten-by-10 {
  background-color: oklch(from var(--accent-color) calc(l + 10) c h);
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/GRzYGZp" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/GRzYGZp)

### Darken a color

Ah yes, when there is light there is dark!

```css
.darken-by-10 {
  background-color: oklch(from var(--accent-color) calc(l - 10) c h);
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/MWLPXeQ" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/MWLPXeQ)

### Invert a color

To invert a color a trick is applied by converting the color to `rgb` and substract each channel's value from 1:

```css
.invert-accent-color {
  background-color: 
    rgb(from var(--accent-color) calc(1 - r) calc(1 - g) calc(1 - b));
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/mdvzKrJ" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/mdvzKrJ)

## Contrast

Accessible colors are a must and one way to achieve this is to add (if `accent-color` is dark) or substract (if `accent-color` is light) at least 40 in lightness if and when the `OKLCH` or `LCH` color space is used.

```css
.contrast-accent-color {
  background-color: var(--accent-color);
  color: oklch(from var(--accent-color) calc(l - 40) c h);
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/gOqBKLr" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/gOqBKLr)

# Palettes

Making a palette can be done based on lightness, which is called a monochromatic palette:

```css
:root {
  --lighter: oklch(from var(--accent-color) calc(l + 20) c h);
  --light:   oklch(from var(--accent-color) calc(l + 10) c h);
  --base:    var(--accent-color);
  --dark:    oklch(from var(--accent-color) calc(l - 10) c h);
  --darker:  oklch(from var(--accent-color) calc(l - 20) c h);
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/zYemaMX" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/zYemaMX)

If the hue is rotated instead an analogous palette is created:

```css
:root {
  --base:      var(--accent-color);
  --secondary: oklch(from var(--accent-color) l c calc(h - 45));
  --tertiary:  oklch(from var(--accent-color) l c calc(h + 45));
}
```

<div className="md:-mx-32 my-4">
  <div className="relative aspect-w-16 aspect-h-9 border">
    <iframe src="https://codepen.io/arielext/full/PoVyaVj" className="absolute inset-0" style={{
      width: "166.66%",
      height: "166.66%",
      transform: "translate(-20%,-20%) scale(.6)",
    }}></iframe>
  </div>
</div>

[View on CodePen](https://codepen.io/arielext/full/PoVyaVj)

Loads more examples of palettes can be found on the [developer.chrome](https://developer.chrome.com/blog/css-relative-color-syntax/#triadic-palettes) website about relative colors.

## Wrapping things up

Instead of defining color properties as variables, or even worse in JavaScript, it's now possible to use the CSS native relative color syntax. Using the `from` keyword the browser can convert the `originating color` to different color spaces and change the color properties. Use the conversion to easily change the color's properties. 

Relative colors are supported by Chromium and Safari as of writing. See [can-i-use](https://caniuse.com/?search=relative+colors).
