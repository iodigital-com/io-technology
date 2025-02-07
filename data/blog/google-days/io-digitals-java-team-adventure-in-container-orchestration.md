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

# Navigating the Kubernetes Sea: iO Digital's Java Team's Adventure in Container Orchestration

At iO Digital, our consultancy team is always on the cutting edge of technology. Recently, our Java team embarked on an exciting journey into the world of Kubernetes, exploring its capabilities and potential for enhancing our development and deployment processes. This "Google Day" initiative allowed our team members to dive deep into Kubernetes, experimenting with advanced deployment techniques like A/B testing and Canary releases. Here's a recap of our adventures and discoveries.

## What's Kubernetes, Anyway?

Before diving into our team's experience, let's briefly explain what container orchestration is and why Kubernetes stands out in this field. Container orchestration is the automated process of managing, scaling, and maintaining containerized applications. It's like having a smart conductor for your software orchestra, ensuring all parts work harmoniously together. This is where Kubernetes shines. As a leading container orchestration platform, Kubernetes offers remarkable flexibility - it can run anywhere, be it in the cloud, on-premises, or in hybrid environments. Its extensibility allows it to adapt to a wide range of use cases, from simple web applications to complex microservices architectures.

Moreover, Kubernetes boasts a large and active community, constantly improving the platform and providing support. This combination of versatility, power, and community backing makes Kubernetes an attractive choice for organizations looking to streamline their containerized deployments.

## Setting Sail: Our Kubernetes Environments

Our team explored various ways to run Kubernetes locally, each with its own advantages:

1. **Docker Desktop with Kubernetes**: Most of our team opted for this method, enabling the Kubernetes feature in Docker Desktop. This approach doesn't require a VM, resulting in less overhead and a smoother experience for many developers.
2. **Minikube**: A couple of team members chose Minikube, finding it relatively easy to set up. Minikube creates a VM to run a single-node Kubernetes cluster, which works well with kubectl (the Kubernetes command-line tool).

## Challenges in the Kubernetes Sea

As with any exploration into new territory, we encountered some challenges:

1. **Docker Registry Hurdles**: Setting up a local private registry proved tricky. We faced port issues (especially with port 5000) and encountered problems with certain build tools.
2. **HTTPS Complications**: When using Maven's Jib plugin for building Docker images, we ran into HTTPS requirements. This led to some interesting discussions about secure vs. insecure registry configurations.
3. **Build Tool Discrepancies**: One team member noticed that Gradle-built images worked fine, but npm-built images caused issues with the registry.

## **Challenges in the Kubernetes Sea and Their Solutions**

As with any exploration into new territory, we encountered some challenges. Here's what we faced and how we overcame them:

### **1. Docker Registry HTTPS Issues**

Many team members faced HTTPS-related problems when setting up local registries. Now there are some workarounds, a common used one for the Google day was using an insecure registry.

### **Using an Insecure Registry**

To address HTTPS-related issues with local registries, some team members used the insecure registry option by adding to their Docker daemon configuration.

- We added the following to our Docker daemon configuration file (**`/etc/docker/daemon.json`**):

  ```json
  {
    "insecure-registries": ["localhost:5000"]
  }
  ```

- After making changes, we restarted the Docker daemon.

This configuration instructs Docker to communicate with the specified registry using HTTP instead of HTTPS. It effectively bypasses certificate verification, allowing connections to the registry without requiring SSL/TLS certificates. This approach simplifies local development by removing the need for complex certificate management in non-production environments.

### Not suitable for production environments

However, this solution is not suitable for production environments for security reasons. In a production setting, unencrypted communication leaves data vulnerable to interception, potentially exposing sensitive information. Without HTTPS, there's no reliable way to verify the authenticity of the registry or the integrity of the images being pulled or pushed. Many industry standards and compliance regulations mandate encrypted communication for data transfers, making insecure registries non-compliant. Furthermore, many production environments and cloud providers block non-HTTPS traffic by default, which would prevent access to insecure registries. Lastly, some Kubernetes configurations are set to reject pulls from insecure sources, which could disrupt deployments.

### How to do this on production

To properly address these issues in a production environment, several measures should be implemented. First and foremost, valid SSL/TLS certificates should be obtained from a trusted Certificate Authority for your registry. This ensures encrypted, authenticated communication. Implementing proper user authentication and authorization for registry access adds an extra layer of security. Network security measures such as firewalls, VPNs, or other tools should be used to protect registry access. Regular updates to the registry software and periodic security audits help maintain a robust security posture. For organisations looking to minimise direct management of these security aspects, using cloud-provided managed container registries can be an excellent option, as these services often handle security and SSL/TLS configuration automatically.

By taking these steps, organisations can ensure secure, compliant, and reliable container image management in their production environments, mitigating the risks associated with insecure registry configurations used in development settings.

### **2. Performance Issues**

Some team members experienced slow performance with Docker and Kubernetes. We implemented the following optimizations:

a) **Using Volume Mounts**:

- For local development, we switched to using volume mounts instead of copying files into containers.
- This significantly sped up our development process, especially for interpreted languages.

b) **Optimizing Docker Images**:

- We started using multi-stage builds to create smaller images.
- We paid more attention to leveraging layer caching effectively.

c) **Resource Allocation**:

- We ensured that enough resources (CPU, memory) were allocated to Docker/Kubernetes when running on local machines.

d) **Using a Pull-Through Cache**:

- To improve performance and avoid rate limiting issues, we set up a local pull-through cache registry that proxies requests to Docker Hub.

### **3. Networking Complexities**

To address networking problems:

a) **Using NodePort and Port Forwarding**:

- For local development, we used NodePort services or **`kubectl port-forward`** to access our applications.

b) **Configuring DNS**:

- We ensured our local DNS was configured correctly. In some cases, using public DNS servers like Google's (8.8.8.8) helped resolve connectivity issues.

## Diverse Explorations

Our team's curiosity led them down various paths:

1. **GitHub Pipelines and Azure Deployment**: Some developers shifted their focus to integrating Kubernetes with GitHub pipelines and deploying to Azure, applying our learnings to real-world scenarios.
2. **Talos and Home Clusters**: One team member ventured into connecting a local Talos cluster with kubectl, exploring advanced topics like Cloudflare tunnels and DNS configurations for home setups.
3. **Visualization Tools**: K8slens.dev caught the attention of one developer. This dashboard tool provides valuable insights into Kubernetes clusters, aiding in debugging and secret management.
4. **Minikube Workarounds**: A team member using Minikube found creative solutions to access their application by changing the service type to NodePort.
5. **Multi-Container Setups**: Towards the end of the day, one developer advanced to a more complex setup involving three intercommunicating containers, delving into the intricacies of Kubernetes networking.

## **Key Takeaways and Best Practices**

1. **Local Development Flexibility**: Kubernetes can be run locally in various ways, each with its pros and cons. This flexibility allows developers to choose the best setup for their needs.
2. **Registry Importance**: A properly configured container registry is crucial for smooth Kubernetes operations. Our team's struggles highlight the need for careful setup and consideration of security protocols.
3. **Networking Complexities**: As we moved to more complex setups, the importance of understanding Kubernetes networking became evident.
4. **Tooling Ecosystem**: Tools like k8slens.dev demonstrate the rich ecosystem around Kubernetes, offering valuable insights and management capabilities.
5. **Consistent Environment**: We're considering using tools like Vagrant or a standardized Docker development environment to ensure consistency across team members' setups.
6. **Documentation**: We've started creating detailed documentation of our local setup process, including troubleshooting steps for common issues.
7. **CI/CD Integration**: We're implementing CI/CD pipelines that mirror our local development environment to catch issues early.
8. **Regular Updates**: We've committed to keeping Docker, Kubernetes, and related tools updated to benefit from bug fixes and performance improvements.
9. **Alternative Tools**: We're exploring tools like Skaffold for streamlining our local Kubernetes development workflow.

## **Conclusion**

Our Google Day adventure into Kubernetes was both challenging and insightful. It’s always fun to see the team’s adaptability, problem-solving skills, and passion for important technologies. While we encountered hurdles, we did ran into learning opportunities and insights into the power and complexity of Kubernetes.

As we continue to explore and implement Kubernetes in our projects, we're excited to also realise again what we can do for our clients. From improved deployment strategies to more resilient and scalable applications, Kubernetes is set to play a significant role in our future developments.

Our next Google day is coming up soon, so stay tuned for more learnings!
