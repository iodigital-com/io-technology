---
title: 'Quantum-Safe Cryptography: How Encryption Evolved and Why It Needs to Evolve Again'
date: '2026-04-03'
tags:
  ['security', 'cryptography', 'quantum computing', 'encryption', 'post-quantum', 'java', 'backend']
images: ['/articles/quantum-safe-cryptography/banner.png']
summary: 'An attempt to make sense of quantum-safe cryptography: where encryption came from, why quantum computers break the rules, and what Java developers can do about it today.'
authors: ['mohamed-elmedany']
theme: 'black'
---

## How It All Started

I was chatting with a colleague, waiting for the coffee machine to do its thing, when he dropped a couple of interesting terms that I wasn't aware of before _"quantum-safe" and "harvest now decrypt later."_ ... and it stuck with me like a song.

That evening I went home and did what any curious engineer does: opened seventeen browser tabs and understood approximately a few of them.

The next day, there was a session about _"quantum-safe cryptography"_ at an event I was attending. I showed up hoping for answers. The speaker was clearly brilliant. The slides were dense. I left with even more questions than I had before.

So I kept looking deeper. This post is the result of that search. It is not an academic paper. It is just me, a software engineer, trying to make sense of something complex and explain it in a way that is easy to follow.

## Why Encryption Exists

Let's start at the very beginning.

You want to send a message to a friend. The message travels across wires, routers, and servers you do not control. **Anyone sitting in the middle can read it.** That is the problem encryption solves.

- Plaintext: readable message
- Ciphertext: scrambled message
- Key: secret that converts between them

Only the one with the right key can reverse the transformation and read the original message.

Without encryption, passwords, tokens, financial transfers, private messages would be readable by anyone on the network. We don’t really debate whether encryption is necessary. The real question is: **how do we make it strong enough that breaking it is not worth the effort?**

## Keeping Secrets by Hand

Early encryption was designed to be used by humans. Which means it was also **breakable** by humans.

The **[Caesar cipher](https://www.geeksforgeeks.org/ethical-hacking/caesar-cipher-in-cryptography)** is the classic example. Shift letters by a fixed number. That’s the entire algorithm. The key is just a number between 1 and 25. There are only **25 possible keys**. A determined person could try all of them in minutes.

More advanced versions, like the **[Vigenère cipher](https://www.geeksforgeeks.org/dsa/vigenere-cipher)**, used a keyword to vary the shift. Harder to crack by hand, but still vulnerable to **frequency analysis**. Letters do not appear randomly in real language. Count the ciphertext characters, and patterns emerge.

This worked... until it did not. The moment that there is a machine that could try all combinations faster than a human, the game changed.

## The Shift to One‑Way Math

The next big leap was moving from hand-solvable puzzles to **mathematical problems that are easy in one direction but extremely hard to reverse.**

The classic example is multiplication vs factoring. Multiplying two large prime numbers together takes microseconds. Factoring the result back? On a classical computer, that can take millions of years for large enough numbers. That asymmetry is the foundation of **[RSA encryption](https://www.geeksforgeeks.org/computer-networks/rsa-algorithm-cryptography)**.

**[ECC (Elliptic Curve Cryptography)](https://www.geeksforgeeks.org/ethical-hacking/blockchain-elliptic-curve-cryptography)** works on a similar idea but uses a different mathematical structure: points on an elliptic curve. The **easy direction** is multiplying a point by a number. The **hard direction** is figuring out what number was used.

> I do not fully understand the maths behind RSA or ECC. I know the intuition, I know the properties, and I think that is completely fine. Most engineers using TLS every day are in the same boat. The important thing is understanding **what guarantees these systems provide** and **what assumptions they rely on.**

The assumption: **certain mathematical problems are hard.** Tough enough that even with all the computers in the world working together, a properly sized RSA key is unbreakable in any reasonable timeframe.

That assumption held for decades.

## Bigger Keys, Bigger Safety Net

As computers got faster, the response was simple: **use bigger keys.**

RSA key sizes tell the story well. In the early days, 512-bit keys were considered adequate, those are now long broken. 1024-bit followed and has since been deprecated. Today, 2048-bit is the minimum recommended, and 4096-bit is common for long-lived certificates.

The same pattern played out with symmetric encryption:

- **[DES](https://www.geeksforgeeks.org/computer-networks/data-encryption-standard-des-set-1)** (56-bit keys) was broken in 1999 by brute force
- **[AES](https://www.geeksforgeeks.org/computer-networks/advanced-encryption-standard-aes)** replaced it with 128, 192, or 256-bit keys, making the keyspace so large that brute force is not a realistic attack

This is the **arms race model** of cryptography: attackers get more computation power, defenders use bigger keys. Not elegant, but it works.

This worked... until a **fundamentally different kind of computer** entered the picture.

## Quantum Computing Changes the Rules

Here is where things get genuinely strange.

**Classical computers** work with bits. A bit is either `0` or `1`. Every computation is a sequence of operations on bits. Fast, deterministic, well-understood.

**Quantum computers** work with **[qubits](https://www.ibm.com/topics/quantum-computing)**. And qubits are weird in a very specific, physics-breaking way:

[The Four key principles of quantum mechanics](https://www.ibm.com/think/topics/quantum-computing#Four+key+principles+of+quantum+mechanics):

- **Superposition** A qubit can be 0 and 1 at the same time. Not a metaphor. Actual physics.
- **Entanglement** Two qubits can be linked so that measuring one instantly tells something about the other, regardless of the distance between them.
- **Interference** Quantum algorithms can be designed to amplify correct answers and cancel out wrong ones.
- **Decoherence** Quantum computing requires avoiding and minimising decoherence.

When there are enough qubits in superposition, a quantum computer can explore a huge number of possible states at once. For **certain types of problems**, this is like having an enormous shortcut.

> I do not understand exactly how quantum computers work. The physics is based on quantum mechanics, which is complex. I have read some explanations and watched videos, but I focus on what this means for computing. For certain problems, quantum computers can find answers much faster than classical computers. One of those problems is factoring large numbers.

## Shor's Algorithm

In 1994, **Peter Shor** published an algorithm that runs on a quantum computer and can factor large numbers in **polynomial time**.

Let that sink in.

This is the real turning point. The entire security of asymmetric cryptography depends on factoring being hard. **[Shor's algorithm](https://www.geeksforgeeks.org/dsa/shors-factorization-algorithm) makes it not hard.** On a powerful enough quantum computer, RSA keys that would take classical computers millions of years to break could be broken in a few hours. The same applies to ECC. Shor's algorithm can also solve the elliptic curve discrete logarithm problem efficiently.

This is not a theoretical concern about some distant future. It is a **known algorithm, published thirty years ago**, waiting for the hardware to catch up.

As of 2024, quantum computers are still in the **"noisy intermediate-scale quantum" (NISQ) era**: hundreds to thousands of qubits, but error-prone and hard to keep stable. Running Shor's algorithm on RSA-2048 would require **millions of stable, error-corrected qubits**. We are not there yet. The direction is clear, but the timeline is uncertain, which is exactly the problem.

## Harvest Now, Decrypt Later

Here is the part that should make us uncomfortable, even if quantum computers are still years away. However, attackers can collect encrypted data **today** and store it. When quantum computers become powerful enough, they decrypt it **then**.

This is called **"harvest now, decrypt later" (HNDL)**, and it is not hypothetical. Nation-state actors with long-term intelligence interests have every incentive to do this right now.

**The window of vulnerability is not when quantum computers arrive. It is now**, for any data that needs long-term confidentiality.

### Does Quantum Break ALL Encryption?

No. The real vulnerability is asymmetric cryptography. Symmetric encryption like AES uses the same key to encrypt and decrypt. Its security does not rely on hard maths problems like factoring; it relies on **sheer key size and the complexity of the cipher itself.** There is an algorithm called [Grover's algorithm](https://www.geeksforgeeks.org/dsa/introduction-to-grovers-algorithm) that gives quantum computers a speedup against symmetric encryption, but it only cuts the effective key size in half. AES-256 effectively becomes AES-128 strength against a quantum attacker. That is still very secure. **The fix is simple: use AES-256 and we are fine.**

Hashing algorithms like SHA-256 face only minor speedups for attackers. The fix for those is straightforward (use larger output sizes if needed).

This is why the quantum threat is specifically aimed at **asymmetric cryptography**, not symmetric encryption.

## Post‑Quantum Cryptography

So if asymmetric cryptography is vulnerable, what replaces it?

The answer is a new class of algorithms based on mathematical problems that are **hard for both classical and quantum computers.** The leading approach: **[lattice-based cryptography](https://blog.cloudflare.com/lattice-crypto-primer).**

A lattice is a grid of points in space. Think of graph paper, now extend that to **hundreds or thousands of dimensions.** In these high-dimensional lattices, there are two famously hard problems: the **Shortest Vector Problem (SVP)** find the shortest non-zero vector in the lattice, and the **Closest Vector Problem (CVP)** given a point, find the nearest lattice point.

These are believed to be **hard even for quantum computers.** Shor's algorithm works because asymmetric cryptography has a specific algebraic structure that quantum computers can exploit through quantum tricks. Lattice problems do not have that structure... yet.

### The New Standards

**[NIST](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards)** finalised its first set of post-quantum cryptographic standards. Three algorithms made the cut:

- **[ML-KEM](https://csrc.nist.gov/pubs/fips/203/final)** Key exchange, based on Module Learning With Errors
- **[ML-DSA](https://csrc.nist.gov/pubs/fips/204/final)** Digital signatures, same basis
- **[SLH-DSA](https://csrc.nist.gov/pubs/fips/205/final)** Digital signatures as a backup, based on hash functions

**ML-KEM** is the headline algorithm. It allows two parties to establish a shared secret over an insecure channel, which is exactly what RSA or ECC is used for in protocols like TLS.

These are not experimental algorithms. They have been through **years of public inspection** by the global cryptography community. They are ready to use.

## Where We Are Now

The standards exist. The algorithms are ready. The ecosystem is catching up. **OpenSSL 3.x** is adding post-quantum key exchange support. **TLS 1.3** is the foundation that post-quantum algorithms will plug into. The [Open Quantum Safe project](https://openquantumsafe.org/) provides open-source implementations we can use today.

Most production systems have not migrated yet, and that is expected. Cryptographic transitions are slow. TLS 1.3 was finalised in 2018 and is still not universal. SHA-1 was deprecated years ago and still shows up in the wild.

I think the hardest part isn’t swapping algorithms. It’s **discovering where cryptography is embedded in our systems.** Many systems have cryptographic dependencies buried in third-party libraries, hardware security modules, or protocols that have not been touched for years.

## What Should We Do?

The quantum computer that breaks asymmetric cryptography does not exist yet. But the data being encrypted today might still need to be secret when it does.

**Understand the exposure**

Audit where your systems use asymmetric cryptography. TLS certificates, SSH keys, JWT signing, code signing, VPN configurations: anywhere asymmetric cryptography is in use is a potential migration target.

**Prioritise long-lived sensitive data**

If your data needs to stay confidential for more than 10 years, the harvest now decrypt later threat applies today. Encrypt it with algorithms that are post-quantum safe.

**Hybrid approaches during transition**

Many implementations combine classical and post-quantum algorithms. If either is secure, the combined scheme is secure. This is a pragmatic way to add quantum resistance; it does not mean that we forget existing threats.

**Follow NIST and your platform vendors**

Early awareness matters more than immediate migration.

### For Java and JVM Developers

Java developers have a practical path forward today. If you're using the [Bouncy Castle](https://www.bouncycastle.org/) library, it already supports `ML-KEM` and other post-quantum algorithms. Here is a minimal example of key encapsulation using ML-KEM:

```java
// Register the Bouncy Castle PQC provider
Security.addProvider(new BouncyCastlePQCProvider());

// Generate an ML-KEM (Kyber) key pair
KeyPairGenerator kpg = KeyPairGenerator.getInstance("KYBER", "BCPQC");
kpg.initialize(KyberParameterSpec.kyber768, new SecureRandom());
KeyPair keyPair = kpg.generateKeyPair();

// The public key is shared; the private key stays secret ;)
PublicKey publicKey = keyPair.getPublic();
PrivateKey privateKey = keyPair.getPrivate();
```

Java 24+ versions are also adding native support for post-quantum algorithms through [JEP 496](https://openjdk.org/jeps/496) (Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism). We probably won't need a third-party library eventually.

For now, the practical steps are:

- Audit the use of asymmetric cryptography and experiment using Bouncy Castle in your projects with ML-KEM
- Watch for newer Java versions and the JDK's built-in post-quantum support

## Final Thought

The history of encryption is a history of **staying one step ahead.** Encryption has always evolved when assumptions changed. Not because the old assumptions were wrong, but because a new kind of computer changes what **"not feasible"** means.

We’re not in crisis mode. But we’re also not too early to care. I think the right approach is awareness, experiment, then gradual adoption.

## Resources

- [Cloudflare's Post-Quantum Blog Series](https://blog.cloudflare.com/tag/post-quantum/): practical, engineering-focused writing on the transition
- [Harvest Now, Decrypt Later (Cloudflare)](https://blog.cloudflare.com/harvest-now-decrypt-later/): more details on the long-term data collection threat
- [Why Is Quantum Computing So Hard to Explain? (Quanta Magazine)](https://www.quantamagazine.org/why-is-quantum-computing-so-hard-to-explain-20210608/): an excellent non-technical explanation
- [PQClean (GitHub)](https://github.com/PQClean/PQClean): clean, portable reference implementations for the PQC algorithms
- [NISQ Era (Wikipedia)](https://en.wikipedia.org/wiki/Noisy_intermediate-scale_quantum_era): more context on the current state of quantum hardware

## Further Reading

- [The Oracle Post-Quantum Cryptography Roadmap (Oracle Security)](https://www.oracle.com/security/post-quantum-cryptography/): the official strategy for bringing quantum-safe algorithms to the Java ecosystem and Oracle Cloud.
- [Post-Quantum Cryptography in Chrome (Chromium Blog)](https://blog.chromium.org/2023/08/protecting-chrome-traffic-with-control.html): how Google is using hybrid ML-KEM to protect web traffic today.
- [Post-Quantum Cryptography at AWS (AWS Security Blog)](https://aws.amazon.com/blogs/security/post-quantum-cryptography-at-aws-for-security-and-resilience/): an overview of AWS’s strategy for quantum-safe communication and hybrid key exchange.
