---
title: 'How to write effective and clean unit tests in JavaScript'
date: '2025-02-14'
tags: ['javascript', 'testing', 'unit-tests', 'jest', 'best-practices']
images: ['/articles/how-to-write-effective-and-clean-unit-tests/banner.png']
summary: 'Learn essential best practices for writing clean and effective unit tests in JavaScript. From using descriptive test cases to following the Arrange-Act-Assert pattern, discover how to enhance your testing practices for better code quality and maintainability.'
authors: ['komeil-mehranfar']
theme: 'blue'
---

In this article, I'd like to share some best practices for writing unit tests in JavaScript that I've found useful, focusing on clarity, readability, and maintainability.

## Table of Contents

- [Use it() instead of test()](#use-it-instead-of-test)
- [Focus on behavior, not implementation](#focus-on-behavior-not-implementation)
- [Use describe() for context](#use-describe-for-context)
- [Split complex tests into multiple ones](#split-complex-tests-into-multiple-ones)
- [Use the arrange-act-assert pattern](#use-the-arrange-act-assert-pattern)
- [Use only one action per test](#use-only-one-action-per-test)
- [Avoid overriding global objects](#avoid-overriding-global-objects)
- [Avoid mocking internal functions](#avoid-mocking-internal-functions)
- [Don't break encapsulation for tests](#dont-break-encapsulation-for-tests)
- [Handle optional parameters carefully](#handle-optional-parameters-carefully)
- [Keep expected results close to assertions](#keep-expected-results-close-to-assertions)
- [Use meaningful test data](#use-meaningful-test-data)
- [Group related tests with nested describe blocks](#group-related-tests-with-nested-describe-blocks)
- [Use test data builders](#use-test-data-builders)
- [Clean up after tests](#clean-up-after-tests)
- [Test edge cases explicitly](#test-edge-cases-explicitly)
- [Avoid test interdependence](#avoid-test-interdependence)
- [Test async code properly](#test-async-code-properly)
- [Use parameterized tests for multiple cases](#use-parameterized-tests-for-multiple-cases)

## Use it() instead of test()

Don't:

```javascript
test('calculate total', () => {
  // Test implementation
})
```

Do:

```javascript
it('should calculate the cart total with discounts', () => {
  // Test implementation
})
```

Why:

- The `it()` function creates human-readable phrases that express the intended behavior.
- Improves readability by forming sentences like "it should calculate the cart total with discounts."
- Encourages writing behavior-focused tests rather than technical implementations.

## Focus on behavior, not implementation

Don't:

```javascript
it('should return false', () => {
  // Test implementation
})
```

Do:

```javascript
it('should show error message when email is invalid', () => {
  // Test implementation
})
```

Why:

- Describing tests in terms of behavior provides a better understanding of expected outcomes.
- Behavior-focused tests are easier to read and serve as effective documentation.
- Helps avoid coupling tests to specific implementations, making them more resilient to changes.

## Use describe() for context

Don't:

```javascript
it('should show username when authenticated', () => {
  // Test implementation
})
```

Do:

```javascript
describe('When user is authenticated', () => {
  it('should show username in header', () => {
    // Test implementation
  })
})
```

Why:

- `describe()` blocks provide context and group related tests together.
- Starting contexts with "When" enhances clarity about the test scenario.
- Allows for shared setup and teardown with `beforeEach` and `afterEach` within the context.

## Split complex tests into multiple ones

Don't:

```javascript
describe('When submitting the form', () => {
  it('should validate inputs and show errors and disable submit button', () => {
    // Test implementation
  })
})
```

Do:

```javascript
describe('When submitting the form', () => {
  beforeEach(() => {
    // Common setup for the tests
  })

  it('should validate email format', () => {
    // Test implementation
  })

  it('should show error messages for invalid fields', () => {
    // Test implementation
  })

  it('should disable submit button while processing', () => {
    // Test implementation
  })
})
```

Why:

- Splitting tests improves readability and maintainability.
- Each test focuses on a single behavior, making it easier to pinpoint issues.
- Facilitates better grouping and organization of tests.

## Use the arrange-act-assert pattern

Don't:

```javascript
it('should calculate total with tax', () => {
  const subtotal = 99.99
  const taxRate = 0.15
  const total = calculateTotal(subtotal, taxRate)
  expect(total).toEqual(114.99)
})
```

Do:

```javascript
it('should calculate total with tax', () => {
  // Arrange
  const subtotal = 99.99
  const taxRate = 0.15

  // Act
  const total = calculateTotal(subtotal, taxRate)

  // Assert
  expect(total).toEqual(114.99)
})
```

Why:

- The Arrange-Act-Assert (AAA) pattern structures tests clearly, separating preparation, execution, and verification.
- Enhances readability and helps quickly identify issues in failing tests.
- Provides a consistent format that makes tests easier to understand.

## Use only one action per test

Don't:

```javascript
it('should process order successfully', () => {
  // Arrange
  const items = ['book', 'pen']
  const userId = 'user123'

  // Act
  loginUser(userId)
  const order = createOrder(items)
  const confirmation = processPayment(order)

  // Assert
  expect(confirmation.status).toEqual('success')
})
```

Do:

```javascript
it('should process order successfully', () => {
  // Arrange
  loginUser('user123')
  const items = ['book', 'pen']
  const order = createOrder(items)

  // Act
  const confirmation = processPayment(order)

  // Assert
  expect(confirmation.status).toEqual('success')
})
```

Why:

- Focusing on a single action in the Act section clarifies what triggers the behavior.
- Multiple actions can create confusion about which action is under test.
- Simplifies debugging and understanding of the test's purpose.

## Avoid overriding global objects

Don't:

```javascript
it('should override the alert with a mock', () => {
  window.alert = jest.fn()
})

// Later tests
it('should use the mock alert', () => {
  // window.alert is still mocked here
})
```

Do:

```javascript
it('should use the mocked alert', () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {})
  // Test implementation
  jest.restoreAllMocks() // Restore after the test
})

// Other tests
it('should use the real alert', () => {
  // window.alert is back to its original implementation
})
```

Why:

- Directly modifying global objects can lead to side effects that affect other tests.
- `jest.spyOn()` allows safe mocking and restoration of global methods.
- Prevents hard-to-detect bugs and ensures test isolation.

## Avoid mocking internal functions

Don't:

```javascript
// utils.js
export function validateEmail(email) {
  return email.includes('@')
}

export function validateForm(formData) {
  return validateEmail(formData.email)
}

// test.js
import * as utils from './utils'

jest.spyOn(utils, 'validateEmail').mockReturnValue(true)

it('should validate form correctly', () => {
  const result = utils.validateForm({ email: 'test@example.com' })
  expect(result).toBe(true)
})
```

Do:

```javascript
// utils.js
function validateEmail(email) {
  return email.includes('@')
}

export function validateForm(formData) {
  return validateEmail(formData.email)
}

// test.js
import { validateForm } from './utils'

it('should validate form correctly', () => {
  const result = validateForm({ email: 'test@example.com' })
  expect(result).toBe(true)
})
```

Why:

- Mocking internal functions couples tests to implementation details, hindering refactoring.
- Tests should verify the output of public functions based on given inputs.
- Promotes better software design and maintainability.

## Don't break encapsulation for tests

Don't:

```javascript
// module.js
export function publicFunction() {
  // ...
}

export function privateHelper() {
  // ...
}

// test.js
import { privateHelper } from './module'

it('should test private helper', () => {
  // Test implementation
})
```

Do:

```javascript
// module.js
function privateHelper() {
  // ...
}

export function publicFunction() {
  privateHelper()
  // ...
}

// test.js
import { publicFunction } from './module'

it('should perform the expected behavior', () => {
  // Test implementation
})
```

Why:

- Exporting private functions solely for testing breaks encapsulation and can lead to brittle tests.
- Testing through public interfaces ensures that tests remain valid despite internal changes.
- Enhances code maintainability by allowing internal refactoring without breaking tests.

## Handle optional parameters carefully

Don't:

```javascript
it('should calculate discount with optional membership level', () => {
  const result1 = calculateDiscount(100, null)
  const result2 = calculateDiscount(100, 'gold')
  expect(result1).toBe(0)
  expect(result2).toBe(20)
})
```

Do:

```javascript
it('should apply no discount when membership level is not provided', () => {
  const result = calculateDiscount(100, null)
  expect(result).toBe(0)
})

it('should apply gold member discount when membership level is gold', () => {
  const result = calculateDiscount(100, 'gold')
  expect(result).toBe(20)
})
```

Why:

- Testing each execution path separately improves clarity.
- Helps ensure all scenarios with optional parameters are adequately tested.
- Makes it easier to identify which case fails if a test does not pass.

## Keep expected results close to assertions

Don't:

```javascript
it('should calculate final price', () => {
  const expectedPrice = 89.99
  const result = calculatePrice(79.99, 10)
  // ... other code ...
  expect(result).toBe(expectedPrice)
})
```

Do:

```javascript
it('should calculate final price', () => {
  const result = calculatePrice(79.99, 10)
  expect(result).toBe(89.99)
})
```

Why:

- Placing expected values near assertions improves readability.
- Reduces scrolling and context-switching while reading tests.
- Enhances the flow of the test from setup to assertion.

## Use meaningful test data

Don't:

```javascript
it('should format user name', () => {
  const result = formatName('a', 'b')
  expect(result).toBe('a b')
})
```

Do:

```javascript
it('should format user name', () => {
  const result = formatName('John', 'Doe')
  expect(result).toBe('John Doe')
})
```

Why:

- Using realistic test data makes tests more understandable and maintainable.
- Helps identify edge cases and potential issues with real-world data.
- Makes it easier for other developers to understand the purpose of the test.

## Group related tests with nested describe blocks

Don't:

```javascript
describe('UserProfile', () => {
  it('should show all fields when admin')
  it('should show limited fields when user')
  it('should show no fields when logged out')
})
```

Do:

```javascript
describe('UserProfile component', () => {
  describe('when editing mode', () => {
    describe('with admin privileges', () => {
      it('should show all editable fields', () => {
        // Test implementation
      })
    })

    describe('with user privileges', () => {
      it('should show limited editable fields', () => {
        // Test implementation
      })
    })
  })

  describe('when view mode', () => {
    it('should show read-only fields', () => {
      // Test implementation
    })
  })
})
```

Why:

- Nested describes create a clear hierarchy of test scenarios.
- Makes it easier to understand the context of each test.
- Helps organize tests logically and improves test suite navigation.

## Use test data builders

Don't:

```javascript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  role: 'admin',
  preferences: { theme: 'dark' },
}

it('should handle admin users', () => {
  const result = processUser(user)
  expect(result.hasAdminAccess).toBe(true)
})
```

Do:

```javascript
const createTestUser = (overrides = {}) => ({
  id: 1,
  name: 'John',
  email: 'john@example.com',
  role: 'user',
  preferences: { theme: 'light' },
  ...overrides,
})

it('should handle admin users', () => {
  const adminUser = createTestUser({ role: 'admin' })
  const result = processUser(adminUser)
  expect(result.hasAdminAccess).toBe(true)
})

it('should handle user preferences', () => {
  const userWithPreferences = createTestUser({
    preferences: { theme: 'dark', notifications: true },
  })
  const result = processUser(userWithPreferences)
  expect(result.theme).toBe('dark')
})
```

Why:

- Makes test data creation flexible and maintainable.
- Reduces duplication in test setup.
- Makes it easy to create variations of test data while maintaining defaults.

## Clean up after tests

Don't:

```javascript
describe('UserAPI', () => {
  const testData = []

  it('should create user', () => {
    testData.push(createUser())
  })

  it('should delete user', () => {
    // Previous test data might affect this test
  })
})
```

Do:

```javascript
describe('UserAPI', () => {
  beforeEach(() => {
    // Set up fresh test database
    initializeTestDB()
  })

  afterEach(() => {
    // Clean up test data
    clearTestDB()
    jest.clearAllMocks()
  })

  afterAll(() => {
    // Close database connection
    closeTestDBConnection()
  })

  it('should create user', async () => {
    const result = await createUser()
    expect(result.id).toBeDefined()
  })

  it('should delete user', async () => {
    // Each test starts with a clean state
    const user = await createUser()
    const result = await deleteUser(user.id)
    expect(result.success).toBe(true)
  })
})
```

Why:

- Ensures each test runs in isolation.
- Prevents test pollution and interdependence.
- Makes tests more reliable and predictable.

## Test edge cases explicitly

Don't:

```javascript
it('should divide numbers', () => {
  expect(divideNumbers(10, 2)).toBe(5)
})
```

Do:

```javascript
describe('divideNumbers function', () => {
  it('should divide positive numbers correctly', () => {
    expect(divideNumbers(10, 2)).toBe(5)
  })

  it('should handle division by zero', () => {
    expect(() => divideNumbers(10, 0)).toThrow('Division by zero')
  })

  it('should handle negative numbers', () => {
    expect(divideNumbers(-10, 2)).toBe(-5)
    expect(divideNumbers(10, -2)).toBe(-5)
    expect(divideNumbers(-10, -2)).toBe(5)
  })

  it('should handle decimal numbers', () => {
    expect(divideNumbers(10.5, 2)).toBe(5.25)
    expect(divideNumbers(10, 0.5)).toBe(20)
  })

  it('should handle very large numbers', () => {
    expect(divideNumbers(Number.MAX_SAFE_INTEGER, 2)).toBe(Number.MAX_SAFE_INTEGER / 2)
  })
})
```

Why:

- Ensures the code handles all possible scenarios correctly.
- Helps prevent bugs in edge cases.
- Serves as documentation for expected behavior in special cases.

## Avoid test interdependence

Don't:

```javascript
let sharedState

beforeEach(() => {
  sharedState = { value: 0 }
})

it('should increment value', () => {
  sharedState.value++
  expect(sharedState.value).toBe(1)
})

it('should multiply value', () => {
  // This test depends on the previous test's state
  sharedState.value *= 2
  expect(sharedState.value).toBe(2)
})
```

Do:

```javascript
it('should increment value', () => {
  const state = { value: 0 }
  state.value++
  expect(state.value).toBe(1)
})

it('should multiply value', () => {
  const state = { value: 1 }
  state.value *= 2
  expect(state.value).toBe(2)
})
```

Why:

- Makes tests more reliable and predictable.
- Easier to debug when tests fail.
- Allows tests to be run in any order.

## Test async code properly

Don't:

```javascript
it('should fetch user data', () => {
  fetchUserData().then((data) => {
    expect(data).toBeDefined()
  })
})

it('should handle API errors', () => {
  return fetchUserData().catch((error) => {
    expect(error).toBeDefined()
  })
})
```

Do:

```javascript
it('should fetch user data', async () => {
  const data = await fetchUserData()
  expect(data).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    email: expect.any(String),
  })
})

it('should handle API errors', async () => {
  await expect(fetchUserData('invalid-id')).rejects.toThrow('User not found')
})

it('should timeout after 5 seconds', async () => {
  await expect(async () => {
    await fetchUserData({ timeout: 5000 })
  }).rejects.toThrow('Request timeout')
})
```

Why:

- Ensures asynchronous operations are properly tested.
- Prevents false positives from unhandled promises.
- Makes async test code more readable and maintainable.

## Use parameterized tests for multiple cases

Don't:

```javascript
describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('should invalidate email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false)
  })

  it('should invalidate email without domain', () => {
    expect(validateEmail('test@')).toBe(false)
  })
})
```

Do:

```javascript
describe('validateEmail', () => {
  test.each([
    ['valid@email.com', true, 'standard email'],
    ['valid+label@email.com', true, 'email with plus addressing'],
    ['invalid.email', false, 'missing @ symbol'],
    ['@nousername.com', false, 'missing username'],
    ['spaces in@email.com', false, 'contains spaces'],
    ['valid@subdomain.email.com', true, 'multiple subdomains'],
    ['', false, 'empty string'],
    ['short@e.c', false, 'too short domain'],
  ])('validates %s as %s (%s)', (email, expected, description) => {
    expect(validateEmail(email)).toBe(expected)
  })
})
```

Why:

- Reduces code duplication.
- Makes it easy to add new test cases.
- Provides clear documentation of all test scenarios.
- Makes patterns in test cases more visible.

## Conclusion

Writing effective and clean unit tests is essential for developing reliable frontend applications. By following these best practices, you can create tests that are easy to understand, maintain, and scale. Focus on testing behaviors rather than implementations, structure your tests clearly with the Arrange-Act-Assert pattern, and ensure each test is isolated and focused.

These practices will help you write more maintainable, reliable, and effective unit tests. The goal is to create tests that are both thorough and easy to understand, helping to catch bugs early while serving as documentation for your code's behavior.
