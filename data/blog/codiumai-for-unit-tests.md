---
title: 'Generate unit tests using CodiumAI'
date: '2023-09-27'
tags: ['frontend', 'unit-tests', 'vs-code', 'intellij-idea']
images: ['/articles/codiumai-for-unit-tests/codiumai-for-unit-tests-cover.webp']
summary: 'Unit tests are an essential part of software development. Tests help you to ensure that the code works as you expect. It takes time to create all necessary tests. But there is a way to generate them.'
authors: ['alexey-ses']
theme: 'blue'
---

## What is Unit testing

Unit testing ensures that pieces of code work the way you expect them to. Performing unit tests is designed to be simple, generally, the tests are written in the form of functions that will determine whether a returned value equals the value you were expecting.

## CodiumAI for unit tests generation

I've recently tried unit tests generation with [CodiumAI](https://www.codium.ai/). It's an extension for VS Code and Intellij Idea that is free to use for independent developers. It supports JavaScript, TypeScript and a variety of other programming languages. Let me show you how it works.

### How to install CodiumAI in VS Code

First of all, you need to install it. CodiumAI supports VS Code. Open VS Code Extensions section, search for "CodiumAI" and install it.

![How to install CodiumAI in VS Code](/articles/codiumai-for-unit-tests/codium-ai-install-vscode.webp)

### How to install CodiumAI in IntelliJ Idea

To install CodiumAI in IntelliJ Idea, go to Settings -> Plugins -> search for "CodiumAI", install it and then restart IntelliJ Idea:

![How to install CodiumAI in IntelliJ Idea](/articles/codiumai-for-unit-tests/codium-ai-install-intellij.webp)

### How to generate unit tests

Here's an example of TypeScript code that will be used for unit tests generation:

```typescript
export interface User {
  userId: string
  userName: string
}

export class AuthService {
  searchUsersByName(users: User[], userName: string) {
    return users.filter((user) => user.userName.toLowerCase().includes(userName.toLowerCase()))
  }
}
```

Tests generation with CodiumAI works similarly in VS Code and IntelliJ Idea. Here's how to do it in VS Code:

![How to generate unit tests with CodiumAI in VS Code](/articles/codiumai-for-unit-tests/codiumai-how-to-generate-tests-vscode.gif)

And here's how you can do the same thing in IntelliJ Idea:

![How to generate unit tests with CodiumAI in IntelliJ Idea](/articles/codiumai-for-unit-tests/codiumai-how-to-generate-tests-intellij.gif)

Starting from here I will use VS Code only for tests generation. It works similarly in IntelliJ Idea.

### Generate custom unit test

Let's say we need a custom unit test that would make our test users have name and surname separated by space as part of their "userName" string. Example: "Jane Doe". So this test:

`returns an array of users, users should have names that contain name and surname separated by space`

We can generate that custom test using the Behaviours Coverage section:

![How to generate custom unit test with CodiumAI](/articles/codiumai-for-unit-tests/codiumai-how-to-generate-custom-test.gif)

Now, a custom unit test is generated and added to the list of tests.

### Run all unit tests

Time to run the tests!

That might require you to have one of the testing libraries (Jest, Mocha, Karma Jasmine, etc.) installed and configured in your project. The only available Test Framework from the Configuration section that worked without any configuration with my simple code example is "React Testing Library". Here's how it works:

![How to run all unit tests with CodiumAI](/articles/codiumai-for-unit-tests/codiumai-how-to-run-tests.gif)

### Fix the code with CodiumAI suggestions

You might find one of the tests broken, due to edge case. CodiumAI would suggest you to fix the code. Here's one of CodiumAI's suggestions that could fix several edge cases:

![Check CodiumAI code suggestions](/articles/codiumai-for-unit-tests/codiumai-code-suggestion.webp)

Now it's time to apply the code suggestion:

![How to apply CodiumAI code suggestion](/articles/codiumai-for-unit-tests/codiumai-how-to-apply-code-suggestion.gif)

Suggestion is applied, and all unit tests are generated. Now you can copy-paste unit tests into your project.

That was the last feature that I wanted to share with you. [There are many others that you can try as well](https://github.com/Codium-ai/codiumai-vscode-release).

## CodiumAI is not perfect

> You should always double-check the tests CodiumAI generates

That's the warning from the CodiumAI team. They've made an amazing tool to make you more productive as you develop unit tests. But don't forget to check what AI generated for you. Happy coding!
