---
title: 'The Power of Basic Kubernetes: Blue-Green Releases Demystified'
date: '2025-01-14'
tags: ['kubernetes', 'devops', 'cloud-native', 'deployment', 'blue-green']
images: ['/articles/the-power-of-basic-kubernetes/blue-green-released.svg']
summary: 'Learn how to implement Blue-Green releases using basic Kubernetes resources, without additional tools like Istio.'
authors: ['dimitri-belfor']
theme: 'blue'
---

## Table of Contents

<TOCInline toc={props.toc} exclude={["Table of Contents"]} toHeading={2} />

## How did we get here?

One of my team members recently found himself working on a greenfield project that sparked his interest in Kubernetes (K8s). While attempting to clean up the project's Helm charts, he dove deep into the K8s documentation and discovered a wealth of functionality already baked into the platform. This exploration led him to appreciate the power of "basic" Kubernetes, especially when it comes to implementing deployment strategies like Blue-Green releases.

Since not everybody is born to familiar with all the features of Kubernetes, we decided to share his findings in a blog post.

# What is Kubernetes (K8s)?

Kubernetes is an open-source platform for managing containerized workloads and services. Its key features include:

- Portability: Run on any cloud provider or bare metal
- Declarative configuration: Describe the desired state, and K8s makes it happen
- Scalability: Easily scale your applications up or down

## Core Kubernetes Resources for Developers

Before we dive into Blue-Green releases, let's review some core K8s resources:

- **Clusters:** A set of worker machines (nodes) that run containerized applications.
- **Pods:** The smallest deployable units, usually containing one container or a group of tightly coupled containers.
- **Services:** An abstraction of a (set of) pods and a policy to access them.
- **ReplicaSets:** Ensures the desired number of pod replicas are running (though often managed indirectly through Deployments).
- **Deployments:** Declarative management a higher-level Kubernetes resource that manages ReplicaSets and provides declarative updates for Pods.

## Let us start with the POD

A Pod is the smallest and most fundamental deployable unit in Kubernetes. A Pod represents a single instance of a running process in your cluster.
Pods contain one or more containers, such as Docker containers. When a pod is created, it is scheduled to run on a node in the cluster. Each pod is assigned a unique IP address within the cluster, allowing the containers to communicate with each other.

POD's have a lifecycle, they can be in the following states: Pending, Running, Succeeded, Failed, Unknown.
When POD's are recreated they get a new IP address, so you can't rely on the IP address to access the pod.

### The Power of Services

So what is the benefit of using a service instead of connecting directly to a pod?
Services provide a stable endpoint for accessing pods. Like I said, when a pod is recreated the ip address changes, but the service stays the same.
There are different types of services, but the most common are ClusterIP, NodePort, and LoadBalancer.
The ClusterIp is only for usage within the kubernetes cluster, a NodePort exposes a specific port on all nodes to the outside world and a LoadBalancer service builds upon the NodePort Service by automatically provisioning an external load balancer from your cloud provider.

# Time to get our hands dirty

Enough introduction, let's dive into some action. Now if you go to https://github.com/iodigital-com/kubernetes-greenblue-workshop you can find the code we started with during the Google day.

First thing you need to do is create an environment to work with.
Our team explored various ways to run Kubernetes locally, each with its own advantages:

1. **Docker Desktop with Kubernetes**: Most of our team opted for this method, enabling the Kubernetes feature in Docker Desktop. This approach doesn't require a VM, resulting in less overhead and a smoother experience for many developers.
2. **Minikube**: A couple of team members chose Minikube, finding it relatively easy to set up. Minikube creates a VM to run a single-node Kubernetes cluster, which also works well with kubectl (the Kubernetes command-line tool).

When you did this make sure to have kubectl installed and configured.
For the Mac users that is as easy as: `brew install kubectl`.

## Building the application

There are multiple ways to build a default container image from gradle. One of them would be using the Jib plugin like below:

```kotlin
id("com.google.cloud.tools.jib") version "3.4.0"

jib {
    from {
        image = "openjdk:11-jre-slim"
    }
    to {
        image = "my-app:1.0.0"
    }
    container {
        mainClass = "io.ktor.server.netty.EngineMain"
        ports = listOf("8080")
    }
}
```

Since we are using KTOR in this example, we can use the ktor docker plugin to build the image:

```kotlin
plugins {
    alias(libs.plugins.ktor)
}

ktor {
    docker {
        localImageName.set("my-app")
        imageTag.set("1.0.0")
    }
}
```

Now to build the image you can run: `./gradlew publishImageToLocalRegistry` to build the image and push it to the local registry.
If you want to validate if the image is there you can run: `docker images` or add `| grep my-app` to filter the list.

## Now let us get started with some Kubernetes commands

First we will create a pod and a service. In the project you will find a blue-deployment.yaml and a service-node-port-blue.yaml file.

To apply the deployment and service you can run:

- `kubectl apply -f blue-deployment.yaml,service-node-port-blue.yaml`
- and check `http get localhost:30081` or `curl localhost:30081` to see if it is running

To see if the service is running can use `kubectl get services` or `kubectl get svc` for short.

- To validate if your pod started use `kubectl get pods` to check the pods.
- For deep-diving into the logs you can use `kubectl logs <pod-name>`
- so for example `kubectl logs green-deployment-c5697b5f5-fs4mz` and check the full logs

Now create the second pod and service:

- Use: `kubectl apply -f green-deployment.yaml,service-node-port-green.yaml`
- And again check if that worked: `http get localhost:30082`

If you look at the service-node-port scripts you will see the service definition helping you to access the pods from outside the cluster.

### Adding the Ingress Controller

For the next step, let's add an Ingress Controller. Ingress in Kubernetes is a resource API object that manages external access to services within a cluster, typically handling HTTP/HTTPS traffic routing.
Unlike basic Service objects that provide L4 load balancing, Ingress operates at L7 (application layer), enabling you to do more than just ip based routing.
Using an Ingress Controller enables us to route traffic based on host names, url paths, http headers, cookies or even the content type.

The most widely used Ingress Controller is the NGINX Ingress Controller. It is the best for general-purpose use cases. Other options are for example;
Traefik, HAProxy, AWS ALB Ingress (AWS Specific), Istio, Kong Ingress, Contour, Ambassador, and many more.

For this example we will setup NGINX Ingress Controller, since it is the most used for general-purpose use cases.

To deploy an ingress we will have to apply it with kubect by using the YAML that can be found on the kubernetes github.
We used the 1.12.0 release from the tag: [1.12.0](https://raw.githubusercontent.com/kubernetes/ingress-nginx/refs/heads/release-1.12/deploy/static/provider/kind/deploy.yaml).
You can do this by running: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/refs/heads/release-1.12/deploy/static/provider/kind/deploy.yaml`.

### Additional configuration

We also need to add a clusterIp service now because we're going to access them from outside

```shell
kubectl apply -f service-cluster-ip.yaml
```

```shell
kubectl apply -f ingress-single.yaml
```

```shell
http get app.localhost
```

## The Power of Simplicity

What makes this approach powerful is its simplicity. With just a few Kubernetes resources and some YAML configurations, we've implemented a sophisticated deployment strategy. This "basic" setup provides:

- Zero-downtime deployments
- Easy rollbacks
- Gradual rollout with traffic splitting
- Reduced risk in production deployments

### Step 1: Create the Blue Deployment and Service

```bash
kubectl apply -f blue-deployment.yaml,service-node-port-blue.yaml
```

Verify the deployment:

```bash
http get localhost:30081
```

### Step 2: Create the Green Deployment and Service

```bash
kubectl apply -f green-deployment.yaml,service-node-port-green.yaml
```

Verify the deployment:

```bash
http get localhost:30082
```

### Step 3: Add the NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
```

### Step 4: Create ClusterIP Services

We need to switch to ClusterIP services for use with the Ingress:

```bash
kubectl apply -f service-cluster-ip.yaml
```

### Step 5: Create the Ingress

```bash
kubectl apply -f ingress-single.yaml
```

Verify the Ingress:

```bash
http get app.localhost
```

### Step 6: Implement Canary Deployment

To demonstrate a gradual rollout, we'll use a canary deployment:

```bash
kubectl apply -f ingress-canary.yaml
```

Test the canary deployment:

```bash
for i in $(seq 1 10); do curl -is app.localhost; echo '\n------\n'; done
```

This command will show a mix of responses from both the blue and green deployments, with about 20% going to the green (canary) version.

## The Power of Simplicity

What makes this approach powerful is its simplicity. With just a few Kubernetes resources and some YAML configurations, we've implemented a sophisticated deployment strategy. This "basic" setup provides:

- Zero-downtime deployments
- Easy rollbacks
- Gradual rollout with traffic splitting
- Reduced risk in production deployments

## Conclusion

While tools like Istio can make certain tasks easier, it's crucial to understand the basic functionality that Kubernetes provides. Sometimes, you don't need additional tools to achieve the same result. Kubernetes can be quite powerful on its own, and it's very easy to try out these deployment strategies.

By mastering these fundamental concepts, you'll be better equipped to make informed decisions about when to use additional tools and when to leverage the built-in capabilities of Kubernetes.

Remember, in the world of microservices and cloud-native applications, sometimes less is more. The power of Kubernetes often lies in its basic, yet flexible, building blocks.
