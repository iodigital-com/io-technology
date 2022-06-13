---
title: 'How to save a kitten by writing clean code'
date: '2022-06-13'
tags: ['clean-code']
images: ['/articles/how-to-save-a-kitten-by-writing-clean-code/intro-sad-cat.jpeg']
summary: "So you came here to save a kitten? That's wonderful, but the real reason we're both here is to talk about clean code."
authors: ['joeri-timmermans']
canonicalUrl: 'https://www.joeritimmermans.be/blog/how-to-save-a-kitten-by-writing-clean-code/'
---

In this blog post I'll be sharing some of my **personal experiences** and **tips**.
But before we dive into the tips and tricks part, let's talk about what we, as developers, do and why we do it.

## New technologies

As a developer, our job is to write code that will help **solve** the **problems** we are presented with.
We usually do this using the tools we know, but from time to time we have to reach out to new technologies.
We tend to forget about clean code because we're out of our comfort zone and **just want to get things done.**
This mindset will drive your project down the hill at lightning speed.

I'm sure we've all heard someone say "this code is terrible, who wrote this?" or "what does this bit do?".
These frustrations manifest themselves in you or your co-workers because you feel your job is made harder
than it has to be by someone else's doing. Try to keep this well-known mantra in mind: **Always code as if the person
who ends up maintaining your code is a violent psychopath who knows where you live.**

We all want to meet our deadlines and produce as much useful features as possible, but solving problems with
**dirty code will** eventually **bite** **you** at a later point in time, where changes have to be made or bugs have to be fixed.
You'll either be stuck with "Damn, why did I write this?", "What the hell was I thinking?" or with a very angry co-worker
who has to work with **your legacy**.

## Best vs Fastest

One of the reasons clean code is so important is that it is essential in generating as little technical debt as possible.
The moment you're presented with a problem you have to solve, it's your duty to do this in the **best possible way**.

Firstly, I would like to highlight the emphasis on the word **best**, because for some weird reason a lot of people confuse this with **fastest**.

Whenever a client wants something, the **deadline** is usually **yesterday**.
This is another reason why we tend to forget about clean code.
If you copy 4 lines and change some variable names, your problem is solved and everyone will be amazed by how fast you did it.
But have you really thought about what you just did? Did you actually read the code?
Did you understand why the decisions expressed by that piece of code were made, by you or a colleague?
Sometimes the scope changes because of a new request, so **why not rewrite the code** to fit the new needs a bit better?

Here's a real life example.
This developer had to add an extra language to a weird old array structure.
On the one hand, this could be done with **4 lines of copy pasta** and everything would have worked out.
On the other hand, the whole function could be rewritten saving about **237 lines**, making the code a lot cleaner and easier to read.
By adding comments (keep these brief and relevant!) you can pass on extra information to other people who need to understand the code later on.

![Code Trouble](/articles/how-to-save-a-kitten-by-writing-clean-code/code-trouble.jpeg)

Now for the other word I put an emphasis on: **possible**.
I know you'll never be able to write perfectly future-proof code, because long-term projects will require maintenance, new features and extensions;
details of which can't be anticipated exhaustively in advance.

Since we are not able to time travel yet, we don't know what the future will bring.
Our **code** will have to **evolve** in order to keep up with the new requirements, and by copying those 4 lines and
not thinking about what you just did on a conceptual level, you increase the **technical debt** that will have to be **paid off eventually.**

> The ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code. ...[Therefore,] making it easy to read makes it easier to write. -- **Robert C. Martin, Clean Code**

## Reading vs Writing

As a developer it's your duty to take good care of your code.
It's **not enough** for your **code to work**, you also have to make sure it's **well written** and **readable**.
If we spend 10 times more time reading code versus actually writing it, this means the readability of your code is directly related to your output and the output of your co-workers.
So providing **cheaper reads** will not only create **happier co-workers,** but also **increase**the **productivity** of your whole team.

**Read/think before you write!**

## Clean code tips

So much for the clean code rant and why it is so important to develop the right mindset towards writing quality code.
Now I'll share some of my personal experiences as a developer.
Most topics can also be found in the classic **[Clean Code](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)** book written by **[Uncle Bob](https://en.wikipedia.org/wiki/Robert_Cecil_Martin)** (aka. Robert C. Martin) which I suggest you **add to your reading list**.

### File and Folder Organization

Clean code starts with a **clean structure** of your project.
One way to get off to a decent start is to **use a framework** and imitate their folder structure.
The PHP framework [Symfony](https://symfony.com/) has a page on their website dedicated to the thought process
behind [their architecture](http://symfony.com/doc/current/quick_tour/the_architecture.html).

On my latest Symfony project our team took advantage of DDD (Domain Driven Design) patterns.
We split up our code in several [bounded contexts](http://martinfowler.com/bliki/BoundedContext.html) as you can see in the image below.

![DDD Folders](/articles/how-to-save-a-kitten-by-writing-clean-code/folder-ddd.png)

Instead of the default Services/Course, we identified **4 contexts** in our domain and **split** the **code** correspondingly:

- **Create** contains code that is required to create content
- **Teach** contains code that is required to teach content
- **Learn** contains code that is required to learn content
- **Common** contains all code that is shared over all our contexts

A **big advantage** we get from using this approach is that it is possible to **differentiate** a concept over the **different contexts**.
For example the concept of a "course" has a similar meaning in the create and the learn context, but will have subtly different implementations.
Learn is about learning, create is about authoring - so that makes a lot of sense.We write our code in a
**language that fits our project**, which makes it **easier** **to** **communicate** for all parties involved.
This includes project managers, designers, and most importantly: our client.

### Documentation

**Documenting code** is part of what makes it **readable**.
Before you start writing a method or function, write down the steps detailing how it should do its job.
Explain in atomic steps what it should do in order to return the expected result and handle failure properly.

This is an example of a signup method from a project I'm working on, before writing any code I
**write down every step** using comments, changing them and moving them around until I have a clear view of how to get to the **expected result**.

```
    public function signUp(SmartCode $code, User $user)
    {
        // 1. Check if the code is valid

        // 2. Check if the user already has a code for this course

        // 3. Register the code

        // 4. Enroll the user with his code

        // 5. Return enrollment
    }
```

## Naming

**Naming functions, variables, classes** and so on is probably the one thing I spend **most of my time** on.
If you can't find a suitable name, you can go with your first idea and maybe come up with a better one by the time you're finished.
There is **no shame** in **constantly refactoring**. IDE's like PHPStorm will make this an easy task.

Why is naming so important? Because it will **lower the semanthic gap** between your **mindset** and your **code**.
A variable `$x` has to constantly be translated by your brain into what it really stands for.
By giving it a usefull name like `$users` we now know it is a list of users.

Another reason is that it will **create structure** in your code. Good names will impart meaning to variables and methods, so you'll need **less documentation**.
In the documentation example above I wrote down the steps to take, then when I write the actual code I use these
comments to determine the names of variables and methods, so the **comments** can be **removed** because they no longer
give any extra information. By doing so your code stays readable and you **avoid superfluous and unnecessary comments**.

```
    public function signUp(SmartCode $code, User $user)
    {
        $this->guardThatSmartCodeIsValid($code);

        $course = $code->getPayload();

        $this->guardThatUserIsNotSignedUp($user, $course);

        $this->smartCodeService->register($user, $code);

        $enrollment = $this->smartCodeEnrollment->enroll($user, $course);

        return $enrollment;
    }
```

All comments are replaced with methods, and their name already says what the method does so no comment is needed to tell
it anymore. IDE's can help you out a great deal here, but sometimes they take things a step too far.
It is obviously unnecessary to write a doc block above a method called `findLicenceByCode($code);` the name of this
method explains what it's going to do and **no further documentation should be needed**.

### DRY Principle

**Don't repeat yourself** is a principle in software development to prevent you from creating duplicate knowledge.
In the screenshot about **best vs fastest** I showed you how you could just copy a few lines to create a new case,
but by actually rewriting the whole code you get the same outcome that is more flexible to **future enhancement**.

The general idea is to make sure **every piece of code** has its **own purpose** in your application.
If you find yourself copying something from one place to another you should be asking yourself whether both places
require the exact same logic: if so, you're most likely better off putting the duplicate logic in an appropriate spot available to both those places.

### Return often

I see many people making the following mistake.

```
<?php

function writeFile($fullpath, $content)
{
    if (is_writable($fullpath)) {

        if ($fp = fopen($fullpath,'w')) {

            if (fwrite($fp,$content)) {

                // ...

            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
```

I remember a lesson a friend of mine taught me a few years ago when I just started programming.
He said: **You should try to avoid using else statements when writing code**.
At first I was confused when I heard this, but after some time I started to realize he was right.
In 80% of cases where I used else before I just realized I no longer needed it if i turned the condition of my if-statement around.
Looking at the above example it would look something like this.

```
<?php

function writeFile($fullpath, $content)
{
    if (!is_writable($fullpath)) {
        return false;
    }

    if (!$fp = fopen($fullpath,'w')) {
        return false;
    }

    if (!fwrite($fp,$content)) {
        return false;
    }

    return true;
}
```

### Tools

Writing clean code or sticking to a standard isn't always that easy.
There's always a point at which you might forget something.
So to make life a bit easier I have a **list of tools** I use to **check** my **code **and keep it clean.

- [GrumPHP](https://github.com/phpro/grumphp): A tool that creates a git hook and does a list of checks before you can commit. For example: We can't commit unless a JIRA ticket ID is present in the commit message.
- [PHP-CS-Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer): A tool created by Sensiolabs to fix most violations against the PHP PSR-1 and PSR-2 standards in your code.
- [PHPMD](https://github.com/phpmd/phpmd): A tool that looks for several potential problems within your project:
  - Possible bugs
  - Suboptimal code
  - Overly complicated expressions
  - Unused parameters, methods, properties

## Happy kittens

You did it! You made it all the way to the end.
I hope I gave you some insights on some common pitfalls and hopefully you learned a thing or two.
Writing clean code isn't something you pick up fast, it's a habit, **a lifestyle**.
You'll always find ways to** improve your code**, and that's a good thing.
It means you're learning and you can **identify mistakes**.

By forcing yourself to stick to certain standards, you and your team will become better, your whole project will become better and everyone will be happier.
Including this little kitten!
Good job!

![Smile](/articles/how-to-save-a-kitten-by-writing-clean-code/cat-smile.jpeg)
