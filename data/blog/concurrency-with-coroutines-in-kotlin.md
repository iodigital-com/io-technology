---
title: 'Clear and Concise Concurrency with Coroutines in Kotlin'
date: '2024-07-03'
tags: ['kotlin', 'concurrency', 'coroutines', 'backend']
images: ['/articles/concurrency-with-coroutines-in-kotlin/multithreaded.png']
summary: 'Learn some Kotlin basics and how to easily use coroutines to write parallelized code cleanly according to structured concurrency.'
authors: ['ruud-nimour']
---

Computers nowadays are blazingly fast. When they to do a really large amount of work though, it can still take a long
time. If the work can be split up into smaller independent tasks which can be done in parallel however, we are in luck.
We can leverage the fact that practically every computer has multiple cores to speed up this work by writing code that
makes use of these extra cores. Writing such multithreaded code can be quite difficult, however, as it is easy to lose
track of threads or run into race conditions.

Kotlin has introduced so-called "coroutines" to make this easier. In this article, we will shortly go over some of
Java's multithreading possibilities, then explain some of Kotlin's syntax, and finally see how it's used to make it very
easy to write clean concurrent code according to _structured concurrency_.

## Java multithreading

Java has multiple ways to do multithreading. The most direct way is by simply creating and starting new Threads like so:

```java
public static void main(String[] args) {
    final int NUMBER_OF_THREADS = 10;

    for (int i = 0; i < NUMBER_OF_THREADS; i++) {
        Thread thread = new Thread(() -> {
            System.out.println("Hello from thread " + Thread.currentThread());
            try {
                Thread.sleep(5000); // simulate some work
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        thread.start();
    }
}
```

Now, this works fine for moderate amounts of threads. On my machine however, cranking the number of threads to a modest
ten thousand already crashes the program at thread number ~9200 with error 'unable to create native thread: possibly out
of memory or process/resource limits reached', even though the threads aren't even doing anything! This is because
`Thread`s in Java are actually quite heavy (requiring several kilobytes of memory), and are bound to OS threads, which
are limited in number.

Fortunately, Java's [Project Loom](https://wiki.openjdk.org/display/loom/Main) introduces `VirtualThread`s, which
are [now production-ready since Java 21](https://openjdk.org/jeps/444). Rather than each created `VirtualThread` also
creating a new OS thread, instead, the JVM has several so-called "carrier threads" which actually run the virtual
threads. This way, we can create many millions of virtual threads without problem. Because we use the same `Thread` API,
the only code change necessary is the `new Thread(...` line above, which will become:

```java
Thread thread = Thread.ofVirtual().unstarted(() -> {
```

With this simple code change, I can now create more than 1 million virtual threads this way.
This is already big improvement, but as we will discuss later, in Kotlin we can do this much more nicely, and moreover
forces you to code following the principle of _structured concurrency_, which I will explain later.

It should also be noted however, that Java provides other ways of doing multithreading. For example, rather than
creating `Thread`s directly, you can submit `Runnable` tasks to an `ExecutorService` with a limited number of threads,
see for instance `Executors.newFixedThreadPool(int nThreads)`. Another implementation of `ExecutorService`
is [ForkJoinPool](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ForkJoinPool.html),
which uses a "work stealing algorithm". If a thread in such a `ForkJoinPool` is waiting for completion of its created
subtasks, it will take work that other threads have in their work queue. This way, the work is distributed more evenly
among the threads, and the threads are kept busy as much as possible.

## Kotlin

### Some Syntax

If you come from a pure Java background like me, it may be good to go over some Kotlin syntax. It will be heavily
used in the following examples, and has some differences with Java. I won't be going over everything here though!
[Kotlin's own documentation](https://kotlinlang.org/docs/home.html) is very good and I recommend you to check it out. If
you're already familiar with Kotlin, you can skip over this part.

#### Variable definitions and String templates

In Kotlin, variables are declared using `val` (immutable) or `var` (mutable). Type declaration in Kotlin is optional if
it can be inferred by the compiler. If we do specify the type, it comes with a colon after the variable name, like
so: `val name: String = "Ruud"`. Kotlin also has string interpolation, using a `$`.
For example: `"my name is $name, and has ${name.length} letters"`. This way, you can easily insert variables (and any
expressions!) into strings. As you can see, simple variable insertions do not need the `{}` curly braces, but if we want
to do method calls on them, we do.

#### Lambda functions

Another feature we will be using heavily, and the main reason I want to go over this syntax, is that the last ([or
as they call it, trailing](https://kotlinlang.org/docs/lambdas.html#passing-trailing-lambdas)) lambda function of a
method can be placed outside the brackets. This was quite puzzling to me, but after using it, I found that it creates
very readable code. For example, from the Kotlin standard library, we have the `repeat` function:

```kotlin
public inline fun repeat(times: Int, action: (Int) -> Unit) {
    for (index in 0 until times) {
        action(index)
    }
}
```

This simply repeats the action `times` times. (The `Unit` return type is Kotlin's equivalent for returning `void`) \
For example, if you want to ask "are you sure" three times, you can do this:

```kotlin
repeat(3, {
    println("are you sure?")
}) // why two sets of brackets here...
```

You can already see some subtle differences with Java's lambda functions. rather than `(params) -> { body }` we
have `{ params -> body }`. Note that in the case of having only a single parameter (like above), this parameter will be
automatically available as `it`, so as you can see we don't even need to have the `params ->` part.
The thing is that we can now apply the rule "last lambda can go outside the function call" to get:

```kotlin
repeat(3) {
    println("are you sure?")
} // cleaner :)
```

to make it even simpler. In the case that there is only one parameter (the lambda) then the function call's brackets are
not even necessary. For example, `Iterable`'s `filter(predicate: (T) -> Boolean)` can be used to call simply

```kotlin
arrayListOf(-2, -1, 0, 1, 2)
    .filter { it > 0 } // filter for only positive numbers: returns [1, 2]
```

No (round) brackets needed!

#### Extension functions and functions with receivers

The last feature I want to discuss here are _functions with receivers_. This ties in heavily with another feature of
Kotlin, which are _extension functions_. These are functions on a class, but are defined outside of the class. For
example:

```kotlin
// define a class with property "name"
class Person(var name: String)

fun Person.greet() {
    // this method now has access to the "name" property
    println("Hello, my name is $name")
}

val ruud = Person("Ruud")
ruud.greet() // prints "Hello, my name is Ruud"
```

As you can see, the `greet` function is defined outside of the `Person` class, but can be called on a `Person` object.
In other words, `Person` is the _receiver_ of the function. We can take this a step further by defining a function with
a receiver. This is done by defining a lambda function with a receiver, like in this example:

```kotlin
fun greetRuud(init: Person.() -> Unit) {
    val ruud = Person("Ruud")
    ruud.init()
}

greetRuud { // instantiates Person("Ruud") which receives this lambda
    greet()
    println("I love playing games!")
}
// prints:
// Hello, my name is Ruud
// I love playing games!
```

As you can see, the `greetRuud` function takes a lambda function. The notation was a bit puzzling to me at first, but it
is essentially the same as the `greet` extension function we defined on `Person`, but now as a lambda parameter that I
call `init`. This also means that this extension function (or how Kotlin refers to it as
a "[function with receiver](https://kotlinlang.org/docs/lambdas.html#function-literals-with-receiver)") has access to
the `Person` object's properties and functions, and as you can see, we were able to call the `greet()` function.

### Applying this to create DSL

Now before we finally dive into the juicy coroutines in Kotlin, let's see how the above concepts are applied to create a
Domain Specific Language (DSL). It's not strictly speaking necessary to understand exactly how all of this works, but it
is very interesting, and if you do understand, it allows you to create very powerful DSLs yourself.

A DSL is, [according to jetbrains](https://www.jetbrains.com/mps/concepts/domain-specific-languages/), "a programming
language with a higher
level of abstraction optimized for a specific class of problems." More abstraction means we can use a more
human-readable language to solve a specific problem. To give a more concrete example (other than greeting me like
earlier), we borrow an example from [Kotlin Koans](https://play.kotlinlang.org/koans/overview). This is a small crash
course on Kotlin, which I can highly recommend to learn the basics of Kotlin, as you can immediately try out the
concepts you have just learned.
Near the end of the course, there is a section on DSLs, giving an HTML builder as an example.

When building an HTML page, you might want to create a table with table rows `<tr>` and table data `<td>` like

```html
<table>
  <tr>
    <td>column header 1</td>
    <td>column header 2</td>
  </tr>
  <tr>
    <td>data row 1: abc</td>
    <td>data row 1: def</td>
  </tr>
</table>
```

In the Kotlin Koans example, we can very expressively create this table like so:

```kotlin
table {
    tr {
        td { text("column header 1") }
        td { text("column header 2") }
    }
    tr {
        td { text("data row 1: abc") }
        td { text("data row 1: def") }
    }
}
```

Effectively the same as the produced HTML. But since this is in Kotlin, we are free to use all of Kotlin's features
available to us, like loops, if statements, etc. For example,

```kotlin
for (i in 1..10) {
    tr {
        td { text("data row $i: abc") }
        td { text("data row $i: def") }
    }
}
```

is a perfectly legal expression and produces ten `<tr>` row tags with two `<td>` data tags inside each.

So then the million-dollar question: how do we create this DSL, i.e. these `table`, `tr`, etc. functions? Again,
please check out the [Kotlin Koans task](https://play.kotlinlang.org/koans/Builders/Builders%20implementation/Task.kt)
for all the details. I will only give a brief explanation here. The main data structure we need is a HTML `Tag`, which
may have a list of child `Tag`s. We can define this as follows:

```kotlin
// define the Tag class (open so that we can subclass it)
open class Tag(val name: String) {
    protected val children = mutableListOf<Tag>()

    override fun toString() = "<$name>${children.joinToString("")}</$name>"
}
```

Then we can define the `<table>` tag as a subclass of `Tag`, which has a function `tr` to add a `<tr>` tag to its child
list.

```kotlin
class TABLE : Tag("table") {
    fun tr(init: TR.() -> Unit) {
        val tr = TR()   // create a new <tr> tag
        tr.init()       // add the "tr { ... }" block contents to the <tr> tag
        children += tr  // add the <tr> tag to (this) <table>'s "children" list
    }
}
```

The `TR` and `TD` tags are defined similarly. For more information, check Kotlin's documentation
on [Type-safe builders](https://kotlinlang.org/docs/type-safe-builders.html).

## Coroutines in Kotlin

Now we can finally dive into coroutines. As already stated, coroutines are a clean way to do multithreading in Kotlin.
The main advantage of coroutines is that they are very lightweight, since they are not bound to OS threads, like Java's
virtual threads. Another is that there is a coroutine DSL that effectively forces you to use "structured concurrency".
What is this "structured concurrency"? According
to [Kotlin's own documentation](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency), it means
that coroutines (i.e. separate computations) can only be launched in a specific `CoroutineScope` which delimits the
lifetime of the coroutine. This means that a coroutine cannot complete until all its child coroutines complete. This
keeps us from "losing" coroutines, which can happen in Java when a `Thread` is created in a method, but the method
returns before the `Thread` completes. We will see in an example how this is enforced through the way we write
coroutines.

### Example: Merge Sort

In order to get a better understanding of coroutines, let's take a look at an example where we can easily use them.
The merge sort algorithm is a good example, as it is a divide-and-conquer algorithm, which can be parallelized very
well. The basic algorithm is as follows:

```kotlin
fun mergeSort(list: MutableList<Int>) {
    if (list.size <= 1) {
        return // already sorted
    }

    // split the list in two
    val middle = list.size / 2
    val left = list.subList(0, middle)
    val right = list.subList(middle, list.size)

    // sort both halves
    mergeSort(left)
    mergeSort(right)

    // and merge the sorted lists back together
    merge(list, left, right)
}
```

where the `merge` function simply takes the lists (`left` and `right`) and merges them into a single sorted list.
Because `left` and `right` are already sorted, merging them into a sorted list is very simple and fast. As you can see,
this is a recursive algorithm, which calls itself twice. This is exactly where we can use coroutines to parallelize
sorting the left and right halves of the lists, as these are independent tasks.

### Adding coroutines

All we need to do is add the dependency "org.jetbrains.kotlinx:kotlinx-coroutines-core" to enable using coroutines in
our Kotlin project, and then introduce coroutines to the `mergeSort` function, like so:

```kotlin
suspend fun coMergeSort(list: MutableList<Int>) {
    // ... same as before

    coroutineScope {
        launch { coMergeSort(left) }
        launch { coMergeSort(right) }
    }

    merge(list, left, right)
}
```

I introduced the `suspend` keyword to the function declaration so that we can use the `coroutineScope` function. It
indicates that this function's execution can be suspended, for example when waiting for its spawned coroutines to
complete. The `coroutineScope` function creates a new coroutine scope, in which we `launch` two new coroutines
(asynchronously) to sort the left and right halves of the list\*. This means that the recursive calls to `coMergeSort`
to sort the left and right halves of the list are now done in parallel. Note that we only exit the `coroutineScope`
function when both launched coroutines complete, showing very clearly where coroutine execution ends, thus adhering to
the principle of structured concurrency. This ensures that only after these two coroutines complete, the `merge`
function is called.

\*= In terms of the nomenclature introduced in the previous section, the `launch` function is a coroutine builder,
available as an extension function on `CoroutineScope`, which is the receiver of the `coroutineScope` function.

When I try out our simple mergeSort and compare it to our shiny new coMergeSort sorting algorithm on a list of 4 and 16
million random integers, I found the following results:

| Algorithm   | 4 million integers | 16 million integers |
| ----------- | ------------------ | ------------------- |
| mergeSort   | 0.6 seconds        | 1.8 seconds         |
| coMergeSort | 1.6 seconds        | 6 seconds           |

As we can see, wait, what!? Wasn't this supposed to go much faster using coroutines, since we utilize every core of our
CPU? Yes, but although coroutines _are_ lightweight, they are _not_ no-weight. Creating a coroutine does carry _some_
overhead, and since we create coroutines even for lists consisting of only one element... You can imagine that creating
16 million coroutines which do nothing but return their one-element list
is not very efficient. Note that we still _can_ do this without crashing the application though, unlike with Java's
`Thread`s, which already crashed at a mere ten thousand threads.

Let's not add the overhead of creating extra coroutines for small lists, and only create coroutines for lists larger
than, say, 1000 items. This way, we can still parallelize the sorting of large lists, but not introduce the overhead for
small lists. This is easily done by adding a check at the start of the function:

```kotlin
suspend fun smartCoMergeSort(list: MutableList<Int>) {
    if (list.size <= 1000) {
        mergeSort(list) // no need to use coroutines for small lists
        return
    }

    // ... same as before
}
```

Testing the performance of this algorithm and comparing them with the previous results (and testing against even larger
lists), we get:

| Algorithm        | 4 million integers | 16 million integers | 64 million integers |
| ---------------- | ------------------ | ------------------- | ------------------- |
| mergeSort        | 0.6 seconds        | 1.8 seconds         | 7.5 seconds         |
| coMergeSort      | 1.6 seconds        | 6 seconds           | 28 seconds          |
| smartCoMergeSort | 0.24 seconds       | 0.55 seconds        | 1.9 seconds         |

Great success! We have increased the performance of our merge sort algorithm by a factor of about 3 to 4.
It should be noted, however, that by incorrectly using them, we managed to actually _reduce_ the performance by about
the same factor.

In conclusion, here we have seen a good example of how coroutines can be very powerful, but also how we must still think
about how we use them. I had a blast learning about coroutines in Kotlin, and this is only the start. For example, we
can also use coroutines
to [handle non-blocking HTTP requests](https://kotlinlang.org/docs/coroutines-and-channels.html#concurrency), also I
never dived into [coroutine exception handling](https://kotlinlang.org/docs/exception-handling.html),
or [timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html) etc.  
You can check my [GitHub "sorters" repository](https://github.com/rnimour/sorters) to see the code in action, or to play
around with it yourself.
