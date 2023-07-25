---
title: 'Streamlining Deployment and Scaling: An Introduction to Kubernetes, Helm, and Terraform'
date: '2023-07-20'
tags: ['Kubernetes', 'Minikube', 'k8s', 'Helm', 'Terraform', 'Dockerization']
images: ['/articles/streamlining-deployment-and-scaling/Intro-Clouds.jpg']
summary: 'A small go through to explore kubernetes, helm and terraform'
authors: ['eyad-jarrar']
theme: 'beige'
---

## Introduction

In the ever-evolving landscape of modern application development and deployment,
managing complex infrastructures has become a critical challenge.
Kubernetes, Helm, and Terraform are three powerful tools that work synergistic-ally to streamline the process of deploying and scaling applications in a reliable and efficient manner.

In this article, we will explore these technologies, their individual roles, and how they complement each other to empower developers and operations teams.

## Terminology

Before we go deeper into the technologies, lets start by giving a brief overview of each of them:

### Kubernetes: Orchestrating Containerized Applications

Kubernetes, often abbreviated as K8s, is an open-source container orchestration platform that simplifies the deployment, scaling, and management of containerized applications. It provides a highly flexible and robust infrastructure for automating the management of containers across a cluster of machines.
Kubernetes offers features like automatic scaling, load balancing, self-healing, and rolling updates, ensuring high availability and fault tolerance.

#### Minikube

We will be using [Minikube](https://minikube.sigs.k8s.io/docs/start) to be able to use kubernetes locally on our machine.

### Helm: Simplifying Application Packaging and Deployment

Helm is a package manager for Kubernetes that simplifies the management of applications and their dependencies. It introduces the concept of "charts," which are pre-configured packages containing all the necessary resources required to run an application on Kubernetes.
Helm enables developers to define, install, upgrade, and uninstall applications in a repeatable and consistent manner. With Helm, deploying complex applications with multiple components becomes more manageable, as it abstracts away the complexity of managing individual resources.

### Terraform: Infrastructure as Code

Terraform is an infrastructure provisioning tool that allows you to define and manage your infrastructure as code (IaC). It supports various cloud providers and infrastructure services, enabling you to create and manage resources such as virtual machines, networks, and storage.
Terraform uses a declarative syntax to define your infrastructure configuration, allowing you to version control and manage it alongside your application code. By treating infrastructure as code, Terraform provides the ability to create reproducible infrastructure deployments, making it easier to maintain and scale complex architectures.

## Get Started

Let's get started with using these tools and deploy a very simple spring-boot application that stores data to a postgres DB and a publishing some data to a RabbitMQ. so let's get started.

### Our Spring-Boot Application

We can start by creating our spring-boot application using [spring-boot-initializer](https://start.spring.io/) for this article I will be using kotlin as our main application language and maven for dependency management.

While generating the project, here are some dependencies that we will need during our journey.

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-stream-binder-rabbit</artifactId>
        </dependency>
```

These dependencies are added to integrate with postgres DB and RabbitMQ.

Starting with the DB layer, we will create the entity and repository

#### Entity

```kotlin
@Entity
@Table(name = "demo")
data class DemoEntity(@Id val id: UUID, val info: String)
```

#### Repository

```kotlin
interface DemoRepository: CrudRepository<DemoEntity, UUID>
```

We will move forward with our application's controller.

#### Controller

```kotlin
@RestController
@RequestMapping("demo")
class DemoController(val demoRepository: DemoRepository, val streamBridge: StreamBridge) {

    @GetMapping
    fun getDemo(): List<String> = demoRepository.findAll().map { it.info }

    @PostMapping
    fun createDemo(@RequestBody input: DemoInput): UUID =
        demoRepository.save(DemoEntity(UUID.randomUUID(), input.data)).also { produceDemoCreatedMessage(DemoCreatedMessage(it.id, it.info)) }.id

    fun produceDemoCreatedMessage(demoCreatedMessage: DemoCreatedMessage) {
        streamBridge.send("demoProduceQueue", demoCreatedMessage)
    }

    data class DemoInput(val data: String)
    data class DemoCreatedMessage(val id: UUID, val info: String)
}
```

The final part of the application will be configuration

#### Configuration

Using [spring-cloud-stream](https://www.baeldung.com/spring-cloud-stream) we will be able to control the rabbitmq topics which we will use.

```yaml
spring:
  cloud:
    stream:
      bindings:
        demoProduceQueue:
          destination: demoCreatedMessage
        demoQueue-in-0:
          destination: demoCreatedMessage
          group: demoQueue
      rabbit:
        bindings:
          demoProduceQueue:
            producer:
              bind-queue: true
          demoQueue-in-0:
            consumer:
              bind-queue: true

      binders:
        local_rabbit:
          type: rabbit
          environment:
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: guest
                password: guest
                virtual-host: /
```

We also want to add a nice plugin to our pom file, to generate a docker image of our application dynamically, and we will call it myimage.

```xml
            <plugin>
                <groupId>com.google.cloud.tools</groupId>
                <artifactId>jib-maven-plugin</artifactId>
                <version>3.3.2</version>
                <configuration>
                    <to>
                        <image>myimage</image>
                    </to>
                </configuration>
            </plugin>
```

Now that our application is all set, let's move forward deploying our application, we will need few tools to install locally.

### Docker

If you don't already have a [docker desktop](https://docs.docker.com/desktop/install/windows-install/) running on your machine, it's a good idea to track our containers that will be created along this article.

### Minikube

We will need [Minikube](https://minikube.sigs.k8s.io/docs/start) to be installed on our machine to use kubernetes locally.

### Helm

As well as [Helm](https://helm.sh/docs/intro/install/) to configure and optimize our kubernetes deployment later on.

## Begin deploying

Right now, our application is ready, we have installed all the tools that we need, it's time to bring our application live.

First lets start our minikube locally, by opening a terminal and executing

```shell
minikube start
```

We should be able to see that our minikube has a docker container in docker desktop application

![Minikube container](/articles/streamlining-deployment-and-scaling/Minikube-start.png)

now let's initialize our helm charts for this project:

```shell
helm create ./helm/demo-chart
```

it will initialize the chart with all the configurations, we just have to change few of them based on our application needs.

Now to make sure that our application will perform as expected, we want to make sure that we have our postgresDB and rabbitMQ are running.
to do so we will be using terraform to initialize and run them.

### Terraform

Dealing with terraform is really simple, we just need to create our IaC for both PostgresDB and RabbitMQ in one file as follows:

1. go to any directory create your own terraform folder just to keep the terraform files and create a terraform file called main.tf using:
   ` touch main.tf`
   and then we need to add the necessary configuration plan to create both postgresDB and rabbitMQ, so inside the main.tf add the following json:

```json
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

resource "docker_image" "rabbitmq" {
  name         = "rabbitmq:3-management"
  keep_locally = false
}

resource "docker_image" "postgres" {
  name         = "postgres:latest"
  keep_locally = false
}

resource "docker_container" "rabbitmq" {
  name  = "rabbitmq"
  image = docker_image.rabbitmq.image_id
  ports {
    internal = 5672
    external = 5672
  }
  ports {
    internal = 15672
    external = 15672
  }
}

resource "docker_container" "postgres" {
  name  = "postgres"
  image = docker_image.postgres.image_id

  env = ["POSTGRES_USER=user", "POSTGRES_PASSWORD=pass"]

  ports {
    internal = 5432
    external = 5432
  }
}
```

This will actually describe our terraform IaC, so our provider will be docker and the resources we want to run are `postgres:latest` and `rabbitmq:3-management` with some additional information like the ports and DB credentials.

2. Now after we have described our IaC we want to initialize it using:
   `terraform init` [command](https://developer.hashicorp.com/terraform/cli/commands/init), it will do a lot of cool stuff but let's assume it loads the above configuration and environment setup and validate it.

3. Once we have our IaC initialized, we can run them by using:
   `terraform apply` [command](https://developer.hashicorp.com/terraform/cli/commands/apply), we should now see what it is actually performing, as for our case it will be something like the below:

```text
docker_image.postgres: Refreshing state... [id=sha256:11a95ab93cf5794c4bb89ae2b7269a4663cc6696756aca8a2ce4860105184f96postgres:latest]
docker_image.rabbitmq: Refreshing state... [id=sha256:fdb605af3235aca1158ffd8650eaf89d78cd50af4df438de3a407a3fe32877c5rabbitmq:3-management]
docker_container.postgres: Refreshing state... [id=524d7994c99690550b90f1f4867f4673380402d81780b3d0e3ae56e0312cc879]
docker_container.rabbitmq: Refreshing state... [id=f0bb9923860f5f422080f6a9273263ec909887bd947d2c93805c5a077284bbed]

Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # docker_container.postgres will be created
  + resource "docker_container" "postgres" {
      + attach                                      = false
      + bridge                                      = (known after apply)
      + command                                     = (known after apply)
      + container_logs                              = (known after apply)
      + container_read_refresh_timeout_milliseconds = 15000
      + entrypoint                                  = (known after apply)
      + env                                         = [
          + "POSTGRES_PASSWORD=pass",
          + "POSTGRES_USER=user",
        ]
      + exit_code                                   = (known after apply)
      + hostname                                    = (known after apply)
      + id                                          = (known after apply)
      + image                                       = "sha256:11a95ab93cf5794c4bb89ae2b7269a4663cc6696756aca8a2ce4860105184f96"
      + init                                        = (known after apply)
      + ipc_mode                                    = (known after apply)
      + log_driver                                  = (known after apply)
      + logs                                        = false
      + must_run                                    = true
      + name                                        = "postgres"
      + network_data                                = (known after apply)
      + read_only                                   = false
      + remove_volumes                              = true
      + restart                                     = "no"
      + rm                                          = false
      + runtime                                     = (known after apply)
      + security_opts                               = (known after apply)
      + shm_size                                    = (known after apply)
      + start                                       = true
      + stdin_open                                  = false
      + stop_signal                                 = (known after apply)
      + stop_timeout                                = (known after apply)
      + tty                                         = false
      + wait                                        = false
      + wait_timeout                                = 60

      + ports {
          + external = 5432
          + internal = 5432
          + ip       = "0.0.0.0"
          + protocol = "tcp"
        }
    }

  # docker_container.rabbitmq will be created
  + resource "docker_container" "rabbitmq" {
      + attach                                      = false
      + bridge                                      = (known after apply)
      + command                                     = (known after apply)
      + container_logs                              = (known after apply)
      + container_read_refresh_timeout_milliseconds = 15000
      + entrypoint                                  = (known after apply)
      + env                                         = (known after apply)
      + exit_code                                   = (known after apply)
      + hostname                                    = (known after apply)
      + id                                          = (known after apply)
      + image                                       = "sha256:fdb605af3235aca1158ffd8650eaf89d78cd50af4df438de3a407a3fe32877c5"
      + init                                        = (known after apply)
      + ipc_mode                                    = (known after apply)
      + log_driver                                  = (known after apply)
      + logs                                        = false
      + must_run                                    = true
      + name                                        = "rabbitmq"
      + network_data                                = (known after apply)
      + read_only                                   = false
      + remove_volumes                              = true
      + restart                                     = "no"
      + rm                                          = false
      + runtime                                     = (known after apply)
      + security_opts                               = (known after apply)
      + shm_size                                    = (known after apply)
      + start                                       = true
      + stdin_open                                  = false
      + stop_signal                                 = (known after apply)
      + stop_timeout                                = (known after apply)
      + tty                                         = false
      + wait                                        = false
      + wait_timeout                                = 60

      + ports {
          + external = 5672
          + internal = 5672
          + ip       = "0.0.0.0"
          + protocol = "tcp"
        }
      + ports {
          + external = 15672
          + internal = 15672
          + ip       = "0.0.0.0"
          + protocol = "tcp"
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

it also asks for the user confirmation on what exactly is going to happen, so once we enter `yes` it will execute the above plan, which is to create both resources with our configuration. and checking the docker desktop, we will find the two images are running locally.

![terraform images](/articles/streamlining-deployment-and-scaling/postgresDB-rabbitMQ-images.png)

### Final steps

Now that we have created our resources using terraform, created our application and its docker image, we need to fix some configuration to match our setup, as our application docker image is on minikube we will need some port-forwarding and configuration changes. we are using minikube to run kubernetes locally. we will create the application image as a last step.

Navigate to ./helm/demo-chart inside the values.yml file we will change two properties:

1. repository: we will set it to the image name that we will create, for example `myimage`
2. tag: it will be an empty string at first, but since we will create the image with name `myimage` and a `tag=1.1` for example while using the mvn command above, we also need to specify the tag here, in the actual deployment on cloud, this tag should be taken automatically from generated build.

When we generated our helm chart, it is already pointing to the values.yml file to take these properties from. but we still need to change few things in the deployment.yml file, which are related to our application property such as the datasource_url since its running on minikube we will need to forward the ports to the local machine and some paths of our health and readiness to make sure that kubernetes understands when our pod is healthy and ready.

So the deployment.yml will look like this:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "testy-chart.fullname" . }}
  labels:
    {{- include "testy-chart.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "testy-chart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "testy-chart.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "testy-chart.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{.Values.image.tag}}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: SPRING_DATASOURCE_URL
              value: jdbc:postgresql://host.minikube.internal:5432/postgres
          ports:
            - containerPort: {{ .Values.service.port }}
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: {{ .Values.service.port }}
            initialDelaySeconds: 30
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: {{ .Values.service.port }}
            initialDelaySeconds: 30
            failureThreshold: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

We want to set up the environment variables needed to configure the Docker client to use the Docker daemon inside the Minikube virtual machine by executing:

```shell
eval minikube docker-env
```

now we can use the local Docker client to interact with the Minikube Kubernetes cluster, making it easier to build and deploy applications using containers directly to the Minikube cluster from our local development environment.

After we have started our minikube and our helm chart, we can now prepare our application docker image by using the plugin we mentioned earlier, we will also use a tag '1.1' for our image, we will use it later to determine which image we want to deploy.

```shell
mvn compile jib:dockerBuild -Djib.to.tags=1.1
```

lets run our application using helm, we should navigate to our main project directory and execute:

```shell
helm install myimage ./helm/demo-chart
```

This will actually create the kubernetes pod of our application on minikube and we can see that our pod is running by:

```shell
kubectl get pod
```

it will give us:

NAME READY STATUS RESTARTS AGE
myimage-demo-chart-7ff95856db-txfdz 1/1 Running 0 7s

it says ready 1/1 because kubernetes checked our health and readiness path and it returned 200, therefore, it assumes the pod is alive.
which is our application. and to be able to see the logs of our pod we can use:

```shell
kubectl logs -f myimage-demo-chart-7ff95856db-txfdz
```

and by using any client to call our endpoints we will notice the database changes and our topic on rabbitmq is storing the messages.

## Conclusion

For reference if needed, you can refer to the [github-repository](https://github.com/Ejarrar/deployment) of our project.

By combining these three powerful tools, you have a comprehensive toolkit that facilitates continuous integration and continuous deployment (CI/CD) practices. Embracing automation and infrastructure-as-code principles, your team can focus on delivering features and improvements, confident in the knowledge that the deployment process is reliable, scalable, and reproducible.

However, as with any technology stack, there are challenges to be aware of. It is crucial to invest time and effort into understanding each tool's intricacies and best practices. Ensuring your team has the necessary skills and knowledge to operate these technologies is essential to maximizing their potential.

In conclusion, embracing Kubernetes, Helm, and Terraform with your Spring Boot applications opens up a world of possibilities in modern software development. The flexibility, scalability, and automation capabilities offered by these tools contribute to improved development cycles, reduced downtime, and enhanced collaboration among team members. As you embark on your journey with these technologies, always remember to stay updated with the latest advancements and leverage community support to overcome any hurdles that may arise. Happy deploying!
