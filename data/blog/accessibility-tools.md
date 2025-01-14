---
title: 'Accessibility tools'
date: '2025-01-14'
tags: ['frontend', 'a11y', 'accessibility']
images: ['/articles/accessibility-tools/a11y.png']
summary: 'In today’s digital age, many websites remain inaccessible to individuals with physical or cognitive disabilities. 
However, there are numerous accessibility tools available to help audit and improve your web content, ensuring accessibility for everyone.'
authors: ['ravindre-ramjiawan']
theme: 'blue'
---

## Table of Contents

<TOCInline toc={props.toc} exclude={["Table of Contents"]} toHeading={2} />

## Background

In the digital world, accessibility[^1] (often abbreviated as a11y) refers to designing and developing web content in a way that can be used by everyone,
including people with disabilities but also for all user agents, including some highly limited devices or services, such as digital assistants.
The goal of a11y is to create an inclusive digital environment where everyone has equal access to information and functionality, regardless of their physical or cognitive abilities.
The Web Content Accessibility Guidelines (WCAG)[^10] provide recommendations to improve web content accessibility, accommodating various disabilities, such as blindness, deafness, limited movement, and cognitive limitations.
According to WebAIM (Web Accessibility In Mind)[^2] and their [2024 report](https://webaim.org/projects/million/) only a small fraction of websites are fully accessible.

## Tools

To help implement WCAG guidelines to make web content more accessible, developers, auditors, content creators and designers have access to a number of tools designed to audit their web content.
These tools automate many of the processes to ensure compliance and enhance accessibility.
The browser has access to its own accessibility tools but also to many free to use browser extensions.

### Lighthouse

The Lighthouse[^3] reporter tool in Chrome can be utilized for auditing your web content for accessibility.
To perform an audit on your web content you simply flag the accessibility category in Lighthouse and run it to analyze your page.

<figure>
  <img
  src="/articles/accessibility-tools/lighthouse-devtools.jpg"
  alt="Lighthouse - Options and settings" />
  <figcaption>Lighthouse - Options and settings</figcaption>
</figure>

Once Lighthouse has done a full inspection of the selected page it will output a report with everything that was checked by Lighthouse.
Lighthouse creates small screenshots of elements that failed to comply with certain WCAG rules and also reports additional items that can be checked manually.

<figure>
  <img
  src="/articles/accessibility-tools/lighthouse-report.jpg"
  alt="Lighthouse - Accessibility audit report" />
  <figcaption>Lighthouse - Accessibility audit report</figcaption>
</figure>

### Axe Devtools

Axe Devtools[^4] is a browser extension that can catch up to [80% or more](https://accessibility.deque.com/hubfs/Semi-Automated-Accessibility-Testing-Coverage-Report.pdf) of accessibility issues.
It also has a paid subscription model in which you can automate entire user flows or perform checks using AI.

<figure>
  <img
  src="/articles/accessibility-tools/axe-devtools.jpg"
  alt="Axe Devtools" />
  <figcaption>Axe Devtools</figcaption>
</figure>

Once Axe Devtools has done a full inspection of the selected page it will output a report with everything that was checked by Axe Devtools.
Axe Devtools reports issues in several categories and has a lot of settings that can be configured especially when using the paid version.
Using the highlight button will show you the element in question that is not compliant with a certain WCAG rule and also explain why it's not compliant and how to solve the issue.

<figure>
  <img
  src="/articles/accessibility-tools/axe-devtools-report.jpg"
  alt="Axe Devtools - Accessibility audit report" />
  <figcaption>Axe Devtools - Accessibility audit report</figcaption>
</figure>

<figure>
  <img
  src="/articles/accessibility-tools/axe-devtools-settings.jpg"
  alt="Axe Devtools - Options and settings" />
  <figcaption>Axe Devtools - Options and settings</figcaption>
</figure>

### Wave

WAVE (Web Accessibility Evaluation Tool)[^5] is another powerful tool to perform accessibility audits on web content.
It is developed by WebAIM. The tool provides visual feedback by injecting icons and indicators into your web page, highlighting potential accessibility issues.
When clicking on an icon in the left panel it will navigate to the element and highlight it. If you open the code panel at the bottom it will navigate to the HTML source code of that element.

<figure>
  <img
  src="/articles/accessibility-tools/wave-devtools.jpg"
  alt="WAVE Devtools - Accessibility audit panel" />
  <figcaption>WAVE Devtools - Accessibility audit panel</figcaption>
</figure>

Another cool feature is the order tabs. It will tell you in which order screen readers[^11] will read out elements.

<figure>
  <img
  src="/articles/accessibility-tools/wave-devtools-order.jpg"
  alt="WAVE Devtools - Screen reader element order list" />
  <figcaption>WAVE Devtools - Screen reader element order list</figcaption>
</figure>

### Accessibility Insights

Accessibility Insights[^6] is a suite of tools developed by Microsoft to help developers identify and fix accessibility issues in their web and Windows applications.
It supports automated checks and manual tests to ensure compliance with accessibility standards according to the WCAG specifications.
It also provides visual helpers and step-by-step guidance to make it easier for developers to fix issues. The tool provides visual feedback by injecting indicators into your web page,
highlighting potential accessibility issues. Accessibility Insights technically uses the axe-core[^7] engine under the hood.

<figure>
  <img
  src="/articles/accessibility-tools/accessibility-insights-devtools.jpg"
  alt="Accessibility Insights - Options and settings" />
  <figcaption>Accessibility Insights - Options and settings</figcaption>
</figure>

When clicking on the list view and filtering link it will open a new window with the reported issues.
Another cool feature is that you can automatically create an issue in GitHub or Azure from this page.

<figure>
  <img
  src="/articles/accessibility-tools/accessibility-insights-report.jpg"
  alt="Accessibility Insights - Accessibility audit report" />
  <figcaption>Accessibility Insights - Accessibility audit report</figcaption>
</figure>

When switching to the quick assess option from the dropdown you land on the Assessment page.
On this page, you have a nice overview of all the checks that were performed automatically but also a guided manual checklist for each category.

<figure>
  <img
  src="/articles/accessibility-tools/accessibility-insights-quick-assess.jpg"
  alt="Accessibility Insights - Quick assessment page" />
  <figcaption>Accessibility Insights - Quick assessment page</figcaption>
</figure>

### Test automation

Test automation can significantly enhance accessibility auditing by ensuring consistency, efficiency, and comprehensive coverage.
It minimizes human error and speeds up the testing process, allowing teams to quickly identify and fix accessibility issues.
Tools like Cypress[^8], integrated with plugins such as wick-a11y[^9], offer thorough accessibility checks using the axe-core engine.
This ensures all aspects, from color contrast to keyboard navigation, are covered. Automated tests also provide immediate feedback, enabling prompt resolution of issues during development.
Additionally, Cypress can generate detailed reports and logs, documenting accessibility issues and offering guidance on how to address them.

<figure>
  <img
  src="/articles/accessibility-tools/cy-a11y.png"
  alt="Cypress - Accessibility audit report" />
  <figcaption>Cypress - Accessibility audit report</figcaption>
</figure>

While test automation offers numerous advantages, it's not a one-size-fits-all solution for accessibility.
Automated tools might not catch nuanced issues such as context-specific problems, user experience concerns, or the needs of individuals with diverse disabilities.
For example, while automation can check for color contrast, it might not ensure that color choices are aesthetically pleasing or culturally appropriate.
Similarly, automated tools can miss dynamic content changes, interactive elements, or custom widgets that require manual testing.

User feedback and manual testing are crucial components to complement automated tests.
Engaging real users, including those with disabilities, provides insights into practical usability and accessibility that automated tools alone cannot achieve.
Therefore, a balanced approach combining both automated and manual testing is essential to ensure a truly accessible and user-friendly experience.

## Conclusion

I hope this provides a quick overview of some of the tooling that is available out there to enhance the accessibility of your web content.
Start with the low-hanging fruit that can be identified and addressed automatically using these tools.
Additionally, take advantage of the guided checklists these tools offer to achieve your accessibility compliance goals effectively.

[^1]: https://en.wikipedia.org/wiki/Computer_accessibility
[^2]: https://webaim.org/
[^3]: https://en.wikipedia.org/wiki/Lighthouse_(software)
[^4]: https://www.deque.com/axe/devtools/
[^5]: https://wave.webaim.org/
[^6]: https://accessibilityinsights.io/
[^7]: https://github.com/dequelabs/axe-core
[^8]: https://docs.cypress.io/app/guides/accessibility-testing
[^9]: https://github.com/sclavijosuero/wick-a11y
[^10]: https://www.w3.org/WAI/standards-guidelines/
[^11]: https://en.wikipedia.org/wiki/Screen_reader
