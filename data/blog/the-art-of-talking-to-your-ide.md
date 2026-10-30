---
title: 'The Art of Talking to Your IDE'
date: '2026-10-14'
tags: ['ai', 'cursor', 'developer-productivity', 'developer-tools', 'ide']
images: ['/articles/the-art-of-talking-to-your-ide/banner.png']
summary: 'A 42-slide deck, one lonely double space, and a rule that makes my editor give me a pep talk. A lighter look at how I talk to Cursor, and what it does when I stop typing and start briefing.'
authors: ['luca-vandenweghe']
theme: 'green'
---

Somewhere in a 42-slide deck, there was a double space in front of an arrow. One. Tiny. Invisible to everyone, including me.

Fixing it by hand would have taken ten seconds. Instead I wrote it into a plan, between "add speaker notes to every slide" and "make the titles consistent", and let Cursor deal with the whole list while I watched.

That, in miniature, is this article. Cursor is not magic, and it is not a chat window glued onto an editor. It is a colleague you brief. The better the briefing, the less you do. I gave a talk about this at our Frontend Developer Day, and this is the pocket version. The [full deck](https://cursor-presentation-six.vercel.app/) is there if you want the long one.

## Meet your new colleague

Cursor is VS Code. Same extensions, same keybindings, same muscle memory. The difference is that you can describe what you want in plain language and it reads your project, proposes edits, and runs commands when you approve them.

I think of it as a junior colleague who never sleeps, never complains, and has never once taken my chair.

You need three shortcuts. That is the whole manual:

- **Cmd+L** opens the agent chat.
- **Cmd+K** edits a selected block inline.
- **Tab** accepts autocomplete.

> **Side note:** Tab is the editor finishing your sentences for you. It is the only time I enjoy being interrupted.

**Shift+Tab** switches modes (more on that in a moment). Learn it on day two, like a normal person.

Your first prompt can be as plain as: _Add a loading spinner to the submit button while the API call is in progress._ Cursor finds the file, reads it, and shows you a diff. You say yes or no, which is more control than I usually have over my own commits.

## Do not make it guess

Asking an AI a vague question is like asking a colleague, "can you look at the thing?" They will look at _a_ thing. Probably not your thing.

So point. Type **@** and reference exactly what you mean. Half of the list is code:

- `@src/components/Button.tsx` points at one file.
- `@src/services/` points at a folder.
- `@codebase` searches everything.
- `@docs React` reads a library's documentation.

The other half is everything that is _not_ code, and it is the half people forget:

- `@Terminals` hands over the error you just got, so you can stop pasting stack traces. Your clipboard deserves a rest.
- `@Chats` pulls in a conversation from yesterday, instead of re-explaining the feature.
- `@Browser` shows the page as it looks right now, which is the fastest way to fix a layout bug.
- `@Branch` is your whole branch diff, which is how you get a review before a human sees it.

Under the hood, how Cursor searches a codebase has changed a few times (it recently swapped its semantic index for a fast local text index plus parallel searches), but the lesson survives every redesign: the more precisely you point, the less the agent has to wander.

A **`.cursorignore`** file keeps files out of its reach, using the same syntax as `.gitignore`. Treat it as tidiness, not a vault. Secrets still do not belong in your repository.

## Pick your gear

Cursor has five modes, and they are different gears for different jobs:

- **Agent**, the doer: edits files, runs the terminal, and uses MCP tools, with your approval.
- **Ask**, the explainer: read-only. Nothing gets written, so nothing can go wrong, which is surprisingly relaxing.
- **Plan**, the architect: writes a plan first, then waits for you to approve it.
- **Debug**, the detective: traces a bug with logs and repro steps instead of guessing at a fix. A detective, not a fortune teller.
- **Multitask**, the fan-out: your next messages stop queueing behind the current task, and each one becomes its own subagent running in parallel. Like having several colleagues, none of whom want a standup. You can also start it by typing `/multitask`.

Switching is one keystroke: **Shift+Tab** cycles through the modes, and **Cmd+.** opens the mode menu directly. Each mode gets its own context window, so a switch is a clean start rather than dragging the old conversation along.

## Plan first, type later

For the deck, I did not start with "make it better". I pressed **Shift+Tab** until the mode said **Plan**, then described the job. The plan came back in phases: install and baseline, rewrite the README and remove dead code, port a zoom toggle, add speaker notes to all 42 slides, tidy the titles, verify.

![A Cursor plan for a slide deck upgrade, with phases, a verification section, and an out-of-scope list](/articles/the-art-of-talking-to-your-ide/plan-mode.png)

_The plan, before a single line changed. Note the verification section and, my favourite, the "out of scope" list._

I read it, crossed out what I did not want, and approved the rest. Then came the model handoff: **Kimi K3 Max** wrote the plan, a strong reasoning model that is cheap for how smart it is, and **Composer 2.5 Fast** did the typing. The expensive model had already done the thinking; boilerplate does not need a genius.

The best line in any plan is the one that says what you are _not_ doing. An agent without boundaries is an intern with admin rights and a lot of energy.

## Rules, or: how I stopped repeating myself

For a while, my conversations with the AI went like this:

> **Me:** Add a button component.
> **AI:** _writes a default export_
> **Me:** Named exports, please.
> _(repeat tomorrow)_

Groundhog Day, but with pull requests.

The fix is a **rule**: a markdown file with frontmatter, telling the agent how your team writes code. It can always apply, match certain file globs, or load when the agent decides it is relevant:

```md
---
description: React component conventions
globs: src/components/**/*.tsx
---

- Functional components, named exports
- Name the props interface `<Component>Props`
- Memoise callbacks passed to children
```

I have no benchmark to quote, but once the conventions lived in rules, I corrected far less. If you are not sure how to start, ask Cursor to write the rule for you from your existing code. It is surprisingly good at setting itself up.

(Rules guide passively. **Skills** run multi-step workflows, and commands are saved prompts. Same family, different jobs.)

### The "ugh" rule

My favourite rule is not technical. It says that when I type "ugh", the assistant gives me a short pep talk before it gets to the fix.

It sounds ridiculous until it is 16:30 and a stack trace has just ruined your afternoon. "This one is genuinely tricky, here is why" lands very differently from a wall of red text.

And because a rule is just a file, here is the actual one:

```md
---
description: Triggers when I say 'hype me', 'im stuck', 'this is impossible', 'ugh', or 'fml'
alwaysApply: false
---

# Hype Man Mode

Luca needs a boost. Channel your inner motivational surfer bro.

## Step 1: Acknowledge the pain

Read the current git diff and branch to understand what Luca is struggling with.

## Step 2: Deliver the hype

Pick a random style:

### Style A: Surfer Bro

Bro. You've been SHREDDING today.
Look at this git log, that's SOLID work.
This bug? It's just a wave. You ride waves.
Let's paddle back out and catch this one.

### Style B: Boxing Corner Man

ROUND 7: LUCA vs THE BUG
You've landed 12 commits today.
That's CHAMPIONSHIP material.
Now get back in there and finish this.

### Style C: David Attenborough

"And here we observe the developer
in his natural habitat. Despite
encountering a particularly nasty
TypeScript error, he persists.
Remarkable."

## Step 3: Actually help

The hype is fun, but the help is what matters. Always end with one concrete next step.
```

Yes, the rule talks about me in the third person. It was easier to write that way, and now it makes me laugh every time it fires.

## The one-word standup

Skills are where this gets properly lazy, in the good way. At 08:45 I type "standup". Cursor reads my git history, my calendar, and my tickets, and writes the update. I read it aloud with the confidence of a person who clearly remembers what they did yesterday.

The whole skill fits on an index card:

```md
---
description: Triggers when I say 'standup', 'daily', or around 08:45
alwaysApply: false
---

# Standup Prep Workflow

## Gather (all in parallel)

1. Yesterday's git activity (Friday's, on a Monday):
   git log --since="yesterday.midnight" --until="today.midnight" --oneline --all

2. Today's calendar:
   icalBuddy -nc -ec "Home" -ea eventsToday

3. Current branch and status:
   git branch --show-current && git status --short

4. My open tickets in Jira (anything assigned, not Done)

## Format

Yesterday:
- [what was done, from git commits + context]

Today:

- [what's planned, from branch + TODOs + tickets]

Blockers:

- [any blockers, or "None"]

Keep it short and casual. I read this out loud.
```

The rest of the day is similar: a ticket broken into a TODO list, agent mode for the boilerplate while I keep the architecture calls, and a pre-merge review prompt at 14:00 that catches things before my colleagues do.

Behind this are **MCP** servers (Model Context Protocol), which let one chat reach tickets, documentation, and design files without tab-juggling. There are also **cloud agents** that take a task, run the tests, and open a pull request while you are in a meeting. I still read the pull request. Obviously.

## Things I try not to do

- **Typing "fix it".** Fix what? That is a taxi driver being told "go".
- **Writing a 500-word prompt.** Short and specific beats long and emotional.
- **Accepting diffs unread.** You would not do it for a colleague.
- **Skipping rules** because you will "correct it later". You will be correcting it in three weeks, in the same way, with the same sigh.

And the serious bit: never paste passwords or API keys into chat, have a human review security-sensitive logic and production SQL, and be careful what client code leaves your machine through third-party models.

**You stay responsible.** The AI types. You sign.

## The double space

It is gone, by the way. One line in a plan. Nobody will ever know, and I will think about it for the rest of my life.

But the typo was never the point. The point is what the plan did: it turned a pile of small chores into a list I could read, edit, and approve before anything changed. That is the workflow I believe in, and here is my honest take on it:

- **Briefing is the skill.** The editor is smart, but the people who get the most out of it explain themselves well: point with **@**, plan before you build, and write the rule the second time you repeat yourself.
- **Plan before you build.** If I could keep only one habit, it would be pressing **Shift+Tab** to get into Plan mode. Reviewing a plan costs minutes. Reviewing a wrong diff costs an afternoon.
- **Delegate the typing, keep the judgement.** The AI is excellent at repetition. Architecture, trade-offs, and "should we even build this?" stay with me.
- **It is not for everything.** A small, obvious change? I just type it. Security-sensitive logic? A human reads every line.

So no, I do not think the future is talking _instead of_ engineering. I think it is engineering with better delegation, and the art is in the briefing.

If you want to go further, try the [Cursor docs](https://cursor.com/docs), community rules at [cursor.directory](https://cursor.directory/), and skill templates at [skills.sh](https://skills.sh/). Start with one rule. If it goes wrong, you know what to type.

_(Ugh.)_
