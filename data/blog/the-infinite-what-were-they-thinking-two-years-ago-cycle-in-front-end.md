---
title: 'The infinite "what were they thinking two years ago"-cycle in front-end'
date: '2022-06-01'
tags: ['frontend']
images:
  ['/articles/the-infinite-what-were-they-thinking-two-years-ago-cycle-in-front-end/interview.jpg']
summary: 'Projects often become legacy in a incredibly short time. I have spoken to people in technology with a variety of skills, experience and roles. Time to find out how they think about this, what tips they have to prevent these issues and more.'
authors: ['dave-bitter']
theme: 'orange'
---

As a front-end developer and consultant, It seems like many of the existing projects I join have the same issues. Generally, within the first week, you hear one of the following quotes:

- "Yeah, that was written two years ago... We need to rewrite that...”
- "What were those developers thinking?”
- "Ah, that's legacy code...”
  - "What? It's not even a few years old!”
- "Let's write our own, that one is super complex and it's easier to make our own...”

Then two years later, the same things are said about the new better solutions these developers made. The larger the projects, the more this seems to happen. Naturally, large projects can become quite complex and therefore the solutions can become quite complex. It does feel however that it's more the rule than an exception. Thinking about this, a couple of questions came to mind:

- Why does this happen so often, so quickly?
- How quickly does something become "legacy code”?
- How can we prevent this for our development teams and own code?

Now, I've got some ideas for my own on these questions, but what does the development world think is the reason for all of this.

## Time for research

I have spoken to people in technology with a variety of skills, experience and roles. Time to find out how they think about these questions, what tips they have to prevent these issues and more.

### The startup mentality

Whether you work at a small startup or a large corporation, there seems to be a common reason why unsustainable solutions are written. Often, the credo is to deliver early, deliver much and keep on getting funding/budget. Especially in front-end development, it's easy to fall into this trap. It's very easy to deliver quickly in front-end development with flashy UI and new features. Almost always this means you have to sacrifice some things. Scalability, documentation and sustainability are some of those things. It's hard to sell these to management who first need to see quick positive results before thinking about long-term consequences. A lot of temporary solutions are made to stay on track with the deadlines.

![I'll fix it later... he, in fact, did not fix it later...](/articles/the-infinite-what-were-they-thinking-two-years-ago-cycle-in-front-end/fix-it-later.png)

> Nothing is as permanent as a temporary solution.

However hard it is, developers need to make time for this. It's naive to think you will get time for this (soon). Developers need to explain, and managers need to understand, that these things are part of building a product that can't be skipped over. If you do, you will create an instant debt that will have an interest.

### Relying fully on frameworks in a coupled way

Front-end development is always mentioned in one breath with frameworks. The rise of frameworks in the past decade(s) has allowed the front-end world to evolve at a rapid pace. Developers can create state of the art user experiences with relatively low effort.

A downside of these frameworks is that, more often than not, developers write their solutions in a very coupled way. Framework-specific logic is completely intertwined with non-framework-specific logic. This makes it hard to migrate to new (versions of) frameworks. By decoupling this logic into smaller modules you can encapsulate features into standalone features. This makes it easier to refactor small parts of your application without having to do a "big bang refactor”.

### ~~Getting~~ Making time

It's incredibly hard to get time to refactor "legacy code”. There is often a communication gap between developers and their product owners/management. Naturally, it's easier to get time for a fancy new feature than to make "invisible” updates. This communication gap can lead to a lot of frustration. Both "sides” have to work on this, however.

As a developer, you often fall into the trap of making your case to non-technical people with technical terms. For example, try explaining to a non-technical person that you need to refactor your global state manager to a new framework that makes it easier to persist state client- and serverside. These terms are not difficult for developers to understand, but if you are not a developer, they can sound like a foreign language.

![Making your manager fall asleep with technical terms](/articles/the-infinite-what-were-they-thinking-two-years-ago-cycle-in-front-end/making-your-manager-fall-asleep.png)

Instead, try to not just "dumb down” what you are explaining, but ask yourself if you need to explain it at all. A better way of communicating this to your manager is to explain the benefits for the users of their product. We need to use this new technique as it will allow us to remember choices the user made across different pages and moments in time. This way we can personalise the user experience and work on improving the conversion rate. You see, this turns it into an understandable story that clearly shows the business value.

Both sides need to keep an eye on miscommunication due to technical terms. On the one hand, developers need to work on how they communicate desires, on the other hand, managers need to be vocal when a developer is not making any sense to them and ask for an understandable explanation.

### Having a process in place

A big question is how seriously does your organisation take this? There's no denying that regular updates and refactors are vital to delivering a solid product. However, we do see that often the work and priority of this are heavily underestimated. There needs to be a process in place to ensure this won't get overlooked.

Luckily, you can automate parts of this. It might be wise to set a standard in your organization and automate audits in your CI/CD to monitor with tools like dependa-bot. This way, problems become visible earlier on, are more tangible and you don't see them a year after your last check.

Next to this, teams working with Scrum should make this part of their standard sprint. Update early, update often is one of the best things you can do as a team and organization. I've seen it so many times that teams postpone updating their applications to the latest versions of external and internal dependencies. You can postpone this all you want, but you're accumulating debt. This ends up with an update/refactor or rebuild discussion crippling any other work, like new features, that need to be built. You'd be surprised how many "legacy applications” can be prevented to rebuild if there was a process in place to keep them up to date.

### Really smart developers will cause issues

It may seem like a counterintuitive statement, but a major downfall of very smart developers is that they may tend to build rather complex solutions. These solutions may even be unnecessarily complex, difficult to maintain and have no/little tests in place. The problem with these solutions is that, although they might work well and are very impressive, you run into trouble once these developers leave your organization. Suddenly, there are these overly complex solutions that are difficult to fully understand by other developers.

Naturally, this can be countered with well-written documentation, knowledge transfers and similar solutions, but you will never fully understand how it works as the original developer did. There is an acronym that we like to use called K.I.S.S. (Keep It Simple Stupid). Although this may seem overly obvious, this credo is not followed in a lot of situations. It's actually quite hard to keep your solution simple and easy to understand. The extra time invested in this will be worth it in the long run as developers not using an existing solution because it's they can't grasp what it offers or how it works is such a shame. A new solution, maybe equally as complex, is written and the cycle continues.

## Front-end is **in its infancy**

![Two front-end developers walk into a bar. They've got nothing to talk about...](/articles/the-infinite-what-were-they-thinking-two-years-ago-cycle-in-front-end/two-front-end-developers-walk-into-a-bar.png)

I can go on and on about reasons for the _"The infinite "what were they thinking two years ago”-cycle in front-end”_ phenomenon, but it comes mostly down to a simple observation. Front-end is in its infancy compared to, for instance, Java and .NET by about 30 years. These platforms went through similar cycles and became more standardised and agreed upon over the years.

### We are not really focused on design patterns

Naturally, we have design patterns in front-end, but we tend to have a lot. Front-end is susceptible to whatever a developer wants to do. Many different opinions on how we should do things. This leads to many discussions and frameworks implementing their own.

Let's compare this to the back-end landscape. Some patterns are over 60 years old! These patterns work, stood the test of time and are not under debate. How different is that from front-end? Can you imagine us having similar patterns undisputed patterns? This would help greatly with our applications withstanding the test of time past two years.

### Frameworks

Let's take frameworks as an indicator. One of the big reasons for certain front-end applications becoming "legacy” is the vast number of frameworks popping up. Suddenly, the framework you used two years ago isn't considered good enough anymore. Although these framework wars spark innovation, they make the front-end landscape change rapidly. My feeling is that this curve is slowly calming down, but you need to be aware of this when starting new applications. You want to make sure that you don't choose a framework as a developer because it looks like the best solution **now**, but can stand the test of time to a certain degree.

### Rendering strategies

![Rendering schema from SSR to CSR to SSG to SSR](/articles/the-infinite-what-were-they-thinking-two-years-ago-cycle-in-front-end/rendering-schema.png)

Another example is rendering strategies. Ever noticed we tend to go in circles? We started with rendering all applications server-side. The rise of SPA frameworks moved everything to client-side rendering. This caused issues that we tried to resolve with static site generation. This was cumbersome so one of the latest frameworks, Remix, is moving back to web fundamentals with server-side rendering. The front-end community figuring this out over the past decade has caused an immense rise in "legacy applications”.

### We'll get there

We're still figuring things out. That's fine, tremendous strides are being made to solidify patterns, better the developer and user experience and more. These things take time. It's our job as front-end developers to be cognizant of this and try to not keep jumping to the latest and newest thing right away.

## Closing thoughts

There is no magic way to prevent your applications to become "legacy”. There are however things you can do to mitigate this as much as possible. This is a joint effort between developers and business. Front-end applications are incredibly complex. We need to recognize this and put checks in place to prevent getting stuck in this cycle.
