---
title: 'Separated Logging with Filebeat and ELK stack'
date: '2022-07-08'
tags: ['java', 'logging']
images: ['/articles/separated-logging-with-filebeat-and-elk-stack/filebeat-elk-stack-diagram.png']
summary: 'Why do we need separate to our logging mechanism in microservice architecture?'
authors: ['ali-goktas']
theme: 'beige'
---

Why do we need separate to our logging mechanism in microservice architecture?

You have to make sure if you need it. Yes, you can use it if you want to manage your logs at one point and you don’t want to do HTTP requests for each log line.

![https://miro.medium.com/max/1400/1*EwPcfFoVUDnwuRH4AruOJA.png](https://miro.medium.com/max/1400/1*EwPcfFoVUDnwuRH4AruOJA.png)

Architechtural Diagram

## What are the benefits of this architecture?

1. Filebeat can listen to all microservices that in same network.
2. Filebeat ships the collected logs as a stream. So it increases the productivity of data transfer.
3. You don’t need do new implementations. When you add new component into the docker-compose.yml, it will work for the component too.
4. Elasticsearch is one of the most usable database for huge data storing.
5. You can monitor metrics and graphics on Kibana.

Filebeat is listening to all containers that are implemented and send to ELK stack. You can configure it via filebeat.yml file.

```
filebeat.autodiscover:
  providers:
    - type: docker
      hints.enabled: true

output.logstash:
  hosts: ["logstash:5000"]

logging.level: error
```

According to the above filebeat.yml file, the consumed logs are sending to logstash. If you don’t want to use Logstash for filtering, you can write “elasticsearch” as output.

```
output.elasticseach:
  hosts: ["elasticsearch:5000"]
```

So, What kind of docker-compose.yml file you need ?

```
version: '3.1'

services:
  X-service:
    build: ./X-service
    ports:
      - "8080:8080"
```

```
logstash:
  container_name: logstash
  image: logstash:7.5.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    - ./logstash.template.json:/usr/share/logstash/templates/logstash.template.json
  ports:
    - 5044:5044
  depends_on:
    - elasticsearch
  stdin_open: true
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "50"
```

```
elasticsearch:
  image: elasticsearch:8.0.1
  volumes:
    - elasticsearch:/usr/share/elasticsearch/data:z
  ports:
    - "9200:9200"
  environment:
    ES_JAVA_OPTS: -Xmx256m -Xms256m
    discovery.type: single-node
    xpack.security.enabled: false
    logger.level: ERROR
```

```
kibana:
  image: kibana:8.0.1
  ports:
    - "5601:5601"
```

```
filebeat:
    image: elastic/filebeat:8.0.1
    user: root
    volumes:
      - ./filebeat/config/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - type: bind
        source: /var/lib/docker/containers
        target: /var/lib/docker/containers
        read_only: true
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
        read_only: true    depends_on:
      - logstash
```

Volume paths and configs can be symbolic in the above code blocks. You can customize them according to your design. Also, you need to add volumes for components that are required.

> Poorly designed code usually takes more code to do the same things, often because the code quite literally does the same thing in several places.

> Martin Fowler

Thanks for your time!
