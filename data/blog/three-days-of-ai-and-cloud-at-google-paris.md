---
title: 'Three days of AI and Cloud at Google Paris'
date: '2025-03-20'
tags: ['ai', 'cloud']
images:
  [
    '/articles/three-days-of-ai-and-cloud-at-google-paris/three-days-of-ai-and-cloud-at-google-paris-hero.jpg',
  ]
summary: 'As part of being a Google Developer Expert, I’m fortunate to be able to join certain Google events to connect, learn and share. The past week I was invited to Google Paris for three days of everything around AI and Cloud. Here’s a short recap with interesting things I heard and what inspired me!'
authors: ['dave-bitter']
theme: 'blue'
---

## The program

I traveled out to Paris Sunday evening. After a quick meal and early night’s sleep I was ready for the first day on Monday. The first day was a [Google Developer Expert](https://developers.google.com/community/experts) (GDE) bootcamp called Train the Trainer on AI. Day two was a Google Cloud Summit which was more open to the public. Finally, day three focussed on Gemma with a nice surprise.

## Day 1: GDE Bootcamp Train the Trainer AI

![Screen welcoming the GDEs to the Train the Trainer event](/articles/three-days-of-ai-and-cloud-at-google-paris/ttt-ai-bootcamp-screen.jpg)

It was really cool to visit the Google Paris Headquarters. Just look at what a nice building it is:

![Beautiful architecture of Paris Office](/articles/three-days-of-ai-and-cloud-at-google-paris/google-paris-office.jpg)

The day consisted of a range of presentations. [Richard Seroter, Google Cloud Chief Evangelist](https://www.linkedin.com/in/seroter/) kicked of with showcasing the Google Cloud platform specifically surrounding AI. What I took note of was how easy it becomes nowadays to proper tooling to deploy entire architectures. His demo showed a seamless experience where the platform works for you instead of you for the platform. Of course a demo is seamless, but even as a developer that is not specifically skilled in the Google Cloud platform I could easily follow along and work with it if needed. And this is specifically a point that he made.

### From Front-end Developer to Developer

Richard made the point that our “old roles” might be more of a thing of the past. With the assistance of AI, a Front-end Developer can now more easily get assistance in doing some Back-end Development, Full-stack Development, Dev Ops etc. Naturally, these roles stay, but it makes it easier nowadays to venture a bit outside of your own little island by utilising AI. I tend to agree, I do think it can also go wrong. You might be able to produce a working product, but it’s hard to verify whether what you did was right, safe etc. Again, you could use AI to verify your work, but I wouldn’t underestimate this.

### Application Design Center (ADC)

Richard also shared a demo on [Application Design Center](https://cloud.google.com/application-design-center/docs/overview) where he showed how easy it was to design, share and deploy Google Cloud application infrastructure. What struck me is how accessible it seemed for me who isn’t familiar with this platform as much. I liked how well they integrated AI assistance throughout the interface. It really seems to assist you in setting things up, writing good queries and more. They really seem to have an approach of having the platform do the work instead of the developer.

### Gemini Deep Research

He finished his talk by showcasing Gemini Deep Research. It was cool to see how he used it to make a sprint planning for a project. More specifically, he uploaded documents he found on things like secure application development, performance and more. He then inputted the capacity of his team and how much time he’d like to spend on optimizing the application. The AI then made a nice sprint planning incorporating not just how many hours to spend, but also made stories based on the best practices that were found in the documents. Naturally, this won’t replace a product owner, but it simply makes it easier to create these plans and ideate. [Make sure to check it out here](https://gemini.google.com/deepresearch?hl=en).

### How to host an AI workshop

Next, [Valentin Deleplace, Developer Advocate Google Cloud](https://www.linkedin.com/in/deleplacevalentin/), gave some practical tips on how to host a good workshop. He listed what you need to have an enjoyable experience. This was a nice reminder to have as I host workshops myself as well. He then showed how we, as GDEs, can request Google Cloud credits for our workshops. Definitely will see if I can host one this year!

### Gemini overview

Finally, [Guillaume Vernade, Developer Advocate Google Gemini](https://www.linkedin.com/in/guillaumevernade/) and [Guillaume Laforge, Developer Advocate Google Cloud](https://www.linkedin.com/in/glaforge/) took us through Gemini. It was quite an information packed session where they showed all the things Gemini can do. First, they showed function calling. Basically a way where you write functionality that the AI assistant then can use (call) to perform an action. For instance, you write a function that turns on the lights in your house. Gemini can then call this when it needs to. Next, they showed 3D image recognition. Image recognition is of course nothing new. I’ve written these article showcasing it in the past:

- [On-the-Fly Machine Learning in the Browser with TensorFlow.js](https://techhub.iodigital.com/articles/on-the-fly-machine-learning-in-the-browser-with-tensor-flow-js)
- [Smart cropping with native browser Face Detection](https://techhub.iodigital.com/articles/native-face-detection-cropping)

![3D squares mapped on image with objects](/articles/three-days-of-ai-and-cloud-at-google-paris/gemini-spatial-understanding.png)

What made it cool is that it can not just recognize things in an image, but give an estimate of the 3D space. Definitely check out the [colab Pointing and 3D Spatial Understanding with Gemini 2.0 (Experimental)](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/examples/Spatial_understanding_3d.ipynb#scrollTo=Bgrop9U9VI08)!

Next, we had a look at video understanding. [Multimodal live streaming is so incredibly cool!](https://ai.google.dev/gemini-api/docs/live) Make sure to check this demo out:

https://youtu.be/9hE5-98ZeCg

It’s incredible to see how natural this seems to work. Even being able to interup the AI is very cool. It reminded me a lot of what I’ve been working on myself with voice and AI:

- [Interacting with ChatGPT through Voice UI on the web](https://techhub.iodigital.com/articles/interacting-with-chat-gpt-through-voice-ui-on-the-web)
- [Reducing latency in AI Speech Synthesis](https://techhub.iodigital.com/articles/reducing-latency-in-ai-speech-synthesis)

I will definitely play around with this more! Maybe build an Aiva 2.0?

### Model Context Protocol

One of the many new things I learned was about [Model Context Protocol (MCP) by Anthropic](https://www.anthropic.com/news/model-context-protocol). MCP is Anthropic's new open-source standard that tackles a real problem in the AI world - connecting AI assistants to where your data actually lives. Even the most advanced AI models hit a wall when they can't access your content repositories, business tools, and development environments. Before MCP, you'd need a custom integration for every data source, making truly connected AI systems a nightmare to scale. MCP fixes this by providing a universal way for AI systems to talk to your data sources, replacing the fragmented approach with a single protocol. The setup is straightforward: developers can expose their data through MCP servers or build AI applications that connect to these servers. Pre-built MCP servers are available for popular systems like Google Drive, Slack, GitHub, Git, Postgres, and Puppeteer. This means AI assistants can access the context they need to give you better, more relevant responses without getting trapped behind information silos.

### Building a small application whilst attending

I got so inspired during the talks that I wanted to build a small application with full AI assistance. I used Gemini to ideate with. We came up with making a small application where the user can upload an image and a bit of text. The AI will then come up with a meme and generate an image.

![Screenshot of input fields and a generated photo with text on it](/articles/three-days-of-ai-and-cloud-at-google-paris/ai-meme-generator.jpg)

Note that the quality of the jokes varies haha! What’s cool is that I ideated with Gemini, designed and wrote all the code using [Cursor](https://www.cursor.com/), generated it, let Cursor refactor the app to make it production-ready, let Cursor write the documentation, create the commits, and create the pull request, and finally let [Copilot on GitHub create a pull request](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-for-pull-requests/using-copilot-to-help-you-work-on-a-pull-request). What especially stood out to me was that I used several AI tools together. I got to pick the tool I wanted for each stage of the process, which was really nice. I will definitely write an article soon that goes a bit more in-depth on this, as I feel this is the direction we are heading as developers.

## Day 2: Google Cloud Summit

![Front of the movie theatre Le Grand Rex Paris](/articles/three-days-of-ai-and-cloud-at-google-paris/le-grand-rex-paris.jpg)

On the second day I visited the Google Cloud Summit at the Rex Theater in Paris. What a beautiful place! I got to see a similar presentation by Richard Seroter again and a variety of, of course, cloud focussed talks. As this was a bit less what I do day to day, I had a bit of a hard time to follow sometimes.

![Big stage in the movie theatre](/articles/three-days-of-ai-and-cloud-at-google-paris/google-cloud-summit-stage.jpg)

What I did take away from the day was the focus on improving of the developer experience when working with cloud. Or maybe not even developer experience, but the experience for someone configuring. I felt like it is becoming more and more accessible for “non-cloud people” to work with it. I think it’s a natural thing where more people can deliver value as the platform does more and more for you.

## Day 3: Gemma Developer Day

![Sign with Gemma Developer Day on it](/articles/three-days-of-ai-and-cloud-at-google-paris/gemma-developer-day.jpg)

On day 3 we dove into everything Gemma. At the intro, I mentioned that there was a nice surprise. [Gemma 3 got announced](https://blog.google/technology/developers/gemma-3/) live on stage! Really cool to see! After the initial announcement, an incredible amount of information was shared. The day was filled with many, tightly choreographed presentation back-to-back.

Firstly, a lot of numbers were shared. Like an immense amount. It was impressive to see how powerful they could make Gemma 3 whilst keeping the size down. I was particularly interested in the Gemma 3 2B model as it is tiny. What cool use cases can we come up with to use this tiny model? Maybe ask Gemini ;).

### Multilinguality

One of the big things Google focussed on was multilinguality. Gemma 3 has out-of-the-box support for over 35 languages and pretrained support for over 140 languages. This is important as you want to let people interact in the language they speak, but also have a diverse pretraining proces. Cool to see the effort they made!

### NVIDIA Jetson Orin Nano Developer

![Small compute without a case](/articles/three-days-of-ai-and-cloud-at-google-paris/nvidia-jetson-orin-nano.jpg)

Then we got another awesome surprise! We all received an [NVIDIA Jetson Orin Nano Developer Kit](https://developer.nvidia.com/embedded/learn/get-started-jetson-orin-nano-devkit)! It is an AI development platform by NVIDIA, designed for edge AI and robotics applications. It features an Orin Nano system-on-module (SoM) with GPU-accelerated computing, supporting AI workloads like computer vision, deep learning, and robotics. It offers high performance, low power consumption, and multiple I/O interfaces, making it ideal for prototyping AI-powered embedded systems. Needless to say, I will definitely try to build something cool with this!

## Day 4: Exploring Paris and wrapping up!

After three jam-packed days of information it was nice to have a final day in Paris before I travelled back home in the evening. I got to explore as much as I could fit in a day to see what Paris has to offer. What a beautiful city and I will definitely come back to properly explore one day.

![Grid with photos of Parisian architecture](/articles/three-days-of-ai-and-cloud-at-google-paris/paris-photos-grid.jpg)

Thank you Google for an amazing couple of days! And thank you to all the amazing people I got to meet (again)!
