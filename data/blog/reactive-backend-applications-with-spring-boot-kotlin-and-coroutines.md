---
title: 'Reactive Backend Applications with Spring Boot, Kotlin and Coroutines'
date: '2022-12-26'
tags: ['reactive', 'backend', 'spring', 'kotlin', 'coroutines', 'java']
images:
  ['/articles/reactive-backend-applications-with-spring-boot-kotlin-and-coroutines/headline.jpg']
summary: 'This article is about going from a traditional MVC-style Spring Boot application written in Java to a modern, functional, reactive Spring Boot application using Kotlin and Coroutines.'
authors: ['leo-schneider', 'mehmet-akif-tutuncu']
theme: 'black'
---

Spring Framework is one of the most popular choices for web applications. It comes with a great ecosystem, tooling and support. Spring applications are mainly written in Java. While they can serve quite well in many different domains and use cases, they may not be a good fit for modern day applications which require low-latency and high-throughput. This is where reactive programming paradigm could help. Spring already supports reactive programming via [Project Reactor](https://projectreactor.io).

Let's start by an introduction to reactive programming.

## 1. Introduction to Reactive Programming

Reactive programming is a paradigm which focuses on non-blocking and asynchronous processing of tasks. One set of specifications/abstractions for reactive programming on JVM is called [Reactive Streams](https://www.reactive-streams.org). Project Reactor is a message driven, type-safe and functional implementation of Reactive Streams, and it is used by Spring (via [spring-webflux](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html) module) to enable reactive web applications. Reactive streams model the data processing as a stream with one end producing the values and one end consuming them.

There are a few basic building blocks with which you should be familiar.

### `org.reactivestreams.Publisher`

```java
public interface Publisher<T> {
    public void subscribe(Subscriber<? super T> s);
}
```

This is the interface is where values are emitted and subscribers can subscribe to those values. It represents the value producing end of a reactive stream.

### `org.reactivestreams.Subscriber`

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```

This is the interface is where the progress of the reactive stream is defined. There can be new values, errors or completion signals. It represents the value consuming end of the reactive stream.

### `org.reactivestreams.Subscription`

```java
public interface Subscription {
    public void request(long n);
    public void cancel();
}
```

This is the interface for a subscriber who subscribed to a publisher. It allows a number of messages to be requested. This way, Reactive Streams support back-pressure by design. It also allows for cancellation for better usage of resources (not to consume messages when not needed). No data will flow in the stream until `request` is called on a subscription.

### `reactor.core.publisher.Mono<T>`

This is an implementation of a Reactive Stream where there can be 0 or 1 element of type `T` emitted. It provides many different operators to transform and combine the stream to achieve desired results.

### `reactor.core.publisher.Flux<T>`

This is very similar to `Mono<T>` but it can emit 0 or more element (not limited to 1) of type `T`.

## 2. How to Get Started?

TODO
