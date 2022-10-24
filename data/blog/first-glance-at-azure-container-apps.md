---
title: 'A First Glance at Azure Container Apps'
date: '2022-09-01'
tags: ['azure', 'devops', 'docker']
images: ['/articles/first-glance-at-azure-container-apps/containerapps.png']
summary: 'Azure recently launched Container Apps, Somewhere in the function-middle between Container Instances and Kubernetes Services lives this new resource type. This is a journal of a first glance on it.'
authors: ['owin-gruters']
theme: 'blue'
---

I did some testing of the relatively new Azure Container Apps. I must say I am quite enthusiastic and will probably try to use it in one of the upcoming projects we will do that are eligible for it. In my view, this would be projects that use microservices and maybe even 1 frontend and 1 API, but at least simple enough not to need AKS.

## How does is relate to other Azure services?

How Container Apps relate to other azure services like Webapps, AKS or Container Instances is written [here](https://docs.microsoft.com/en-us/azure/container-apps/compare-options#azure-container-instances), it gave me a good insight on where to use it. Basically, Container apps is a container instance on steroids including load balancing (auto)scaling, certificates+custom domains, identity, logging, Service connections (see below) and probably some other stuff.
After I did a simple tutorial with a frontend UI app + an API app and how to connect the two. It was quite easy and working like a charm.

## Service Connections

In the Azure portal I noticed it is very easy to hookup other Azure services as a 'service connection', which is in preview, but looks very promising (see screenshot with services that can be connected).

![The image shows a list of all service connection available from Container Apps.](/articles/first-glance-at-azure-container-apps/serviceconnections.png)

## NO azure managed certificates (yet)!

As for now, you can only bring your own certificate and thus custom domain. Azure managed certificates is in the making. But as frontdoor cannot do without certificates if you have more than 1 routing rule it's quite a blocker for now. (source: https://twitter.com/nthonyChu/status/1525267833856225281).

## Costs!!

Finally, I looked at the costs and was a bit amazed by the low cost of the setup. Not sure if I entirely doing the right things in the azure calculator, but it seems that for \< 2M requests per month it is free of charge. Then 0.55 cents per every extra million requests. And even if I put in quite high numbers for requests, vCPU, concurrent requests, and execution time the pricing is still enormously low compared to App Service or AKS. This is what surprised me the most.

## Some more on the calculation of the costs :)

The number of vCPU seconds = (#requests \* execution time) / concurrent requests per container app. If that’s more that 180.000 you start paying.
The denominator here is a bit tricky naming-wise. In the Azure Pricing Calculator, it seems to be the number of simultaneous requests, but actually it is the number of concurrent requests your container can manage (as autoscaling will be done if it can’t manage it).

With this calculation it pays off to do proper micro servicing, making the Apps small.

Note that the calculator does not seem to consider the idle time of an instance if you decide to have 1 instance always online. It's not really clear to me yet how long the warmup time is for the first instance to be able to have the default to 0 instances.

## To Sum up

This new Azure resource for docker containers look very promising. As container instances has very limited functionality and AKS is quite complex to master, container apps seem a very promising resource. It can be for the gamechanger for docker images, what App Services have been for webservices.

It's also still in the making. You cannot yet create managed certificates, so it's bring-your-own-for now. There will most likely be some other caveats that I have not encountered. But Microsoft is also actively developing more features and integrations, so it will only get better.