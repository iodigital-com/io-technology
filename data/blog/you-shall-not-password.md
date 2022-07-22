---
title: 'You shall not Password!'
date: '2022-07-22'
tags: ['security']
images: ['/articles/you-shall-not-password/keys.jpg']
summary: "Isn't it weird that we have to come up with a phrase and share it with a server to protect our account?"
authors: ['mark-van-der-linden']
theme: 'blue'
---

Keeping dozens of accounts safe from all kinds of websites and services has become too difficult. All these accounts require a password which needs to be more complex by the day. You start using a password manager because you can't remember all of them or worse, use the same password everywhere. All these passwords end up in databases and if you are unlucky, on leaked password lists online. The question we should ask ourselves is: why do we still entrust the key to our account to some third party? Is there a way to protect our accounts without having to share our secret?

## SMS, email & apps

The simplest form of authenticating a user without a password is by including a separate system that the user can access. Once the user provides their username during the login flow, an email or SMS is sent with a one-time code that they must provide to successfully log in.

A similar option is to generate a so-called magic link and deliver it in the form of an email to the user. You click on the link within the email and are immediately logged into the platform.

There could also be the option for the user to install the mobile application of the service to their phone and act as an authenticator by receiving a push notification while performing the login.

These options seem straightforward but do have some side effects. They require the user to provide additional personal details like a phone number or install an additional app on their phone. Magic link emails can turn up in spam folders and the email service is probably also protected with a password, so aren’t we just delegating the issue towards another service?

The biggest problem however is that these mechanisms aren’t part of any standardized protocol. This results in multiple variants of the implementation and thus reinventing the wheel every time with the consequence of creating security issues. This also doesn’t incentivize identity providers to support these functionalities out of the box.

## Web Authentication

The FIDO Alliance is an association that has a clear goal: creating standards that help reduce the over-reliance the world has on passwords. With that in mind, the alliance created the FIDO protocol. This protocol allows users to authenticate with a FIDO-complaint device such as physical security keys. Yubikeys are a popular example of such devices. These keys could for example connect to your laptop via USB and allow for a passwordless login to your Windows account. Together with the W3C they have taken it a step further and introduced the FIDO2 protocol. This protocol consists of the Web Authentication (WebAuthn) specification and Client to Authenticator Protocol (CTAP).

WebAuthn provides an API for the browser to communicate with two types of authenticators:

**Platform authenticators** leverage the capabilities of the device itself and provide a way for the user to safely prove their identity. This mostly comes down to biometrics like fingerprint or face recognition.

![Platform authenticators](/articles/you-shall-not-password/platform-authenticators.svg)

**Roaming authenticators** consists of physical hardware that is in the possession of the user. These can communicate with the device via Bluetooth, NFC, or USB.

![Roaming authenticators](/articles/you-shall-not-password/roaming-authenticators.svg)

Having multiple options allows for flexibility for the user but also allows for broader support of different kinds of devices. For instance, not all devices support biometrics but might have Bluetooth or a USB port to use a physical security key. A list of platform and browser combinations with both platform and roaming authenticators can be found on the following [website](https://webauthn.me/browser-support).

With the help of Google, Mozilla, Microsoft and Apple, the specification has become supported in all modern browsers which makes this method of authentication broadly available due to almost every device running a browser these days. On top of that, WebAuthn is based on public key cryptography. For every account on a website or service, a keypair is created. The private key stays on the device, and the public key is shared with the third party. This eliminates sharing our secret! During the creation of the keypair, the domain of the website is also part of the parameters. This is a very important parameter because it binds the key to a specific domain which makes phishing attacks impossible.

### Registration and Authentication

For a user to start using their authenticator for authentication, registration must first take place. The server sends a challenge that the client must send back in a signed format, to mitigate replay attacks. Once the challenge is received, the user is prompted to choose an authenticator. This prompt is triggered by calling the designated method in the WebAuthn API. This API directly communicates with the browser to determine the available authenticators. Once an authenticator is chosen and the necessary steps have been taken by the user, like a biometric check, a keypair is created. The private key is stored on the user’s device and is used to sign the challenge. The public key and signed challenge are sent to the server. The server validates the request and is responsible for storing the public key with the user’s account.

![Registration](/articles/you-shall-not-password/registration.svg)

Once the user has registered and starts the authentication process to log in, the server once again starts with the challenge. The WebAuthn API is invoked again by the browser, the user performs the biometric check once again and the challenge is signed with the private key on the device. The challenge is sent to the server and is validated with the stored public key of the user.

![Authentication](/articles/you-shall-not-password/authentication.svg)

## Benefits and challenges

Implementing WebAuthn has multiple advantages over passwords in terms of security. For one, the user can’t decide to re-use a password or use one that might have been leaked online. More importantly, the server will never have any kind of credential stored except for the public key. This means that if the database is ever exposed, it would only reveal that public key which is of no use to anyone. The attacker will have to go after the user’s key by accessing the device of that user instead of a server with the passwords of all users. This makes it less interesting for a malicious party. In addition, while creating the key pair, it's linked to a specific domain which makes it impossible for phishing practices.

Another benefit is that WebAuthn is a standardized protocol. With that, identity providers have already started supporting passwordless out of the box. Developers can configure this feature in identity providers like Auth0, Okta or Keycloak without having to write a single line of code. Standardization also brings SDKs which makes it that much easier for developers to implement the protocol if they don’t use an identity provider product.

There are however some things to consider when providing this functionality to your users. Like any other authentication options that revolve around another piece of hardware, like OTP, there is the matter of losing your device. For that, you could fall back on the email address of the user to start registration of a new authenticator or make sure a user registers multiple authenticators.

## Way forward

Even though there is wide support for Web Authentication, it's not supported by all devices and some users still value the importance of a password. This will take time and means we can’t get rid of passwords together (yet!). However, this shouldn’t stop developers from giving the user the choice of enabling it.
You can also provide it as an option for a 2nd-factor authentication. The user can still register with a password but with the added protection of the 2nd factor. This way the user gets to experience how easy the flow is and might think twice next time they have to provide a password for yet another account.
To get started with Web Authentication go have a look at the [WebAuthentication Guide](https://webauthn.guide/).
