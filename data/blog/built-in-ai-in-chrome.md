---
title: 'Built-in AI in Chrome'
date: '2025-06-30'
tags: ['ai', 'frontend']
images: ['/articles/built-in-ai-in-chrome/built-in-ai-in-chrome-hero.jpg']
summary: 'Chrome now offers built-in, on-device AI APIs for summarization, translation, and language detection—no cloud required, but still experimental and hardware-dependent.'
authors: ['dave-bitter']
theme: 'blue'
---

If you're building for the web and want lightweight AI functionality like summarization or translation, Chrome now has some built-in capabilities worth knowing about. These features run on-device using Google's Gemini Nano model and are exposed through browser APIs. That means no cloud calls, no API keys, and no additional libraries required.

This article walks through what’s available, how to use it, and what to expect in real-world usage.

## Overview

As of Chrome 138, developers can access:

- Summarizer API
- LanguageDetector API
- Translator API

All three APIs run entirely on-device using Google's Gemini Nano and are part of a push to enable local AI capabilities in the browser without requiring server-side inference.

### Requirements and Limitations

- Chrome 138 or later
- Desktop platforms only (Windows, macOS, Linux)
- Not supported on Android, iOS, or ChromeOS
- Enable via `chrome://flags/#enable-ai-features`
- Minimum: 22 GB free disk space, 4+ GB VRAM, unmetered network

## Summarizer API

The Summarizer API generates concise summaries from longer text, supporting types like tl-dr, key-points, headline, and teaser. This allows developers to customize the summary style to fit their application, whether it’s generating a quick TL;DR for news articles or extracting key points from long-form content.

For example, in a web-based documentation viewer or a news aggregator, you could automatically produce brief overviews to help users scan content faster. Messaging platforms could also use the API to summarize long conversation threads or emails, reducing information overload. Additionally, because it runs fully on-device, it fits well with offline-first or privacy-sensitive applications where sending data to a server is undesirable.

Here’s a sample of how to create a summarizer and generate a summary:

```js
if ('Summarizer' in self) {
  const summarizer = await Summarizer.create({
    type: 'key-points',
    format: 'markdown',
    length: 'short',
  })

  const summary = await summarizer.summarize(text, {
    context: 'Summarize for a general audience',
  })

  console.log(summary.output)
}
```

You can also monitor the model download progress since the underlying model needs to be cached locally:

```js
summarizer.addEventListener('downloadprogress', (e) => {
  console.log(`Downloaded \${e.loaded} of \${e.total}`)
})
```

## LanguageDetector API

The LanguageDetector API detects the language of a given text snippet. This is particularly useful in multilingual applications where the interface or processing logic needs to adapt dynamically based on user input.

For example, chat applications can use this to route messages for automatic translation or content moderation based on language. Web forms and editors can pre-select appropriate spellcheck languages or keyboard layouts based on detected text. Content platforms may analyze user-generated content to surface language-specific feeds or statistics.

Its simple API allows you to pass a string and receive the most probable language code, making it easy to integrate:

```js
if ('LanguageDetector' in self) {
  const language = await LanguageDetector.detect(text)
  console.log(language) // e.g., "en", "es", "fr"
}
```

## Translator API

The Translator API performs local translation between supported languages. This on-device translation capability enables real-time translation features without relying on external services, enhancing privacy and offline usability.

Use cases include chat or collaboration tools that provide live translations, browser extensions offering quick translation of selected text, and offline web apps that need to support multilingual content. Content moderation systems might also leverage this to flag or process foreign-language text more efficiently.

A basic example for translating text into English:

```js
if ('Translator' in self) {
  const translator = await Translator.create()
  const result = await translator.translate(text, {
    to: 'en',
  })

  console.log(result.output)
}
```

## Things to Consider

### 1. Still Experimental

These APIs are not yet standardized, but are now documented on MDN with an experimental status. They are currently only available in Chrome and are subject to change.

### 2. Disk Space + Hardware Requirements

Models require approximately 1.5–2 GB of space, but Chrome requires at least 22 GB free disk space and a minimum of 4 GB VRAM. If space is too low, models silently fail to load. This can lead to no output without clear errors, as experienced during testing.

### 3. Input Length Limits

Due to limited model context size, large documents need chunking and hierarchical summarization.

Example:

```js
const chunks = splitIntoChunks(longText)
const summaries = await Promise.all(chunks.map((chunk) => summarizer.summarize(chunk)))
const finalSummary = await summarizer.summarize(summaries.map((s) => s.output).join('\\n\\n'))
```

See: Scaling Summarization → https://developer.chrome.com/docs/ai/scale-summarization/

## Inspiring Use Cases

Browser extensions can use these APIs to provide on-the-fly summarization or translation of selected text, enhancing user workflows without leaving the page. Smart input fields might automatically detect language and translate user input in real time, or adapt spellchecking accordingly. Documentation viewers and knowledge bases could dynamically generate summaries or translate content, making them more accessible across regions. Messaging or email clients can integrate live translation to break language barriers between users.

Offline web apps and progressive web apps stand to benefit particularly, since these APIs run locally without cloud dependencies. Lastly, onboarding experiences in multi-region apps can leverage automatic language detection and translation to create a more personalized and inclusive experience.

## Conclusion

Chrome’s built-in AI APIs offer developers easy access to powerful summarization, translation, and language detection tools that run fully on-device. While still experimental and requiring significant disk space and hardware, they represent a promising direction toward more privacy-preserving and performant AI on the web.

If your app targets desktop Chrome users with the hardware resources available, these APIs are worth exploring today — especially for enhancing user experience through progressive enhancement.
