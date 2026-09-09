---
title: 'Coding Is Being Commoditized. Engineering Is Not.'
date: '2026-04-24'
tags: ['ai', 'developer-experience']
images: ['/articles/coding-is-being-commoditized-engineering-is-not/hero.png']
summary: 'Agentic coding is making code generation cheaper, but it is raising the value of judgment, systems thinking, and accountability. This article explores why engineering is not being commoditized and what agentic engineering looks like in practice.'
authors: ['dave-bitter']
theme: 'blue'
---

We are entering a strange moment in software.

Agentic coding systems can read and write code, call tools, and iterate on their own. They scaffold applications, refactor modules, generate tests, and wire services together at a pace that would have felt unrealistic a few years ago.

It is tempting to jump to two wrong conclusions. The first is that everyone can be an engineer now. The second is that engineers will not be needed for much longer. Both miss what is actually happening.

People who have spent most of their careers building systems by hand are in a sweet spot. We understand trade-offs, failure modes, and the boring details that make software survive contact with reality. That foundation is exactly what you need when code can appear so quickly and in such volume.

Agentic coding makes the act of producing code cheaper. It does not commoditize the judgment, systems thinking, and responsibility that define engineering.

It also brings us back to something a lot of us secretly wanted all along.

Many engineers did not join this field to spend their days on mechanical, repetitive work. We wanted to build products, solve real problems, and ship things that matter. For years, a lot of our time has gone into boilerplate, glue code, and the same refactors repeated across different codebases.

Agentic coding is a chance to flip that balance.

If we use it well, it can take over the monotonous parts of the job and free us up to do more of the work that actually creates value. The boring parts of engineering get compressed so that the interesting parts can expand.

In this article I want to focus on two things: what changes when coding is cheap but engineering mistakes are still expensive, and what "agentic engineering" looks like in day-to-day work.

## From commoditized coding to compound judgment

For years, the profession rewarded people who could hold complex systems in their head, translate requirements into working code more or less from scratch, and accumulate deep, stack-specific knowledge.

That skill set still matters, but its relative value shifts when agentic coding tools can generate working fragments faster than any individual, repetitive patterns and glue code can be produced on demand, and entire scaffolds, tests, and refactors become a prompt away.

On the surface, it looks like an equaliser. If everyone can generate code, why are experienced engineers still needed?

The answer is that code is not the bottleneck anymore. The bottleneck is framing the right problem, designing systems that can survive change, knowing which generated code to trust and which to rewrite or delete, and recognising when an almost-correct suggestion creates long-term risk.

This is where the sweet spot appears.

Engineers who spent a decade or more debugging real failures in production, dealing with legacy systems and strange edge cases, and negotiating constraints between business, infrastructure, security, and teams now get to plug that experience into agentic coding workflows. The tools amplify their output, but they also amplify their judgment. They can use agents to explore implementation options they would not have had time for, let agents handle the obvious boilerplate while they focus on architecture and constraints, and spot subtle problems in generated code precisely because they have seen similar issues before.

Coding as a mechanical activity is becoming cheap. Good engineering judgment becomes more valuable, because bad judgment scales faster than ever.

## What agentic engineering actually is

Agentic coding is not "letting the AI build everything". It is treating code-generating systems as active collaborators that can plan, call tools, and adapt based on feedback.

Agentic engineering is what happens when you put that capability in the hands of someone who understands real systems.

Instead of thinking "AI replaces my keystrokes", you start thinking about orchestration. How do I get agents to do useful work in my context? How do I keep that work aligned with the architecture, constraints, and long-term health of the system? How do I move faster without losing the properties that matter in production?

That requires a specific skillset, which builds on the fundamentals many of us learned the hard way.

### Framing work for agents, not just for humans

Agents are powerful but very literal. They need clear goals, boundaries, and feedback.

Agentic engineers break work into units that are safe and meaningful for agents to tackle. The prompt is not "improve this codebase", but something closer to "refactor this module to separate read and write paths without changing behaviour" or "generate tests for these edge cases using the framework we already have". They provide the right context, including the relevant files, the patterns that must be followed, and the constraints that cannot be violated. Then they inspect and refine the plan instead of accepting the first idea.

This feels familiar if you have ever mentored a junior engineer. You think in terms of scoped tasks, clear interfaces, and tight feedback loops.

### Keeping architecture and invariants in your head

When agents can produce large amounts of code quickly, someone still has to protect the shape of the system.

Agentic engineers keep a clear mental model of the architecture and the invariants that cannot be broken. They know how data flows through the system, which guarantees must always hold, and where the sensitive boundaries are. They use agents to explore implementation details, but measure everything against those invariants. They also push architectural intent directly into prompts and constraints: follow the existing structure and naming, use the established state management approach, reuse the design system instead of inventing new styling patterns on the fly.

The more code is generated, the more important it becomes that someone is responsible for the big picture.

### Reviewing generated work like it is your own

Agentic coding multiplies output. It also multiplies the surface area for subtle bugs and long-term pain.

Agentic engineers treat generated code as something they are fully accountable for. They review it with the same standards they apply to their own work, looking at readability, maintainability, correctness, failure modes, and security or privacy concerns. Most importantly, they use experience to spot almost-correct solutions that will become a liability later.

This is where a decade of debugging and maintenance pays off. You recognise patterns of future pain that an agent simply cannot see.

### Designing workflows, not just picking tools

Agentic coding is less about finding the perfect model and more about designing workflows that are predictable and safe.

Agentic engineers decide where agents are allowed to act automatically and where they should only propose changes. They combine agents with existing practices such as code review, pair or mob programming, continuous integration, and automated tests. They also put guardrails in place around repository access, required checks, and manual approval for high-risk modifications.

The result is not a magic agent that does everything, but a set of reliable paths where agents consistently make the team faster.

### Understanding the cost of mistakes

When code is cheap to generate, it is also cheap to generate a lot of the wrong thing.

Agentic engineers think in terms of blast radius. They know which parts of the system are safe for aggressive automation and which parts need slow, careful change. They think about lifecycle cost, not just initial speed. How hard will this be to debug in six months? How will it interact with other services and teams? Their experience with outages, migrations, and messy refactors becomes the compass for how agents are allowed to operate.

This is precisely where the sweet spot generation shines. Years of painful lessons become a compass for how to use agentic coding without escalating risk.

## How agentic engineering changes the day-to-day

Agentic engineering is not a new job title. It shows up in the small loops you run every day: understanding a problem, changing code, validating it, and shipping it.

Here is how those loops change when agents enter the picture.

### Understanding and exploring a change

Before agentic coding, you read tickets, dig through the codebase, search for usages, and manually trace how data and events flow through the system. A lot of time goes into simply answering the question: where do I even make this change?

With agentic coding in the loop, you can ask an agent to locate relevant modules, summarise how a feature is wired together across routes, state, and API calls, and highlight possible side effects of changing a specific piece of code. You still verify what you are told, but you get a much faster map of the territory.

The win is not skipping understanding. It is compressing the time from "no idea" to "I roughly know where this lives and what it touches".

### Implementing and refactoring

Before agentic coding, you write most code by hand, with autocomplete as a convenience. Larger refactors are slow and risky, so they get postponed. Repetitive patterns get re-implemented slightly differently each time because the friction of doing them properly is high.

With agentic coding in the loop, you define a clear task, such as extracting logic into a reusable function while keeping behaviour identical, or implementing a new flow using the existing design system and established patterns. You let the agent propose the first pass, then you review, adjust, and run tests.

In practice, that might mean letting an agent split a large module into smaller, more cohesive pieces, help migrate from one data-fetching or state-management approach to another, or wire a new user flow into existing APIs and error-handling patterns. Your role shifts from typing every line to directing the shape of the change and making sure it fits the system.

### Tests and edge cases

Before agentic coding, tests are often written at the end under time pressure. Edge cases are easy to miss, especially in flows with many states, so teams gravitate toward the happy path and a few obvious failures.

With agentic coding in the loop, you can ask an agent to list possible states and transitions, propose unit, integration, and end-to-end test cases, and generate test skeletons in the framework you already use. You still own the judgment call about which tests matter, how they should be structured, and what enough coverage means for the feature in front of you.

The limiting factor becomes less "I did not think of that state" and more "I decided whether that state is worth testing".

### Debugging and maintenance

Before agentic coding, you manually read stack traces, add logs, click through flows, and search issues, documentation, and code for patterns that match your bug. The process is often slow and hard to parallelise.

With agentic coding in the loop, you can hand an agent the error, the relevant code, the logs, and a description of what the user is experiencing. It can propose likely causes, point to suspicious code paths, and suggest minimal changes that would confirm or rule out a hypothesis. You still decide which hypothesis to follow, implement and validate the fix, and make sure the final answer is not just a band-aid.

Debugging stays a human judgment task, but the exploration gets a powerful assistant.

### Documentation and design communication

Before agentic coding, documentation tends to lag behind. Design decisions live in people's heads, chat threads, and half-finished docs, and sharing context with new team members is slower than it should be.

With agentic coding in the loop, agents can turn comments, pull request descriptions, and meeting notes into documentation drafts. They can generate diagrams or textual overviews of component hierarchies and data flows, and summarise design decisions into short notes. Your role is to correct, sharpen, and preserve the reasoning behind the choices rather than just the final output.

The result is not perfect documentation. It is good-enough documentation that actually exists and stays more current because the cost of producing it is lower.

## How engineers can adapt

Agentic coding is not something you wait for your organisation to roll out. You can start adapting from where you are today.

The shape of that adaptation is slightly different depending on where you are in your career, but the core moves are the same.

### If you are in the "sweet spot" generation

You have spent a large part of your career writing and shipping systems without agents doing the work for you. That is an advantage.

Lean into it by treating agents like strong juniors you are responsible for. Let them propose implementations, refactors, and tests, but review their work with your full standards and take responsibility for what gets merged. Push your hard-won constraints into the workflow by making invariants explicit in prompts and documentation, capturing patterns you know are safe, and being deliberate about where automation is allowed and where it is not.

Use agents to extend your reach, not replace your thinking. Explore more options before committing to a design. Try migrations or refactors you would normally have postponed. Translate your mental model into checks, tests, and guardrails the agents must respect. Just as importantly, teach the next generation how to use this safely. Narrate your reasoning when you accept or reject generated code, share stories of almost-correct code that caused real problems, and help teams build a culture where speed is balanced with accountability.

Your experience is not being made obsolete; it is being put on a larger amplifier. The main shift is moving from "I write most of the lines" to "I shape how a lot of lines get written."

### If you are early in your career

For people entering the field now, the risk is different. It is easy to get good at driving agents without ever building a deep foundation.

The way around that is to deliberately practise the fundamentals: data structures, algorithms, concurrency, abstractions, and the mechanics of HTTP, storage, caching, and event-driven systems. Read code from experienced engineers and ask why it is written that way. Use agents as a learning tool rather than a shortcut. Ask for explanations before asking for code, compare your own implementation with what an agent suggests, and use agents to explore trade-offs rather than avoid thinking.

It also helps to own small slices end to end. Take responsibility for a feature, service, or component across its life. Use agents inside that boundary, but make sure you understand everything that goes in and learn how it behaves in production, not just in your editor. And seek feedback from humans, not just tools. Ask more senior engineers to review both your code and how you used agents. Discuss design decisions, not just syntax, and learn what experienced people look for when they review generated work.

The goal is not to compete with agents on generating lines of code. The goal is to become the kind of engineer who can direct them well because you understand the underlying systems.

### Shared habits that matter for everyone

Regardless of experience level, a few habits seem to make the biggest difference. Make your work observable with good tests, clear logs, and simple monitoring. If agents help you change things, they should also help you see when something breaks. Write things down so decisions, invariants, and patterns are available to other people and reusable by agents. Be explicit about risk by discussing blast radius, rollback strategies, and ownership when you design workflows. And stay curious, but keep a spine. Try new tools and approaches, but say no when something feels unsafe or incoherent, even if it looks impressive in a demo.

These habits are not new. Agentic coding just raises the stakes and the impact of practising them well.

## Closing

Coding is being commoditized. That does not mean engineering suddenly became easy, or that anyone with access to an agent is now an engineer.

If anything, the opposite is true.

When code can be generated at scale, the cost of bad decisions goes up. The importance of clear architecture and invariants goes up. The value of people who have seen systems fail in the real world goes up.

Agentic coding gives us new leverage. Agentic engineering is what turns that leverage into reliable systems instead of unpredictable ones.

This is not just survivable, it is exciting. If we let agents handle more of the repetitive work, we get to spend more of our time on what drew many of us to engineering in the first place: understanding problems, shaping products, and shipping useful things. Less grind, more impact.

Engineers who learn to direct agents, protect the shape of their systems, and pass on their judgment will not be replaced. They will be the ones everyone turns to when cheap code needs to become dependable software.
