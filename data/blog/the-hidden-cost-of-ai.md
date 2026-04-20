---
title: 'The Hidden Cost of AI'
date: '2026-04-15'
tags: ['AI', 'Cluade', 'Gemini', 'ChapGPT']
images: ['/articles/the-hidden-cost-of-ai/the-hidden-cost-of-ai.png']
summary: 'Developers often default to the most powerful AI models without thinking about the real cost behind each call.
This article explores why understanding model tiers and pricing matters for smarter, more efficient engineering decisions.'
authors: ['susan-fulop']
theme: 'beige'
---

## Introduction

From time to time, I find myself in conversations with fellow software engineers who say that a particular model hasn’t been performing well lately, so they’ve switched to Opus because it feels faster. After looking into this more closely, a few patterns started to stand out. Many engineers are struggling to keep up with the rapidly evolving landscape—figuring out which model belongs to which company, identifying the latest versions, understanding their strengths, and, perhaps most importantly, keeping track of their costs.

To be fair, from an engineering perspective—especially for those using Opus with tools like Cursor—the experience is often that it’s one of the most capable models available. However, this raises an important question: do you actually need a high-powered, premium model for every task?

---

## Naming does not make things easier

One of the key problems is that, without deliberate research, it can be quite challenging to determine which model belongs to which AI family (such as Google, OpenAI, or Anthropic) or how each model should be categorized—whether as a basic, mid-tier, or pro-level option.

It also doesn’t make things easier that many editors don’t explicitly label which models belong to which category.

---

## Why understanding the AI model landscape matters

In order to evaluate which models are best suited for your day-to-day work, it helps to have a general overview of what’s currently happening in the market. In this article, I’ll attempt to provide a concise summary to help make that landscape a bit easier to navigate.

---

## Different AI families and companies

The three main AI model families currently most widely used in software development are Google’s Gemini, OpenAI’s GPT models, and Anthropic’s Claude models. A few examples of specific models can be seen in the table below.

| Company   | Model Family | Example Models (tiers)                                                   |
| --------- | ------------ | ------------------------------------------------------------------------ |
| OpenAI    | GPT          | GPT-4o mini, GPT-4o, GPT-4.1, o3, o4-mini                                |
| Google    | Gemini       | Gemini 1.5 Flash, Gemini 1.5 Pro, Gemini 2.5 Pro, Gemini Ultra (limited) |
| Anthropic | Claude       | Claude 3 Haiku, Claude 3.5 Sonnet, Claude 3 Opus                         |

What is not visible in the table is that each AI model family typically includes a basic, mid-tier, and pro-level variant. Pricing can vary significantly between these tiers, making it important to choose the right model for the right task.

For example, there is very little benefit in using a high-end pro model to write unit tests, where a cheaper and faster model would usually be sufficient.

| Tier   | OpenAI (GPT)                                            | Google (Gemini)                          | Anthropic (Claude) |
| ------ | ------------------------------------------------------- | ---------------------------------------- | ------------------ |
| Basic  | GPT-4o mini                                             | Gemini 1.5 Flash / Flash-Lite            | Claude 3 Haiku     |
| Medium | GPT-4o / GPT-4.1                                        | Gemini 1.5 Pro / Gemini 2.5 Flash        | Claude 3.5 Sonnet  |
| Pro    | o3 / o4 (reasoning models), GPT-4.1 (high-end variants) | Gemini 2.5 Pro / Ultra (where available) | Claude 3 Opus      |

## What each model tier is generally best used for

A key idea is that **Basic models** are best suited for mechanical, repetitive work, **Medium models** serve as the daily engineering workhorse for most development tasks, and **Pro models** are designed for solving hard, complex problems that require deep reasoning.

| Tier                       | What it’s good for                                                                | Example tasks                                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Basic (fast & cheap)       | Simple, repetitive, low-risk tasks where correctness is easy to verify            | Fixing typos in code, formatting, renaming variables, writing unit test boilerplate, generating simple functions, explaining short code snippets                                                                   |
| Medium (balanced default)  | Everyday development work where quality still matters but cost/speed is important | Writing meaningful unit tests, implementing small features, refactoring functions, debugging simple-to-medium issues, generating API clients, explaining architecture decisions                                    |
| Pro (high reasoning power) | Complex, multi-step or high-impact tasks requiring deep understanding             | Debugging hard production issues, designing system architecture, complex refactoring across multiple files, reasoning about concurrency/state bugs, reviewing large codebases, solving tricky algorithmic problems |

## What are tokens and what are they for?

In the context of AI pricing, a token is the basic unit that language models use to process text. A token is not always a full word—it can be a word, part of a word, or even punctuation. For example, the word “apple” might be one token, while longer or more complex words can be split into multiple tokens.

AI models are typically billed based on the number of input and output tokens used. It’s also important to note that different languages can result in different token counts: English is often tokenized more efficiently, while other languages—especially those with more complex or agglutinative structures—may require more tokens to express the same meaning. This means that the same content can have different costs depending on the language used.

To help estimate token counts, OpenAI provides an [estimation page](https://platform.openai.com/tokenizer) that allows you to approximate how text is broken down into tokens.

---

## Estimated cost of 1 million tokens (input side)

| Tier   | OpenAI (GPT)                        | Google (Gemini)                     | Anthropic (Claude)            |
| ------ | ----------------------------------- | ----------------------------------- | ----------------------------- |
| Basic  | GPT-4o mini → ~\$0.15–\$0.30        | Gemini Flash → ~\$0.10–\$0.30       | Claude Haiku → ~\$0.25–\$0.50 |
| Medium | GPT-4o / GPT-4.1 → ~\$2–\$5         | Gemini 1.5 Pro → ~\$1–\$3           | Claude Sonnet → ~\$3–\$6      |
| Pro    | o3 / reasoning models → ~\$10–\$20+ | Gemini 2.5 Pro / Ultra → ~\$5–\$15+ | Claude Opus → ~\$15–\$30+     |

## Estimated cost of 1 million tokens (output side)

| Tier   | OpenAI (GPT)                            | Google (Gemini)                             | Anthropic (Claude)         |
| ------ | --------------------------------------- | ------------------------------------------- | -------------------------- |
| Basic  | GPT-4o mini → ~\$0.50–\$1.00            | Gemini Flash → ~\$0.30–\$1.00               | Claude Haiku → ~\$1–\$5    |
| Medium | GPT-4o / GPT-4.1 → ~\$8–\$12            | Gemini 1.5 Pro / 2.5 Pro → ~\$5–\$10        | Claude Sonnet → ~\$12–\$18 |
| Pro    | o-series (o3 / reasoning) → ~\$15–\$40+ | Gemini Ultra / Pro high tiers → ~\$10–\$25+ | Claude Opus → ~\$25–\$75+  |

## What is the context window?

A context window is the maximum amount of text an AI model can process and “remember” at one time within a single interaction. It includes everything the model uses to generate a response—your current prompt, previous messages in the conversation, and any additional inputs like documents. The size of the context window is usually measured in tokens (pieces of words). A larger context window allows the model to handle longer conversations or documents without losing earlier information, while a smaller one limits how much context the model can consider at once.

AI model tiers (basic, medium, pro) differ significantly in context window size, which affects both cost and capability. Larger context windows allow models to process longer inputs and maintain coherence across complex tasks, but they increase token usage and cost per request. Smaller models are cheaper but often require chunking and additional engineering to handle large inputs. Choosing the right model involves balancing compute cost against system complexity. The key is to select the smallest context window that reliably handles your task, since overestimating needs wastes budget, while underestimating them leads to fragmented outputs or more complicated workflows.

| Model Tier | Typical Context Window          | Best-Suited Tasks                                                               | Strengths                                                     | Limitations                                                    |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| Basic      | Small (e.g. ~4K–16K tokens)     | Short Q&A, simple prompts, classification, quick chats                          | Low cost, fast responses                                      | Limited memory, struggles with long inputs, requires chunking  |
| Medium     | Moderate (e.g. ~16K–64K tokens) | Multi-step tasks, coding help, longer conversations, moderate document analysis | Balanced cost vs capability, better reasoning across turns    | Still limited for very large documents, may need some chunking |
| Pro        | Large (e.g. ~128K–1M+ tokens)   | Long documents, research, complex reasoning, persistent conversations           | Handles full context, high coherence, less engineering needed | Higher cost per request, can be overkill for simple tasks      |

---

## The hidden cost of AI

In many development environments, AI tools and models are accessed through team or enterprise licenses, which often obscures the true costs for individual developers. Even when this information is available, it may take some effort to locate it.

This means that during day-to-day work, developers usually do not have direct visibility into how much each model call actually costs, unless they are specificly looking for it. Over time, this can weaken the natural intuition for the trade-off between cost and performance, making it easier to default to more powerful (and more expensive) models even for tasks where a cheaper alternative would be sufficient.

From my personal experience, whenever this cost part comes up in conversations, developers are actually very interested in it. There is a clear curiosity around understanding how pricing works, which models are more expensive, and how to make more informed choices in everyday usage.

As a result, this curiosity points to a growing need for better guidance and tooling around cost-efficient usage.
