---
title: 'ChatGPT as My Coding Mentor: How I Learned React and Next.js as a Junior Developer'
date: '2025-11-18'
tags: ['ai', 'frontend']
images: ['/articles/chatgpt-as-my-coding-mentor/learning-react-and-next-with-ai-hero.png']
summary: "A junior developer's journey from confusion to confidence, learning React and Next.js by discovering how to turn AI into an effective coding mentor through better prompting and asking for explanations 'like I'm 5.'"
authors: ['ellenoor-bok']
theme: 'blue'
---

## "What's a Hook, and Why Do I Need It?"

That's the first thing I typed into my coding agent on my very first morning as a junior developer. I was staring at React documentation, trying to understand useState, and feeling completely overwhelmed.

Coming from school, where I'd used Svelte, I needed to learn React for my new job. The official docs assumed I understood concepts I'd never encountered. Terms like "trigger a re-render" and "current state" were everywhere, and I needed someone to explain the basics patiently.

My first attempts didn't go well. When I asked, "What is useState?" my coding agent responded: "useState is one of the most fundamental React Hooks that allows you to add state to functional components." As a junior developer, I had no idea what that meant.

When I said I didn't understand, it got slightly better: "useState is a React Hook that lets you add a variable that 'remembers' its value between renders." Still confusing.

That's when my mentor stepped in. He looked at my conversation and said: "Your agent doesn't know anything about you. You need to explain how you want your answer. Instead of asking him to explain, ask him to explain it like you're 5 years old."

So, I tried: "Can you explain useState like I'm 5?"

The response was completely different: "useState is like a box that remembers something, and whenever you tell it to change, your whole website updates to show the new thing."

Finally, something clicked. This wasn't a technical definition - it was an explanation that met me where I was. I realized I had found something more valuable than documentation: a mentor available 24/7 who could adapt their explanations until I understood.

## Developing My Learning Method

That useState breakthrough taught me how to use my coding agent effectively. I developed a system:

1. **Set context:** "I'm a junior developer learning React..."
2. **Set my level:** "Explain this like I'm new to React" or "Use simple analogies."
3. **Set expectations:** "Don't show me code yet just explain the concept."
4. **Ask specifically:** Focus on one concept at a time
5. **Request examples:** "Can you show me a simple example?"
6. **Dig deeper:** "Why do I need this? What's the concept behind it?"

The key was learning to prompt correctly. My mentor's advice about explaining how I wanted answers changed everything. Instead of getting textbook definitions, I started getting explanations that actually made sense. That "like I'm 5" approach became my go-to whenever I hit a wall with technical explanations.

My questions evolved naturally. **Week 1:** "What's useState?" **Week 4:** My questions became much more detailed and specific: "I'm a junior developer learning React. I have to use useEffect for my project but I'm completely new to React and don't understand what it does. Can you explain useEffect like I'm 5 years old, using simple analogies? Don't show me code yet, just explain the concept first. Then can you show me a simple example? And finally, why do I need useEffect - what's the concept behind it and why can't I just put my code directly in the component?" I was building understanding layer by layer, and my coding agent adapted to my growing knowledge.

## From React to Next.js

After getting comfortable with React basics, I decided to convert my application to Next.js. "I just changed my project from React to Next. What's different now?" led to conversations about file-based routing, Server Components vs Client Components, and the new App Router.

The transition was more confusing than I expected. Instead of asking broad questions, I learned to have focused conversations with my coding agent:

**Me:** "How do I know which parts of my code are running on the server versus in the browser?"

**Agent:** "In Next.js, components are Server Components by default. If you see 'use client' at the top, that runs in the browser."

**Me:** "But I changed from React to Next.js, so I didn't have those defaults before. How do I know which parts are server-side now?"

**Agent:** "In plain React, everything ran in the browser. Now in Next.js, your components run on the server first unless you add 'use client'. That's why some of your React code might be breaking."

**Me:** "So if I'm getting errors about useState or onClick handlers, those need 'use client'?"

**Agent:** "Exactly! Those are browser-only features. Add 'use client' to components that need interactivity and leave the rest as Server Components for better performance."

These focused conversations taught me more in 10 minutes than hours of reading Next.js documentation. By asking about my specific errors instead of broad concepts, I finally understood the server-client distinction that had been confusing me.

## Two Months Later

I went from not understanding basic React concepts to confidently building full-stack applications with Next.js. More importantly, I learned how to learn with AI as a teacher - a skill that's made me confident I can adapt to whatever technology comes next.

### What worked for me:

- **Learning to prompt correctly:** My mentor's advice about explaining how I wanted answers made all the difference
- **Asking for analogies first:** The "box" explanation for useState taught me that simple comparisons work better than technical definitions
- **Building progressively:** Starting with useState before moving to useEffect, then Server Components
- **Understanding the distinction** between React concepts and Next.js features

### What I would do differently next time:

- **Don't ask generic questions:** Instead of "What is useState?" ask "Can you explain useState like I'm 5, using a simple example I can relate to?"
- **Don't ask for everything at once:** Rather than "Explain React and Next.js," focus on one concept at a time and build understanding gradually
- **Don't copy code without understanding:** Before implementing any solution, make sure you understand what each part does and why it's needed
- **Don't skip verification:** Always cross-reference information with official docs or other sources, since AI can sometimes provide outdated or overcomplicated approaches

### Tips for other junior developers:

- **Always set your experience level:** Tell your AI "I'm new to React" or "I've never used hooks before" to get explanations that match your knowledge
- **Be specific about what confuses you:** Instead of "I don't understand," say "I don't understand why useEffect needs a dependency array"
- **Request step-by-step breakdowns:** Ask "What are the steps to create a React component?" rather than "How do I build a component?"
- **Ask "why":** Understanding the reasoning behind patterns helps you apply them to new situations

The key is remembering that your AI is a conversation partner, not a search engine. The better you communicate what you need, the better help you'll get.

## The Journey

Two months ago, I didn't know what JSX was and got confused by basic React documentation. Now I can build full-stack applications and, more importantly, I know how to learn any new technology effectively using AI as my learning partner.
