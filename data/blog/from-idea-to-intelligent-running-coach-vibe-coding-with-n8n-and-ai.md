---
title: 'From Idea to Intelligent Running Coach: Vibe Coding with n8n and AI'
date: '2025-08-11'
tags: ['ai']
images:
  [
    '/articles/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai-hero.png',
  ]
summary: 'I set out to make my mornings easier and build something fun: a personal running coach that lands in my inbox at 6am. Using n8n Cloud to orchestrate APIs, Cursor to generate the workflows and code nodes, and Gemini to turn weather data into clear coaching advice, I wired up a simple scoring model, friendly analysis, and a nicely styled email (yes, the AI handled the email CSS). This is a practical walkthrough of the approach—less handwritten code, more connecting services—what worked, what didn’t, and why this pattern feels like where everyday developer automation is headed.'
authors: ['dave-bitter']
theme: 'blue'
---

After my recent experience [vibe coding a complete web application](/articles/my-experience-ai-vibe-coding-a-complete-web-application-from-scratch) without touching a single line of code, I was hungry for another experiment. This time, I wanted to explore a different kind of building. Not generating code with AI, but orchestrating systems and services to create something genuinely useful.

The idea was simple: what if I could wake up each morning to a personalized running coach in my inbox? Not just a weather report, but an intelligent analysis that considers temperature, humidity, wind, precipitation, and even gives me AI-powered training advice. And what if I could build this entire system using automation tools instead of traditional coding?

Enter [n8n](https://n8n.io), a workflow automation platform that promised to let me connect APIs, trigger actions, and build complex logic through visual workflows. When I got access to n8n Cloud, I moved from my local setup to their hosted platform. Armed with [Cursor AI](https://cursor.sh) to help with workflow generation, I discovered how this change transformed both the development experience and system reliability.

## The Spark: Make Life Easier, Build Something Cool

This started with a simple thought: I could make my mornings easier and build something fun in the process. I love running, I check the weather anyway, and I enjoy experimenting with automation. So I set out to create a small system that would bring those pieces together in a useful way.

## The Vision: More Than Just Weather

Instead of manual weather checking, I wanted to wake up to intelligent analysis:

_"Running Score: 85/100 - Perfect conditions! Light layer recommended. Morning window optimal before 10 AM rain."_

Not just weather data, but intelligent analysis with AI coaching. The system needed to:

- **Analyze multiple weather factors** including temperature, conditions, humidity, wind speed, and precipitation
- **Generate a smart running score** with a 0-100 rating based on optimal conditions
- **Provide AI coaching** through personalized advice, gear recommendations, and safety warnings
- **Deliver daily insights** via automated morning emails with multi-period analysis
- **Run entirely on free tiers** using [OpenWeatherMap API](https://openweathermap.org/api) and [Google Gemini](https://gemini.google.com)

I think we are perhaps moving to this way of building things where we are more in charge as devs in connecting systems than writing all logic and code from scratch.

## Building with Orchestration and Vibe Coded Logic

Unlike my previous vibe coding experiment where AI generated traditional application code, this project was about connecting existing services through workflows. But here's where it gets interesting: I still needed custom logic for data processing, scoring algorithms, and formatting. Instead of writing this code myself, I vibe coded it using Cursor AI.

### Core Stack:

- **n8n Cloud** for hosted workflow automation
- **OpenWeatherMap API** for current weather + 5-day forecast (free tier)
- **Google Gemini 2.0 Flash** for intelligent coaching and analysis (ideal for automation)
- **SMTP email integration** for reliable message delivery
- **Zero infrastructure management** with cloud hosting

The beauty here? Instead of writing complete applications, I was combining pre-built services with small, focused code snippets that I never had to write myself. And by moving to n8n Cloud, I eliminated all the infrastructure overhead entirely.

## Cursor AI Builds Everything

Here's where this approach gets interesting. I didn't build the n8n workflow by dragging and dropping nodes in the UI. Instead, I used Cursor AI to generate the complete workflow as JSON, including all the custom code nodes needed for data processing.

I could prompt Cursor with:

Create an n8n workflow JSON that triggers daily at 6 AM, fetches current weather and 5-day forecast from OpenWeatherMap API for Haarlem, analyzes the morning window, calculates dynamic running scores, enhances with Gemini 2.0 Flash AI coaching advice, and sends a formatted email via SMTP

Cursor would then generate not just the workflow structure, but also sophisticated JavaScript code nodes embedded within it for:

- **Multi-endpoint data fetching** - Parallel current weather and 5-day forecast calls
- **Time-based analysis** - Dynamic period calculation based on current time
- **Advanced scoring algorithms** - Weather condition classification with 200+ lines of logic
- **AI prompt engineering** - Structured coaching requests to Gemini 2.0 Flash
- **HTML email generation** - Complete responsive email templates with CSS
- **Error handling and logging** - Comprehensive failure recovery and debugging
- **Data validation and transformation** - Safe data extraction with fallbacks

![Screenshot of above mentioned nodes being connected in the n8n UI](/articles/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai-hero.png)

For example, one of the code nodes that Cursor generated for scoring:

```javascript
// Temperature scoring (7-18°C optimal)
if (temp >= 7 && temp <= 18) {
  score += 20
  recommendations.push(`Perfect temperature at ${temp}°C!`)
} else if (temp < 2) {
  score -= 15
  warnings.push(`Quite cold at ${temp}°C - layer up and warm up gradually`)
}

// Weather condition scoring
const conditionScores = { Clear: 15, Clouds: 15, Rain: -25, Snow: -25 }
score += conditionScores[condition] || 0
```

And email formatting:

```javascript
let emoji = score >= 80 ? '🌟' : score >= 60 ? '✅' : '⚠️'
return {
  subject: `${emoji} Running Score: ${score}/100`,
  html: generateEmailHTML(score, weather, aiAdvice),
}
```

I never wrote any of this code. I just described what I wanted each node to do, and Cursor generated the complete JavaScript functions.

Everything in this project was vibe coded. From the workflow structure to the logic inside the code nodes, I used prompts to describe intent and let the AI do the implementation. From here on, I’ll just refer to the outputs and results without repeating that context.

### Pro Tip: Visual Context for AI

One breakthrough technique I discovered was taking screenshots of the n8n UI and sharing them directly in my Cursor chat. Instead of trying to describe the workflow structure in text, I could show Cursor exactly:

- How nodes were connected
- What the current data flow looked like
- Which specific node was failing
- The exact error messages in context

This visual context dramatically improved Cursor's ability to suggest fixes and generate new nodes that fit perfectly into the existing workflow structure.

## The Magic of Visual Debugging

While Cursor generated both the workflow structure and all the custom code nodes, the n8n UI became my debugging and monitoring interface. I could manually trigger the workflow to test without waiting for the daily cron, see data flow through each node including the output of my custom code, and debug code node failures by examining error messages and intermediate data. I could test individual code nodes in isolation with sample data, monitor performance of both API calls and custom logic, and iterate quickly by asking Cursor to modify specific code nodes and reimporting them.

![Screenshot of n8n UI where one of the node is red as there's an error](/articles/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai/n8n-error.png)

This hybrid approach gave me the best of both worlds: AI-generated workflow logic AND custom code logic, with visual debugging and monitoring for everything.

## Coding the Complex Parts

The most interesting part was how I could vibe code the more complex algorithmic logic. When I wanted to add multi-period analysis (morning, afternoon, evening), I just prompted:

_"Add a code node that fetches weather for 3 time periods today and determines the optimal running window, considering score changes and precipitation timing"_

Cursor generated a sophisticated code node that:

- Called the weather API for different time periods
- Calculated scores for each period
- Analyzed precipitation timing to avoid getting caught in rain
- Recommended the optimal running window with reasoning

When I wanted better email formatting with proper HTML and CSS, I prompted:

_"Create a code node that generates beautiful HTML emails with weather icons, score visualization, and responsive design"_

And got a complete email templating system with embedded CSS, weather condition icons, and mobile-friendly layouts. Styling emails is everyone's favorite, right? It was great to let AI handle the HTML/CSS while I focused on the content.

The beauty was that I could focus entirely on the problem-solving and user experience, while AI handled all the implementation details of both the workflow orchestration and the custom logic.

## Intelligence Through Integration

The real magic happened when I connected Google Gemini to analyze the weather data and provide coaching insights. Even the Gemini integration was vibe coded - I created a code node that formats the weather data into a prompt for Gemini:

```javascript
// Actual Gemini 2.0 Flash API integration with sophisticated prompting
const geminiRequest = {
  contents: [
    {
      parts: [
        {
          text: `You are an expert AI running coach analyzing weather conditions for optimal training. Provide comprehensive yet organized advice in 300-400 words.

IMPORTANT: Do NOT include any greetings, names, or salutations - jump straight into the coaching advice. The email already has a personalized greeting.

FOCUS: Recommend what types of training these weather conditions are OPTIMAL for. Don't assume training schedule or fatigue - focus purely on weather-based training opportunities.

WEATHER DATA:
• Location: ${location}
• Current: ${temperature}°C, ${description}
• Humidity: ${humidity}% | Wind: ${windSpeed} km/h
• Best time: ${bestPeriod} (Score: ${score}/100)

PROVIDE DETAILED ADVICE WITH THESE SECTIONS:
🎯 **Weather-Optimal Training:** What specific types of workouts these conditions are PERFECT for (easy runs, tempo, intervals, long runs, hill training, etc.) and explain WHY these conditions suit that training type

👕 **Gear & Clothing:** Comprehensive clothing strategy including layers, materials, and accessories with scientific reasoning for these conditions

⚠️ **Weather Considerations:** How these specific conditions affect performance, hydration needs, and any weather-related risks to watch for

💡 **Condition-Specific Tips:** Tactical advice for maximizing performance in these exact conditions - pacing adjustments, technique modifications, timing strategies

Explain the science behind why certain weather conditions favor specific training types. Start immediately with the first section - no introduction needed.`,
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 600,
  },
}
```

Instead of hardcoded responses, my morning emails now include intelligent analysis like:

**Real Output Example:**
_"Running Score: 85/100 - Perfect Running Conditions_

_🎯 **Weather-Optimal Training:** These conditions are PERFECT for tempo runs! The 12°C temperature sits in the ideal zone for sustained efforts, while stable humidity and minimal wind create optimal heat dissipation. Perfect for threshold work or progression runs._

_👕 **Gear & Clothing:** Layer with moisture-wicking base and light windproof jacket. The temperature differential between start and peak effort will be significant._

_⚠️ **Weather Considerations:** Excellent visibility and stable conditions. Hydration needs are moderate - start hydrated but you won't need mid-run fluids for sessions under 90 minutes._

_Temperature: 12℃ | Humidity: 45% | Wind: 8 km/h"_

![Email with above mentioned content](/articles/from-idea-to-intelligent-running-coach-vibe-coding-with-n8n-and-ai/email-example.png)

This wasn't programmed responses. This was genuine AI analysis of real-time conditions, automatically delivered and personalized, all orchestrated through vibe coded logic that analyzes multiple weather periods and recommends optimal training windows.

## Why Gemini 2.0 Flash Works Well for This

In my experience building this automation, Gemini 2.0 Flash handled the requirements well:

The responses were consistent enough that my workflows didn't break, which was important since this runs daily without supervision. The API proved reliable: I never hit rate limits (though with just one call per day, I probably never will) and haven't experienced downtime that would disrupt the morning email delivery.

From a practical standpoint, the free tier covered my usage completely. Running one analysis per day fits comfortably within the limits, which meant I could build and test without worrying about costs.

For this specific use case - analyzing weather data and generating structured coaching advice - Gemini seemed well-suited. It handled the bounded task of taking weather inputs and producing formatted recommendations without going off-topic or being overly creative.

## The Developer Experience Revolution

The developer's role is fundamentally changing. We used to ask "How do I implement this?" Now we ask "How do I connect these services?" This represents a major shift from being code writers to becoming system orchestrators.

What struck me most was how moving to n8n Cloud eliminated all infrastructure concerns while Cursor AI helped me focus purely on workflow configuration and custom code logic. Instead of managing Docker containers and email servers, I could prompt:

_"Create n8n workflows with advanced scheduling, email integration, and custom code nodes for data processing"_

And within minutes, I had zero infrastructure setup required, built-in email capabilities, reliable hosting and scaling, automated backups and monitoring, professional-grade reliability, and could focus purely on workflow logic.
This felt like the evolution beyond infrastructure as code: pure logic as conversation with enterprise-grade hosting included.

## The Good: Rapid Value Creation

Speed was incredible. Within hours, I went from idea to a working system delivering daily value. No boilerplate, no setup overhead, no infrastructure management, no database configuration, and no manual coding of business logic. Moving to n8n Cloud eliminated even the Docker setup time, leaving just pure problem-solving through prompting.

The hybrid approach of AI-generated JSON workflows with vibe coded logic nodes made complex systems surprisingly manageable. I could generate sophisticated workflows AND custom algorithms with Cursor, then use n8n's UI to understand and debug everything.

Code node flexibility meant I never hit platform limitations. When n8n's built-in nodes couldn't do exactly what I needed, I just vibe coded a custom solution.

Free tier viability meant this actually runs in production without ongoing costs. OpenWeatherMap's free tier plus Gemini's generous limits make this sustainable indefinitely.

AI integration felt natural, not bolted on, but genuinely useful. Having personalized coaching based on actual conditions added real value beyond basic automation.

## The Challenges: Reality Check

Let's be honest - this approach isn't perfect yet. Here's what I actually experienced:

- **Disconnect between n8n instance and Cursor** - Working locally while deploying to cloud created friction
- **Bug fixing in loops** - When AI-generated code failed, debugging required understanding both n8n context and the generated logic
- **Breaking unrelated things while trying to fix bugs** - Making changes to one node sometimes affected unexpected parts of the workflow
- **Tunnel vision on specific issues** - Getting stuck on AI-generated solutions that weren't quite right
- **The future isn't here yet... but it's close!** - The tooling is powerful but still requires patience and iteration

There are also traditional development challenges to consider. Code node debugging can be trickier than traditional development. Complex logic still needs good prompting and multiple iterations. Testing isolated code nodes requires different approaches. And version control and collaboration remain tricky with JSON workflows.

## The Future of Development?

This experiment reinforced my belief that we're shifting toward system orchestration with AI-generated logic. Why build email sending when you can connect to a service? Why write scoring algorithms when AI can generate them? Why create data processing when you can vibe code it?

The developer's role is evolving from "How do I implement this?" to "How do I connect and orchestrate these services and what logic do I need to glue them together?"

This doesn't replace traditional development. Complex applications still need sophisticated user interfaces, database design, and architectural decisions. But for automation, integrations, and workflow-driven solutions, this combination of platform orchestration with vibe coded logic represents a genuinely different approach.

The combination of AI-generated workflows with AI-generated custom code creates a development experience that's both incredibly rapid and surprisingly powerful.

## Beyond Weather: Expanding the Automation

Once I had the weather system running smoothly, I couldn't resist applying the same approach to other areas. Enter the **Strava Auto-Descriptions project**, another workflow that demonstrates the versatility of this AI-orchestrated approach.

The challenge was simple: every time I complete a run or bike ride, Strava gives it a generic name like "Morning Run" or "Afternoon Ride." Boring. I wanted something more descriptive and engaging.

So I built an automated workflow that:

- Triggers whenever I complete a Strava activity
- Analyzes the workout data (heart rate zones, pace patterns, power metrics)
- Uses Gemini AI to classify the workout type and generate engaging titles
- Automatically updates the Strava activity with AI-generated descriptions

The results speak for themselves. Instead of "Morning Run," I get "🚀 Easy run with tempo block." Rather than "Afternoon Run," it generates "⚡ Interval session 5x3min." And boring "Evening Ride" becomes "🔥 Threshold workout 20min@FTP."

This second project proved that the approach scales beautifully across different domains.

## The Real Test

The real test of any development approach is: would you actually use what you built?

**Two weeks later:** When the system warns about humidity or suggests optimal timing, I actually consider it. It has influenced my training decisions. When the system warns about incoming precipitation or suggests optimal timing, I listen. That's when you know it works.

## Key Insights

- **Orchestration > Implementation** - Connect services, don't rebuild them
- **Use AI to generate everything** - Workflows AND custom logic
- **Vibe Coding is not just a meme** - Describe what you want, get what you need
- **Choose the right AI for automation** - Gemini 2.0 Flash works well for this use case
- **The future is now** - As developers, we're moving more toward orchestration

## The Complete Setup

The entire project runs on free tiers and includes cloud-hosted n8n with enterprise-grade reliability, built-in email capabilities and scheduling, vibe coded workflows with embedded JavaScript logic nodes, zero infrastructure management or server maintenance, automated backups and professional monitoring, version-controlled workflows as importable JSON files with embedded code, and instant deployment with cloud-based configuration.

The development toolkit includes pnpm scripts for deploying workflows to n8n Cloud, downloading workflows from cloud, checking workflow JSON integrity, and creating version control snapshots.

What makes this approach powerful is that once you have the cloud hosting, creating new workflows with custom logic becomes incredibly fast. Generate the workflow AND the code with AI, import it into n8n Cloud, test and iterate without any infrastructure concerns.

## The Migration: From Self-Hosted to Cloud Hosting

I first ran this locally in Docker. For production, I did not want to manage containers, updates, or deployment plumbing, so when I got access to n8n Cloud I moved it there and kept building.

What improved: maintenance overhead dropped to near zero, with no Docker updates, server monitoring, or backup chores. Reliability improved with solid uptime and automatic scaling I could not get locally. Deploys became instant, and email, scheduling, and monitoring were available out of the box. Most importantly, I could focus on the workflow logic.

What I gave up: there is less local control, mocking external services or working fully offline is harder, and there’s a natural disconnect between Cursor and the deployed n8n Cloud instance which added friction when iterating and debugging. I did less infrastructure work, so I learned less about orchestration.

The unexpected takeaway: moving to cloud did not only remove infrastructure work, it also changed my headspace. I stopped thinking about "How do I deploy this?" and started asking "What should I automate next?"

## Your Next Steps

If you're curious about automation platforms with custom logic, n8n Cloud is genuinely accessible. Start simple with a personal workflow or notification. Add custom logic by vibe coding code nodes for data processing or formatting. Try AI integration using Gemini's free tier. Think in systems about what services you could connect and what logic you need.

A few directions to explore:

- **Data analysis workflows**: automated insights from any data source
- **Content pipelines**: AI-enhanced writing, editing, formatting
- **Personal productivity**: smart scheduling, task management, notifications
- **Business automation**: customer service, lead qualification, reporting
- **Creative tooling**: image processing, content curation, social workflows

The tools are there. The APIs are available. AI can generate both the workflows and the custom logic. The only limit is imagination.
