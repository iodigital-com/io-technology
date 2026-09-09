---
title: 'Top 10 ways AI can help your dev workflow outside of code generation'
date: '2025-08-01'
tags: ['ai']
images:
  [
    '/articles/top-10-ways-ai-can-help-your-dev-workflow-outside-of-code-generation/top-10-ways-ai-can-help-your-dev-workflow-outside-of-code-generation-hero.jpg',
  ]
summary: "AI tools like Cursor and GitHub Copilot can do way more than just generate code. I've been exploring how to use them for documentation, commit messages, code reviews, and other workflow tasks that often get skipped. Here are some practical ways to expand how you use AI in development beyond the usual code generation."
authors: ['dave-bitter']
theme: 'blue'
---

I was chatting with some colleagues recently about Cursor AI and GitHub Copilot, and it got me thinking about how we all use these tools. While many of us have moved beyond just basic code generation (asking for React components or help with algorithms), I've noticed we sometimes forget about all the other ways AI can fit into our development workflow.

Even developers using, for instance, Cursor's agent mode often focus primarily on the code generation and review aspects. But these AI tools are capable of so much more than just churning out code.

After diving deep into agent mode recently and really exploring what these tools can do, I've found that AI can help with almost every aspect of development, from the boring documentation tasks we always postpone to the architectural decisions that keep us up at night.

Let me share some ways AI has expanded my development workflow, beyond the usual code generation.

## 1. Write the documentation you never write

Let's be honest: we all hate writing documentation. But what if I told you that you could just ask AI to do it for you?

I've started using Cursor to generate comprehensive README files, API documentation, and even inline code comments. The beauty is that it has full context of your codebase, so it's not writing generic docs. It's writing documentation specific to your project.

Try prompting: "Create detailed documentation for this API endpoint including examples, error handling, and edge cases" or "Generate a README for this project that explains the architecture, setup instructions, and common use cases."

The result? You actually have proper documentation now, and your team loves you for it.

## 2. Explain unfamiliar codebases

Ever been thrown into a new project or asked to make changes to a part of the codebase you've never touched? Instead of spending hours trying to understand the architecture, just ask AI to be your guide.

I regularly prompt Cursor with: "I don't know this codebase. I need to make some changes to the API response for the product detail page. Explain this project and in particular where I need to make changes and suggest how to do it."

It's like having a senior developer who knows the entire codebase sitting next to you, ready to explain any part of it on demand.

## 3. Get expert code reviews before committing

This one changed my game completely. Before pushing any significant changes, I ask AI to review my code from different perspectives:

- "Give me an expert performance review on this code"
- "Provide a security review of this implementation"
- "General code review: what can be improved?"

It's not perfect, but it catches issues I might have missed and often suggests improvements I would not have thought of. Think of it as a pre-review before your actual code review.

## 4. Write meaningful commit messages

We've all written commit messages like "fix stuff" or "updates." Now I let AI write proper commit messages with actual commit bodies.

AI can analyze your changes and generate descriptive commit messages that follow best practices. No more lazy commits: every change gets properly documented.

## 5. Create project tooling and scripts

AI excels at creating supporting tools for your project. I've used it to generate validation scripts, precommit hooks, deployment scripts, and custom utilities.

For example, I recently had it create a validation script that checks generated workflows in a project I'm working on. The agent now uses this same script to test its own work, and we've integrated it into our CI pipeline.

## 6. Create comprehensive testing strategies and edge cases

While AI can certainly generate test code (which is basically code generation), what's more valuable is using it to think through testing strategies and identify edge cases you might miss.

I'll prompt: "What testing strategy would you recommend for this feature? What edge cases should I consider?" Then use those insights to guide my own test writing or to generate tests based on a solid strategy.

## 7. Plan architecture and technical decisions

Before diving into implementation, I've started using AI to brainstorm architectural approaches. The beauty of using Cursor for this is that it has full context of your existing codebase.

Instead of getting generic advice like you would from ChatGPT, you can ask: "Given our current architecture, how should we implement real-time notifications? What patterns are we already using that we should follow?"

It will not make the final decision for you, but it's excellent at laying out options that actually fit your existing codebase and helping you think through the implications.

## 8. Analyze and improve your existing code patterns

Instead of generating new code, use AI to analyze patterns in your codebase and suggest improvements. "Look at how we handle API responses across this project: are there inconsistencies we should fix?" or "Review our error handling patterns and suggest standardizations."

This helps maintain consistency across your codebase and can reveal technical debt you might not have noticed.

## 9. Write release notes and changelogs

Instead of hastily writing "bug fixes and improvements" for every release, let AI analyze your commits and generate proper release notes that actually explain what changed.

## 10. Create onboarding documentation

New team members joining your project? Have AI create comprehensive onboarding guides that explain the codebase structure, development workflow, and common tasks.

## The mindset shift

Here's what I've realized: AI tools like Cursor's agent mode are not just about generating code faster. They are about removing all the friction around the important but tedious parts of development that we usually skip.

Documentation, proper commit messages, comprehensive testing, thorough code reviews: these are the things that separate good developers from great ones. But they are also the things we often do not have time for when we are focused on shipping features.

AI removes that excuse. Now I can be that developer who actually does all the best practices, without the time investment that previously made it impractical.

## A word of caution

I've definitely noticed myself becoming more dependent on AI and sometimes less aware of how certain parts of my codebase work. It's important to always review what AI generates and make sure you understand it.

Think of AI as that incredibly productive pair programming partner who never gets tired, but still needs you to make the important decisions and catch their mistakes.

## Expanding your toolkit

The next time you fire up Cursor or Copilot, consider all the other tasks in your development workflow beyond just the code you need to write.

Documentation that needs updating, commit messages that could be clearer, code patterns that could be more consistent: these are all opportunities where AI can remove friction and help you work more effectively.

What I love about this approach is that AI becomes less about replacing what we do and more about helping us do the things we know we should be doing but often do not have the bandwidth for.

These tools can genuinely help you become a more thorough developer, just with a lot less manual work.
