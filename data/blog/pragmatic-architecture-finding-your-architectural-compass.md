---
title: 'Pragmatic Architecture: Finding Your Architectural Compass'
date: '2026-09-01'
tags: ['software-architecture', 'microservices', 'modular-monolith', 'system-design']
images: ['/articles/pragmatic-architecture-finding-your-architectural-compass/banner.webp']
summary: 'Why architecture should follow the needs of your system, not industry trends. And why this matters even more in the AI era.'
authors: ['mohamed-elmedany']
theme: 'blue'
---

A while ago, I found myself looking at an architecture that, on paper, had all the ingredients people currently love to
hate.

Five services, four of them were adapters. Each one talked to a different third-party API, with its own mapping rules,
data transformations, retry behaviour, and communication quirks. Their output was published asynchronously and consumed
by a single domain service.

It was not particularly clever. It was not a microservices architecture because I wanted five boxes in a diagram. There
were just five things that had very different reasons to exist.

And then came the questions.

> Why is this not one service? Do we really need microservices here?

> Wouldn't a modular monolith be simpler? Why are we adding all this operational complexity?

These were reasonable questions, that was the annoying part. I reconsidered the design a couple of times, somewhat
sarcastically wondering whether I had accidentally reinvented the industry's favourite architectural antipattern.

The more I thought about it, the more I realised the problem was not that people were questioning microservices. The
problem was that we were questioning architecture through _trends._

## The Architectural Compass Has Moved

The **microservices fatigue** is real. After more than a decade of microservices being presented as the answer to almost
every scaling, team, deployment, and organisational problem, the industry has started rediscovering the monolith. More
specifically, the **modular monolith**.

Honestly, I think that correction is healthy.

Microservices became an easy answer because successful companies made them look inevitable. We saw dozens of companies
explaining how they structured large engineering organisations around independently deployable services. Then everyone
copied the architecture without necessarily inheriting the problems that created the architecture in the first place.

When a company with hundreds of engineers and a huge distributed system needs independent deployment, team autonomy,
fault isolation, and independent scaling, that tells me something about _their_ system. It does not automatically tell
me anything about _mine_.

Smaller teams ended up operating infrastructure that was much more complicated than their product.

Now, I hear the opposite arguments much more often.

> No need for complexity, just use a monolith.

> Don't split anything until you absolutely have to.

Again, there is a lot of good advice here. The problem starts when it becomes another default. We have somehow managed
to replace **"microservice-first"** with **"monolith-first"** and call that progress.

I don't think it is. The architectural compass has simply been pointed in the other direction.

## The Microservice Premium

The first reason teams get tired of microservices is straightforward: **they are expensive.** Not necessarily in
compute, but in everything around it.

Five services do not mean five times the CPU bill. They mean five deployment units, five sets of configuration, five
sets of logs, five sets of alerts, five health checks, and five places to reason about failures. They also mean five
things developers need to understand before changing the system.

A team of good engineers can absolutely build and operate microservices. The more interesting question is: **why they
would want to.**

Every network boundary introduces another thing that can be slow, unavailable, misconfigured, incompatible, or
misunderstood. A function call becomes a network call, a transaction becomes a synchronisation problem, a stack trace
becomes a distributed-tracing problem, and an integration test becomes a small infrastructure project.

None of that is automatically bad. It is just not free.

That is the **Microservice Premium**. You pay it because you need the benefits. If you do not need the benefits, your
cloud provider will send you a thank-you note along with the bill.

## Premature Decomposition

The second problem is worse.

We started splitting systems by nouns. I am sure everyone has seen systems where Customer Service, Order Service,
Payment Service, Invoice Service, Notification Service, and so on became the architecture diagram.

That sounds reasonable until you discover that all of these services have to be deployed together, communicate
constantly, share the same database, scale together, and cannot really operate independently.

Congratulations ... you have built a distributed monolith.

The architecture diagram looks impressive. The deployment pipeline looks terrible. The debugging experience is a
nightmare. The underlying problem is not that the services are too small. It is that the boundaries were wrong.

I think service boundaries should always include **operational characteristics**, not just domain vocabulary.

> What needs to change, scale, or fail independently?

> What has a fundamentally different reliability profile?

> What has a different deployment cycle?

> What has an external dependency that should not be allowed to poison the rest of the system?

Those are much more interesting questions than whether "Order" deserves to be its own box.

## Then the Cloud Bill Arrived

Another reason the enthusiasm cooled down is straightforward. Cloud made the operational cost much harder to ignore.

Running more services means more infrastructure, more instances, more observability, more idle capacity, and more
network traffic. Once the system is distributed, data moves between processes constantly. Serialisation and
deserialisation consume compute, traffic crosses availability zones, and sometimes regions or different providers.

The network is not a transparent wire. It has latency, failure modes, bandwidth limits, and security boundaries. Cloud
networking and data transfer costs are now a much more visible architecture concern than they were when every
architecture diagram proudly showed another dozen services.

So yes, the microservice fatigue is justified. But that does not make microservices inherently bad. It just means the
price is now much harder to ignore.

## The Question Nobody Asks

A monolith is not bad. Microservices are not bad either. **Not knowing why you chose one over the other is bad.** That
is the architectural failure I actually care about. My opinion is that a **modular monolith** is a fantastic default for
many systems.

If the team is small, boundaries are changing, traffic characteristics are relatively uniform, and there is no
meaningful reason to isolate parts of the system operationally, I would probably choose it too.

Why would I pay for distributed-system complexity before I need the benefits?

However, I also refuse to force a monolith onto a system that has obvious reasons to be distributed simply because the
trend currently prefers fewer boxes.

That brings me back to the system that started this article.

## When Five Services Actually Made Sense

The architecture was straightforward. Four adapter services and one domain service, with an asynchronous event bus
connecting them.

![Architecture diagram of a domain service connecting through four adapters to external APIs, with REST, webhook, and event-bus flows](/articles/pragmatic-architecture-finding-your-architectural-compass/diagram.webp)

The important part was not the technology. It was that these components had materially different operational
characteristics.

The adapters were responsible for dealing with external systems. They mapped external data into domain models. They
dealt with different APIs, different failure modes, different rate limits, and different behaviours.

The domain service had a completely different responsibility. It handled the business logic.

That difference gave me two very practical reasons to keep the boundaries.

One adapter handled roughly _75%_ of the incoming external traffic. If everything lived in one process, scaling that
traffic would mean scaling the entire application. The domain logic would consume the same pool of CPU and memory as the
adapter doing most of the work. Instead of scaling the thing that was actually hot, I would scale everything.

Microservices gave me a tedious but useful capability here: **keep the scaling decision local to the workload.** The
other services do not need to care. Even when two services scale together today, they don't necessarily have to scale
together tomorrow. That is a legitimate operational boundary.

The second reason is even more important to me. External APIs are not under my control. They will change schemas, return
unexpected data, rate-limit, become slow, or even unavailable.

I want all of that to belong to the adapter, not leak into the core domain logic.

The service boundary is therefore not just about deployment. It is a **blast-radius boundary**. The domain service can
still exist if the adapter crashes. However, that does not magically make the system resilient. You still need retries,
timeouts, monitoring, backpressure, and sensible failure handling.

That is a microservice boundary I can defend.

## Architecture Is Not a Personal Taste

I think the industry has learned some useful lessons from the microservices era.

We learned that distributed systems are hard, operational complexity compounds, tiny services can still create a
surprisingly large amount of work, and a modular monolith is sometimes exactly the right thing to start with.

The fact that an architecture practice is popular is not evidence that it belongs in your system, nor that it is solving
your problems. The fact that many companies are successful with it is even less useful. They probably have different
scales, different constraints, different organisational structures, different failure modes, and a different set of
problems to solve.

My approach is much less exciting: **I always ask what the system needs.**

If everything has roughly the same traffic profile, deployment schedule, failure boundary, and scaling characteristics,
I will probably start with a modular monolith.

When a capability has materially different operational characteristics, I will consider separating it. When an external
dependency creates a meaningful blast radius, I will consider isolation. When a component needs to scale independently,
I will consider giving it its own deployment.

If I cannot explain the benefit of a service boundary in one or two sentences, I probably do not need the service.

## ...And Not Even Now

Another reason I think this matters even more now.

AI is making software development easier and faster. You can ask an AI coding agent to build an API, generate
infrastructure, add a message queue, create tests, explain unfamiliar systems, or split a module into a separate
application. The code can be there in minutes.

But it does not remove the challenging architectural decisions.

> Why should we do it?

> Where should the boundary be? What should scale independently?

> What should be allowed to fail independently?

> What complexity are we introducing, and what do we get in return?

AI can help us implement the decision. **It does not make the decision for us.**

The same applies to microservices. AI can make creating and maintaining another service feel almost trivial. However,
the operational cost is not necessarily trivial.

A new service still has to be deployed, monitored, secured, tested, debugged, and operated. It still has its own failure
modes and adds another boundary to the system.

The technology is changing quickly. The architectural questions are not.

## Final Thoughts

I do not think we need an architecture winner. We need better architecture decisions.

A monolith is not a failure, a microservice is not an achievement, a modular monolith is not automatically more mature.

The useful question is always the tedious one: **What trade-offs are we making, and why?** That is the part I think we
keep losing whenever the architectural compass swings.

Today the trend answer might be "modular monolith". A few years from now it might be "microservices, but with a
brand-new name".

I would rather keep the old-fashioned skill of looking at the system in front of me and deciding what it actually needs.

## Further Reading

- [Microservice Trade-Offs](https://martinfowler.com/articles/microservice-trade-offs.html)
- [Modular Monolith vs Microservices: How to Choose](https://milanjovanovic.tech/blog/modular-monolith-vs-microservices)
- [How to break a Monolith into Microservices](https://martinfowler.com/articles/break-monolith-into-microservices.html)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_service_architecture_monolith_soa_microservice.html)
