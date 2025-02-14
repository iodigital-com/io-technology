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

# The Power of Basic Kubernetes: Blue-Green Releases Demystified

## Introduction

As a seasoned Java developer turned technical writer, I recently found myself working on a greenfield project that sparked my interest in Kubernetes (K8s). While attempting to clean up the project's Helm charts, I dove deep into the K8s documentation and discovered a wealth of functionality already baked into the platform. This exploration led me to appreciate the power of "basic" Kubernetes, especially when it comes to implementing deployment strategies like Blue-Green releases.

## What is Kubernetes (K8s)?

Kubernetes is an open-source platform for managing containerized workloads and services. Its key features include:

- Portability: Run on any cloud provider or bare metal
- Declarative configuration: Describe the desired state, and K8s makes it happen
- Scalability: Easily scale your applications up or down

## Core Kubernetes Resources for Developers

Before we dive into Blue-Green releases, let's review some core K8s resources:

- **Clusters:** A set of worker machines (nodes) that run containerized applications.
- **Pods:** The smallest deployable units, usually containing one container or a group of tightly coupled containers.
- **Deployments:** Declarative management of application state and rolling updates.
- **Services:** An abstraction of a (set of) pods and a policy to access them.
- **ReplicaSets:** Ensures the desired number of pod replicas are running (though often managed indirectly through Deployments).

### The Power of Services

Q: What's the benefit of using a service instead of connecting directly to a pod?

A: Services provide a stable endpoint for accessing pods, which can be ephemeral. They also enable load balancing and service discovery within the cluster.

## Kubernetes Ingress

An Ingress is an API object that manages external access to services within a cluster, typically via HTTP or HTTPS. It acts as a smart router for your cluster.

## Blue-Green Deployment Demo

Let's walk through a Blue-Green deployment using basic Kubernetes resources. This demo will show how powerful K8s can be without additional tools like Istio.

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
