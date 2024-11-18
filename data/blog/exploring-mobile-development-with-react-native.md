---
title: 'Exploring mobile development with _React Native_'
date: '2024-11-18'
tags: ['frontend', 'react native']
images: ['/articles/exploring-mobile-development-with-react-native/mobile-development.webp']
summary: 'Exploring React Native for cross-platform apps as a front-end developer, finding strengths in familiarity and challenges in styling and native feel.'
authors: ['lee-ravenberg']
theme: 'green'
---

## Exploring mobile development with React Native

Are you a front-end web developer and are interested in writing native applications for the iOS and Android platforms? Join me as explore what its like building a small app, using React Native.

There are various reasons why you might want to target other platforms besides the web. Such as device features that are not available in browsers, being able to distribute your app through an app store, or just creating an experience that feels native to the device people use.

## Why React native

I am not going to tell you that React Native is the best way to achieve those goals. Like with all technical decisions, there are trade-offs. However, there aren’t too many choices. Here are some of my considerations.

|                                             | Pro                                                                              | Con                                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Native with SwiftUI and Jetpack compose** | Leverage the latest platform features.                                           | Learning curve. I am not proficient with Swift and Kotlin to say the least.                                    |
| **Flutter**                                 | Lower learning curve than native and cross-platform.                             | The Dart language. Probably not as native due to the Skia rendering engine. Although Impeller looks promising. |
| **Ionic (Capacitor)**                       | Same techniques im used to building web apps.                                    | Outcome might not feel native to the trained eye unless using Ionics components (no Material 3 for Android).   |
| **Progressive web app (PWA)**               | Same techniques im used to building web apps.                                    | Poor iOS support.                                                                                              |
| **Tauri 2**                                 | Security oriented, cutting edge.                                                 | Using a Webview just like capacitor, Outcome might not feel native to the trained eye.                         |
| **React Native**                            | Outcome is native native, familiar developer experience with typescript and HMR. | Quirky to use. Apps may have performance issues if you don’t know what you’re doing.                           |

Again, these are my personal considerations, and this whole thought process will probably change from project to project. Truth be told; I just want to use SwiftUI and Jetpack, but as a full-time web developer I find the learning curve daunting. I'm afraid it might take a year before I get productive. I am hoping React Native will give me best of both worlds.

## Getting started

When visiting the official React Native docs, you will be advised to build apps using Expo. You can think of Expo as a meta framework for building React Native applications. This is now the de-facto way to build a new React Native project.

![image.png](/articles/exploring-mobile-development-with-react-native/getting-started.webp)

Expo offers various tools, and it's hard to tell which one does what. But for our development purposes, it’s Expo CLI and the Expo Go app you are using.

### Expo CLI

Used to initialize new apps using one of the templates and run the dev server. It also offers some native build commands that you might need depending on which native module you’re using.

### Expo Go

A native app that you install on your phone. This app loads the app you’re working on, so you can interact with it seamlessly on your device.

## Styling

I will now explain what I meant by “quirkiness” when listing it as a con for using React Native. As a front-end web developer, I am carrying my mental model around how the browser renders styles to native land. Much of this knowledge is transferable, except for a couple of things.

For example: everything is `display: flex` as default. And the flex-direction defaults to `column`. Also, if your content fills the screen till it overflows, don’t expect there will be a scrolling mechanism to help your user to access that content. Instead, you have to wrap that part of the UI in a so-called `<ScrollView>` component. This is a Core Component that you have to import from RN, and you will reach out to those components all the time instead of the html elements that are available in the browser.

One way to apply styles to these Core Components is by using the StyleSheet API. If you are familiar with CSS in JS; it's just that with some caveats. For example, if you want to control the `box-shadow` for Android, the property you are using is elevation, and for iOS it's `shadowOffset`.

There are a lot more details that I have to explore. Pseudo-selectors and media queries are not a thing, and animations might prove challenging. As long as I keep these caveats in mind, UI programming with React Native will probably be just as intuitive as it is for the web.

## Native look and feel

Setting up a new project with Expo was straightforward, if you are curious about what that looks like refer to the [getting started guide](https://docs.expo.dev/get-started/create-a-project/). After that, I went on to configure routing using the React Navigation package and style configuration using [NativeWind](https://www.nativewind.dev/), which allows me to apply styles using Tailwind classes. I also made sure to support a dark color scheme by wrapping the Text and View core components. That ended up looking like this:

```jsx
import React from "react";
import { Text } from "react-native";
import classNames from "classnames";

export function ThemedText({ children, stylesheetStyles, tailwindClasses }) {
  const classes = classNames('text-stone-800', 'dark:text-stone-50', tailwindClasses)

  return (
    <Text style={stylesheetStyles} className={classes}>
      {children}
    </Text>
  )
```

Once that was done, it was time for some interaction. The debt-tracking application im working on allows users to enter their debt. I figured I could use the Button core component for that. At that point, I noticed my expectations were not met. See I was under the assumption that - just like with browser default styling - using React Natives’ core components would be enough to build a UI that looks native.

While I was satisfied with the result on iOS, I noticed the look and feel of the Button was outdated on Android. Material 3 (Material You) is not used. For some reason, I thought that dropping in elements without any styling applied would assume the default styling for the platform, just like the browser.

Here’s my dilemma; Does this mean I have to implement these styles myself then? What if I stray from the Apple Human Interface Guidelines or the Material Design spec, will my look and feel still be considered native? Should I architect my app in such a way that render the UI using React Native Paper for Android and my own styling for iOS?

I ended up sticking with what I had and make the UI with primitives. As long as I keep my little app simple this should be ok.

## The new architecture

React Native apps have been criticized for their performance issues. Some of it has been attributed to React Native's underlying architecture. Something about a JavaScript runtime and a bridge. While I personally have not encountered these issues so far, I am glad to hear that these are soon issues of the past.

Recently, [the new React Native architecture has been released](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here) and has been made available in Expo SDK 52 that [got released](https://expo.dev/changelog/2024/11-12-sdk-52) the second I initialized my exploration project. During this exploration however I remained an SDK 51-based project, and I was somewhat caught in between the transition. When trying to install the Expo Router for handling navigation between screens, I noticed that the underlying dependency (React Navigation) was set to an incompatible version resulting in errors. I eventually worked around these errors by locking the React Navigation version to 6 instead of 7.

## Building

When I finally got started with my little app, the experience was pretty straightforward. I could lean on the same techniques I am accustomed to for building web applications because of React and Tailwind.

I also played around with some Expo libraries such as `expo-audio` and `svg`. Looking all the list of Expo libraries gets me excited about building something that uses the device’s capabilities.

During my project, I experienced what it's like doing some layout work, implementing navigation, and dark mode, building a button by wrapping the `Pressable` Core component, and working with the `CategoryList` Core component.

The latter I'm not satisfied with because of content overflowing beyond the safe area. Even while wrapping this in the `<SafeArea>` Core component. This is particularly noticeable on iOS.

![ui.png](/articles/exploring-mobile-development-with-react-native/project.webp)

## Third party packages

Even though React Native is in its core technology built and maintained by Meta, just like React itself, it leans heavily on the amazing community. With various third-party initiatives, React Native is a versatile piece of technology for a wide array of use cases.

I would like to list and highlight some notable ones, but truthfully there are too many. Some are small, some are big. But almost all of them play an important role in filling up the gaps that React Native is keeping open because of how focused the project is at its core. I find this is understandable as building an abstraction on top of Android and iOS is a huge scope already.

## Conclusion

This exploration has been from the perspective of someone who prioritizes achieving a native look and feel in apps. Does React Native deliver this? On the “feel” aspect, it’s a yes to me, on the “look” part not so much. At least not out of the box.

I also came in assuming the majority of things I learned from building web apps would carry over to React Native. But then I ran into multiple issues from quirkiness of styling to the troubles I had rendering a list.

Lastly, I did not like dealing with third-party dependencies to implement things that ideally come out of the box, such as navigation. Luckily Expo is growing and becoming a reliable meta framework to lean on.

Regardless of React Native still being a “0.x versioned” technology, it enables developers and companies all over the world to achieve their goals. I can only imagine what it would be like building apps with it when it finally graduates to a 1.0 product. For my personal needs I will probably explore Flutter next.

### Links

I would like to share a couple of things related to this exploration;

- [Talk by Dan Stepanov - Being a Good Platform Citizen (Chain React 2024)](https://www.youtube.com/watch?v=3UEQhdaWwus)
- [Simon Grimm’s YouTube channel](https://www.youtube.com/@galaxies_dev)
- [The project repository](https://github.com/ravenberg/react-native-exploration)
