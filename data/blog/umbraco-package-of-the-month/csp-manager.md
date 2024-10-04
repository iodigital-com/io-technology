---
title: 'Umbraco package of the month: CSP Manager'
date: '2024-10-04'
tags: ['umbraco', 'csp']
summary: 'Looking at CSP Manager that lets you control the CSP from Umbraco'
authors: ['jeroen-van-kempen']
serie: umbraco-package-of-the-month
---

This month, I’m exploring the “Umbraco.Community.CSPManager” package, which allows you to control the Content Security Policy (CSP) headers directly from Umbraco. With this package, you no longer need to deploy the entire application just to add a single line to the CSP.

## How It Works

After installation, you'll find a new tab named “CSP Manager” within Umbraco. The CSP Manager tab displays the sources and settings for both your front-end and back-end applications. Here, you can manage your CSP configurations and settings for reporting

![The view of the configuration of the CSP](/articles/umbraco-package-of-the-month/csp-manager/CSP_View.png)

_Figure1: The view of the configuration of the CSP_

![The view of the settings of the CSP](/articles/umbraco-package-of-the-month/csp-manager/Settings_View.png)

_Figure2: The view of the settings of the CSP_

Access to this tab can be configured via user groups so clients can be kept away from it.
Additionally, there's an “Evaluate” tab that lets you test your CSP and provides suggestions to enhance its security.

![The view of the Evaluate of the CSP](/articles/umbraco-package-of-the-month/csp-manager/Evalulate_view.png)

_Figure3: The view of the Evaluate of the CSP_

## Confusing UI Elements

I encountered some confusion with the “Toggle CSP Header” setting. The checkbox indicates the current state, but I initially misunderstood it as representing the state after enabling it. For instance, an unchecked box labeled “CSP Disabled” indicates the current state, but I mistakenly thought I needed to check it to disable it, this led to some frustration.

## Nonce Issues

Another issue was with the nonce setting. Whether it was due to the package or my self, I couldn’t get it to work correctly. Even after removing the nonce from the CSP, it persisted across all my browsers. Nonce can be tricky to use, and this package didn’t simplify it as much as I had hoped.

## Conclusion

Overall, the “Umbraco.Community.CSPManager” package is a valuable tool, especially for clients who frequently need to add new scripts. It eliminates the need for constant deployments, allowing quick changes directly in Umbraco. However, I recommend avoiding the nonce feature due to its complexity and potential issues.
