---
title: 'Exploring the Trio: My Journey with Kotlin, Kafka, and Docker'
date: '2024-07-16'
tags: ['kotlin', 'kafka', 'docker', 'backend']
images: ['/articles/exploring-the-trio-my-journey-with-kotlin-kafka-and-docker/the-trio.png']
summary: 'In this blog, I share my experience of learning Kotlin, Kafka, and Docker while building a Spring-boot application. Join me on this journey as I explore these technologies and provide insights into my project approach, technology integration, and the minimum business logic approach.'
authors: ['michelle-van-der-linde']
theme: 'blue'
---

### Project approach

I started this project with the **aim** of learning `Kotlin`, `Kafka`, and `Docker` and wanted a great business idea as well.

The aim is clear right, however, this was what I ended up spending most of my time on:

- Designing, and re-designing the architectural plan
- Deciding between H2 or an SQL database
- Designing database
- Designing API's
- Building business logic
- Debugging to see where things went wrong

Sounds familiar.... although the above is very important it did create a lot of overhead which derailed me from my main objective which was to learn cool technologies.
So I took a `Minimum Business logic` approach while incorporating `Verification of Implementation` throughout the development process.

For me, the `Minimum Business logic` was :

- To create a single endpoint in the ProducerApp that accepts an object
- Place that object on a topic in Kafka
- Enable the ConsumerApp to listen to the topic and print out the object
- Then dockerize everything

With that in mind, I created checkpoints to verify that each technology is working as expected and is well integrated.
This created a clear view of what I was busy with currently and if something broke I knew at which point this might have gone wrong.
After I configured the technologies to communicate with each other I could now proceed to implementing the business logic knowing that
my base is well-defined.

### Technology Integration

#### Kotlin

`Kotlin is a programming language that makes coding concise, cross-platform, and fun`. To learn more https://kotlinlang.org/

- I've been a Java developer for over 10 years, but I must admit the one thing that stands out for me the most is the ease of writing and reading the code
- The `?` symbol has been my favorite up until now. It indicates that this field can be NULL or that this function could return a NULL object

```kotlin
@Entity
data class YourEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    var someField: String
){}
```

```kotlin
fun someMethodName(fieldName: String) : YourObject? {
    return someRepository.getYourObjectByFieldName(fieldName)
}
```

- Configuring a simple producer & consumer is so easy in Kotlin

```kotlin
@Component
class Producer(private val kafkaTemplate: KafkaTemplate<String, YourObject>) {
    fun yourMethodName(dto: YourObjectDto) {
        kafkaTemplate.send(YOUR_TOPIC_NAME, dto)
    }
}
```

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

#### Kafka

`Apache Kafka is a distributed event store and stream-processing platform`. To learn more https://kafka.apache.org/

- Configuring Kafka in your projects

ProducerApp

```yaml
kafka:
  producer:
    bootstrap-servers: localhost:9092
    key-serializer: org.apache.kafka.common.serialization.StringSerializer
    value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

ConsumerApp

```yaml
kafka:
  consumer:
    bootstrap-servers: localhost:9092
    auto-offset-reset: earliest
    key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
```

Kafka Dependencies required in both projects

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### Docker

Consists of two files

1. Dockerfile (no extensions) - It is a set of instructions that needs to be executed to assemble an image

```Dockerfile
FROM bellsoft/liberica-openjdk-alpine:21.0.3

WORKDIR /usr/share/app

COPY target/*.jar app.jar

CMD ["java","-jar", "app.jar"]
```

2. Docker Compose - This is a YAML file that is used to define all your services and allows you with a single command to start everything together `docker-compose up` and also tear it all down `docker-compose down`. Note these commands should be executed in the directory where the docker-compose file is located. In this docker-compose, we describe Zookeeper, Kafka, and our two microservices.

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

#### Key things to mention here

- To enable communication between your microservices and Kafka you have to supply it the config through the environment variables

```yaml
environment:
  - KAFKA_BOOTSTRAP_SERVER=kafka:9092
```

- Take note that the ports are different for your microservices

- This automatically takes care of building the images of your microservices just ensure you supply the correct directory

```yaml
build: /consumerApp/.
```

### Conclusion

When starting a new project to learn new technologies you only need the bare minimum business logic to be able to complete your learnings
and remember to verify your implementation as you code. I hope that my experience assists you in how you can approach your next tech skill.
