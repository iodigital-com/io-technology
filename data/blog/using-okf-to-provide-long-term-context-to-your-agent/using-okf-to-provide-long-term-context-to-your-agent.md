---
title: 'Using OKF to provide long term context to your agent'
date: '2026-09-10'
tags: ['ai', 'development', 'tooling', 'okf']
authors: ['oscar-reyes']
images:
  [
    '/articles/using-okf-to-provide-long-term-context-to-your-agent/brand-concept--screen-pulse.webp',
  ]
theme: 'blue'
summary: 'Your agent forgets you after every compaction. The Open Knowledge Format is a small set of conventions for writing knowledge down as markdown, so it survives the session and the next agent can read it without a translation layer.'
---

There is a moment in a long agent session where things finally click. The agent knows its way around the codebase, it knows why that odd workaround exists, and it has stopped suggesting the function we deleted three weeks ago. It feels like working with a colleague who has been on the team for a while.

Then the context window fills up, the session is compacted, and all of that is gone. Or I finish the task, open a fresh session for the next one, and I am back at the beginning: _"read this file for background, no we don't use that pattern anymore, yes that test is supposed to fail."_ Right when you feel the agent finally understands you, it is as if that colleague no longer remembers you.

I griped about exactly this on my personal blog a few months ago: _"It is frustrating to spend 5 hrs vibe coding one day just to start from (almost) scratch the next day."_ My workaround was a pile of markdown files: a plan here, a summary there, a `guidelines.md` I kept trimming. It worked, sort of. The problem was that the meaning of those files lived in my head, and nothing except me knew which ones were still true.

## The tools already do this, but not where you can see it

To be fair, the agentic tools already solved this problem: they write things down. Claude Code drafts a plan file before it starts on anything substantial, keeps a per-project memory folder, and reads a `CLAUDE.md` or `AGENTS.md` from the repository. Other tools have their own version of the same idea.

The catch is where most of it lands. The plan and the memories sit in a directory under my home folder, keyed to my user account on this machine. Which means:

- My colleagues cannot see them, so the understanding stays mine.
- Nobody reviews them, because they never appear in a pull request.
- They are not versioned with the code they describe, so a refactor silently invalidates them and nothing complains.
- A different tool cannot read them, and if I switch machines they are gone.
- They cannot be referenced (easily), and memories go stale without you noticing.

And yet, the knowledge accumulated is related to the code; e.g. the reason why prices are cached per-tenant is a fact about the codebase, not a fact that belongs to my laptop.

Those tools solve the forgetting problem properly, but I want that solution in the repository. Put the plan and the durable notes next to the code they describe, in a shape a person can review in a pull request and a different tool can still read next year. That is the whole appeal of a format.

## What it is

The Open Knowledge Format (OKF) is an open specification published by the Google Cloud team behind their Knowledge Catalog, and it is deliberately simple: **a directory of markdown files with YAML front matter**. No runtime, no SDK, no service to run. If you can `cat` a file you can read it; if you can `git clone` a repo you can ship it.

The whole format is about four ideas:

1. **One file is one concept.** A concept is any unit of knowledge you want to keep: a design decision, a subsystem, a metric, a runbook.
2. **The file path is the concept's identity.** Move the file and you change the id, so paths are treated like identifiers.
3. **`index.md`** is a per-directory catalogue, so a reader can see what is available before opening anything. This is the part that makes a growing wiki affordable to read.
4. **`log.md`** is a per-directory, date-grouped history of what changed, newest first, and kept extremely concise.

The front matter carries the structured fields. Only `type` is required, and it is a free string:

```yaml
---
type: Design Decision
title: Caching strategy for the pricing service
description: Why prices are cached per-tenant instead of globally.
tags: [caching, pricing]
---
```

That is a conformant document, and the rest is optional. Consumers are required by the specification to tolerate an OKF bundle (a folder with markdown files following the OKF spec) with unknown types, unknown extra keys and broken links rather than reject it. The format standardises the interoperability surface and leaves your content model alone.

The idea did not start at Google. Andrej Karpathy wrote it up as the [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern, and we have been using front matter since the early days of static site generators. The LLM Wiki brought the idea back to solve a problem that anyone trying to maintain documentation can relate to: the tedious part of a knowledge base was never the reading or the thinking, it was the bookkeeping. Updating cross-references, keeping summaries current, noticing when a new fact contradicts an old one. People abandon wikis because the maintenance cost grows faster than the value. Agents do not get bored and can touch fifteen files in one pass. So the exact reason personal wikis always failed is the part that is now nearly free.

OKF's contribution is turning that pattern into a format. Karpathy's wiki, your team's wiki and a vendor's catalogue export all look alike (markdown, front matter, cross-links), yet none of them were designed to cooperate. There was no agreed answer to which fields a document should carry, or what a filename means.

## v0.2: the fields that let you decide before you read

Version 0.1 covered describing a concept: `type`, `title`, `description`, `resource`, `tags`. Version 0.2 added a second kind of field, the kind you use to **decide something about a document before you spend tokens reading it**.

When a person authors a document, the provenance can be verified easily; you can just go and ask that person for clarifications. When an agent writes 200 pages overnight, it had better show evidence of how the information was gathered. The only honest replacement for that conversation is explicit signals. So v0.2 makes five questions answerable from the front matter:

| Question                                     | Field                        |
| -------------------------------------------- | ---------------------------- |
| What was this made from?                     | `sources`                    |
| Who wrote it, who confirmed it?              | `generated`, `verified`      |
| Is it still true?                            | `stale_after`                |
| Is it the current version?                   | `status`                     |
| Was this number computed the sanctioned way? | `type: Attested Computation` |

```yaml
generated: { by: my-agent/opus-5, at: 2026-09-08T14:00:00Z }
verified:
  - { by: process:doc-link-check, at: 2026-09-08T14:05:00Z }
status: stable
stale_after: 2026-12-31T00:00:00Z
sources:
  - id: adr-014
    resource: /design/multi-tenant-caching.md
    title: Multi-tenant caching decision
    last_modified: 2026-08-30T00:00:00Z
```

Actors follow one convention: `<producer>/<version>` for a tool, `human:<id>` for a person, `process:<id>` for automation. A consumer reads a trust tier straight off `verified`. No key at all means unverified; machine actors only means machine-confirmed; a `human:` actor means somebody reviewed it.

Also, when you start accumulating information, it becomes very important to know whether a document should be read at all in the first place. After all, if everything is linked together, you can end up filling the agent's context window with information it doesn't need.

Even if you never adopt the format, there are a couple of ideas in there worth keeping in mind.

**Absence carries meaning.** A missing `verified` key is a statement: _"nobody has confirmed this"_. I have a rule in my instructions file that an agent may never write a `human:` verifier, because that forges the strongest trust signal in the format and makes the whole tier worthless everywhere it appears. Only an actual, dated human action earns one.

**Record signals, not scores.** A source records `author`, `usage_count` and `last_modified`, and no credibility number. A score is a judgement that goes stale the moment it is written, whereas the facts travel and let the consumer weigh them.

## Why not just RAG, embeddings, or an MCP server?

This was the first question I had when I heard about this format. Then I learned they are not really competing, but they do solve different halves. The half OKF solves is the one I was missing: long-term context.

**Retrieval re-derives the answer on every query.** The model finds relevant chunks in the raw sources and synthesises an answer, then throws the synthesis away. Ask a question that needs five documents stitched together and it stitches them together again next time, from scratch, possibly differently. Nothing accumulates.

A wiki is the opposite: it is a **compounding artefact**. The cross-references are already resolved. The contradiction between the old design and the new one has already been flagged, in writing, by whoever noticed it. The synthesis already reflects everything read so far. Retrieval finds the knowledge; the wiki keeps it.

A few practical consequences:

- **It is reviewable.** A change to the corpus shows up as a diff in a pull request. I cannot review a re-indexed embedding.
- **It is greppable and boring.** Debugging _"why did the agent believe that?"_ is a `grep`, rather than a similarity search I have to interpret.
- **It has no infrastructure.** No database to run, no sync job, no re-index after a rename. It is files in the repo, versioned with the code they describe.
- **It degrades to `cat`.** A person can read it in a browser, on GitHub, or in Obsidian.

MCP is a different kind of thing altogether. It is a protocol for how an agent reaches a tool or a system, while OKF describes what got written down. An MCP server needs something to serve, and an OKF bundle is a perfectly good thing to serve through one. I use both: a code-graph MCP server answers _"who calls this function"_ from the live code, and the bundle answers _"why is it built this way"_, which no amount of reading the code will tell you.

None of this makes OKF better than retrieval. It makes it the thing to reach for when your problem is that the agent keeps rediscovering what it already worked out, rather than that the agent cannot find the right chunk. At real scale you will want search over the bundle as well, though the index file goes a surprisingly long way first.

## How it sits next to Spec Driven Development

Spec Driven Development (write a spec, derive a plan, break it into tasks, execute them one at a time) is more or less the workflow I described on my personal blog last year, and I still work that way. OKF does not replace it. They fit together because they hold different shapes of document:

- **A plan is workflow-shaped.** It tracks steps towards a state. Once every step has landed, re-reading it costs an agent context for no benefit, because nobody re-executes a finished step.
- **A design is state-shaped.** It explains why the code is the shape it is, for as long as that code exists, which routinely outlives the plan by a wide margin.

The mistake I made for months was letting finished plans pile up as the project's memory. They are the worst possible memory: long, sequential and mostly about work already done. What I do now is treat the plan as disposable, and make sure its durable half (the decision, the rejected alternative, the measured outcome) migrates into a design concept before the plan goes away. Otherwise the reasoning dies with the plan, and someone re-proposes the thing we already rejected.

Put simply: spec-driven development is how the work gets done, and OKF is where the understanding lands afterwards.

## What I keep in there

A few things I now write as concepts:

- **Design decisions.** The highest value by a wide margin. I set `status: deprecated` when a newer decision supersedes one, and the old file stays, so an agent proposing the superseded approach can be pointed at the file that explains why it lost.
- **ADRs.** A natural fit, since `status`, `sources` and `verified` are close to what an ADR already wants. If you already have a `docs/adr/` folder then it is nearly OKF already.
- **Plans**, kept deliberately short-lived, as above.
- **The product backlog**, but only on projects that do not want an external tracker. On a project with Jira this is a bad idea, because you end up with two backlogs and no rule for which one wins. On a solo or small project, having the backlog in the repo means the agent can read what is next without me pasting it.
- **Subsystem pages**, the ones that pay for themselves fastest. Instead of the agent grepping thirty files to work out how authentication flows through the app, it reads one page that says so and cites the files. Cheaper, and much less likely to arrive at a confident wrong answer.
- **Dated evaluations.** _"We measured this on 2026-09-07 and got these numbers."_ Facts with a date attached age honestly.

## A minimal setup

Nothing here requires tooling. Start with a directory:

```
docs/
├── index.md
├── log.md
├── design/
│   ├── index.md
│   ├── log.md
│   ├── caching-strategy.md
│   └── auth-flow.md
└── plans/
    ├── index.md
    └── migrate-to-postgres.md
```

`index.md` carries no front matter. It is a catalogue, one line per document, with the description copied from the document itself:

```markdown
# design: index

Subsystem and decision documents. What changed in any of them is in [`log.md`](log.md).

## Documents

- [`caching-strategy.md`](caching-strategy.md) - why prices are cached per-tenant instead of globally.
- [`auth-flow.md`](auth-flow.md) - how a request acquires and carries its identity.
```

`log.md` carries no front matter either. Date headings, newest first, and always link the document that changed:

```markdown
# design: update log

## 2026-09-08

- **Update**: [`caching-strategy.md`](caching-strategy.md) now records the per-tenant
  decision and why a global cache was rejected.

## 2026-09-02

- **Creation**: [`auth-flow.md`](auth-flow.md).
```

Note that both files exist **per directory**, not only at the root. That is what keeps reading affordable: an agent looking for a design decision reads `docs/index.md`, then `docs/design/index.md`, then one document. It never loads the catalogue of everything.

## On tooling

There are already tools to read this format. The specification ships with reference implementations, including a producer that generates a bundle, and an ecosystem of third-party tools is being catalogued. I am not using any of them yet, mostly because the format is plain markdown and my editor already renders it.

What I did write is a small script that validates front matter, to check that every file parses, that each one carries a non-empty `type`, that every actor matches one of the three forms, and that every timestamp has an explicit offset. It runs in CI next to the tests. That is my entire investment in tooling so far, and it has already caught some subtle mistakes, mostly timestamps without an offset and actors written as prose instead of an id.

## To make it work

It is as simple as adding the following excerpt to the `AGENTS.md` file, or your agent's equivalent, so it applies to every session.

```markdown
Before starting work, read `docs/index.md` and then the `index.md` of the
relevant subdirectory. Do not grep the codebase for something a design
document already explains.

When a decision changes, update the document and add one entry to the
`log.md` in that document's directory.

Only a real, dated human review may add a `human:` verifier. Do not write one.
```

## What I would tell you before you try it

I have been at this for a couple of weeks, which is long enough to be useful and short enough that you should read this as an early report rather than a verdict.

The effect I wanted is there. I no longer open a session by re-explaining the project; the agent reads two index files and one design document, and arrives roughly where the previous session ended. The colleague who forgot me now reads their own handover notes on the way in. I no longer have to guess what is in the `MEMORY.md` files on other people's machines.

It also needs pruning, in the same way the rest of agent work does. Agents like to be verbose, they like to fill fields, and nobody reads a knowledge base that records everything, not even the agent, which pays for it in context while you pay for it in tokens. The discipline is the one I wrote about earlier: keep it small but complete, and revisit it when a new practice emerges.

## TL;DR

- Agents forget you after compaction or a task switch. The fix is writing knowledge down somewhere they are told to read.
- The tools already write plans and memories, but under your home folder, where nobody reviews them and no other tool can read them. Move that output into the repository.
- OKF is a directory of markdown files with YAML front matter. `type` is the only required field. `index.md` and `log.md` are reserved, per directory.
- v0.2 adds provenance and trust (`sources`, `generated`, `verified`, `status`, `stale_after`) so a consumer can judge a document before reading it. Absence of a field is information, so resist filling every one.
- Retrieval finds knowledge and a wiki accumulates it; MCP is a transport and can serve a bundle. These stack rather than compete.
- Plans are workflow-shaped and disposable, designs are state-shaped and durable. Make sure the durable half survives the plan.
- The format is inert until your instructions file tells the agent to read it and to update it.

## References

- [Introducing the Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing), the v0.1 announcement.
- [Open Knowledge Format v0.2 adds trust signals](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals), covering provenance, trust, freshness, lifecycle and attestation.
- [The OKF specification](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md), short, and worth reading in full.
- [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), Andrej Karpathy's gist, where the pattern was articulated.
