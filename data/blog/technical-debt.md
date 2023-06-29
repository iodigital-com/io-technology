---
title: 'Introducing technical debt'
date: '2022-07-28'
tags: ['development', 'code-quality']
images: ['/articles/technical-debt/technical-debt.jpg']
summary: 'Are you tired of seeing good websites go to waste? Do you want to keep your codebase clean, but you have no idea where to start? Ever wondered how a small change request or simple bugfix turned into an endless game of whack-a-mole? Monitoring technical debt can provide a way out.'
authors: ['niels-matthijs']
theme: 'energetic_blue'
---

There are many holy grails in the web development community, but one of our boldest challenges is building websites that _increase_ in quality over time. Too many projects have inexcusably short lifespans, as neither clients nor developers find themselves able to deal with the scrambled chaos websites inevitably become. Despite everybody's best intentions, websites are often on life support by the time they are effectively launched, which is a far stretch from the quality we aspire to deliver.

The good news is that influential people are starting to notice the absurdity of this situation, and slowly ideas and concepts are emerging that will help our industry take the necessary steps forward. Not too long ago I spotted a mention of [The Ship of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus) in an article on design systems, the rise of headless setups is helping us deal with architectural challenges and our own Dave Bitter wrote a very insightful article on some of the [most common causes for code corruption](https://techhub.iodigital.com/articles/the-infinite-legacy-cycle-in-front-end).

Workflow improvements are essential and being aware of possible pitfalls is certainly a great help, but when reality hits, they will not safeguard our projects from imperfections and the inevitable decay. That's where the concept of technical debt comes into play. Technical debt won't necessarily prevent bad code, but it does help you deal with it.

## Introducing: technical debt

Technical debt is an umbrella term for whatever suboptimal technical decision found its way into an application. It is something we face and deal with every day, only it is very hard to explain, let alone quantify to non-technical people. With experience, we develop a radar for it, but clients simply don't have time to worry about nondescript developer feelings. That's why the "debt" analogy is such a powerful one. Our clients are used to dealing with debt, and they're well aware of its implications. Technical problems are never just stationary or contained, when left unattended, they will grow into bigger problems.

The moment you introduce the concept of technical debt into a project, it can become part of an agenda. It can turn into a shield that blocks unsavory requests (more specifically, the answer to the question "Is it technically possible?" could change from "Yes" to "Yes, but technical debt"). It can be tracked and monitored as part of a project's health indicators, and it can be translated into actionables. Before digging deeper into its benefits though, let's figure out why so many of our projects spiral out of control.

## Primary reasons for technical debt

Now, some developers might be worried that technical debt could become a measuring stick for the quality of their work. Rest assured, while we obviously carry some of the responsibility for the quality of our code, we aren't always the cause for things going sideways. Neither is technical debt always a bad thing, so let's look at some of the most common triggers that lead to unwieldy code.

### Mid-development change requests from clients

You've built what the client asked for, your code is bug-free, clean, lean, and mean, everything works exactly as intended, and then a change request comes in that turns everything upside down. Someone, somewhere down the line had an epiphany, and now you're left wrangling your code against a deadline that is too tight.

### Botched internal planning

Project managers are busy people, so once in a while, a bug ticket slips through the cracks, or an important remark goes missing from the briefing. Maybe your designer didn't quite find his mojo and is slaving away beyond his deadline. Parts of the functional analysis could be missing when we start work on a new piece of functionality, and of course, nobody remembered the 404 page so could we please whip something up ... the list of possible mishaps is endless. As developers, we're often caught between an immutable deadline and internal delays (i.e. "the sandwich"), and in the end, it's up to us to make it work.

### Technological maturity

The quality of our code is only as robust as the capabilities of the language it is written in. Anyone familiar with front-end development knows that it can take a long time before new standards are agreed upon and are safe to use across a wide array of browsers. The [first time I wrote about container queries](https://www.onderhond.com/blog/media-queries-based-on-elements) was in 2012, only now are we seeing browsers implementing the idea. And for the past few years, I've been impatiently awaiting the moment to fully ditch oldskool JPGs & PNGs in favor of better image formats, but alas, these things take time.

### Unnecessary complexity

A good developer is taught to write DRY ("don't repeat yourself") code, but abstractions introduce complexity, and unnecessary complexity doesn't come cheap. It's not always easy knowing what to abstract from the start, and overengineered code will come back to bite you. Sadly, KISS ("keep it simple, stupid") and DRY are two ideals that are very hard to balance, so when in doubt, choose KISS. It may just be better to wait until bits of code start repeating themselves before DRYing them, even though by then it might be too late to refractor on the fly.

### By design

Technical debt can also be a solution rather than a problem. This may sound contradictory at first, but it's not that different from going to the bank and lending money to buy a house. There are times when it's more important to land a new feature as quickly as possible, so people can start using it right away. If your e-commerce site needs to be responsive, and you have to choose between a 15-day desktop-first responsive hackathon or a 160-day from-the-ground-up front-end rework, the choice isn't that hard.

### Dev skills and mood swings

And yes, developers are only people too. We might have a bad day, maybe we're put on a project that's above our current skill level, sometimes we underestimate complexity because we haven't thought everything through, or we might be distracted by more interesting projects. It certainly wouldn't be the first time I think up a better solution the moment I walk out of the office, and I'm pretty certain it won't be the last. Just own up to those moments.

The most important thing to remember is that technical debt isn't about assigning blame, it's about tracking code imperfections that will invariably lead to problems down the road. Once you make that mental shift, a new world will open up.

## Monitoring technical debt

The best place to anchor technical debt is in the actual code. Identifying and describing technical debt are additional tasks for developers that typically crop up when things aren't going too smoothly, so keeping friction minimal is vital. The system only works when developers are noting down these issues, so don't make it harder for them than necessary.

Of course, adding these notes is only half the work. Having code riddled with technical debt comments isn't going to magically fix anything. With a bit of extra tooling though, the actual monitoring work becomes trivial. It is easy to write a script that extracts all comments from code and dumps them in a place where developers, PMs, and clients can toy around with them. This is a one-time overhead, but it is definitely worth the effort, as it could mean the difference between success or failure.

Once you have that in place, you can think about adding extra metadata to your comments. A red flag and a description of the problem is all you need to get going, but a little extra context will help with grouping, planning, and prioritizing technical debt, so it can be taken care of properly. The context I usually provide is:

- a priority level (from 1-5, but whatever works best for your team)
- the component it relates to
- the technology involved (HTML, CSS, JS, PHP, SQL, ...)
- the area of impact (DRY, robustness, performance, security, UX, ...)
- the reporter (so you can bug him for clarifications if needed)
- a way to fix the problem (if possible)

This could then result in something like this:

```
@TODO-3-newsTeaser-html-performance-Niels: add AVIF support to the teaser image
@TODO-5-button-css-robustness-Niels: grid gaps and widths are based on media queries, should be container queries
```

I realize that doesn't look particularly sexy, but it doesn't have to be, as this is not client-facing. Just dress up the management interface, so things look clear and understandable there. Make it so you can filter out the CSS issues when you have a front-end resource available, look at the current problems before you start to rework an existing component. Set up budgets (f.e. no more than 5 priority 1 comments) or tackle performance issues when needed. You can even draw up monthly reports to keep clients posted on your progress and set up weekly emails to inform and confront developers and PMs. The sky's the limit.

## Added benefits to the client relationship

Technical debt may sound like a very technology/developer-focused affair, but there are also clear benefits for the relationships we foster with our clients, transparency being one of the most crucial ones. Something like technical debt can take you out of the honeymoon phase, when everyone is still pretending they're perfect and nothing ever goes wrong, to a more mature stage in the relationship, where we can show a willingness to work through the hassle when issues arise.

It's also instrumental in clarifying the consequences of decisions that are being made along the way. Out of the blue, a deadline may become less pressing when a client hears a proposed technical solution is flawed and will cost them dearly later on. Or a post-launch follow-up phase can be added right away, to make sure any added debt gets dealt with right away. The debt analogy makes these kinds of conversations a lot easier, and it is sure to prevent future frustrations.

Ideally, technical debt becomes a project in its own right, as part of an SLA. A monthly budget, dedicated resources, and proper reporting can do wonders to the health of a long-running project. Developers will be happier working in a clean(er) code base, fewer unforeseen errors will pop up, fewer bugs will need to be reported, we can all spend time and effort on improving the website rather than covering our mistakes, and the overall cost of developing new functionality won't spiral out of control anymore. As long as the technical debt is kept under control that is.

## Babysteps will get you there

If all of this sounds a little daunting, don't panic. The true beauty here is that tracking technical debt pays off on even the most basic level and that any developer can start doing it right away, without any kind of master plan in place. The next time you come across a piece of code that can be improved, simply add a comment and move along. Then tell your fellow developers to do the same. By the time PMs and clients are on board with the idea, rest assured you'll have amassed a big stack of issues to get rid of.

Of course, monitoring and balancing technical debt isn't a magical solution that will solve all problems in a flash. But if we ever want to turn our websites into ships of Theseus, it's a necessary first step to keep our projects from deteriorating before our very eyes.
