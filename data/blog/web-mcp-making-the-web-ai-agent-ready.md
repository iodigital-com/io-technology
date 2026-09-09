---
title: 'WebMCP: Making the web _AI-agent ready_'
date: '2026-02-12'
tags: ['ai', 'frontend']
images:
  ['/articles/web-mcp-making-the-web-ai-agent-ready/web-mcp-making-the-web-ai-agent-ready.jpg']
summary: 'WebMCP is a new browser API that lets you expose your web application functionality as structured tools for AI agents. No screen scraping, no brittle automation, just direct function calls.'
authors: ['dave-bitter']
theme: 'blue'
---

The web is evolving. AI agents are increasingly being used to interact with websites on behalf of users. Whether it's booking a flight, filling in a support ticket, or shopping for a product, AI agents are expected to navigate the web just like we do. The problem? The web was built for humans, not for agents. Buttons, forms, and visual flows were designed for clicking and reading, not for programmatic interaction.

That's where [WebMCP](https://webmachinelearning.github.io/webmcp/) comes in. Published as a [W3C Draft Community Group Report](https://webmachinelearning.github.io/webmcp/) on February 10, 2026, WebMCP is a new browser API that makes your website "AI-agent ready". I think this is a really cool addition to the web platform and want to walk you through what it does and why it matters.

## What is WebMCP?

WebMCP stands for Web Model Context Protocol. It builds on top of Anthropic's [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) but brings it to the browser. The core idea is simple: instead of AI agents trying to figure out what your website does by scraping the DOM and clicking buttons like a robot, you explicitly tell agents what actions are available and how to perform them.

You do this by exposing your web application functionality as "tools". These are JavaScript functions with natural language descriptions and structured schemas that AI agents can discover and invoke. Think of it as creating an API for your website, but one that lives right in the browser and uses your existing session.

## The two APIs

[WebMCP proposes two approaches](https://developer.chrome.com/blog/webmcp-epp) for browser agents to take action on behalf of the user:

### Declarative API

The Declarative API allows you to define standard actions directly in HTML forms. This is great for straightforward interactions where the action maps neatly to a form submission. If your website already has forms for things like search, checkout, or contact, you can make these discoverable for agents without writing additional JavaScript.

### Imperative API

The Imperative API is where it gets really interesting for us developers. It allows you to define complex, dynamic interactions through JavaScript. The core of this API lives on `navigator.modelContext`, which exposes a `ModelContextContainer`. This is where you register your tools.

## A practical example

Let's say you have an e-commerce site and you want to allow an AI agent to add products to the cart on behalf of the user. Here's how you could register that as a tool:

```js
if ('modelContext' in navigator) {
  navigator.modelContext.registerTool({
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart by its product ID and a specified quantity',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The unique identifier of the product',
        },
        quantity: {
          type: 'number',
          description: 'The number of items to add',
        },
      },
      required: ['productId', 'quantity'],
    },
    async execute({ productId, quantity }) {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })

      const result = await response.json()
      return { success: true, cartTotal: result.total }
    },
  })
}
```

Let's break that down. First, we check if the `modelContext` API is available on the `navigator` object. Then, we register a tool with a `name`, a human-readable `description`, an `inputSchema` that describes what parameters the tool expects, and an `execute` function that contains the actual logic. The agent can now discover this tool, understand what it does, and call it with the right parameters. No guessing, no clicking around.

What I love about this approach is that you're reusing your existing application logic. The `execute` function is just regular JavaScript. You're not building a separate API or integration layer. You're exposing what your app already does.

## WebMCP vs MCP

You might be wondering how this relates to the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) you may have already heard of. The distinction is straightforward:

- **MCP** is for backend services and server-to-agent communication
- **WebMCP** is for browser-based tools where users are present

They're complementary. Use MCP when you need an agent to talk to your backend services directly. Use WebMCP when the interaction happens in the browser and you want to leverage the user's existing session, authentication, and context.

## Use cases

The [Chrome for Developers blog post](https://developer.chrome.com/blog/webmcp-epp) highlights a few compelling use cases:

- **E-commerce**: Agents can find products, configure options, and navigate checkout flows with precision. No more fragile screen scraping that breaks when you update your UI.
- **Travel**: Agents can search, filter flights, and handle bookings using structured data to ensure accurate results every time.
- **Customer support**: Agents can help users create detailed support tickets by automatically filling in technical details.

These are just the starting points. Any website that has actions a user can take could benefit from exposing those actions as WebMCP tools. Think about form-heavy workflows, dashboards, booking systems, content management, the possibilities are endless.

## Things to Consider

### 1. Still very early

WebMCP is in [early preview](https://developer.chrome.com/blog/webmcp-epp) as of February 2026. The [W3C specification](https://webmachinelearning.github.io/webmcp/) is a Draft Community Group Report, not a standard yet. This means the API surface can and likely will change. It's great for prototyping and experimenting, but keep in mind that things might shift.

### 2. No native browser support yet

Browsers don't natively support `navigator.modelContext` at the time of writing. [MCP-B](https://docs.mcp-b.ai/) serves as the reference implementation and acts as a polyfill. It adds `navigator.modelContext` to any browser and bridges WebMCP tools to the MCP format for compatibility with existing AI frameworks. You can check out the [MCP-B GitHub](https://github.com/WebMCP-org) for the source code.

### 3. Security and user consent

Because WebMCP tools execute within the browser's existing session, they inherit the user's authentication and permissions. This is convenient but also means that proper security considerations around what you expose and to whom are crucial. The spec includes sections on security and privacy considerations that are worth reviewing.

## Conclusion

WebMCP is an exciting step towards making the web work seamlessly with AI agents. By giving developers a structured way to expose their application's functionality, it bridges the gap between the human-first web and the emerging agentic web. Instead of AI agents clumsily automating your interface, they become native extensions of your application.

It's still early days, but the fundamentals are promising. A simple API, reuse of existing application logic, and a standards-based approach through the W3C. If you're building for the web and want to explore how AI agents could interact with your site, now is a great time to experiment.

Want to try it out? [Sign up for the early preview program](https://developer.chrome.com/blog/webmcp-epp) and check out the [WebMCP specification](https://webmachinelearning.github.io/webmcp/) and [MCP-B documentation](https://docs.mcp-b.ai/) to get started.
