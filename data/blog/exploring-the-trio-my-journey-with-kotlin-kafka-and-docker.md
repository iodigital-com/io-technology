---
title: 'Exploring the Trio: My Journey with Kotlin, Kafka, and Docker'
date: '2024-07-16'
tags: ['kotlin', 'kafka', 'docker', 'backend']
images: ['/articles/exploring-the-trio-my-journey-with-kotlin-kafka-and-docker/the-trio.png']
summary: 'In this blog, I share my experience of learning Kotlin, Kafka, and Docker while building a Spring-boot application. Join me on this journey as I explore these technologies and provide insights into my project approach, technology integration, and what i like to call the minimum business logic approach.'
authors: ['michelle-van-der-linde']
theme: 'blue'
---

As any software engineer, I get excited with new tech and also interesting business ideas... my creative mind normally takes off.
The project that I'm referring to in this blog revolves around money being sent from one part of the world to another part of the world instantly with a massive reduction
in costs or at least that is the dream. My thinking was if the banks in the same country can process transactions without charging transaction fees why can't we do this worldwide?

Let's dive into my project approach and how I integrated Kotlin, Kafka, and Docker.

## Project Approach

I started this project to learn Kotlin, Kafka, and Docker and wanted a great business idea as well.

The aim is clear right, however, this was what I ended up spending most of my time on:

- Designing, and re-designing the architectural plan
- Deciding between H2 or an SQL database
- Designing database
- Designing APIs
- Building business logic
- Debugging to see where things went wrong

Sounds familiar.... although the above is very important it did create a lot of overhead which derailed me from my main objective which was to learn cool technologies.
So I took a Minimum Business logic approach while incorporating Verification of Implementation throughout the development process.

For me, the Minimum Business logic was :

- To create a single endpoint in the ProducerApp that accepts an object
- Place that object on a topic in Kafka
- Enable the ConsumerApp to listen to the topic and print out the object
- Then dockerize everything

With that in mind, I created checkpoints to verify that each technology works as expected and is well-integrated.
This created a clear view of what I was busy with currently and if something broke I knew at which point this might have gone wrong.
After I configured the technologies to communicate with each other I could now proceed to implementing the business logic knowing that my base is well-defined.

## Technology Integration

### Kotlin

Kotlin is a programming language that makes coding concise, cross-platform, and fun. To learn more https://kotlinlang.org/

I've been a Java developer for over 10 years, but I must admit the one thing that stands out for me the most is the ease of writing and reading the code.
The ? symbol has been my favorite up until now. It indicates that this field can be NULL or that this function could return a NULL object.

```kotlin
@Entity
data class YourEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    var someField: String
){}
```

When reading Kotlin you will find the most important information is right at the start.
Just look at the code below - this is a method that takes one parameter and returns an object that could be NULL. I mean how nice is that!

```kotlin
fun someMethodName(fieldName: String) : YourObject? {
    return someRepository.getYourObjectByFieldName(fieldName)
}
```

The same goes for configuring a Kafka Producer & Consumer, it is just so easy in Kotlin. The first line of code says this is a class called Producer,
and it takes in a KafkaTemplate map of key String and value YourObject. That's it, now you can invoke the methods on that KafkaTemplate.

```kotlin
@Component
class Producer(private val kafkaTemplate: KafkaTemplate<String, YourObject>) {
    fun yourMethodName(dto: YourObjectDto) {
        kafkaTemplate.send(YOUR_TOPIC_NAME, dto)
    }
}
```

On the Consumer part it gets even easier, just annotate your method with @KakaListener and provide some details such as the topic and the groupId and that's it.

```kotlin
@Component
class Consumer(private val yourService: YourService) {
    @KafkaListener(topics = [YOUR_TOPIC], groupId = YOUR_GROUP_ID)
    fun yourMethodName(dto: YourObjectDto) {
        // your business logic
        yourService.yourMethodName(dto)
    }
}
```

### Kafka

Apache Kafka is a distributed event store and stream-processing platform. To learn more https://kafka.apache.org/

To configure Kafka in your projects is very easy. The ProducerApp is used to produce messages onto a Kafka topic and for that, you need to provide
Spring with some config like where Kafka is running and what the type for the key and value is.

```yaml
kafka:
  producer:
    bootstrap-servers: localhost:9092
    key-serializer: org.apache.kafka.common.serialization.StringSerializer
    value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

The ConsumerApp is responsible for reading the messages from the Kafka topic and for this, you also need to similar config.
You will notice an additional config the auto-offset-reset that tells the consumer where to start reading from the Kafka topic.

```yaml
kafka:
  consumer:
    bootstrap-servers: localhost:9092
    auto-offset-reset: earliest
    key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
```

To be able to use Kafka in your Springboot project you also need to add the following in your pom.xml of both ProducerApp & ConsumerApp.

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
<dependency> <!--Only used for testing purposes-->
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka-test</artifactId>
    <scope>test</scope>
</dependency>
```

### Docker

In short, docker is an open platform for developing, shipping, and running applications. To learn more https://www.docker.com/

If we take an example of a physical shop in the city that sells hotdogs if we had to dockerize this it would become a truck that has the
appliances built in and contains all the products it requires to sell hotdogs. The Hotdog shop is no longer bound to the city it can now
sell hotdogs in multiple places. Now to dockerize your application all you need is a Dockerfile & DockerCompose, this will ensure that your
application has what it needs to be able to run anywhere.

1. The Dockerfile (no extensions) is a set of instructions that needs to be executed to assemble an image.

```Dockerfile
FROM bellsoft/liberica-openjdk-alpine:21.0.3

WORKDIR /usr/share/app

COPY target/*.jar app.jar

CMD ["java","-jar", "app.jar"]
```

2. The Docker Compose is a YAML file that is used to define all your services and allows you with a single command to start everything together **docker-compose up** and also tear it all down **docker-compose down**. Note these commands should be executed in the directory where the docker-compose file is located. In this docker-compose, we describe Zookeeper, Kafka, and our two microservices.

```yaml
version: '3'
services:
  zookeeper:
  image: 'bitnami/zookeeper:latest'
  ports:
    - '2181:2181'
  extra_hosts:
    - 'host.docker.internal:host-gateway'
  environment:
    - ALLOW_ANONYMOUS_LOGIN=yes

  kafka:
    image: 'bitnami/kafka:latest'
    ports:
      - '9092:9092'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    environment:
      - KAFKA_BROKER_ID=1
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
    depends_on:
      - zookeeper

  producerapp:
    build: /producerapp/.
    image: producerapp
    ports:
      - '8080:8080'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    environment:
      - KAFKA_BOOTSTRAP_SERVER=kafka:9092

  consumerapp:
    build: /consumerApp/.
    image: consumerapp
    ports:
      - '8081:8081'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    environment:
      - KAFKA_BOOTSTRAP_SERVER=kafka:9092
```

### Key things to mention here

To enable communication between your microservices and Kafka you have to supply the config through the environment variables.

```yaml
environment:
  - KAFKA_BOOTSTRAP_SERVER=kafka:9092
```

- Take note that the ports are different for your microservices

- This automatically takes care of building the images of your microservices just ensure you supply the correct directory

```yaml
build: /consumerApp/.
```

## Conclusion

Looking back on this journey I found three things that hampered me in moving forward and that was not having a clear enough goal, not sticking to it, and adding too much
business logic to the application. Goals are important, we all know that and yet when diving into new tech it disappears into the background, well that's what happened
to me. I also overcomplicated the project with a lot of business logic. This experience taught me that you only need the bare minimum business logic to be able to complete
this kind of learning and remember to verify your implementation as you code. Ensuring each piece worked on its own and then integrating them one by one ensured that when
troubleshooting arose I could easily pinpoint where the problem was.

If I had to start this project again I would throw the business idea out of the window and just ensure that the ProducerApp can place a DTO on a Kafka topic and that the
ConsumerApp can read that DTO and log it. That's it, nothing more, the objective would have been achieved and I would've had more time diving deeper into other Kafka
config properties.

I hope that my experience assists you in how you can approach your next tech upskill. Happy learning!
