---
title: 'Staying one step ahead of cyber attacks'
date: '2026-06-26'
tags: ['security', 'ssdlc', 'compliance']
images: ['/articles/ssdlc/ssdlc.webp']
summary: 'Building secure applications: the Secure Software Development Lifecycle (SSDLC)'
authors: ['owin-gruters']
theme: 'beige'
---

# Staying one step ahead of cyber attacks \- Building secure applications: the Secure Software Development Lifecycle (SSDLC)

**Hackers are energetic innovators, constantly developing and changing their methods and expanding their cyber attack capabilities. They relentlessly target business critical applications on web and mobile devices, looking for weaknesses. They want to access data, to launch ransomware attacks, to misuse infrastructure for their own purposes or simply to disrupt the target’s continuity of service through (D)Dos attacks. But what does this mean to us at iO as application creators?**

It means we need a broad range of reliable strategies to stay ahead of these security threats.

## How do we find the balance between attack prevention and acceptable risk?

At iO, we create applications for a wide range of clients with a broad scope of security breach risks. Security threat mitigation is time consuming, because it demands time and expertise from web architects, developers and testers. They need time to find, analyse, develop and crucially, to test threat mitigation.

The initial costs can be a significant part of the development budget, but when you’re talking about secure development, early stage investments are always less costly than the measures you’re forced to take when bugs emerge later in the process.

![Costs of bugs in different stages of the SDLC](/articles/ssdlc/bug costs.png)

The earlier in the development process you guarantee security, the more efficiently you can build secure applications. Secure Development has to be an integral part of every step in a project and process to work effectively. To be part of the fabric. That's why iO's Secure Software Development LifeCycle (SSDLC) is designed to be just as end-to-end as our market proposition is.

### Finding the right balance

Experience informs practice at iO. We deliver the right balance between investment in attack prevention and acceptable risk (= chance x consequence). In collaboration with our clients, we assess what kind of data is processed and stored in the system. This data is used to anticipate the negative consequences of a data exposure, both for the users and the client itself, in terms of fines and reputational damage. Risk exposure is classified using the CIA rating triad (Confidentiality, Integrity and Availability, see [here](https://www.doc.ic.ac.uk/~ajs300/security/CIA.htm) for more information) and PIA (Privacy Impact Assessment).

These evaluations are always carried out in close collaboration with our clients, and are used to set the risk classification of the project to Low, Medium or High, which in turn influences the controls we select from the Secure Software Development LifeCycle and the level in which we implement them.

## Secure Software Development LifeCycle the unshakeable foundation in all safe applications

To provide our teams with the right tools to prevent, detect, mitigate and respond to security bugs, iO created our own Secure Software Development LifeCycle.

### What is the iO SSDLC?

An SSDLC is a set of policies, best practices, tools and processes that address different challenges faced by developers at every stage of the development lifecycle. An SSDLC gives developers a structured way to think about and address the security impact in every stage of the development process.

The iO SSDLC covers 9 distinct stages of development ((Pre-)sales, Governance, Training, Requirements, Design, Implementation, Verification, Release and Operations). Every stage has controls that connect with 1 key security element. This can be a point of concern, an investigation, a (mandatory) action to create, or to give the client advice.

The classification of the level of risk in the system (Low, Medium, or High) determines exactly which controls have to be included and at which level. For Low risk developments we use a minimal set of basic controls, High risk includes all controls implemented on the highest level and Medium risk includes enhanced basic controls according to need.

## Let’s explain a little bit more about how we build highly secure software

Here are a few examples of SSDLC controls:

- **Training**  
  iO developers receive periodic secure development training. They learn about the latest and most commonly used attacks and how to defend against them in their specific expertise. They are trained in generic office security (like locking laptops, closing doors, etc), authentication techniques (like OAUTH/OIDC, securing JWT tokens), how to use (the latest) security headers properly, language specific Cross-site-scripting mitigation, securing APIs, validation and encoding, and the likes.
- **Secure development guidelines**  
  iO developers follow secure development guidelines and best practices and we are testing auto-testing as much as possible.
- **Formulating security requirements**  
  We collaborate with our clients to determine their system’s security requirements.
- **Threat modelling**  
  Where needed, we use threat modelling to identify potential threats, attacks, vulnerabilities, and countermeasures that could negatively impact our client’s businesses.
- **Security risk rating**  
  Every solution is given a security risk rating. This rating is key to deciding which controls we will implement.
- **Code Quality**  
  We check our work by doing peer reviews, static code (SAST) and dynamic application (DAST) application testing.
- **Dependency Tracking**  
  All third party libraries are periodically monitored and kept up to date using best of breed tools to automate as much as possible. We also keep on monitoring after go-live.
- **(External) PEN test**  
  Even though iO performs our own security tests using our selected tooling, PEN **(**penetration) tests are carried out by an independent party. We can help find the right partner, and actively assist the testers. We then resolve issues revealed by the PEN test, or consult with the client to assess their tolerance for acceptable risk.
- **Debugging and Proactive monitoring**  
  Proactive monitoring of the system and proper logging, monitoring and alerting during both the production and development helps with finding issues in time debugging issues.

## The iO SSDLC: a programme of constant improvement

This is just a small subset of the controls in the iO Secure Software Development LifeCycle. In total, our SSDLC consists of 34 controls at time of writing, divided over the 9 development stages. The control set is constantly improving because they’re part of every project, and this means they are in a state of permanent review. Next to that, our dedicated expert group is keeping track of new developments in the secure development and devops domains. It only gets better.

Ultimately, our goal at iO is to deliver web applications and mobile apps that are consistently secure and keep our clients ahead of the cybercriminals.

**Ready to get started with secure development?**  
Our experts can’t wait to tell you more about how we ensure security in the development process at iO.  
Contact Owin (owin.gruters@iodigital.com or +31 6 27 04 36 89)
