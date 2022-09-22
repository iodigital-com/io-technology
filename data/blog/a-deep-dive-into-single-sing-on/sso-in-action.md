---
title: 'SSO in action'
date: '2021-02-26'
tags: ['security']
summary: 'SSO solutions can be implemented to tackle a great number of use cases'
authors: ['daan-beulen', 'mark-van-der-linden']
theme: 'blue'
serie: 'a-deep-dive-into-single-sing-on'
---

In the second part of our blog series we've taken a look at some of the market leaders in the SSO space at the moment and what their products offer. In the third and final part of our blog series, we're going to be taking a look at these products in action. We'll be taking a deep dive into a couple of real, anonymized use cases that we've implemented.

We'll be covering four typical use cases:

- A start-up that needs a way to identify customers but doesn't have the time or resources to build its login and user base.
- A business-to-consumer use case where two existing portals and user bases need to be merged into one.
- A business-to-employee use case where multiple internal tools are being brought together under a single sign-on.
- A business-to-business use case where employees of a business need to get access to a portal of a different business, with smooth on and off-boarding of users.

## Start-up

A start-up company building a new application needs to provide their users with some way of authentication and being able to differentiate between users. To reduce the barrier of entry for potential new customers they want to allow logins through all the popular social identity providers. Due to being a start-up they are working with limited resources and want to focus all these resources on the core business of the app. Logins are not part of the core business of the app but are a requirement. Because of that, they are looking to use an out-of-the-box solution. Since they don't know how many users will be using the app in the near future they'd like to start small and can scale when needed.

With these requirements in mind, we'd recommend going for one of the cloud options. The cloud options are managed for you and most of them allow you to start with free options when your userbase is small but also can scale into millions of users when needed. The main requirement was that logins should be offered via Facebook, Google and Twitter. All of the cloud options have federation support and built-in connections to these social media platforms.

The start-up ended up going with Auth0 and setting it up to be able to federate between Facebook, Google and Twitter users. Their app then used the Auth0 SDKs to integrate with the Auth0 platform. The result is shown in the image below.

![Startup](/articles/sso-in-action/startup.png)

## Business-to-Consumer (B2C)

A large payment service provider that recently merged with another payment service provider needed a single sign-on solution to enable a single login for both back office systems. Each system already has an existing user base, which is linked to a database that's specific to the application that it was originally built for. On top of that, the payment service providers' platform is white-labelled, so the user base consists of multiple separated user bases.

To facilitate the SSO between those applications we decided to set up a Red Hat SSO instance that would contain the user base. The reason for this is that Red Hat SSO has been designed with multitenancy in mind which fits well with the white-labelled set-up of the existing applications. We opted to go for Red Hat SSO over Keycloak because the payment service provider we were working with is a large enterprise and needs the more hardened software and the support contracts that Red Hat SSO offers.

The first thing we did was come up with a migration strategy to be able to move the users from the existing database to Red Hat SSO. A key requirement of this strategy is that existing users should keep their existing passwords. But since we didn't have the passwords in a useable format we needed to do some prep work first. We implemented some additional code in the existing applications that generated password hashes that are compatible with Red Hat SSO. We did this by using the brief window in the login flow that a password is available in memory, allowing us to encrypt it with the second hashing algorithm. We temporarily stored these new hashes in the database next to the original password hash. Over time this allowed us to generate hashes for all active users.

Next, we refactored the current applications to enable logins through the OIDC authorization code flow with Red Hat SSO as the identity provider. On the release day of the SSO logins, we first migrated the users to Red Hat SSO using the Red Hat SSO compatible password hashes generated over the past months. Next, we deployed the application with the SSO login flows enabled. The result was SSO functionality between the two existing applications, and a framework to easily offer SSO with any future applications by leveraging Red Hat SSO while not having any impact on the active user base.

![Business-to-Consumer](/articles/sso-in-action/b2c.png)

## Business-to-Enterprise (B2E)

Most companies have a catalogue of applications and tools for their employees to use. Most of these applications need some form of authentication. These applications usually integrate with an Active Directory quite easy and thus making it easy to have one set of credentials for multiple applications. However, this only solves part of the problem. These credentials will have to be provided every time the user wants to log in to one of the applications. The SSO component is missing as there is no single point where the session of the user is being held.

This can be solved by setting up Keycloak as a service provider and federating the users from the internal Active Directory. With this setup, employees can still use their single set of credentials but only have to provide it once as Keycloak will now manage the authenticated session. All applications that support either SAML, OAuth or OpenIDConnect can be connected to Keycloak and have it act as the authentication mechanism.

![Business-to-Enterprise](/articles/sso-in-action/b2e.png)

## Business-to-Business (B2B)

A financial and retail technology company developed an application that is accessed by internal employees and external companies. The problem with this setup is that the responsibility of the external user accounts lies with the application. This causes issues when, for instance, an employee leaves an external company without notifying the maintainers of the application. The employee might be offboarded at the external company but the account might never be removed from the application. Furthermore, with a lot of external companies connected, the number of roles and groups was getting too much to properly maintain. Then there is also the fact that the external employees have to remember another set of credentials for an application.

To solve these issues Red Hat SSO is set up which acts as a bridge between the application and the user bases of these external companies. First, the authentication was replaced by the standard protocol OpenID Connect which simplified the login mechanism and removed the responsibility of authenticating users from the application. Next up, the external company user bases were connected via the necessary protocols. With this in place, an employee of an external company is redirected to their identity provider if they want to access the application. Once redirected, the user will be taken to the familiar company login form and must provide its credentials. Once the user has successfully authenticated against their company identity provider, the user is redirected back to Red Hat SSO. A token of proof is sent to Red Hat SSO to validate that the user has indeed successfully authenticated. The credentials of the user will never be communicated back to the Red Hat SSO solution.

With this mechanism in place, users will not be able to access the application anymore once their account has been offboarded at the external company. The responsibility of authenticating and checking if the user account is still active now lies with the external company itself. In addition, the roles and groups associated with this user account can also be managed by external companies. These roles and groups can be received by Red Hat SSO once a user is redirected back from the external identity provider. The roles and groups are then mapped by Red Hat SSO to generic roles and groups the the application knows.

![Business-to-Business](/articles/sso-in-action/b2b.png)

## Summary

In this article, we've looked at SSO solutions in action in four different use cases. We hope that this gives you some insight into the power of SSO and the issues that it can solve.

This was the final article of our blog series about SSO, we hope you've enjoyed the series!
