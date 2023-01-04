---
title: 'Solving Tower of Hanoi coding challenge'
date: '2022-12-20'
tags: ['puzzle', 'dot-net', 'code-challenge']
summary: ''
authors: ['ahmed-ali']
---

In the previous article on the Tower of Hanoi coding challenge, we discussed the Tower of Hanoi as a mathematical problem that we need to solve using code. We were introduced to the Tower of Hanoi puzzle and the rules to solve it. If you haven't read the previous article yet, I suggest you do so.  
[Coding challenge Tower of Hanoi](tower-of-hanoi).

In this article, we are going to explore together how to solve this coding challenge.

## Algorithm for Tower of Hanoi

One general way to solve the Tower of Hanoi is a recursive algorithm. First, we need to decide on two pegs as the source and destination, and the spare peg would be temporary.

Here are the steps to solve the Tower of Hanoi puzzle:

- Move the top n-1 disks from the source peg to the helper peg.
- Afterward, move the nth disk from the source peg to the destination peg.
- Finally, move the rest n-1 disks from the helper peg to the destination peg.

### How to solve the Tower of Hanoi Puzzle

Let’s illustrate the algorithm for three disks and consider peg A as the source, peg B as the helper, and peg C as the destination

**Step 1)** Initially, all the disks will be stacked on peg A.

![](/articles/dotnet-puzzels/towersOfHanoi/1.png)

At this stage:

Source = Peg A
Destination = Peg C
Helper = Peg B

Now, we need to move the top n-1 disks from the source to the helper.

Note: Though we can only move one disk at a time, it breaks our problem from a 3-disk problem to a 2-disk problem, which is a recursive call.

**Step 2)** As we call a recursive call from peg A and the destination is peg B, we will use peg C as a helper.

Notice that we are at stage one again for the same tower of Hanoi problem for two disks.

Now we need to move n-1 or one disk from source to helper, moving the smallest disk from peg A to peg C.

![](/articles/dotnet-puzzels/towersOfHanoi/2.png)

At this stage:

Source = peg A
Destination = peg B
Helper = peg C

**Step 3)** Then, according to our algorithm, the nth or 2nd disk needs should be transferred into the destination or peg B.

![](/articles/dotnet-puzzels/towersOfHanoi/3.png)

At this stage:

Source = peg A
Destination = peg B
Helper = peg C

**Step 4)** Now, we will move the n-1 disks or disk one from helper or peg C to the destination or peg B according to the third stage of our algorithm.

![](/articles/dotnet-puzzels/towersOfHanoi/4.png)

At this stage:

Source = peg A
Destination = peg B
Helper = peg C

**Step 5)** After completing the recursive call, we will return to our previous setting when the first stage of the algorithm.

**Step 6)** Now, in the second stage, we will move our source to our destination, which is moving disk 3 to peg C from peg A.

At this stage:

Source = peg A
Destination = peg C
Helper = peg B

**Step 7)** Now we can see that

![](/articles/dotnet-puzzels/towersOfHanoi/5.png)

d is to move the remaining disks from helper (peg B) to destination (peg C). We will use the initial source or peg A as a helper in this case.

Step 8) As we can’t move two disks simultaneously, we will call a recursive call for disk 1. According to the last step and our algorithm, a destination in this step is peg A.

![](/articles/dotnet-puzzels/towersOfHanoi/6.png)

At this stage:

Source = peg B
Destination = peg A
Helper = peg C

**Step 9)** Our recursive call is completed now. Then we move disk 2 from its source to its destination.

![](/articles/dotnet-puzzels/towersOfHanoi/7.png)

At this stage:

Source = peg B
Destination = peg C
Helper = peg A

**Step 10)** Then we move our remaining n-1 or disk 1 from helper to destination.

![](/articles/dotnet-puzzels/towersOfHanoi/8.png)

**We will apply this approach as below to solve the puzzle:**

- Create a function towerOfHanoi where pass the N (current number of disk), startPeg, endPeg, tempPeg.
- Make a function call for N – 1 th disk.
- Then print the current the disk along with startPeg and endPeg
- Again make a function call for N – 1 th disk.

Below is the implementation of the above approach using C#.

```js
char startPeg = 'A'; // start tower in output
char tempPeg = 'B'; // temporary tower in output
char endPeg = 'C'; // end tower in output
int totalDisks = 3; // number of disks

MoveDisk(totalDisks, startPeg, endPeg, tempPeg);

static void MoveDisk(int n, char startPeg, char endPeg, char tempPeg)
{
    if (n > 0)
    {
        MoveDisk(n - 1, startPeg, tempPeg, endPeg);
        Console.WriteLine("Move disk " + n + " from peg " + startPeg + " to peg " + endPeg);
        MoveDisk(n - 1, tempPeg, endPeg, startPeg);
    }
}
```

**Output**

```
Move disk 1 from peg A to peg C
Move disk 2 from peg A to peg B
Move disk 1 from peg C to peg B
Move disk 3 from peg A to peg C
Move disk 1 from peg B to peg A
Move disk 2 from peg B to peg C
Move disk 1 from peg A to peg C
```
