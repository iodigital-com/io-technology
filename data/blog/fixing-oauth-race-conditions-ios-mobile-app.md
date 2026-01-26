---
title: 'Fixing OAuth Race Conditions in iOS Mobile Apps with App Extensions'
date: '2026-01-23'
tags: ['mobile', 'ios']
images: ['/articles/fixing-oauth-race-conditions-ios-mobile-app/race_conditions.jpg']
summary: 'How to prevent token conflicts between your app, widgets, and background services'
authors: ['thomas-sempf']
theme: 'beige'
---

Widgets. App Clips. Notification services.

They've all become part of the modern iOS experience. And they all run separately from the main app —which is great from a performance and battery perspective but can easily lead to coordination problems.

If these extensions need access to live data, they'll need to fetch it on their own and for that authentication is needed. And that's where things can get difficult.

Because when your app and its extensions both try to update the same OAuth token at the same time, you're risking:

- Failed authentication
- Unexpected logouts
- Hard-to-trace race conditions

Luckily, Apple gives us some tools to prevent and improve these scenarios.

## TL;DR

**Short-lived tokens + multiple iOS processes = race conditions waiting to happen.**

This locking approach makes sure only one process updates your OAuth state at a time — cleanly and safely.

## Why OAuth Fails in Mobile Apps Using iOS Extensions

On iOS, apps and their extensions run in separate processes. That means they can't share in-memory state — but they can share tokens using app groups, shared keychains, and user defaults. Since extensions can't launch a full sign-in flow on their own, they rely entirely on a shared authentication state provided by the main app.

That works fine until both the app and an extension decide to refresh the token at the same time.

It happens more often than one would think — especially scenarios where a higher security is needed from the authentication system, e.g. if you're using short-lived access tokens and refresh tokens are regularly updated.

Without coordination, this can lead to silent failures, corrupted state, or users being mysteriously logged out.

## Real-World Example: OAuth Token Conflicts in a Mobile App

Working with one of our clients, we ran into this specific problem: a high-profile app with many users spread out over several markets and high security requirements concerning the OAuth tokens.

We started to experience a higher frequency of log-out issues on all markets, especially since we added support for iOS Widgets to the app. As normally, the issue happened very seldom during QA tests, as the amount of test cycles to produce this issue was too low.

So, we started intensively analyzing user logs to really find out what was happening. The process took several weeks to find out the real culprit behind this, which led to the solution described in this article. Luckily, with this fix in place, the problem vanished rapidly after an app update.

## The Fix: A Local Locking Mechanism

The good news? There's a lightweight, built-in way to handle this safely.

For this we utilize the `NSFileCoordinator` class, a native API from Apple, which coordinate access to a shared file in the app group container and guarantees atomic operations.

Here’s how it works (find all the nitty-gritty details in the Swift code below):

![Flow diagram of the locking mechanism](/articles/fixing-oauth-race-conditions-ios-mobile-app/diagram-overview.png)

Here's how it works:

### Step 1: Try to acquire the lock

- We use the NSFileCoordinator to attempt writing to a specified file in the shared app group container.
- A successful access indicates a lock acquisition; otherwise, we employ exponential backoffs and retries.
- If the file exists, we check its creation date. Older files are stale data, so we allow lock acquisition by creating a new one. If it is a recent file, it means another extension is updating the OAuth token; so we fail to acquire the lock and retry later.

### Step 2: Refresh the OAuth token

Once the lock is held, we update the token and store for later retrieval.

### Step 3: Release the lock

We remove the file and the lock onto it, indicating for others that the token update process is finished.

### The Swift Implementation

```swift
func acquireLock() async -> Bool {
    // URL based in the shared group file container
    guard let lockFileURL = getLockFileURL() else {
        return false
    }

    var retryCount = 0
    var backoffTime: TimeInterval = 0.2

    while retryCount < 5 {
        if attemptToAcquireLock(lockFileURL) {
            return true
        }

        retryCount += 1
        NSLog("FileLock: Retrying in \(backoffTime) seconds...")
        try? await Task.sleep(nanoseconds: UInt64(backoffTime * 1_000_000_000))
        backoffTime *= 2 // Exponential backoff
    }

    NSLog("FileLock: Failed to acquire lock after 5 retries.")
    return false
}

func releaseLock() {
    guard let lockFileURL = getLockFileURL() else {
        return
    }

    let coordinator = NSFileCoordinator()
    var error: NSError?

    coordinator.coordinate(writingItemAt: lockFileURL,
                          options: [],
                          error: &error) { (url) in
        do {
            try FileManager.default.removeItem(at: url)
            NSLog("FileLock: Lock released.")
        } catch {
            NSLog("FileLock: Failed to remove lock file: \(error.localizedDescription)")
        }
    }

    if let error = error {
        NSLog("FileLock: NSFileCoordinator error while releasing lock: \(error)")
    }
}

func attemptToAcquireLock(_ lockFileURL: URL) -> Bool {
    let coordinator = NSFileCoordinator()
    let lockTimeout: TimeInterval = 60
    var error: NSError?
    var success = false

    coordinator.coordinate(writingItemAt: lockFileURL,
                          options: [],
                          error: &error) { (url) in
        if let attributes = try? FileManager.default.attributesOfItem(atPath: url.path),
           let creationDate = attributes[.creationDate] as? Date {
            let timeElapsed = Date().timeIntervalSince(creationDate)
            if timeElapsed < lockTimeout {
                NSLog("FileLock: Lock is held by another process.")
                return
            } else {
                NSLog("FileLock: Lock expired. Forcing acquisition.")
            }
        }

        do {
            let lockContent = ISO8601DateFormatter().string(from: Date())
            try lockContent.write(to: url,
                                atomically: true,
                                encoding: .utf8)
            success = true
            NSLog("FileLock: Lock acquired.")
        } catch {
            NSLog("FileLock: Failed to create lock file: \(error.localizedDescription)")
        }
    }

    if let error = error {
        NSLog("FileLock: NSFileCoordinator error while acquiring lock: \(error)")
    }

    return success
}
```

### One Caveat (and a possible workaround)

If iOS decides to terminate the app or extension mid-refresh, the lock file might linger longer than intended. Using **beginBackgroundTask** can help mitigate this issue.

## Why It Matters

If you're leading a mobile team — whether as a CTO, Head of Engineering, or Mobile Architect — this is the kind of foundational fix that:

- Improves stability
- Reduces hard to trace bugs
- Prevents support tickets
- Keeps authentication working and reliable

It's simple, effective, and uses Apple-native APIs. No SDKs, no hacks, no extra overhead.

## Summary: A Lightweight OAuth Fix for Stable iOS App Auth

Managing OAuth across iOS apps and extensions isn't always straightforward, especially when higher security is involved and tokens are short-lived.

This solution adds a small locking mechanism that keeps your app and extensions from stepping on each other's toes when refreshing the OAuth state.

It's a lightweight fix that helps keep authentication smooth, stable, and frustration-free.
