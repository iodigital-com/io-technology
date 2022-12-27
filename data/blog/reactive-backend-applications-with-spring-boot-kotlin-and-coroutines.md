---
title: 'Reactive Backend Applications with Spring Boot, Kotlin and Coroutines'
date: '2022-12-26'
tags: ['reactive', 'backend', 'spring', 'kotlin', 'coroutines', 'java']
images:
  ['/articles/reactive-backend-applications-with-spring-boot-kotlin-and-coroutines/headline.jpg']
summary: 'This 2-part article is about going from a traditional MVC-style Spring Boot application written in Java to a modern, functional, reactive Spring Boot application using Kotlin and Coroutines.'
authors: ['leo-schneider', 'mehmet-akif-tutuncu']
theme: 'black'
---

Spring Framework is one of the most popular choices for web applications. It comes with a great ecosystem, tooling, and support. Spring applications are mainly written in Java. While they can serve quite well in many different domains and use cases, they may not be a good fit for modern-day applications which require low-latency and high-throughput. This is where the reactive programming paradigm could help. Spring already supports reactive programming via [Project Reactor](https://projectreactor.io).

This will be a 2-part article. In this first part, let's start with an introduction to reactive programming.

## 1. Introduction to Reactive Programming

Reactive programming is a paradigm that focuses on non-blocking and asynchronous processing of tasks. One set of specifications/abstractions for reactive programming on JVM is called [Reactive Streams](https://www.reactive-streams.org). Project Reactor is a message-driven, type-safe and functional implementation of Reactive Streams, and it is used by Spring (via [spring-webflux](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html) module) to enable reactive web applications. Reactive streams model the data processing as a stream with one end producing the values and one end consuming them.

There are a few basic building blocks with which you should be familiar.

### `org.reactivestreams.Publisher`

```java
public interface Publisher<T> {
    public void subscribe(Subscriber<? super T> s);
}
```

This is the interface where values are emitted and subscribers can subscribe to those values. It represents the value-producing end of a reactive stream.

### `org.reactivestreams.Subscriber`

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```

This is the interface where the progress of the reactive stream is defined. There can be new values, errors, or completion signals. It represents the value-consuming end of the reactive stream.

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

This is very similar to `Mono<T>` but it can emit 0 or more elements (not limited to 1) of type `T`.

## 2. How to Get Started?

For demonstration purposes, let's first create a traditional, MVC-style Spring application for weather information. We will then update this application into being a reactive application.

### Creating Spring Web Project

You can use [start.spring.io](https://start.spring.io) to generate a project using Java 17, Gradle, Spring Web, Spring Data JPA, and H2 Database. Here's what the build file of our project should look like:

```kotlin
plugins {
  java
  id("org.springframework.boot") version "3.0.0"
  id("io.spring.dependency-management") version "1.1.0"
}

group = "com.iodigital"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-web")
  runtimeOnly("com.h2database:h2")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
  useJUnitPlatform()
}
```

Let's create our weather entity:

```java
package com.iodigital.weather;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.StringJoiner;

@Entity
public class WeatherInfo {
    @Id
    @GeneratedValue
    private Long id;
    private String region;
    private String country;
    private String state;
    private String city;
    private LocalDate localDate;
    private String avgTemperature;

    // Constructors, getters, setters here
}
```

Then a repository:

```java
package com.iodigital.weather;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRepository extends ListCrudRepository<WeatherInfo, Long> {
    List<WeatherInfo> findAllByCityIgnoreCase(final String city);
}
```

Then a service:

```java
package com.iodigital.weather;

import com.iodigital.weather.api.WeatherAPIClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {
    private final WeatherRepository repository;

    public WeatherService(final WeatherRepository repository) {
        this.repository = repository;
    }

    public List<WeatherInfo> getAll() {
        return repository.findAll();
    }

    public List<WeatherInfo> getForCity(final String city) {
        return List.of(); // TODO: Will implement later
    }
}
```

And finally a controller:

```java
package com.iodigital.weather;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    private final WeatherService service;

    public WeatherController(final WeatherService service) {
        this.service = service;
    }

    @GetMapping
    public List<WeatherInfo> getAll() {
        return service.getAll();
    }

    @GetMapping("/city/{city}")
    public List<WeatherInfo> getForCity(@PathVariable final String city) {
        return service.getForCity(city);
    }
}
```

Now let's run our application in a terminal

```bash
gradle bootRun --console=plain
```

and send a request to test it.

```bash
# Gets nothing because DB is empty
curl localhost:8080/weather

[]
```

In order for this application to be useful, let's also integrate with a 3rd party weather data provider. I chose [weatherapi.com](https://www.weatherapi.com) for this. Before going forward, register and get an API key.

Let's add models matching their API response (as separate files):

```java
// api/Location.java
package com.iodigital.weather.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Location(@JsonProperty("name") String city, String region, String country) {}
// ---

// api/Temperature.java
package com.iodigital.weather.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Temperature(@JsonProperty("avgtemp_f") double avgF) {}
// ---

// api/ForecastDay.java
package com.iodigital.weather.api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record ForecastDay(LocalDate date, @JsonProperty("day") Temperature temperature) {}
// ---

// api/Forecast.java
package com.iodigital.weather.api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record Forecast(@JsonProperty("forecastday") List<ForecastDay> days) {}
// ---

// api/WeatherAPIResponse.java
package com.iodigital.weather.api;

import com.iodigital.weather.WeatherInfo;

import java.util.List;

public record WeatherAPIResponse(Location location, Forecast forecast) {
    public List<WeatherInfo> toWeatherInfoList() {
        final var region = location.region();
        final var country = location.country();
        final var city = location.city();
        return forecast.days().stream().map(f ->
                new WeatherInfo(
                        null, // id is null because this will be a new entity
                        region,
                        country,
                        "",
                        city,
                        f.date(),
                        "%.2f".formatted(f.temperature().avgF())
                )
        ).toList();
    }
}
```

Then let's add our credentials to `application.properties` file:

```properties
weatherapi.host=https://api.weatherapi.com
weatherapi.api-key=your-api-key
```

Since we'll send HTTP requests, we'll make use of Spring's `RestTemplate`. Let's update our application class to add a `Bean` definition for this.

```java
package com.iodigital.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class WeatherApplication {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(WeatherApplication.class, args);
    }
}
```

Now we can add a client that can talk to external API:

```java
package com.iodigital.weather.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class WeatherAPIClient {
    private final RestTemplate http;
    private final String host;
    private final String apiKey;

    public WeatherAPIClient(
            final RestTemplate http,
            @Value("${weatherapi.host}") final String host,
            @Value("${weatherapi.api-key}") final String apiKey
    ) {
        this.http = http;
        this.host = host;
        this.apiKey = apiKey;
    }

    public WeatherAPIResponse getWeather(final String city) {
        return http
                .getForObject(
                        "%s/v1/forecast.json?key=%s&q=%s&days=7".formatted(host, apiKey, city),
                        WeatherAPIResponse.class
                );
    }
}
```

Now we can add some logic to our `WeatherService`:

```java
package com.iodigital.weather;

import com.iodigital.weather.api.WeatherAPIClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {
    private final WeatherAPIClient api;
    private final WeatherRepository repository;

    public WeatherService(final WeatherAPIClient api, final WeatherRepository repository) {
        this.api = api;
        this.repository = repository;
    }

    public List<WeatherInfo> getAll() {
        return repository.findAll();
    }

    public List<WeatherInfo> getForCity(final String city) {
        final var weatherForCity = repository.findAllByCityIgnoreCase(city);

        if (!weatherForCity.isEmpty()) {
            return weatherForCity;
        }

        final var apiResponse = api.getWeather(city);

        return repository.saveAll(apiResponse.toWeatherInfoList());
    }
}
```

Finally, we can run the application and test again:

```bash
# Gets nothing because DB is empty
curl localhost:8080/weather
[]

# Gets nothing from DB, then fetches from 3rd party, saves and returns some data
curl localhost:8080/weather/city/Amsterdam
[
    {
        "avgTemperature": "47,20",
        "city": "Amsterdam",
        "country": "Netherlands",
        "id": 1,
        "localDate": "2022-12-22",
        "region": "North Holland",
        "state": ""
    },
    ...
]

# Gets data from DB directly
curl localhost:8080/weather
[
    {
        "avgTemperature": "47,20",
        "city": "Amsterdam",
        "country": "Netherlands",
        "id": 1,
        "localDate": "2022-12-22",
        "region": "North Holland",
        "state": ""
    },
    ...
]
```

There we are at last. Our application does something useful. In the next section, we'll go reactive!

### Going Reactive with Spring WebFlux

Now that we have an application, let's turn it into a reactive application. For this, we'll replace Spring Web dependency with Spring WebFlux, Spring Data JPA with Spring Data R2DBC. We'll also add R2DBC dependency for our H2 database.

Let's start by updating `dependencies` section of our build file as following:

```kotlin
dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
  implementation("org.springframework.boot:spring-boot-starter-webflux")
  runtimeOnly("com.h2database:h2")
  runtimeOnly("io.r2dbc:r2dbc-h2")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.projectreactor:reactor-test")
}
```

Now we'll need to adjust our controller, service, and repository layers respectively until our application compiles again and makes use of reactive components and types.

As a rule of thumb, we'll replace single values of `A` with `Mono<A>` and multiple values `List<A>` with `Flux<A>`.

Updating the controller is straightforward. Our `WeatherController` becomes:

```java
package com.iodigital.weather;

// ...
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    // ...

    @GetMapping
    public Flux<WeatherInfo> getAll() {
        return service.getAll();
    }

    @GetMapping("/city/{city}")
    public Flux<WeatherInfo> getForCity(@PathVariable final String city) {
        return service.getForCity(city);
    }
}
```

Since the service code will need to change a bit to make use of `Mono`s and `Flux`es, let's handle the rest of the changes first and leave the service to the end.

`WeatherInfo` entity becomes (note the annotations, no more Jakarta/JPA annotations):

```java
package com.iodigital.weather;

import org.springframework.data.annotation.Id;
// ...

public class WeatherInfo {
    @Id
    private Long id;

    // ...
}
```

`WeatherRepository` becomes so DB interactions are non-blocking (making use of R2DBC):

```java
package com.iodigital.weather;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface WeatherRepository extends ReactiveCrudRepository<WeatherInfo, Long> {
    Flux<WeatherInfo> findAllByCityIgnoreCase(final String city);
}
```

Since we don't use JPA/Hibernate anymore, we'll need to be handling our DB structure ourselves. Luckily, for simple cases like ours, Spring supports DB schema initialization directly. Let's create a `schema.sql` in our resources folder:

```sql
CREATE TABLE IF NOT EXISTS WEATHER_INFO(
    id IDENTITY NOT NULL,
    region VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    local_date DATE NOT NULL,
    avg_temperature VARCHAR(255) NOT NULL
);
```

The web client will also need to be reactive so `WeatherAPIClient` becomes (`WebClient` is used instead of `RestTemplate`):

```java
package com.iodigital.weather.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class WeatherAPIClient {
    private static final Logger log = LoggerFactory.getLogger(WeatherAPIClient.class);

    private final WebClient http;
    private final String host;
    private final String apiKey;

    public WeatherAPIClient(
        final WebClient http,
        @Value("${weatherapi.host}") final String host,
        @Value("${weatherapi.api-key}") final String apiKey
    ) {
        this.http = http;
        this.host = host;
        this.apiKey = apiKey;
    }

    public Mono<WeatherAPIResponse> getWeather(final String city) {
        return http
            .get()
            .uri("%s/v1/forecast.json?key=%s&q=%s&days=7".formatted(host, apiKey, city))
            .exchangeToMono(response -> response.bodyToMono(WeatherAPIResponse.class))
            .doFirst(() -> log.info("Getting weather forecast for city {}", city))
            .doOnError(e -> log.error("Cannot get weather forecast for %s".formatted(city), e))
            .doOnSuccess(response -> log.info("Weather forecast for city {}: {}", city, response));
    }
}
```

This requires `Bean` definitions to be updated in the application:

```java
package com.iodigital.weather;

// ...
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.client.reactive.ReactorResourceFactory;
import org.springframework.web.reactive.function.client.WebClient;
// ...

@EnableR2dbcRepositories
@SpringBootApplication
public class WeatherApplication {
    @Bean
    public ReactorResourceFactory resourceFactory() {
        return new ReactorResourceFactory();
    }

    @Bean
    public WebClient webClient() {
        return WebClient
            .builder()
            .clientConnector( // Some defafult configuration for WebClient
              new ReactorClientHttpConnector(
                resourceFactory(),
                client -> client.responseTimeout(Duration.ofSeconds(10))
              )
            )
            .build();
    }

    // ...
}
```

Finally, let's adjust our service layer so `WeatherService` becomes:

```java
package com.iodigital.weather;

// ...
import reactor.core.publisher.Flux;

@Service
public class WeatherService {
    // ...

    public Flux<WeatherInfo> getAll() {
        return repository.findAll();
    }

    public Flux<WeatherInfo> getForCity(final String city) {
        return repository
            .findAllByCityIgnoreCase(city)
            .switchIfEmpty(
                api
                    .getWeather(city)
                    .flatMapMany(apiResponse ->
                        repository.saveAll(apiResponse.toWeatherInfoList())
                    )
            );
    }
}
```

Finally we can run the application and test:

```bash
# Gets nothing because DB is empty
curl localhost:8080/weather
[]

# Gets nothing from DB, then fetches from 3rd party, saves and returns some data
curl localhost:8080/weather/city/Amsterdam
[
    {
        "avgTemperature": "47,20",
        "city": "Amsterdam",
        "country": "Netherlands",
        "id": 1,
        "localDate": "2022-12-22",
        "region": "North Holland",
        "state": ""
    },
    ...
]

# Gets data from DB directly
curl localhost:8080/weather
[
    {
        "avgTemperature": "47,20",
        "city": "Amsterdam",
        "country": "Netherlands",
        "id": 1,
        "localDate": "2022-12-22",
        "region": "North Holland",
        "state": ""
    },
    ...
]
```

It works! We now have a reactive application that's non-blocking at every layer.

The key point in reactive applications is to use reactive types and operators defined on them to achieve the result we want. This follows the principles of functional programming too because the (immutable) values we're building are actually descriptions of our program. This means nothing is run while we're building our stream. We build small building blocks and combine them into a larger program. It is eventually run when there is a subscription to our stream. For this application, it is taken care of by Spring WebFlux.

## 3. Next Steps

To recap this first part of the article, we started with a traditional MVC-style Spring Boot application and we converted it into a modern, reactive one step-by-step.

In the second part, we'll take things further by converting the application to Kotlin and adding coroutines support.

You can find the source code of this application at [github.com/iodigital-com/reactive-kotlin-weather-api](https://github.com/iodigital-com/reactive-kotlin-weather-api)
