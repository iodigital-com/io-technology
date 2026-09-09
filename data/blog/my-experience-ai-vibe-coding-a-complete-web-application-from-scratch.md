---
title: 'My experience AI _vibe coding_ a complete web application from scratch'
date: '2025-05-27'
tags: ['ai', 'cursor', 'frontend']
images:
  [
    '/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/paxaura-final-overview.png',
  ]
summary: 'Discover how I built a complete breathing exercise web app without touching a single line of code, using AI to transform an idea into a fully functional product. What was good, what was bad and is this where we are heading in our industry?'
authors: ['dave-bitter']
theme: 'green'
---

I was looking into an app for some breathing exercises I wanted to do. Naturally, one of the first things that went through my head was: “I can make something like this myself”. But then, as always, I thought about all the coding I’d have to do for this simple app. I need to scaffold the project, build the logic, build the UI etcetera. Not complex, but a lot of grind work.

Nowadays, whenever I think of a simple cumbersome task that requires grind work, I think AI! So, let’s make this a challenge. Let’s “vibe code” this breathing exercise app from scratch to finish. Some rules:

- I may not touch a single line of code in the editor
- I may not provide example code in the prompting
- It needs to be designed to a level I usually design my side projects in
- I need to use simple tooling that is widely accessible

I ended with using [Cursor](https://www.cursor.com/) for this. Cursor is an AI code editor that I’ve been trying out recently. Even though I now have the paid version, I used the free version for this challenge. Which model did I use? I have ab-so-lutely no idea. That’s the point. Can someone who is not as much into AI build something cool as well using one of these tools?

## Setting up the project

I created a new empty GIT repository and wrote my first prompt.

```jsx
init a nextjs app with app router for paxaura project
```

I wanted to use the “new” app router in Next.js for this project. I also, like any cool new side project, gave it a nice name. “Pax” (Latin for peace) and “Aura” (lating for breath/air/essence). Well, at least according to the AI I used.

Now, it had no issue performing this task. It doesn’t surprise me at all as there is so much documentation on how to set up a new Next.js project not even mentioning all the example repositories it can draw inspiration from.

If you’ve never seen Cursor before, you basically have a regular code editor with a chat window at the side. What’s pretty cool is that Cursor will be able to access the entire project, create/read/update/delete files and even run commands from the terminal.

![Code editor with an AI chat on the right hand side](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/cursor-init-project.png)

You can see it explains what it’s going to do first. Then it opens a small terminal inline and first asks me to hit the “run this command” button. This is something nice because of course, you’d like to keep a bit of control in what it does in your terminal. When running the generated command it initialised the entire Next.js app with sensible defaults. Cool, as it’s good practice, let’s quickly commit this. Wait, can’t the AI do that for me? Of course! Just prompt “commit this for me”. It then does a scan of the changes and types out a neat commit message to go with it.

## Hey AI, build this entire app for me in one go!

Naturally, I wanted to do as little as possible myself. I could give it step-by-step instructions, but what happens if I just describe the app that I want? Can I just let it figure it out itself. Vibe Coding 🤘. Here’s the simple, non-technical, prompt I gave it:

```jsx
I want to create an app with simple breathing exercises. I want an overview page with the different ones (i'll share the actual excersises later) and a detail page were you can do them. They will be simple time based inhale exhale reps
```

Then it went to work. Step by step it created folders, files, types etcetera. All the things I would normally do. Maybe even a bit neater as I’d take some shortcuts during a side project.

![Code editor with an AI chat on the right hand side and all files created](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/cursor-mvp-project.png)

And just like that, we had a working Minimal Viable Product (MVP) within minutes of starting this challenge. It generated an overview page:

![Basic overview page with cards that have exercises for breathing](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/paxaura-mvp-overview.png)

What I found interesting is that it created some features I didn’t instruct it to or even thought of. For instance, giving the exercises labels like beginner, intermediate and advanced is a nice addition. As well as the benefit tags. Naturally, you then want to be able to filter so it made a filter bar. A nice extra benefit of using AI, it generated the data to be used for the exercises as well. I don’t know all breathing technique exercises so nice to see that it listed them for me.

When you click on one of the cards it brings you to the detail page:

![Basic detail page with the breathing exercise on there](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/paxaura-mvp-detail.png)

Here it created a working exercise component including the breathing animation which grows and shrinks on the inhale and exhale. It also added the live information on whether to inhale/exhale, how many seconds remaining, and which repetition you’re currently doing. Nice! Within minutes I have a working MVP!

## Adding feature after feature

Then it was just a matter of giving it more and more features by prompting for it. For example:

- “Give it dark and light mode including a toggle”
- “Add a search bar on the overview page”
- “I want to be the style to use gradients, use Tailwind’s purple color scheme”
- “I want to use the Radix UI component Library”
- “Add audio feedback with a short beep so users can close their eyes and follow along”
- “Make it installable as a Progressive Web App (PWA)
- “Add a favourites button that stores your favourites in the browser”
- “Use icons in the labels and buttons”
- “Add and link to content pages in the app that have more information on the benefits”
- etcetera

It was amazing to see how quickly I was able to go from idea, to prompt, to actual value for the user in the app at a rapid pace. Each feature inspired another and I started to prompt based on my user needs. What do I want the app to do? It doesn’t matter what the effort is. Just build.

Before I knew it, I created a very useful breathing exercise web application that is free for the world to use:

![Similar overview to before but with more content, better design and more features](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/paxaura-final-overview.png)

![Similar detail to before but with more content, better design and more features](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch/paxaura-final-detail.png)

You can try it yourself over at [paxaura.davebitter.com](https://paxaura.davebitter.com)! Curious about the source code it generated? Head over to [github.com/DaveBitter/paxaura](https://github.com/DaveBitter/paxaura).

## The good

First, some benefits you can expect. I was able to quickly get all the simple grind work done. Not having to start with the boring bits I’ve done a million times like setting up a new Next.js project, creating simple layouts, creating all the files, creating the types etcetera. The things we as developers can do with our eyes closed. Not having this barrier to actually get started in building this side project was incredibly nice. The AI was able to create a setup with a first working MVP in minutes so I could immediately start building the cool parts!

Once this base was there, I was able to generate real user value at an unbelievable pace. Many items? Create a search bar. Storing favourite exercise? Create a working system that uses LocalStorage in the browser. No audible feedback during the exercise? Use the Web Audio API to generate a beep. These features are not hard to build, but do take some times in looking up docs, creating the files and writing the code. Being able to almost build these features real-time got me into a mode of thinking purely from a user standpoint. I want/need this. Build it. Now.

An unexpected benefit I saw was that (A)I also build the nice to have features. For example, i like to have icons in the labels. Useful to have, but not the most important thing to normally spend time on. Now I just mentioned I’d like icons in all labels and within a minute it was there.

Finally, I was impressed by the extras it built that were indeed good to add for the best user experience. I mentioned I wanted an audible beep during the switching between inhaling and exhaling. What I didn’t think about was that some users might not want that. So it added a mute button without me asking. Awesome!

## The bad

Naturally, not all was good. Sometimes you hear people say: “Just use AI. Just vibe code it.”. You get the feeling that AI is able to create the end result I showed you without any issue. But that wasn’t the case I found.

Firstly, I noticed I did had to use some technical terms here and there to steer it towards what I want. For instance, when prompting for the functionality of favouriting it tried to make Next.js API routes and was expecting for me to have a database to store the user’s favourites. Then also you need to have user management, so on, so on. I stopped it because that was way overkill for me. I mentioned to use LocalStorage for it. It then perfectly builds the feature. Of course, I should’ve given it the context that I wanted the easy solution, but on the other hand I asked myself why? With all the prompting and code we generated, it was clear that this is a super lightweight simple breathing exercise app. Adding such complexity just to favourite a few exercises is, in my opinion, overengineering. In **my opinion**. How did I get to that opinion? From building applications for years and making that judgment. I felt that sometimes it was to focused on the functionality and not the bigger picture.

Secondly, it often changed unrelated things and actually breaking parts of the application. When it was building the feature of the audible feedback, it had to tie into the state of whether the user was inhaling or exhaling. It tried to be clever and hook into the breathing animation code. Now normally, I’d separate these two concerns as they shouldn’t affect each other. Outside of it being neater to split, it didn’t work when combined. As a real vibe coder, I can’t remember what the actual issue was, but it needed to change some of the code of how we animate. It then made the audio work, but the visual was now broken. Naturally, chatting a bit back and forth I could steer it to a better solution. But it did keep breaking the animation until I said that it should just be separate and hook into the state with a `useEffect` hook.

Thirdly, I felt the AI had a bit of tunnel vision. Kind of what you see when people just start out with programming but with one dangerous difference. When you just start out with programming, you focus on just the bit you need to build. Before you do any actual real damage, you probably get stuck and ask for some help. Then whoever helps you probably mentions what parts you might break with the solution you want to build. Not the AI. It happily went on creating the feature I prompted for while simultaneously breaking other features. And I don’t mean syntax errors. Don’t get me wrong, it sometimes made issues there as well, but I mean functional issues. Suddenly a dropdown doesn’t filter the list anymore as the AI updated the handler and forgot to check the other components using it. This happend more than once and I actually shipped it to the live version as well as I just didn’t catch it. But Dave, you should’ve checked it yourself. No, why? The AI should check it for me, right? I thought that that was part of vibe coding. Not checking all the code but trusting that the AI builds it right.

Finally, when it doesn’t get it right the first few times the proces got incredibly frustrating. You know when you have a discussion with someone and you keep on going in circles and feel like they don’t remember what you already discussed and said? Kind of like that. I had to start fresh chats just to be able to get out of that loop. Incredibly annoying! But on the other had, very human-like hahaha!

## The future

There’s no way around it, AI isn’t going anywhere. I’m not going to predict the future for you here. I’ll just share my experiences and thoughts. The goal of this experience was to fully immerse myself in the AI tooling. Fully rely on it to do my job. And it did for the most part. The way I build changed, but I felt like I was still in the driver’s seat. I was able to deliver more in a shorter time. It could (and will) improve in a lot of areas but working with this kind of programming approach is, in my opinion, where we are heading. Sure it doesn’t replace me but it empowers me so much!

The question I asked in the end was if I could do better on my own. Well, yes and no. At the moment, the AI still needs me to give guidance, choices etc. It can’t one-on-one replace me. But! For this specific application, AI would always be better. You know why? Because without it I would’ve not even built it. It’s competing with an app I wouldn’t have build in the first place. I have the skills, but not the time en focus to actually built it in my free time. Empowered with AI I did and I’m happy with the end result.

And now what? I get to use [my breathing exercise app](https://paxaura.davebitter.com/) every time I hear somebody say I will be out of a job as I can just be replaced. Nice!
