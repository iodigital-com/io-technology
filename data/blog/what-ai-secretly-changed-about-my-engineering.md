---
title: 'What AI Secretly Changed About My Engineering'
date: '2026-07-06'
tags:
  [
    'ai',
    'software engineering',
    'developer productivity',
    'claude code',
    'github copilot',
    'junie',
    'spec-driven-development',
  ]
images: ['/articles/what-ai-secretly-changed-about-my-engineering/banner.png']
summary: 'After hundreds of hours of AI-assisted development, I expected to write less code. Instead, I changed how I plan, review, and reason about it.'
authors: ['mohamed-elmedany']
theme: 'green'
---

At first, I thought AI-assisted development would teach me how to type less, just like everyone else seemed to promise. That was the obvious story. Faster autocomplete, faster boilerplate, faster drafts. But after using these tools on real services, with real constraints and the usual collection of legacy decisions, which we prefer now to call _"context",_ the lesson became different.

AI did not make engineering generally cheaper. It made some parts dramatically cheaper, only to expose the ones that were never inexpensive to begin with.

Implementation got faster. Ambiguity got more expensive. Context started behaving like an engineering resource. Review became more of a bottleneck. Architecture stopped being an abstract quality discussion and became something the tool either _amplified_ or _punished_ immediately.

The strange part was that most of the failures were not random. They pointed at weak spots I had been politely ignoring.

So this is not really about prompting tricks. Unfortunately for everyone hoping for a shortcut, it is about how we shift our mindset to become significantly harder to fool.

## The First Promise Was Speed

The first time an AI coding assistant saved me a couple of hours, I reacted like any reasonable engineer. I immediately wondered how many more hours I could extract from it before anyone noticed.

For a while, I thought the story was simple. AI made me faster. Then it started making me slower in very specific ... well, embarrassing ways.

I would ask _Claude_ to implement a small change in one service, and twenty minutes later I was discussing out-of-scope changes in a module I had not touched in three months. _Copilot_ would complete a method beautifully, except it hallucinated a business rule that sounded just real enough to survive a late-afternoon review. _Junie_ would plan a refactor that looked reasonable until I realised the plan depended on a mental model of the codebase that only existed in my head, and apparently I had forgotten to share it.

The AI was not really bad at the task. **The task was badly framed.** The code was harder to understand than I admitted. The tests proved less than their confident green colour suggested. The PR was technically mine, but I felt like an outsider staring through a foggy window at someone else's black-box code.

I decided at this point that I need to learn better prompting. That was not the gap.

## When Vague Thinking Becomes Expensive Code

My first serious lesson came from a simple clean-up mechanism.

The task sounded simple: fix the clean-up of old entities so it matched the intended clean-up logic. The service already had a scheduled job for that. I gave _Claude_ a short description, because of course I did. Nothing makes us overconfident like a ticket with fewer than a couple of sentences.

The change looked straightforward. _Claude_ produced a decent first draft. It introduced a retry when clean-up failed, delayed the next attempt, and marked entities as failed after a limit. It even named things reasonably well, which is always suspicious.

Then I started reviewing the behaviour.

What counts as retryable? SQL failures? Locking issues? Networking errors? What if the entity was cleaned up but is still referenced somewhere else? What if an update arrives after the database transaction has committed?

None of those questions were AI problems. They were product and engineering questions. I just had not asked them before requesting code.

_Claude_ had done exactly what many engineers do when given vague requirements: it filled in the blanks with reasonable guesses. The uncomfortable part was that I had given it the same kind of task description I may give to humans, then acted surprised when reality was more detailed than the ticket.

I think this is where AI becomes useful in a way that is not obvious at first. **It makes vague thinking executable.** That sounds helpful ... until the executable version has to survive production.

That changed how I start tasks.

Now, before I ask any tool to write code, I write down the boring questions: **_exact behaviour, non-goals, failure modes, test cases, verification steps,_** anything that I would ask in a PR if someone else wrote it.

Sounds like bureaucracy? It is not. Bureaucracy is when you write documents nobody reads to satisfy a process nobody trusts. This is cheaper than discovering in production that a reference was still in use after its target had been cleaned up. What state does the system end up in then?

The more time I spent clearly describing the problem, the less magical the AI felt.

## Every Task Deserves Its Own Context

The next habit came from a different kind of mess: dirty context.

At some point I noticed that long AI sessions started behaving like long meetings. They began with focus, accumulated side conversations, collected unresolved assumptions, and ended with everyone pretending the conclusion was obvious. Nodding does not mean understanding, unfortunately.

I would start by fixing a cache invalidation bug. Then I would ask a question about a test. Then we would discuss a possible refactor. Then I would paste an error log from a different branch. After a while, _Copilot_ would confidently connect things that should never have been connected. It had technically listened to me. That was the problem.

It took me a while to realise that AI context is not a landfill. It is closer to a workbench. If I pile every tool, screw, coffee mug, and mysterious cable on it, I should not be surprised when the next thing I build contains a coffee mug.

Around the same time, I started thinking in _tokens_. Not as an API billing concern, but as an engineering constraint. That includes latency and cost, not just accuracy. **Context is a finite resource**, and every irrelevant file, stale assumption, or abandoned requirement consumes some of it. Once I saw it that way, task decomposition stopped being a project management ritual. It became resource allocation.

Small task, clean context. New bug, new conversation. Refactor discussion, separate from implementation. Review phase, separate from planning. When I need to keep important information, I write it in a task note or a specification instead of _hoping_ that chat transcript remains a clean representation of reality.

This was a milestone. It improved more than the AI output. It improved my own thinking. I had to decide which files, constraints, and decisions actually belonged to the task.

I think that context management is becoming a core engineering skill. Not because AI needs it, but because complex systems already need it. A person can often infer when you are mixing topics. They can interrupt and ask, "Are we still talking about cache warming or did we switch to read replicas?" AI, with its super helpful mode, will happily follow the mess.

## Plans Are Cheaper Than Code

For a long time, I treated planning as something that happened before real work. Real work was code. Planning was the overhead.

AI made that attitude look childish very quickly.

The first time I asked _Claude_ to implement a medium-sized change without a plan, it produced a medium-sized diff without a plan. Fair enough. The change touched controllers, services, repositories, migration scripts, and tests. The code compiled. Some tests passed. **The shape was wrong.**

The feature was a schema refactor. _Claude_ implemented the new tables, the migration script, and updated the required queries. What it missed was the domain idea hiding underneath. The underlying data model needed a complete rethink, otherwise handling the transition was just a technical patch spread across multiple services.

Now I ask for plans before code, and I review the plan like I review an _architecture proposal_. I want to see the files involved, the responsibilities that move, the tests that should exist, the migration risk, and the rollback strategy. I want _Claude_ to say what it will not touch. That last part matters more than I expected.

Why? Because it creates a pause. That pause gives me a chance to notice that we are about to modify fourteen files to fix a four-line bug, or that the current design is fighting the change. The plan is the cheapest artefact in the whole pipeline. It is much easier to delete a paragraph than to untangle a diff.

## Spec-Driven Development Was Not the Trick I Expected

I kept improving my prompts. I added more context. I gave stricter instructions. I had prompts that sounded like I was negotiating with a very talented junior engineer who had read the entire internet but forgotten our company's naming rules.

Then I noticed that my prompts were becoming miniature specifications. They described goals, constraints, edge cases, test expectations, and review criteria. The prompt was no longer a clever command. **It was ... the work itself**.

That was the turning point. I stopped asking, _"How do I prompt this better?"_ and started asking, **"What specification would make this task safe for another engineer to implement?"**

A prompt is written for a single interaction. A specification is written for the work. It can be reviewed, challenged, versioned, reused, and handed to a person without embarrassment. If a prompt only works because the tool guesses what I mean, that is not a good prompt. That is luck.

So the version of Spec-Driven Development that worked for me was not heavy. It was simply this: before implementation, write the specification clearly enough that **code becomes one possible execution of it**. Nothing fancy. Usually a Markdown note with current behaviour, desired behaviour, constraints, non-goals, affected classes, test cases, and open questions. The spec does not need to be a story. It needs to remove the expensive ambiguity while decisions are still inexpensive to change.

The AI output improved, but that became almost secondary. The spec improved my own implementation even when I wrote the code manually. It gave reviewers something real to discuss and made the eventual PR less like a puzzle.

This is also where multiple tools stopped competing. _Claude_ might expand the plan from the repository context, _Junie_ can reason close to the IDE, and _Copilot_ can help during implementation. None of that matters as a tool comparison. **The spec is the heart of the conversation, not the chat window.**

## Small Diffs Beat Heroic Rewrites

AI is very comfortable changing code. Sometimes too comfortable.

I once asked for help fixing a bug in a data processing service. Under a rare path, a message could be marked as processed before it was fully persisted. The correct fix was probably a small transaction boundary adjustment and one test. _Junie_ suggested a cleaner processing pipeline that touched the validation handlers, provider and enricher adapters, retry processors, and test fixtures. It was coherent. It was also completely unnecessary for that one specific bug.

This taught me to become much stricter about diff size.

I do not think of small diffs as a matter of taste. **They are a risk control.** They make review possible, keep rollback simple, and reduce the number of unrelated behaviours that can accidentally change while everyone is admiring the rewrite structure. They also fit in one clean context, which by now should sound familiar.

When using AI, I now say what kind of change I want:

- Minimal bug fix first.
- No broad refactor unless explicitly requested.
- Preserve public behaviour.
- Add the failing test before changing the implementation.
- Explain any file changes outside the expected boundary.

That last instruction has saved me more than once. If a change to validation logic requires changing the message structure, I want _Junie_ to justify it. Sometimes there is a good reason. Usually the reason is that the model got lost navigating an overengineered layer.

Do not get me wrong, I love a good refactor. But keep it separate. Refactoring deserves its own reason, space, review, and tests. And its own context. Keeping changes small reduces risk before the code is merged. The next question is whether the change is actually correct.

## Never Let The Same AI Review Its Own Work

Yes, I admit it, I fell into that silly loop.

I asked _Claude_ to implement something. Then I asked it again to review it. It found a few issues, fixed them, reviewed again, and eventually declared the result solid. This felt efficient until I realised I had basically asked unvalidated input to write its own sanitisation logic and unit tests.

AI review is useful, but it needs independence and direction. I do not trust the same context to review the design. It already carries the assumptions that produced the diff. It may catch syntax mistakes, missing tests, or obvious inconsistencies, but it is less likely to challenge the premise. Sounds familiar? Humans have the same problem. **We are all strangely attached to the code we just wrote.**

_"Is this good enough?"_ is not a review prompt. It is a question that invites politeness. I ask for specific challenges: behaviour that violates the spec, missing tests, race conditions, unrelated changes, naming inconsistency, or unnecessary fixtures. This produces better feedback because it resembles how I want another engineer to review the change. Not emotional support, but actual risk discovery.

The same suspicion extends to green builds. I like tests. I also doubt them, which I think is a healthy relationship. AI made me more suspicious of passing tests because it is great at satisfying the tests that exist, and **existing tests are often a map of what we remembered to worry about last time.**

I ask different questions around tests. Which behaviour is not covered? Which data shapes are missing from test fixtures? Which tests would fail before this fix? Are we testing the contract or the implementation detail? Did AI add tests that prove something meaningful, or tests that mostly prove it can read its own code?

That last one happens more often than I like. AI-generated tests can be beautifully circular: mock the exact method the implementation calls, assert the exact value the implementation just constructed, and sit there glowing green like traffic lights on a cliff.

For bug fixes, I ask for a failing test first whenever possible. It does not need to be perfect. It needs to demonstrate the bug in a way that would have protected us from shipping it. For features, I want tests based on the spec examples, including negative cases and boring edge cases.

A human review is still the final gate, simply because _AI does not own the system_.

## My Workflow Today

There is no fixed prescription. My workflow keeps changing, but the current version is much calmer than where I started.

For small tasks, auto-completion is still enough. If I am writing a straightforward mapper, a test fixture, or a small validation rule, I do not need a ceremony for every line of code. Sometimes a boring completion can stay boring, and we should be grateful.

For medium or risky tasks, everything now moves around the spec. I write it first, ask for a plan, and review that plan before any code exists. Implementation happens in a clean context, in small diffs, with tests I run and inspect myself. Another context review from the specification and the diff, without the implementation conversation. Sometimes I even use a different tool. Sometimes I simply start clean and provide the spec, the changed files, and the review criteria.

![my-workflow-today](/articles/what-ai-secretly-changed-about-my-engineering/my-workflow-today.png)

The owner pass is the part I refuse to automate, at least for now. **If my name is on the PR, I own it**: the design, the tests, the migration, the rollback plan, everything. The green build does not mean comprehension. I should still be able to explain every line six months later if it breaks at 3 a.m.

This workflow is not perfect, and it is not universal. If it does not make sense for your setup, skip it. It is just the specific shape that survived contact with my own real services, real deadlines, and a personal talent for underestimating edge cases.

The interesting part is that most of it would still make sense without any AI. Clear specs, focused context, small diffs, clean architecture, independent review, meaningful tests, and ownership. These are **the things that ultimately make you a better teammate, not just a faster coder.**

## Final Thoughts

The more I use AI, the less I think the main lesson is about AI.

The tools are useful, sometimes invaluable. They can speed up exploration, remove boring typing, challenge a design, draft tests, and help navigate unfamiliar code. They can be a collaborator, a drafter, a reviewer, and occasionally the source of many good ideas. **They are never the responsible engineer**.

AI quietly rewards engineering discipline. It rewards clear requirements, clean boundaries, explicit decisions, small changes, and thoughtful review. It punishes ambiguity, messy architecture, missing tests, and the comforting belief that because something compiles, it must be close to correct.

The specific tools will change. Model names will change. IDE integrations will improve, break, get renamed, and improve again. The habits will age better.

Happy coding!

## Further Reading

- [Spec-Driven Development: A Spec-First Approach to AI-Native Engineering](https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering)
- [AI Is Amplifying Software Engineering Performance, Says the 2025 DORA Report](https://www.infoq.com/news/2026/03/ai-dora-report/)
- [Complexity is the ceiling: software design in the age of AI coding](https://thenextweb.com/news/complexity-is-the-ceiling-software-design-in-the-age-of-ai-coding)
- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Claude Code best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
