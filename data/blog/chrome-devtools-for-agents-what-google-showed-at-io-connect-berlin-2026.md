---
title: 'Chrome DevTools for agents'
date: '2026-06-27'
tags: ['ai', 'frontend', 'chrome', 'devtools', 'events']
images:
  [
    '/articles/chrome-devtools-for-agents-what-google-showed-at-io-connect-berlin-2026/chrome-devtools-for-agents-what-google-showed-at-io-connect-berlin-2026-hero.jpg',
  ]
summary: 'Google I/O Connect Berlin and the GDE Europe Summit showed how coding agents can drive Chrome directly through chrome-devtools-mcp, and how Modern Web Guidance keeps agents from reaching for stale patterns in the first place.'
authors: ['dave-bitter']
theme: 'blue'
---

I just got back from Berlin after two days at Google events: [I/O Connect Berlin 2026](https://io.google/2026/intl/de/) at [Wilhelm Studios](https://wilhelmstudios.de/) and the [GDE Europe Summit](https://developers.google.com/community/experts) at the Google Berlin office. I was there as a [Google Developer Expert (GDE)](https://developers.google.com/community/experts) for Web together with [Brecht De Ruyte](https://techhub.iodigital.com/authors/brecht-de-ruyte).

![Collage from Google I/O Connect Berlin and the GDE Europe Summit: the event sign, venue mascots, the chrome-devtools-mcp talk, a beer garden during Ecuador vs. Germany, I/O glasses, a humanoid robot demo, and a GDE badge](/articles/chrome-devtools-for-agents-what-google-showed-at-io-connect-berlin-2026/berlin-events-collage.jpg)

Still unpacking, but the highlight for me was clear: a coding agent opened Chrome, read the console, inspected a performance trace, and fixed a bug. No copy-pasting. No switching windows.

This post covers the two tools that stood out: Chrome DevTools for agents and Modern Web Guidance.

## The problem these tools address

The familiar workflow when using a coding agent goes something like: write a prompt, agent generates code, you run it in the browser, something breaks, you copy the error, paste it back to the agent, it fixes that, something else breaks. Repeat.

The agent is essentially blind to what happens after it writes code. You become the relay between browser and agent, manually ferrying console output back and forth. The sessions framed this as one of the core friction points in AI-assisted development right now. The tools shown were a direct response.

## Chrome DevTools for agents

The main announcement for me was [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), an open-source [MCP](https://modelcontextprotocol.io/) server that connects a coding agent to a live Chrome browser instance using the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro).

Once installed, the agent can read [console output](https://developer.chrome.com/docs/devtools/console) directly (errors, warnings, logs) without you touching the browser. It can inspect [network traffic](https://developer.chrome.com/docs/devtools/network/overview), record and evaluate [performance traces](https://developer.chrome.com/docs/devtools/performance/overview) to find long tasks and [INP](https://web.dev/articles/inp) issues, run [Lighthouse audits](https://developer.chrome.com/docs/devtools/lighthouse) and act on the results, and walk the [accessibility tree](https://developer.chrome.com/docs/devtools/accessibility/reference).

The demo shown in the sessions had an agent check performance on a page, identify a long task blocking the main thread, trace it to a specific function, and propose a fix using [scheduler.yield](https://developer.chrome.com/docs/web-platform/scheduler-yield). All from a single prompt, with the agent driving Chrome directly.

The useful part for day-to-day work is that the agent can actually verify its own output. It writes code, opens the page, checks whether the console is clean, looks at what rendered, and iterates from there.

## Auto-connecting to an existing session

One of the more practical things shown was the [auto-connect mode](https://developer.chrome.com/docs/devtools/agents/use-cases/auto-connect) (Chrome 144+). By default the MCP server spawns a fresh Chrome instance, but with `--autoConnect` you can point it at a browser session that's already open: one that's already logged in, already has state, already has the page you're debugging loaded.

The caveat was made clear in the sessions: when you auto-connect, the agent inherits your active session including cookies and authenticated state. Treat it like handing someone your unlocked laptop. Worth it for debugging, worth knowing about before you use it.

Manual connection via [remote debugging port](https://developer.chrome.com/docs/devtools/remote-debugging) is also possible for sandboxed environments:

```bash
# Start Chrome with debugging port
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-stable
```

Then configure the MCP server to connect to it:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
    }
  }
}
```

## Installing it

For [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview):

```bash
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
```

For any [MCP-compatible agent](https://github.com/ChromeDevTools/chrome-devtools-mcp#mcp-client-configuration) (Gemini CLI, Cursor, Copilot, Cline, etc.):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Headless mode is available too if you want the agent running browser checks in the background without a visible window; add `--headless` to the args.

## Testing the setup

The sessions suggested a quick verification prompt once installed:

```
Check the performance of https://developers.chrome.com
```

If it's working, the agent opens a browser window and records a trace. If something is off with the setup, the [DevTools troubleshooting skill](https://developer.chrome.com/docs/devtools/agents/get-started#troubleshoot) can be invoked directly:

```
Use the Chrome DevTools troubleshooting skill to fix my setup.
```

## The companion piece: Modern Web Guidance

The sessions also covered [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance), a separate skill targeting a different part of the same problem. Chrome DevTools for agents handles debugging and verification in the browser. Modern Web Guidance handles the code quality side, giving agents up-to-date guidance on modern web platform features so they stop reaching for outdated patterns in the first place.

The short version: AI agents default to outdated patterns because their training data is stale. Modern Web Guidance is a skill file that instructs the agent to lazily fetch current guidance via the [modern-web-guidance CLI](https://www.npmjs.com/package/modern-web-guidance) when it needs to know how to approach something. An internal benchmark showed a 37 percentage point improvement in how consistently agents use modern platform features when equipped with it.

Install for Claude Code:

```bash
/plugin marketplace add GoogleChrome/modern-web-guidance
/plugin install modern-web-guidance@googlechrome
/reload-plugins
```

It integrates with [Baseline](https://web.dev/baseline), the W3C initiative that classifies web features by browser support. Set a target in your `CLAUDE.md`:

```
This project's Baseline target is Baseline 2024.
```

The agent then only suggests features within that window and adds fallbacks where needed.

## Both together

The sessions presented these two tools as a pair. Modern Web Guidance reduces the chance of stale or broken code. Chrome DevTools for agents catches and fixes what still goes wrong, without the developer acting as a messenger. Neither is a complete solution on its own. Together they address the debugging loop from both ends.

At the time of writing both are in early preview, but the [chrome-devtools-mcp repository](https://github.com/ChromeDevTools/chrome-devtools-mcp) is already active and the [official get started guide](https://developer.chrome.com/docs/devtools/agents/get-started) has instructions for every major agent.
