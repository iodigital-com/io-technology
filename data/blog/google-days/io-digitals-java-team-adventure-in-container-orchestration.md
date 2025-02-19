---
title: 'Navigating the Kubernetes Sea: iO Digital Java Team Adventure in Container Orchestration'
date: '2025-01-31'
tags: ['kubernetes', 'devops', 'docker']
images:
  ['/articles/io-digitals-java-team-adventure-in-container-orchestration/kubenetes-workshop.png']
summary: Recently, our Java team embarked on an exciting journey into the world of Kubernetes, exploring its capabilities and potential for enhancing our development and deployment processes. This "Google Day" initiative allowed our team members to dive deep into Kubernetes, experimenting with advanced deployment techniques like A/B testing and Canary releases. Here's a recap of our adventures and discoveries.
authors: ['arno-koehler']
theme: 'beige'
serie: 'google-days'
---

![kubenetes-workshop.png](/articles/io-digitals-java-team-adventure-in-container-orchestration/kubenetes-workshop.png)

## Kubernetes

Kubernetes, also known as K8s, is an open source system for automating deployment, scaling, and management of containerized applications.
For us as developers Kubernetes is a way to declare infra as Yaml, that will be translated into:

- **Clusters:** A set of worker machines (nodes) that run containerized applications.
- **Pods:** The smallest deployable units, usually containing one container or a group of tightly coupled containers.
- **Deployments:** Declarative management of application state and rolling updates.
- **Services:** An abstraction of a (set of) pods and a policy to access them.
- **ReplicaSets:** Ensures the desired number of pod replicas are running (though often managed indirectly through Deployments).

Kubernetes offers a way of doing declarative configuration, with great portability and scalability.
All major cloud providers offer managed Kubernetes services.
Google has GKE (Google Kubernetes Engine), Azure has AKS (Azure Kubernetes Service) and Amazone has EKS (Amazon Elastic Kubernetes Service), making it easier for enterprises to adopt and maintain Kubernetes clusters.
The fact that Kubernetes is backed by the Cloud Native Computing Foundation (CNCF) and major tech companies, makes it a great choice for configuring your containers.

# The Power of Basic Kubernetes: Blue-Green Releases Demystified

So what did we look into? One of our developers recently found himself working on a greenfield project with Kubernetes (K8s), attempting to clean up the project's Helm charts.
What happened was that he dove deep into the K8s documentation and discovered a wealth of functionality already baked into the platform.
This exploration led him to appreciate the power of "basic" Kubernetes, especially when it comes to implementing deployment strategies like Blue-Green releases.

## Setting Sail: Our Kubernetes Environments

Our team explored various ways to run Kubernetes locally, each with its own advantages:

1. **Docker Desktop with Kubernetes**: Most of our team opted for this method, enabling the Kubernetes feature in Docker Desktop. This approach doesn't require a VM, resulting in less overhead and a smoother experience for many developers.
2. **Minikube**: A couple of team members chose Minikube, finding it relatively easy to set up. Minikube creates a VM to run a single-node Kubernetes cluster, which also works well with kubectl (the Kubernetes command-line tool).

## Challenges we ran into with Kubernetes

What are some typical issues we ran into during the Google day?
Let's sum it up;

1. **Docker Registry Hurdles**: Setting up a local private registry proved tricky. We faced port issues (especially with port 5000) and encountered problems with certain build tools.
2. **HTTPS Complications**: When using Maven's Jib plugin for building Docker images, we ran into HTTPS requirements. This led to some interesting discussions about secure vs. insecure registry configurations.
3. **Build Tool Discrepancies**: One team member noticed that Gradle-built images worked fine, but npm-built images caused issues with the registry.

### **1. Docker Registry HTTPS Issues**

Many team members faced HTTPS-related problems when setting up local registries. Now there are some workarounds, a quick and dirty way that was mostly used for the Google day was using an insecure registry.
To address HTTPS-related issues with local registries, you can add the change below to modify your Docker daemon configuration.

- We added the following to our Docker daemon configuration file (**`/etc/docker/daemon.json`**):

  ```json
  {
    "insecure-registries": ["localhost:5000"]
  }
  ```

- After making changes, do not forget to restart the Docker daemon.

This configuration instructs Docker to communicate with the specified registry using HTTP instead of HTTPS. It effectively bypasses certificate verification, allowing connections to the registry without requiring SSL/TLS certificates. During development you can use this quick fix to removing the need for complex certificate management.

### Do not do this on PRD!

However, I want to expres this very clearly; this solution is not suitable for production environments! For security reasons, in a production setting, unencrypted communication leaves data vulnerable to interception, potentially exposing sensitive information. Without HTTPS, there's no reliable way to verify the authenticity of the registry or the integrity of the images being pulled or pushed. Luckily many industry standards and compliance regulations mandate encrypted communication for data transfers, making insecure registries non-compliant. Furthermore, many production environments and cloud providers block non-HTTPS traffic by default, which would prevent access to insecure registries. And also note that some Kubernetes configurations are set to reject pulls from insecure sources, which could disrupt deployments.

### Side Quest: How do you securing Container Registries in Production?

I know this is a bit of a side quest, that is not related to the Google day; but it's important to address.
One should never compromise security for convenience, so in your production environment or even your test environment, you should secure your container registry. To properly address security concerns in a production environment, organizations should implement several key measures.
So please when it comes to SSL/TLS Encryption: obtain valid certificates from a trusted Certificate Authority to ensure encrypted, authenticated communication.
Next to that you might also want to implement robust user authentication and authorization mechanisms for registry access.

Now as a developer the next parts might not be in your scope but also things like network Security: firewalls, VPNs, and other security tools to protect registry access and control traffic.

Keep software updated, should be one of the many mantra's of a developer and that should also count fo the registry, next to conducting periodic security audits to maintain a strong security posture.
If you want less of these activities you could consider using cloud-provided managed container registries to offload security management, as these often include automatic SSL/TLS configuration and updates.

### **2. Performance Issues**

Back to the Google day, some team members experienced slow performance with Docker and Kubernetes.
Multiple solutions were explored to address these performance issues.

a) **Using Volume Mounts**:

- For local development, some switched to using volume mounts instead of copying files into containers.

This significantly sped up our development process, especially for interpreted languages.

b) **Optimizing Docker Images**:

- Some explored using multi-stage builds to create smaller images.

This way more attention was payed to leveraging layer caching effectively.

c) **Resource Allocation**:

- When dealing with a local kubernetes cluster you have to ensure that enough resources (CPU, memory) were allocated to Docker/Kubernetes when running on local machines.
- You can run into the situation of nodes showing 'NotReady' status or pods being evicted. This can be due to insufficient resources allocated to the cluster.
  This can also be seen when PODS suddenly die due to OOMKilled status. Network configuration is another challenge that can give developers headaches.

d) **Using a Pull-Through Cache**:

- To improve performance and avoid rate limiting issues, we set up a local pull-through cache registry that proxies requests to Docker Hub.

### **3. Networking Complexities**

To address networking problems:

a) **Using NodePort and Port Forwarding**:

- For local development, we used NodePort services or **`kubectl port-forward`** to access our applications.
- Next to that you also have your regular challenges like portconfigurations that you would also experience in a regular cloud setup.

We noticed during the workshop that managing port-numbers is one of the main 'gotchas' when communication between pods and applications is not working.

b) **Configuring DNS**:

- We ensured our local DNS was configured correctly. In some cases, using public DNS servers like Google's (8.8.8.8) helped resolve connectivity issues.

Of course there a million more things that can go wrong, but these were the main challenges we faced during the Google day.

## Every one his own adventure

When you are with a group, you do not all share the same interests and that is okay.
During a Google day we stimulate our developers to explore their own interests and that is what happened during this day.
Our team's curiosity led them down various paths. Here are some highlights of individual adventures:

1. **GitHub Pipelines and Azure Deployment**: Some developers shifted their focus to integrating Kubernetes with GitHub pipelines and deploying to Azure, applying our learnings to real-world scenarios.
2. **Talos and Home Clusters**: One team member ventured into connecting a local Talos cluster with kubectl, exploring advanced topics like Cloudflare tunnels and DNS configurations for home setups.
3. **Visualization Tools**: K8slens.dev caught the attention of one developer. This dashboard tool provides valuable insights into Kubernetes clusters, aiding in debugging and secret management.
4. **Multi-Container Setups**: Towards the end of the day, one developer advanced to a more complex setup involving three intercommunicating containers, delving into the intricacies of Kubernetes networking.

Now if you like these subjects you can connect with us on our [LinkedIn](https://www.linkedin.com/company/iodigital-com/) and we can discuss these topics further.

## Interested in what we did?

Stay tuned for our detailed article about Green-Blue deployments and Canary releases in Kubernetes.

## **Conclusion**

Our Google Day adventure into Kubernetes was both challenging and insightful.
It’s always fun to see the team’s adaptability, problem-solving skills, and passion for important technologies.
While we encountered hurdles, we did ran into learning opportunities and insights into the power and complexity of Kubernetes.
As we continue to explore and implement Kubernetes in our projects, we're excited to also realise again what we can do for our clients.
Our next Google day is coming up soon, so stay tuned for more learnings!
