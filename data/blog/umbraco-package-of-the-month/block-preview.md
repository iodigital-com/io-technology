---
title: 'Umbraco package of the month: Block previews'
date: '2024-08-26'
tags: ['umbraco']
summary: 'Looking at two packages that show your blocks in the backend for a better content experience'
authors: ['jeroen-van-kempen']
serie: umbraco-package-of-the-month
---

Welcome to the second blog in this series, where we explore two new Umbraco packages that aim to enhance the block preview functionality within the CMS. In this blog, we will delve into "Instant Block Preview" and "Block Preview" to understand their features, differences, and benefits.

These packages provide a convenient solution for visualizing block grids and lists within the CMS. By implementing either of these packages, content creators can easily preview their changes without the need for repetitive saving. Unlike the default setup in Umbraco, which requires manual work for each new block, these packages simplify and expedite the process.

![The default view of an block list and grid](/articles/umbraco-package-of-the-month/block-preview/Default_Grid_Block.png)

_Figure1: Default block grid view in Umbraco_

![Blocks showing up in the CMS how they would on the site](/articles/umbraco-package-of-the-month/block-preview/Block_preview.png)

_Figure2: Block grid view via package_

## Setup

Installing both packages is straightforward. Simply install the Nuget package and configure the custom view for each block. However, when using areas in your blocks, you only need to utilize the custom views if there are additional elements beyond the areas themselves. Otherwise, extra configuration is needed.

## Functionality

Both packages share a core functionality, displaying blocks as they would appear on the site within the CMS. In terms of appearance and usability, the packages are relatively similar. However, the key distinction lies in their maturity. The "Instant Block Preview" package may exhibit more issues, particularly with blocks not displaying correctly in areas and RTEs.

When using the custom view for blocks, it's important to note that the styling implemented on pages or layouts will not be applied. Although it is possible to add a custom CSS file for the blocks, this requires careful configuration.

Apart from maturity, what sets the two packages apart? "Instant Block Preview" offers additional functionalities, positioning it as a more future-ready option. It supports a headless setup, is compatible with Umbraco 14, and facilitates injections for web components, JS and more.

## Conclusion

Both "Instant Block Preview" and "Block Preview" significantly enhance the block editing experience for content creators. Unless you specifically require the extra features provided by "Instant Block Preview," I would recommend opting for "Block Preview" due to its higher level of maturity and the larger community actively contributing to its development.
By leveraging these packages, content creators can enjoy an improved workflow and gain better insights into their block designs within the CMS. These enhancements ultimately save time and enhance the overall content creation process.

Both of these packages deserve a #h5yr 🙏.
