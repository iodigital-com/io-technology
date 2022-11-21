---
title: 'An overview of SSO products'
date: '2020-10-15'
tags: ['security']
summary: 'What products provide out-of-the-box SSO solutions and how do they differ from each other?'
authors: ['daan-beulen', 'mark-van-der-linden']
theme: 'blue'
serie: 'a-deep-dive-into-single-sing-on'
canonicalUrl: 'https://www.iodigital.com/en/history/isaac/an-overview-of-sso-products'
---

After a technical introduction to Single Sign-On, we're going to take a look at some of the SSO products available in the space in the second part of the series. Comparing them on a couple of key functionalities that are important when choosing a product to work with. Our aim is to provide pointers that can be used when making your choice for a SSO solution, regardless of the product you're currently looking at. We'll be taking a look at the following products:

- Ping Identity
- Auth0
- Keycloak
- Amazon Cognito
- Okta

We'll be comparing these products on the following functionalities:

- Compliance
- Extensibility
- Protocol support
- Pricing
- Federation support
- Integration support
- MFA support

### Ping Identity

![Ping Identity logo](/articles/an-overview-of-sso-products/ping-identity-logo.png)

Ping Identity is a modular platform consisting of various products that each offer parts of the typical functionality expected from an identity and access management platform. This gives you the option to only run the parts that you need, as opposed to having to run a full platform when you're only really interested in using a small part of it. If you're running multiple products of the platform you're guaranteed to have compatibility and seamless integration through pre-build connectors. The table below contains an overview of the most important products and what they do.

| Product       | Functionality                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PingFederate  | Compliant SAML / OAuth2 / OpenID Connect server. Offers user federation and sign on capabilities. FAPI compliant                                            |
| PingDirectory | LDAP compliant storage intended for storing enterprise scale user bases                                                                                     |
| PingAccess    | Functions as an API Gateway. Can also handle authentication and transform authentication information in order to provide SSO capabilities to legacy systems |
| PingOne       | Cloud SSO and directory platform                                                                                                                            |

### Auth0

![Auth0 logo](/articles/an-overview-of-sso-products/auth0-logo.png)

Auth0 is a cloud-native solution that offers authentication-as-a-service functionality and offers a complete identity and access management platform. Generally speaking, Auth0 runs in their public cloud, however they also offer options to host it in a private cloud. This means that you get an isolated instance of Auth0 where none of your software and infrastructure is shared with other tenants.

### Keycloak

![Keycloak logo](/articles/an-overview-of-sso-products/keycloak-logo.png)

Keycloak is an open-source project that aims to provide a full identity and access management platform. It has a large community backing it and is constantly being developed by the community. Keycloak has been picked up by Red Hat and an enterprise version of Keycloak, Red Hat SSO, is available through them. The enterprise variant offers long-term support for its versions being released, whereas Keycloak does not. This means that you will receive security patches for older versions of Red Hat SSO, and you don't have to upgrade to newer versions as often. Currently Keycloak is mostly used as an on-premise solution, however the Keycloak project is currently working towards cloud-native support as well.

### Amazon Cognito

![Amazon Cognito logo](/articles/an-overview-of-sso-products/amazon-cognito-logo.png)

Amazon Cognito is a complete identity and access management platform available on AWS. As such it's a cloud-native solution that integrates well with other AWS services. For example, you can use Amazon SNS to send out one-time password codes and Amazon Lambda to trigger custom code during login flows. Amazon Cognito also offers advanced security features such as risk-based adaptive authentication and compromised credentials protection. Amazon Cognito can also keep metrics and data in Amazon CloudWatch for important events such as sign-ups, sign-ins, risk scores and the results of sign-in attempts and second-factor challenges.

### Okta

![Okta logo](/articles/an-overview-of-sso-products/okta-logo.jpg)

Okta is a cloud-native solution that focuses on easy integration with more than 6500 different integrations from cloud to on-premise products. Integrations range from identity providers and directories like Google, Azure Active Directory and LDAP to applications like Slack, Zoom, Salesforce and Atlassian. It's a complete identity and access management platform with features like multi-factor authentication, API management, universal directory and extensive audit logging capabilities. Every feature can be subscribed to separately which means you only pay for the features your organization needs.

## Compliance

Depending on the field you're working in and the customer data that will be stored in the identity and access management solution, you may have to be compliant with certain regulations. SSO products are often compliant with some of these regulations, lowering the burden on your development team since they'll no longer have to deal with it. This can be an important driver for deciding on a solution. We've created an overview of the subset of products we've selected.

Note that in this overview we're comparing compliance with regulations when the solution is hosted in a managed environment. Keycloak is exclusively a self-hosted solution so it cannot guarantee compliance. For that reason, Keycloak has been excluded from the overview.

| Ping Identity                         | Auth0                                                                                                                 | Amazon Cognito                                                                                 | Okta                                                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ISO27001 <br /> SOC 2 <br /> CSA STAR | ISO27001 <br /> ISO27018 <br /> HIPAA BAA <br /> EU - US Privacy Shield Framework <br /> Gold CSA STAR <br /> PCI-DSS | ISO27001 <br /> ISO27017 <br /> ISO27018 <br /> ISO9001 <br /> HIPAA <br /> PCI-DSS <br /> SOC | ISO27001 <br /> ISO27017 <br /> ISO27018 <br /> SOC 2 Type II <br /> CSA STAR <br /> PCI-DSS <br /> SOX <br /> HIPAA |

A few things immediately jump out here. Keycloak does not offer any support for compliancy with regulations and instead leaves it up to the user of their platform. The next one that jumps out is that the cloud-native platforms, Auth0, Amazon Cognito and Okta, offer the most with regards to compliancy, including PCI-DSS which is a big one if you're in finances or handling card data and HIPAA which is important for the medical and insurance fields. The reason that the cloud platforms can do this is that the data is stored in environments that are controlled by the suppliers, so they can take all the required actions with regards to the data at rest and in transit through the system. The last thing that's important to note is that Ping Identity offers FAPI compliance, which is important when dealing with PSD2.

## Extensibility

While out-of-the-box solutions try to offer a wide variety of functionality and connections to external systems for data sources, federation, etc. It's impossible to be able to catch all use cases. To resolve this, most platforms offer some way to create custom extensions. These custom extensions can hook into the solution to deal with use cases that cannot be dealt with by the build-in functionality. See the table below for an overview of the ways that the products we've selected can be extended.

|              | Ping Identity                                                         | Auth0                                            | Keycloak                                                                               | Amazon Cognito                                   | Okta                                             |
| ------------ | --------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Language** | Java                                                                  | JavaScript / NodeJS                              | Java                                                                                   | JavaScript / NodeJS                              | -                                                |
| **Hooks**    | Authentication <br /> Themes <br /> OTP <br /> Datasource connections | Pre and post authentication hooks in login flows | Authentication <br /> Themes <br /> OTP <br /> Role mappers <br /> Token claim mappers | Pre and post authentication hooks in login flows | Pre and post authentication hooks in login flows |

What stands out here is that the cloud-native options have limited extensibility. They only offer some predefined hooks in flows where scripts can be executed or allow you to create limited custom integrations. The on-premise options offer more extensibility, generally speaking in the form of SDKs that offer interfaces for certain functionality. Developers are then free to implement those and can load their code into the runtime of the server through dynamic class loading. The result is that your implementations show up as configurable options on administration screens.

## Protocol Support

In the first post of the series, we've already gone over the most prominent protocols that are used for SSO in today's landscape. Here we provide an overview of what protocols are supported by each product.

| Protocol     | Ping Identity | Auth0 | Keycloak | Amazon Cognito | Okta |
| ------------ | ------------- | ----- | -------- | -------------- | ---- |
| **OAuth**    | ❌            | ✔️    | ❌       | ❌             | ❌   |
| **OAuth2.0** | ✔️            | ✔️    | ✔️       | ✔️             | ✔️   |
| **OIDC**     | ✔️            | ✔️    | ✔️       | ✔️             | ✔️   |
| **SAML**     | ✔️            | ✔️    | ✔️       | ✔️             | ✔️   |

As expected, all platforms support all major protocols. One thing to note here is that only Auth0 still supports OAuth, however it's not relevant because OAuth has been replaced by OAuth2.0 for a while now and shouldn't be used anymore.

## Pricing

### Ping Identity

Ping Identity requires you to buy licenses per product in their catalogue. The prices per license are not publicly defined on their website. To know the costs you'll have to request a quote. Generally speaking, the costs are based on the number of expected users managed by the solution.

### Auth0

Auth0 uses a freemium model. It's possible to use Auth0 for free if you have a relatively small user base (up to 7000 users) and don't need any of the advanced features like role management, customized emails and log retention. Next to the free plan there are two premium plans that do offer the advanced features. Here the pricing is defined based on the amount of active users. A user is considered active if they've logged in at least once for the month. The pricing for the pro plans is clearly defined on Auth0's website. Finally there's an enterprise variant. The enterprise variant offers a high SLA environment with enterprise grade support, compliancy with various standards and more extensive log retention. In order to know the pricing of the enterprise version, you have to request a quote.

### Keycloak

Keycloak is an open-source solution and as such is free to use. The enterprise variant of Keycloak, Red Hat SSO, has its pricing based on the number of CPU cores that are running the software. This is a common pricing model for Red Hat products.

### Amazon Cognito

Amazon Cognito charges per monthly active user, similar to Auth0 a user is only considered active if they've logged in at least once that month. The first 50K monthly active users are free, and the first 50 monthly active users federated through federation are free. After these amounts, there's a cost per monthly active user that scales down the more monthly active users you have. A similar scaling pricing model is used for the additional security features that Amazon Cognito offers. For the advanced security features, there is no pricing difference between federated and regular users.

### Okta

Okta has separate pricing for workforce identity and customer identity. In the case of workforce identity, you pay a fixed price per user per month. Each feature is priced separately, and you can pick and choose the features that you need for your specific use case. Volume discounts become available at 5000+ users. Here the pricing is per user, regardless of if they're active or not. There is a trial option available for the workforce identity solution.

The Customer identity product has three editions: developer, one app and enterprise. The developer edition is free for up to 1000 monthly active users, with the price slowly going up as you need more users. The developer edition only offers basic SSO functionality and doesn't have the option of installing addons. The developer edition also has a cap of 50000 monthly active users and only offers support through email. The one app solution and the enterprise solution offer options that allow for unlimited monthly active users and have the option of installing addons. Next to that, they both have more extensive support options like the ability to call someone. The only difference between one app and enterprise is that the one app edition has a limit of 5 OIDC clients, and the enterprise edition has no cap on the allowed clients. Pricing of the one app and enterprise editions is based on a quote, but a ballpark figure is given on Okta's website.

Addons for the customer identity product are things like multi-factor authentication, API access management, B2B integration, SSO integrations and more.

### Conclusion

As we can see each product has its unique way of pricing but generally based on the same principles. The cloud variants, Auth0, Okta and Amazon Cognito, allow you to start for free and start charging per user after a certain threshold has been reached, after that the pricing per additional user is well defined. Ping Identity and Auth0 offer enterprise variants that require you to request a quote. Generally speaking, though the costs are then again based on the number of users. Keycloak stands out here since it's an open-source product and can be used for free. The enterprise version of Keycloak, Red Hat SSO, also stands out because it's the only enterprise option that doesn't charge per monthly active user, but by CPU core instead. Okta is unique because it allows you to pick and chose the components that you need ensuring that you only pay for what you need.

## Federation Support

In today's landscape, it's common to allow consumers to log in using one of their already existing accounts like their Google, Facebook or Active Directory account. This is called user federation. With federation support, we're taking a look at to which extent the products support logging in with already existing accounts.

| Feature                                                    | Ping Identity | Auth0 | Keycloak | Amazon Cognito | Okta |
| ---------------------------------------------------------- | ------------- | ----- | -------- | -------------- | ---- |
| **Out of the box connections**                             | ✔️            | ✔️    | ✔️       | ✔️             | ✔️   |
| **Custom connections via portals**                         | ✔️            | ✔️    | ✔️       | ✔️             | ✔️   |
| **Custom connections via SDK implementations**             | ✔️            | ❌    | ✔️       | ❌             | ❌   |
| **Marketplace with additional out of the box connections** | ❌            | ❌    | ❌       | ❌             | ❌   |

All products offer support for federation through out-of-the-box connections. These are available for all the major players in the industry, like Google, Facebook, Twitter and LDAP. They also all offer support for configuring custom connections to identity providers that implement the OAuth2.0, OIDC or SAML protocols. The on-premise solutions, Ping Identity and Keycloak, also offer the option to build custom connections to other systems you want to federate with even if these systems don't implement one of the SSO protocols through SDKs. Finally, Ping Identity and Okta also offer a marketplace with connections to various identity providers allowing you to offer the option to log in with for example AWS, Sharepoint, Slack and more.

## Integration Support

Setting up the SSO platform is only half of the journey. The next step is integrating your applications with the SSO platform. We see integration support as "how easy is it to integrate the platform into my application". We think this is an important indicator when selecting an SSO product since good integration support can save you loads of time and will keep your developers happy. We've taken a look at SDKs provided by each product.

|                           | Ping Identity               | Auth0                                                                                   | Keycloak               | Amazon Cognito                            | Okta                                                                                                                                               |
| ------------------------- | --------------------------- | --------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vendor supported SDKs** | Java <br /> .NET <br /> PHP | JavaScript <br /> iOS <br /> Android <br /> .NET <br /> PHP <br /> NodeJs <br /> Python | Java <br /> Javascript | JavaScript <br /> iOS <br /> React Native | JavaScript <br /> iOS <br /> Android <br /> .NET <br /> PHP <br /> NodeJs <br /> Python <br /> Go <br /> Angular <br /> Vue.js <br /> React Native |

While the language support of SDKs may seem limited, it's important to note that all products implement the SSO protocols mentioned and there are loads of generic libraries for OAuth2.0/OIDC and SAML out there for each language. All of these should also work with these products. All products are also documented reasonably well and provide enough support to integrate easily.

## MFA Support

The final indicator we'll be looking at is the multi-factor authentication support offered by the products. People expect to have the option to use multi-factor authentication nowadays and regulations require it to be in place. Because of that, it's important to know what options are available when selecting a product.

| Ping Identity                                                        | Auth0                                                                                               | Keycloak                                          | Amazon Cognito              | Okta                                                                                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| OTP <br /> Marketplace <br /> Extendable with custom implementations | OTP <br /> SMS verification <br /> Email verification <br /> Push notifications <br /> DUO Security | OTP <br /> Extendable with custom implementations | OTP <br /> SMS verification | OTP SMS verification <br /> Email verification <br /> Push notifications <br /> FIDO2 (WebAuthn) |

All products support MFA through one-time passwords via google authenticator or similar apps. Things to note here are that Keycloak and Ping Identity allow you to write custom MFA implementations. Ping Identity also offers a marketplace with many MFA implementations. This includes features like SMS, push notifications, passwordless logins and more. Okta offers all of these features out of the box which makes them more easily accessible.

## Summary

In this blog, we've looked at five SSO solutions and we've compared them on some key functionalities that are relevant when selecting a product to integrate with. With this, we also hope that we've given you some criteria that you can use to determine if a product is a good fit for you even if you're not looking at SSO solutions on our list.

In the next part of our series, we'll show the products in action as we make a deep dive into some live SSO use cases that we've tackled using these products.
