---
title: 'Refactoring Gone Wild: Avoiding code smells and cleaning up the mess'
date: '2025-04-11'
tags: ['kotlin', 'refactoring', 'best practices', 'clean code']
images: ['/articles/refactoring-gone-wild-avoiding-code-smells-and-cleaning-up-the-mess/banner.png']
summary: 'Identifying and avoiding bad coding practices, and refactoring them into clean, elegant, self-explanatory code'
authors: ['mohamed-elmedany']
theme: 'blue'
---

Recently, I was refactoring a big part of one of the core domain services my team works on, and I ran into some classic bad practices. These are the kinds of mistakes most engineers, including myself, fall into because of tight deadlines, lack of knowledge about the tools and frameworks in use, and the ever-present "I will clean this up later" syndrome. I thought it would be fun to share some of these as a reference for others, and future me, to avoid them next time.

If you have ever wrestled with legacy code, you might recognise these patterns. Let's break them down and transform messy, hard-to-maintain code into something clean, elegant, and self-explanatory, powered by Kotli's built-in features!

## 1. The Pyramid of Doom

We have all been there, checking one condition after another, nesting deeper and deeper until the code starts looking like an ancient pyramid. As an Egyptian, I love pyramids, but not this kind. Unlike those architectural marvels, our code pyramids are a nightmare to maintain, not something to admire.

**Before (Deeply nested and hard to read)**

```kotlin
fun attemptToSendNotification(user: User?) {
    user?.let { validUser ->
        if (validUser.hasEnabledNotifications()) {
            val deviceToken = validUser.getDeviceToken()
            if (deviceToken != null) {
                val notificationService = getNotificationService()
                if (notificationService.isAvailable()) {
                    notificationService.sendTo(deviceToken)?.let { result ->
                        if (result.isSuccessful) {
                            // Finally! We did it!
                            Log.info("Sent notification to ${validUser.name}")
                        } else {
                            Log.error("Failed to send: ${result.errorMessage}")
                        }
                    }
                } else {
                    Log.error("Service unavailable")
                }
            } else {
                Log.error("No device token")
            }
        } else {
            Log.error("Notifications disabled")
        }
    } ?: Log.error("No user found")
}
```

**After (Clear and readable)**

```kotlin
fun attemptToSendNotification(user: User?) {
    val validUser = user ?: run {
        Log.error("No user found")
        return
    }

    if (!validUser.hasEnabledNotifications()) {
        Log.error("Notifications disabled")
        return
    }

    val deviceToken = validUser.getDeviceToken() ?: run {
        Log.error("No device token")
        return
    }

    val notificationService = getNotificationService()
    if (!notificationService.isAvailable()) {
        Log.error("Service unavailable")
        return
    }

    val result = notificationService.sendTo(deviceToken) ?: return

    if (result.isSuccessful) {
        Log.info("Sent notification to ${validUser.name}")
    } else {
        Log.error("Failed to send: ${result.errorMessage}")
    }
}
```

The `guard clause` pattern in the improved version makes the code flow more natural, almost like reading a story. Each check serves as a gatekeeper, immediately handling failures and allowing only the valid path to proceed, eliminating unnecessary nesting.

## 2. The Name Confusion

Ever worked on a codebase where `customer,` `client,` `user,` and `account` were used interchangeably? Or where some functions used `camelCase` while others used `snake_case`? And let's not forget those cryptic function names that give no hint about their purpose. Welcome to naming hell, where consistency is optional, and confusion is guaranteed!

**Before (Confusing naming conventions)**

```kotlin
class OrderProcessor {
    private fun processShipment(Shipment: Shipment) { /* ... */ }
    private fun processshipment(shipment: Shipment) { /* ... */ }
    private fun shipped(shipment: Shipment): Boolean { /* ... */ }
    private fun shipment_delivered(s: Shipment): Boolean { /* ... */ }
    private fun check(shipment: Shipment): Boolean { /* ... */ }
}
```

**After (Consistent and clear)**

```kotlin
class OrderProcessor {
    private fun processStandardShipment(shipment: Shipment) { /* ... */ }
    private fun processExpressShipment(shipment: Shipment) { /* ... */ }
    private fun isShipped(shipment: Shipment): Boolean { /* ... */ }
    private fun isDelivered(shipment: Shipment): Boolean { /* ... */ }
    private fun isShipmentComplete(shipment: Shipment): Boolean { /* ... */ }
}
```

Your future self, and your colleagues, will thank you for consistent naming conventions. It is like organising your toolbox, everything has its place, and finding the right tool is effortless!

## 3. The Mystery Parameters

Ah, the joy of encountering a function with eight different, including boolean, parameters. Is that value for this, that, or even the other one? Who knows? It is a guessing game that only leads to confusion!

**Before (Guessing game)**

```kotlin
// What do all these parameters mean?
sendOrderConfirmation("ORD-12345", "customer@example.com", true, false, true, 50.0, "EUR", false)
```

**After (Self-explaining parameters)**

```kotlin
data class DeliveryOptions(
    val isExpressDelivery: Boolean = false,
    val hasGiftWrapping: Boolean = false,
    val sendSmsNotification: Boolean = false,
    val specialInstructions: String? = null
)

sendOrderConfirmation(
    orderId = "ORD-12345",
    customerEmail = "customer@example.com",
    deliveryOptions = DeliveryOptions(
        isExpressDelivery = true,
        sendSmsNotification = true
    ),
    totalPaid = 50.0,
    currencyCode = "EUR",
    isBusinessOrder = false
)
```

Extracting parameters into a data class improves structure by grouping related values and providing optional ones with defaults. In the same context, using Kotlin's named arguments when calling the function is like wearing name tags at a networking event, everyone knows who-is-who without awkward guessing.

## 4. The Monolithic Monster Function

We have all encountered, or maybe even created, that massive function that does everything, from data validation to business logic to formatting output. It becomes a beast no one dares to touch, too scary to refactor. Even your most experienced team members will avoid it, hoping someone else will take the responsibility.

**Before (The black hole in the codebase)**

```kotlin
fun processCustomerOrder(order: Order, customer: Customer): OrderResult {
    // 30 lines of validation

    if (order.items.isEmpty()) {
        throw IllegalArgumentException("Order must have items")
    }
    if (customer.address == null) {
        throw IllegalArgumentException("Customer must have address")
    }
    // ... 20 more validation checks ...

    // ... 40 lines of business logic ...
    val totalPrice = order.items.sumOf { it.price * it.quantity }
    val tax = calculateTax(totalPrice, customer.address.country)
    val discount = if (customer.isVip) totalPrice * 0.1 else 0.0
    // ... 35 more lines of calculations ...

    // ... 30 lines of database operations
    databaseClient.beginTransaction()
    try {
        val savedOrder = databaseClient.saveOrder(order)
        databaseClient.updateInventory(order.items)
        // ... more database operations ...
        databaseClient.commitTransaction()
    } catch (e: Exception) {
        databaseClient.rollbackTransaction()
        throw e
    }

    // ... 25 lines of notification logic
    if (customer.hasEmailNotifications) {
        emailService.sendOrderConfirmation(order, customer.email)
    }
    // ... more notification logic ...

    // ... 15 lines of result building
    return OrderResult(
        // ... many fields ...
    )
}
```

**After (Focused, testable modular functions)**

```kotlin
fun processCustomerOrder(order: Order, customer: Customer): OrderResult {
    validateOrderAndCustomer(order, customer)

    val orderDetails = calculateOrderDetails(order, customer)

    val savedOrder = persistOrderData(order, orderDetails)

    sendNotifications(order, customer)

    return buildOrderResult(savedOrder, orderDetails)
}

private fun validateOrderAndCustomer(order: Order, customer: Customer) {
    // Focused validation logic
}

private fun calculateOrderDetails(order: Order, customer: Customer): OrderDetails {
    // Focused business logic
}

// Additional helper functions...
```

Breaking down giant functions into smaller ones is like cleaning up a messy toolbox. You no longer waste time looking for the right tool. When you need to fix something, it is possible to quickly find the problem instead of getting lost in a big, confusing block of code, saving you from those "Where on earth is this even going wrong?" moments.

## 5. The Null-Check Jungle

Kotlin provides powerful tools to handle nullability, yet we often find ourselves writing one null check after another, or worse, nesting them. Each checks again on top of the previous one, growing taller with every "just to be safe" condition. Kotlin's null-handling features can save us from this mess. Once again, not my preferred type of pyramids.

**Before (The just to be safe null checks)**

```kotlin
fun getCustomerShippingLabel(orderId: String?): String {
    val order = orderRepository.findById(orderId)
    if (order != null) {
        val customer = order.customer
        if (customer != null) {
            val address = customer.shippingAddress
            if (address != null) {
                val postalCode = address.postalCode
                if (postalCode != null) {
                    // Finally! We did it!
                    return formatShippingLabel(customer.name, address, postalCode)
                } else {
                    return "Missing postal code"
                }
            } else {
                return "Missing address"
            }
        } else {
            return "Missing customer"
        }
    } else {
        return "Order not found"
    }
}
```

**After (Efficient null handling)**

```kotlin
fun getCustomerShippingLabel(orderId: String?): String {
    return orderRepository.findById(orderId)
        ?.customer
        ?.shippingAddress
        ?.postalCode
        ?.let { postalCode ->
            val address = orderRepository.findById(orderId)
                ?.customer
                ?.shippingAddress
                ?: return "Missing address"

            val name = orderRepository.findById(orderId)
                ?.customer
                ?.name
                ?: return "Missing customer name"

            formatShippingLabel(name, address, postalCode)
        } ?: "Invalid order information"
}
```

**Even better**

```kotlin
fun getCustomerShippingLabel(orderId: String?): String {
    val order = orderRepository.findById(orderId) ?: return "Order not found"
    val customer = order.customer ?: return "Missing customer"
    val address = customer.shippingAddress ?: return "Missing address"
    val postalCode = address.postalCode ?: return "Missing postal code"

    return formatShippingLabel(customer.name, address, postalCode)
}
```

Kotlin's safe call operator `?.` and Elvis operator `?:` are efficient tools that help you avoid null pointer exceptions effortlessly. They allow you to handle nullability in a clean, concise, and safe way, keeping your code sharp and bug-free.

## 6. The Puzzle of Boolean Expressions

Complex boolean expressions with unclear meaning are like puzzles left for the next developer to solve. They create a cryptic mess of conditions, leading only to confusion and frustration.

**Before (Boolean puzzle)**

```kotlin
if (shipment.status == "DELIVERED" || shipment.status == "DELIVERED_DAMAGED" ||
    shipment.status == "DELIVERED_INCOMPLETE" || shipment.status == "REFUSED" ||
    (shipment.status == "LOST" && shipment.reportFiled) ||
    (shipment.status == "RETURNED" && shipment.receivedAtWarehouse)) {
    completeOrderProcess()
}
```

**After (Self-explanatory code)**

```kotlin
private fun isShipmentCompleted(shipment: Shipment): Boolean {
    val deliveredStatuses = setOf("DELIVERED", "DELIVERED_DAMAGED", "DELIVERED_INCOMPLETE", "REFUSED")

    val isShipmentLostWithReport = shipment.status == "LOST" && shipment.reportFiled

    return when {
        shipment.status in deliveredStatuses -> true
        isShipmentLostWithReport -> true
        isShipmentReturned(shipment) -> true
        else -> false
    }
}

private fun isShipmentReturned(shipment: Shipment) = shipment.status == "RETURNED" && shipment.receivedAtWarehouse
```

Extracting boolean expressions into well-named variables or functions transforms cryptic conditions into clear, readable business rules. It is like turning a complex riddle into a straightforward, easy-to-understand story that anyone can read and follow.

## 7. The Error Handling Chaos

Inconsistent error handling feels like navigating a maze with no map, you never know which path will lead to a dead end or where the next issue will pop up. One wrong turn, and you are stuck trying to figure out how to fix it, instead of catching errors predictably and efficiently.

**Before (Inconsistent error handling)**

```kotlin
fun processPayment(payment: Payment) {
    try {
        paymentGateway.process(payment)
    } catch (e: Exception) {
        Log.error("Payment", "Failed to process payment", e)
        throw RuntimeException("Payment processing failed")
    }
}

fun refundPayment(paymentId: String) {
    try {
        paymentGateway.refund(paymentId)
    } catch (e: Exception) {
        // Swallow the exception and continue, who cares!
    }
}

fun verifyPayment(paymentId: String): Boolean {
    return try {
        paymentGateway.verify(paymentId)
        true
    } catch (e: Exception) {
        false
    }
}
```

**After (Consistent error handling)**

```kotlin
fun processPayment(payment: Payment) {
    executePaymentOperation {
        paymentGateway.process(payment)
    }
}

fun refundPayment(paymentId: String) {
    executePaymentOperation(allowFailure = true) {
        paymentGateway.refund(paymentId)
    }
}

fun verifyPayment(paymentId: String): Boolean {
    return executePaymentOperationWithResult(defaultValue = false) {
        paymentGateway.verify(paymentId)
        true
    }
}

private fun <T> executePaymentOperationWithResult(defaultValue: T, operation: () -> T): T {
    return try {
        operation()
    } catch (e: Exception) {
        logPaymentError(e)
        defaultValue
    }
}

private fun executePaymentOperation(allowFailure: Boolean = false, operation: () -> Unit) {
    try {
        operation()
    } catch (e: Exception) {
        logPaymentError(e)
        if (!allowFailure) {
            throw PaymentException("Payment operation failed", e)
        }
    }
}

private fun logPaymentError(e: Exception) {
    Log.error("Payment", "Payment operation failed", e)
}
```

Standardising and centralising error handling makes your code more predictable and easier to debug. It is like having a clear fire escape plan. When something goes wrong, there is no panic or guessing, just a straightforward path to safety.

## 8. The Mutable Collections Overuse

Using mutable collections when immutability is enough, like giving everyone in the office a key to the server room. Sooner or later, someone is going to mess with something they should not. Immutability keeps things secure and under control, preventing unintended modifications and hard-to-track errors.

**Before (Unnecessary mutability)**

```kotlin
fun getActiveUsers(allUsers: MutableList<User>): MutableList<User> {
    val result = ArrayList<User>()
    for (user in allUsers) {
        if (user.isActive) {
            result.add(user)
        }
    }
    return result
}
```

**After (Embracing immutability)**

```kotlin
fun getActiveUsers(allUsers: List<User>): List<User> = allUsers.filter { it.isActive }
```

Unless you have a clear, unavoidable need for mutability, immutability is your best defence against bugs caused by unexpected state changes.

## 9. The Validation Repetition

Repetition of the same validation logic across multiple functions is not just redundant, it is highly error-prone. Each duplicate increases the chance of inconsistency, making maintenance a nightmare. Centralising validation logic keeps the code clean, consistent, and easier to manage.

**Before (Scattered validation)**

```kotlin
fun createOrder(order: Order) {
    if (order.items.isEmpty()) {
        throw ValidationException("Order must have at least one item")
    }
    if (order.customer.email.isBlank()) {
        throw ValidationException("Customer email is required")
    }
    // Process order
}

fun updateOrder(order: Order) {
    if (order.items.isEmpty()) {
        throw ValidationException("Order must have at least one item")
    }
    if (order.customer.email.isBlank()) {
        throw ValidationException("Customer email is required")
    }
    // Update order
}
```

**After (Centralised validation)**

```kotlin
fun createOrder(order: Order) {
    validateOrder(order)
    // Process order
}

fun updateOrder(order: Order) {
    validateOrder(order)
    // Update order
}

private fun validateOrder(order: Order) {
    require(order.items.isNotEmpty()) { "Order must have at least one item" }
    require(order.customer.email.isNotBlank()) { "Customer email is required" }
}
```

Centralising validation logic keeps your code consistent and easy to maintain. When validation rules change, and they always do, you will only need to update them in one place, saving time and preventing scattered mistakes.

## 10. The Coroutine Chaos

Misusing coroutines opens the door to memory leaks, unpredictable behaviour, and debugging headaches that make you question your life choices. Understanding coroutine scopes and lifecycle management helps you avoid these mistakes and keep your code running smoothly.

**Before (Coroutine misuse)**

```kotlin
fun loadUserData(userId: String, callback: (UserData) -> Unit) {
    // Creating a new scope for every call can lead to leaks
    CoroutineScope(Dispatchers.IO).launch {
        val userData = userRepository.fetchUserData(userId)

        // Switching to main thread for UI updates
        withContext(Dispatchers.Main) {
            callback(userData)
        }
    }
}

fun refreshAllData() {
    // Fire and forget without any error handling
    CoroutineScope(Dispatchers.IO).launch {
        dataRepository.refreshAll()
    }
}
```

**After (Structured concurrency)**

```kotlin
// In a service or any other component
fun loadUserData(userId: String, callback: (UserData) -> Unit) {
    serviceScope.launch {
        try {
            val userData = withContext(Dispatchers.IO) {
                userRepository.fetchUserData(userId)
            }
            callback(userData)
        } catch (e: Exception) {
            handleError(e)
        }
    }
}

fun refreshAllData() {
    serviceScope.launch {
        try {
            withContext(Dispatchers.IO) {
                dataRepository.refreshAll()
            }
        } catch (e: Exception) {
            handleError(e)
        }
    }
}

// For truly fire-and-forget operations
fun logAnalyticsEvent(event: AnalyticsEvent) {
    CoroutineScope(Dispatchers.IO).launch {
        try {
            analyticsService.logEvent(event)
        } catch (e: Exception) {
            Log.error("Analytics", "Failed to log event", e)
        }
    }
}
```

Structured concurrency ensures coroutines are properly managed and cancelled when their parent scope is cancelled, similar to how database connection pools prevent resource leaks by closing connections when transactions complete.

## 11. The idiomatic Kotlin practices

Kotlin offers many powerful features that make code more concise and expressive. Yet there are times when we still end up writing overly structured code in Kotlin files.

**Before (Verbose code)**

```kotlin
fun getCategorizedProducts(products: List<Product>): Map<String, List<Product>> {
    val result = HashMap<String, ArrayList<Product>>()

    for (product in products) {
        val category = product.category
        if (!result.containsKey(category)) {
            result[category] = ArrayList()
        }
        result[category]!!.add(product)
    }

    return result
}
```

**After (Idiomatic Kotlin)**

```kotlin
fun getCategorizedProducts(products: List<Product>): Map<String, List<Product>> = products.groupBy { it.category }
```

By using Kotlin's `groupBy` function, we not only simplify the code into a concise one-liner but also boost readability.

**Before (Verbose code)**

```kotlin
fun getUserAge(user: User?): Int? {
    if (user != null && user.age > 18) {
        return user.age
    }
    return null
}
```

**After (Idiomatic Kotlin)**

```kotlin
fun getUserAge(user: User?): Int? = user?.age.takeIf { it > 18 }
```

By using Kotlin's safe call operator `?.` and the `takeIf` function, we make the code more concise and expressive, handling nulls and conditional logic in a single line.

**Before (Verbose code)**

```kotlin
fun processPayment(payment: Payment) {
    var attempt = 0
    val maxRetries = 3
    while (attempt < maxRetries) {
        try {
            // Try to process the payment
            return paymentGateway.process(payment)
        } catch (e: Exception) {
            attempt++
            if (attempt < maxRetries) {
                Log.error("Payment failed to process payment, retrying (attempt ${attempt})", e)
            }
        }
    }
    throw RuntimeException("Payment processing failed after $maxRetries attempts", e)
}
```

**After (Idiomatic Kotlin)**

```kotlin
fun processPayment(payment: Payment, maxRetries: Int = 3) {
    repeat(maxRetries) { attempt ->
        try {
            // Try to process the payment
            return paymentGateway.process(payment)
        } catch (e: Exception) {
            if (attempt < maxRetries - 1) {
                Log.error("Failed to process payment, retrying (attempt ${attempt + 1})", e)
            }
        }
    }
    throw RuntimeException("Payment processing failed after $maxRetries attempts")
}
```

By using the `repeat` function, we can cleanly iterate the retry logic without manually managing the attempt count, making the code more concise and readable.

**Even better with an extracted reusable function and `runCatching`**

```kotlin
fun <T> retryOperation(maxRetries: Int, operation: () -> T): T {
    repeat(maxRetries) {
        runCatching { operation() }  // Try executing the operation
            .onFailure { e ->
                if (attempt < maxRetries - 1) {
                    Log.error("Retry operation failed, retrying...", e)
                }
            }.getOrNull() // Return the result on success
    }
    throw RuntimeException("Operation failed after $maxRetries attempts")
}

fun processPayment(payment: Payment) {
    return retryOperation(3) {
        // Try to process the payment
        paymentGateway.process(payment)
    }
}
```

By extracting the retry logic into a reusable `retryOperation()` function, we not only make the `processPayment()` function more readable but also create a utility that can be used across different parts of the codebase, improving maintainability and reducing duplication.

There are countless other examples. Mastering Kotlin's standard library functions gives you a powerful toolkit for any task. These built-in functions are designed to make your code more expressive, concise, and maintainable, allowing you to focus on solving business problems instead of reinventing the wheel.

## Conclusion

These patterns may seem small on their own, but they add up quickly. The good news is that refactoring them is often simple and highly satisfying, like tidying up your desk and instantly feeling more organised.

Even experienced developers can fall into these traps. The key is to spot them and improve your codebase gradually. You don't need to fix everything at once. Small, incremental progress still makes a big difference.

Happy coding!
