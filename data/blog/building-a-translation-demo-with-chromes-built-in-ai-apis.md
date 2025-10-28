---
title: 'Building a Translation Demo with the Chrome Built-in AI APIs'
date: '2025-10-28'
tags: ['ai', 'frontend']
images:
  [
    '/articles/building-a-translation-demo-with-chromes-built-in-ai-apis/building-a-translation-demo-with-chromes-built-in-ai-apis-hero.png',
  ]
summary: 'A deep dive into the Chrome Translation and Language Detection APIs, featuring a live demo with multilingual product reviews and on-device AI translation.'
authors: ['dave-bitter']
theme: 'blue'
---

Back in June, I wrote about [Chrome's built-in AI APIs](https://techhub.iodigital.com/articles/built-in-ai-in-chrome) after attending Google I/O Connect and the Google Developer Expert Summit in Berlin. I covered the Summarizer API, Language Detection API, and Translation API, all running on-device using Google's [Gemini Nano](https://deepmind.google/technologies/gemini/nano/) model.

Since then, I've been itching to build something real with these APIs. Theory is great, but nothing beats getting your hands dirty with actual code! So I decided to focus on the Translation and Language Detection APIs and build a proper demo to see how they work in practice.

Spoiler alert: The APIs have matured quite a bit since Chrome 138, and building with them is actually really fun!

## What I Built

I created a fake e-commerce product page for an "AI-Powered Universal Translator Device." The irony? The product reviews are written in multiple languages and need to be translated. Meta, right?

**[Try the live demo →](https://web-ai-translation-demo.davebitter.com/)**
**[View the source code →](https://github.com/DaveBitter/web-ai-translation-demo)**

![Demo of Chrome Translation API in action](/articles/building-a-translation-demo-with-chromes-built-in-ai-apis/chrome-ai-translation-demo.gif)

The concept is simple: 8 customer reviews in different languages (English, Spanish, French, German, Dutch, Japanese, Italian, and Swedish), each with a language selector and translate button. The demo automatically detects what language each review is written in, and you can translate any review to your preferred language, all happening on your device.

No servers. No API keys. No cloud. Just your browser doing AI magic locally.

## Language Detection API in Action

The Language Detection API does exactly what it says on the tin: it detects what language a piece of text is written in. This happens completely on-device, so your text never leaves your computer.

Here's how it works:

```javascript
async function detectLanguage(text) {
  if (!window.LanguageDetector) {
    return null
  }

  // Check availability
  const availability = await window.LanguageDetector.availability()
  if (availability === 'no') {
    return null
  }

  const detector = await window.LanguageDetector.create()
  const results = await detector.detect(text)

  if (results && results.length > 0) {
    return results[0].detectedLanguage
  }

  return null
}
```

In my demo, I run language detection as soon as the page loads for each review:

```javascript
// Detect language on mount
useEffect(() => {
  const detectOnMount = async () => {
    setIsDetecting(true)
    const detected = await detectLanguage(review.text)
    setDetectedLanguage(detected)
    setIsDetecting(false)
  }
  detectOnMount()
}, [review.text])
```

The detection is surprisingly fast! It happens almost instantly, even for longer reviews. Each review card shows a language badge showing what language was detected.

### Important: Enabling the API

To use the Language Detection API, you need to enable specific flags in Chrome:

1. Navigate to `chrome://flags/#language-detection-api` and enable it
2. Navigate to `chrome://flags/#optimization-guide-on-device-model` and enable it
3. Restart Chrome
4. Go to `chrome://components/` and update "Optimization Guide On Device Model"

Without these steps, `window.LanguageDetector` will be undefined and the API won't be available.

## Translation API Deep Dive

Once we know what language we're dealing with, we can translate it. The Translation API takes a source language, a target language, and gives you back translated text.

Here's the implementation:

```javascript
async function translateText(text, targetLanguage, sourceLanguage, onProgress) {
  if (!window.Translator?.create) {
    throw new Error('Translator API not available')
  }

  const translator = await window.Translator.create({
    sourceLanguage,
    targetLanguage,
  })

  // Listen for download progress
  if (onProgress) {
    translator.addEventListener('downloadprogress', (e) => {
      onProgress({
        loaded: e.loaded,
        total: e.total,
        percentage: Math.round((e.loaded / e.total) * 100),
      })
    })
  }

  // Wait for the translator to be ready
  if (translator.ready) {
    await translator.ready
  }

  // Perform the translation
  return await translator.translate(text)
}
```

### The Workflow

When someone clicks "Translate" on a review, here's what happens:

1. **Language Detection**: We detect the source language (if not already detected)
2. **Model Download**: If this is the first translation for this language pair, Chrome downloads the model (1-2GB). We show a progress bar for this!
3. **Translation**: The actual translation happens
4. **Display**: We show the translated text with a visual indicator

The download progress tracking is particularly nice for UX:

```javascript
const translated = await translateText(
  review.text,
  selectedLanguage,
  detectedLanguage,
  (progress) => {
    setIsDownloading(true)
    setDownloadProgress(progress.percentage)
  }
)
```

Users see a progress bar showing "Downloaded 45% of model" or whatever. Much better than a silent wait.

## Real-World Implementation Details

The component for a review manages quite a bit of state:

```javascript
const [translatedText, setTranslatedText] = useState(null)
const [selectedLanguage, setSelectedLanguage] = useState('')
const [isTranslating, setIsTranslating] = useState(false)
const [isDownloading, setIsDownloading] = useState(false)
const [downloadProgress, setDownloadProgress] = useState(0)
const [detectedLanguage, setDetectedLanguage] = useState(null)
// ... more state for error handling and UI
```

This gives us fine-grained control over the UI:

- Show a spinner while detecting language
- Display the detected language badge
- Show download progress during model download
- Switch to translated text when ready
- Let users toggle back to see the original
- Highlight reviews that match the user's system language

The visual feedback is important because some operations take time. Language detection is fast, but downloading a translation model on first use? That can take a minute or two depending on your connection.

## API Changes Since Last Article

Here's something important: **the API has changed since Chrome 138!**

This is something to expect with experimental APIs. They're still evolving, and you need to keep an eye on the documentation and updates. The good news? If you build with progressive enhancement, these changes won't break your UI or show errors to users. The APIs will simply not be available, and your fallback experience kicks in.

In my original article, I showed code using `window.ai.translator` and `window.ai.languageDetector`. That's the old way. As of Chrome 141, it's now:

```javascript
// Old way (Chrome 138):
window.ai.translator.create()
window.ai.languageDetector.create()

// New way (Chrome 141):
window.Translator.create()
window.LanguageDetector.create()
```

The APIs moved from being nested under `window.ai` to being global objects. This actually makes the API surface cleaner and easier to work with.

Here's what the API looks like now:

```javascript
// Create a language detector
const detector = await window.LanguageDetector.create()
const results = await detector.detect(text)
// results[0].detectedLanguage => "en", "es", "fr", etc.

// Create a translator for a specific language pair
const translator = await window.Translator.create({
  sourceLanguage: 'es',
  targetLanguage: 'en',
})
const translatedText = await translator.translate(text)
```

The flag names also changed. You now need to enable `chrome://flags/#language-detection-api` and `chrome://flags/#optimization-guide-on-device-model`. It's no longer just `#translation-api`.

## Things I Learned Building This

### 1. Detection is Really Fast

I was expecting language detection to be slow, but it's not. It happens almost instantly, even for longer text. This makes it perfect for real-time use cases.

### 2. Model Downloads Happen on First Use

The first time you translate to a specific language, Chrome needs to download the translation model. This can take a minute or two (1-2GB download). But it's a one-time thing, and Chrome shows you the progress.

### 3. Progressive Enhancement is Your Friend

Not everyone will have Chrome 138+. Not everyone will have the flags enabled. So build your UI to degrade gracefully.

In my demo, if the APIs aren't available, users see a friendly banner explaining how to enable them. The reviews are still readable, you just can't translate them.

### 4. The Confidence Score Exists (But I Didn't Use It)

The language detection results include a confidence score. I didn't display it in my demo, but you could use it to show uncertainty or ask users to confirm the detected language if confidence is low.

## Putting It All Together

The beauty of these APIs is how they compose. In my demo:

1. Page loads → Language Detection API runs on all reviews
2. User selects a target language → State updates
3. User clicks "Translate" → We check if we have the detected language
4. If not detected yet → Detect it now
5. Translation API creates a translator for the language pair
6. If model needs downloading → Show progress bar
7. Translation completes → Display translated text with visual indicator
8. User can toggle back to original anytime

All of this happens without a single network request to a translation service. It's all local, private, and fast.

## Tech Stack

For the curious, here's what I used:

- **[Next.js 16](https://nextjs.org/)** with App Router
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)** for type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** for styling
- **[Radix UI](https://www.radix-ui.com/)** for the language selector (accessible components ftw!)
- **Chrome 141** for the AI APIs

## Conclusion

Chrome's built-in AI APIs are getting better with every release. We've gone from Chrome 138 to 141, the APIs have been cleaned up, and the functionality is solid.

These APIs open up some really interesting possibilities:

- **Privacy-first translation** in chat apps
- **Offline-capable multilingual apps** for travelers
- **Browser extensions** that translate selected text instantly
- **Progressive web apps** with built-in language support
- **Content moderation** tools that work locally

The key is progressive enhancement. Build your core experience to work everywhere, then layer on these AI features for users who have them available. That way, you're not excluding anyone, but you're giving Chrome users something special.

I'm genuinely excited about where this is heading. On-device AI in the browser feels like a superpower, and we're still in the early days. I can't wait to see what people build with these tools!

**Go try the demo yourself:** [web-ai-translation-demo.davebitter.com](https://web-ai-translation-demo.davebitter.com/)

Make sure you have Chrome 138+ and the flags enabled. Then start translating those reviews and see the magic happen locally on your device. If you build something cool with these APIs, I'd love to hear about it!

For more details on Chrome's built-in AI capabilities, check out the [official Chrome AI documentation](https://developer.chrome.com/docs/ai/built-in-apis) or read my [previous article on built-in AI in Chrome](https://techhub.iodigital.com/articles/built-in-ai-in-chrome).
