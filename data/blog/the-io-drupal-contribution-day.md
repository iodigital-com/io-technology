---
title: 'The iO Drupal contribution day'
date: '2021-12-01'
tags: ['drupal']
image: '/blog/drupal-contribution-day/drupal-contribution-day.jpg'
summary: 'In a year where contributions were going down a bit we thought it was a good idea to see if we can end the year with a little bump.'
authors: ['lennard-swaneveld']
---

In a year where [contributions were going down a bit](https://dri.es/who-sponsors-drupal-development-2021) we thought it was a good idea to see if we can end the year with a little bump.

As a fast growing company we were hoping this would be a great way to meet all our Drupalista’s face-to-face, but alas this was not meant to be.

Getting people new to contributing to engage and not feel like they spend most of their day just getting all the needed tools to contribute to run on their local machines can be hard even under normal circumstances. Doing this in an online setting needed some real focus.

We came up with two ways of doing this.

First we compiled a list of patches that are used in our customer projects. That way we had some clear targets and anything that we could move forward or maybe even get committed had clear benefits to the teams that had run into these issues and clear benefits for our customers because we would no longer need to spend time making sure patches kept applying for these issues. This part would be the focus of those already experienced in contributing to Drupal.

Secondly we would focus on [bug triage](https://www.drupal.org/community-initiatives/bug-smash-initiative/issue-queue-triage-intro-and-comment-templates). [The Bug Smash Initiative](https://www.drupal.org/community-initiatives/bug-smash-initiative) is a Drupal Community initiative that strives to reduce the number of open bugs and the time that bugs are open. What’s important here is that there are many ways to reduce the number of open bugs. Fixing a bug is one of them, but fixing Drupal core bugs is hard. There are [a number of gates](https://www.drupal.org/about/core/policies/core-change-policies/drupal-core-gates) that each issue has to pass through before something will be considered ready to be merged. Getting any code ready to be committed is a lengthy process that can take years. So often, when you only have one day to contribute, this will lead to feelings of not really getting anything done on a contribution day.
In order to provide a feeling of accomplishment to those participating we decided to focus on something that can easily be done in a day: triage.

Triaging a bug means making sure that the bug report contains everything somebody needs to get working on it. Things like steps to reproduce and a clear description of the expected outcome of an action versus the actual outcome. You can also check if a bug is still relevant or that it might have been fixed in another issue. Here is the flow chart the Bug Smash Initiative uses when doing triage: 

![Maple](/blog/drupal-contribution-day/bug-triage-flow.jpg)

At other events there was usually not real structure on how to find things to triage. So that often meant that people would focus on the first couple of pages of bugs in the issue queue. Or we would do a Major triage where we would only look at bugs that were tagged as ‘major’.

But since Drupal core contains almost 7000 bugs, that leaves quite a lot of bugs untouched once they move of the first couple of pages.

![Maple](/blog/drupal-contribution-day/open-bugs-by-years-open.jpg)

So our weapon of choice would be using [Bug bingo triage](https://lendude.gitlab.io/bug-smash-initiative/). The button on that page will send you to a random bug in the issue queue that hasn’t  had any activity in more than a year. That way, you will not get stuck triaging the same set of pages over and over.

About 25 got together in one Meet for a short introduction on why contributing to Open Source is fantastic for both personal growth and giving exposure to your company. After that we split up and we had about 15 people that were interested in doing triage.

We started off with me just sharing my screen and pressing the bingo button, we had no idea what would come up. Some issues need more triage than others, but they all work as a tool for explaining the process. Even if one issue is already perfect, we could use that as an example of what to expect.

We went through about 5 issues with an experienced contributor and pointed out things that were good about it, and things that were not. Does it have steps to reproduce? [Is this actually a bug or more a task or a feature?](https://www.drupal.org/docs/develop/issues/fields-and-other-parts-of-an-issue/issue-category-field) [Is it really ‘major’ or ‘critical’ or is it ‘normal’?](https://www.drupal.org/docs/develop/issues/fields-and-other-parts-of-an-issue/issue-priority-field) Can we find any duplicate issues?
If the text looked good, maybe somebody would go to [simplytest.me](https://simplytest.me/) and see if they could reproduce the issue. We didn’t do the reproducing with the whole group since we wanted to focus on the triage process, but we would just put the link in our shared slack channel. Then somebody would start a thread on this and say they were trying to reproduce it.

After this, we handed over the process to less experienced contributors who could then hit the bingo button and we would all help them go through the issue. Sometimes we would get issues that really were way outside the comfort zone of people, and then we just went back and hit the Bingo button again, no reason to force anything here.

Above all, we tried to make it clear, that the goal was not to fix or close an issue, but to just see why an issue was stuck and to see if we could help get it moving forward.

At the end of the day, a loose check showed that we had touched well over 50 issues (we didn’t use an event specific tag, so it’s hard to check exactly), and closed about 20 of those bugs.

Afterwards people commented that it was a great way to feel that you got something done during a day of contributing. And I believe that this is a great result for a day of contributing.

I want to thank everybody that joined us for a great day of contributing and hopefully we can do the next one offline!
