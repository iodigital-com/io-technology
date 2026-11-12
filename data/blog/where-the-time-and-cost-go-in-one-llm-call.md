---
title: 'My one-word LLM call was thinking behind my back'
date: '2026-10-26'
tags: ['ai', 'llm', 'claude', 'java', 'spring-ai', 'opentelemetry', 'observability', 'performance']
summary: 'A one-word answer used 48 output tokens instead of 4. Putting tokens and cost on the trace of every model call showed why: a default thinking setting I never turned on. On a triage call, it added 52% to the cost and about 0.6 seconds to the response.'
authors: ['bulent-turkmen']
images: ['/articles/where-the-time-and-cost-go-in-one-llm-call/hero.webp']
theme: 'blue'
draft: false
---

## The request that used 48 tokens

I asked for one word and got one word, but the usage said 48 output tokens. The prompt was about 400 tokens of text on return policies, ending with "Reply with only: OK". The model answered "OK", as it did in every run I checked, and normally that took 4 output tokens.

I noticed it in the terminal. The stream showed two empty `data:` lines before `data: OK`, and the output token count was higher than in the other runs. My first guess was that the model had ignored the instruction and written more than "OK". It hadn't, so where did the other 44 tokens go?

I could see the count at all because my app puts token counts and an estimated cost on the trace of every model call. That run cost 7.018E-5 in my price table, while the four runs after it cost 4.598E-5 each. That's about 53% more for the same visible answer.

## How I measured

The app is a small Spring Boot service that uses Spring AI and OpenTelemetry, and it calls Claude Haiku 5.5 through an OpenAI-compatible gateway.

Before adding more features, I wanted to know what one call actually costs and how long it takes, so I put it on the trace instead of guessing. Every model call is a span, and Spring AI puts the token counts on it. I add an estimated cost from a price table in my config (0.11 per million input tokens, 0.55 per million output tokens), and for streaming calls I also record the time to the first chunk.

<figure class="flex flex-col items-center justify-center">
  <img alt="Trace span attributes for one model call: 13 input tokens, 395 output tokens, estimated cost 2.1868E-4, streaming true, temperature 1.0." src="/articles/where-the-time-and-cost-go-in-one-llm-call/trace_oh-a_r20_model.png"/>
  <figcaption>One request, not typical. The estimated cost is the price table times these token counts.</figcaption>
</figure>

The cost is only an estimate. Over 2000 calls straight to the gateway, the gateway's own cost values add up to the same sum as my table, but it isn't an invoice and I couldn't confirm how the two relate. For real money, look at your provider's usage page. That's also why I write "estimated cost" and don't state a currency.

I used two prompts: the long text with a one-word answer, and "What is a return policy?", which gets a long answer. Temperature was 1.0, and I threw away one warmup call before each batch.

## The hidden tokens

One run with 48 tokens could have been noise. To check, I sent the same prompt 70 times straight to the gateway, without streaming and without touching the thinking setting. In 4 of the 70 runs, the usage showed 44 to 88 extra output tokens on top of the usual 4. The visible answer was "OK" every time.

In the 3 odd runs where I looked at the response body, each had an empty thinking block, and the normal runs had none. The explanation is in the model docs. Adaptive thinking is on by default for Haiku 5.5, and "a response can start with one or more `thinking` blocks even when the request doesn't mention thinking" ([Anthropic docs, What's new in Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5)). The thinking text was empty in my responses, but its tokens were still counted as output.

The fix is one request field: `thinking: {"type": "disabled"}`. With it, 150 runs of the same prompt gave 0 odd runs. That's what I'll stand behind: 4 of 70 without the setting, 0 of 150 with it. These were separate batches, not run side by side, and it's too few runs to quote a rate.

The long-answer prompt had no thinking blocks in 40 runs with the default setting, and a few dozen tokens matter far more next to a 4-token answer than a 400-token one, so short-answer calls like classification and routing are where I'd look first.

In Spring AI, I send the field with the `extra-body` option. The Spring AI docs say it's flattened to the top level of the JSON request, and that the official OpenAI API rejects unknown fields with a 400 error ([Spring AI, OpenAI Chat](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)). So this setting belongs in a profile for this gateway only.

```yaml
# for example application-gateway.yaml, only active with the gateway profile
spring:
  ai:
    openai:
      chat:
        extra-body:
          thinking:
            type: disabled
```

## Thinking on a triage call

The one-word prompt is a toy case. My real use is triage: the model reads a customer message and returns JSON with an intent, an order id, a flag for human review, a reason and a summary. So I ran this call with thinking off and on. I expected the difference to be small.

I started two copies of the app that were identical except for the thinking setting, and sent 8 customer messages to both, alternating between them, 10 times each. That's 80 requests per setting, with the same temperature and warmup as before. This is a separate batch, so I don't mix it with the numbers above.

With thinking on, the median request produced 245.5 output tokens, against 111.5 with it off. The mean estimated cost per request was 0.000218 against 0.000143, and the median latency was 2.30 s against 1.71 s. In money, the difference is small: 0.000075 per request, or about 0.075 per 1,000 requests in my price table. In relative terms it wasn't: 52% more per request, and about 0.6 s slower. And it grows with volume and with any model that has a higher output price.

The extra tokens didn't show up on every message. By a rule of thumb (output more than 40 tokens above the largest value I saw with thinking off for the same message), 58 of the 80 runs with thinking on had extra tokens. The message asking for a refund had none in 10 runs, and the others had 4 to 10 of 10.

To check that thinking was the cause, I sent a similar request straight to the gateway: 6 of 6 default calls had one empty thinking block, and 0 of 6 with thinking disabled did. It isn't the exact request my app sends, so I don't compare its token counts with the batch above.

Did thinking change the answers? For 6 of 8 messages, the decision was the same in all 20 runs. Two messages differed. For "It is broken.", thinking off gave OTHER in 10 of 10 runs, while thinking on gave WARRANTY in 9 and OTHER in 1. For a message about an order that arrived late and damaged, thinking on flagged 1 run of 10 for human review, and thinking off flagged none. Without labeled answers, I can't say which is better.

For this use case I keep thinking off. It costs more and takes longer, and in these 80 runs it changed the decision on two messages, one of them in only 1 run of 10. The docs say the `effort` parameter is the better way to trade quality against speed and cost, which I haven't tested yet.

## Two clocks

Latency has two parts, not one. A streamed answer has two waits: one for the first chunk, and one for the full answer. These numbers come from 20 runs per prompt through the app, with thinking off.

| Prompt          | Runs | Output tokens | First chunk, median (range) | Full stream, median (range) |
| --------------- | ---- | ------------- | --------------------------- | --------------------------- |
| Long answer     | 20   | 366 to 455    | 963 ms (663 to 3830)        | 3.10 s (2.48 to 5.88)       |
| One-word answer | 20   | 4 in all runs | 1197 ms (660 to 2047)       | 1.20 s (0.67 to 2.05)       |

For the one-word answer, the first chunk is almost the whole request, because there's nothing left to stream. For the long answer, the first chunk arrived on average after about 37% of the full stream time (I used means here, since I'm comparing the two parts of the same runs).

<figure class="flex flex-col items-center justify-center">
  <img alt="Trace of the HTTP request: duration 3.01 seconds, first chunk recorded at 1143 milliseconds." src="/articles/where-the-time-and-cost-go-in-one-llm-call/trace_oh-a_r20_http.png"/>
  <figcaption>The same request as the first trace. The first chunk reached my backend at 1.14 s. The full response took 3.01 s.</figcaption>
</figure>

Not every slow run was slow in the same way: in some the first chunk was late (2550 and 3830 ms), and in others the stream itself was slow, at 125 to 135 tokens per second against a median of about 200. A single "latency" number would have hidden both.

One warning: it's the first chunk my backend receives, and it can be empty. In the 48-token run, two empty chunks came before the "OK". So it isn't the model's first token, and it isn't the first word on a user's screen.

## What I would do

- Put input tokens, output tokens and an estimated cost on the span of every model call.
- Record the time to the first chunk and the time to the full answer as two numbers.
- For short-answer calls, compare the output token count with the visible answer. A gap is a signal.
- Read your provider's defaults for hidden thinking, and know which request field turns it off. Measure your own calls with it on and off, alternating the requests, and check again when you change the model version.

What I didn't measure: whether thinking gives better answers (I have no labeled set), other temperatures, other models, the `effort` parameter, and where the first-chunk wait comes from. I also don't know whether the gateway caches. I saw no sign of it in these runs, but that may change.

I only found any of this because the numbers were already on the trace. A one-word answer looked fine on screen, and without that span I might never have asked where the other 44 tokens went.

Sources:

- [What's new in Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5)
- [Spring AI, OpenAI Chat](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)
