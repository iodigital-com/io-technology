![iO logo](/public/io.svg)

> Do you like to contribute an article? Head over to [the contribution page](https://techhub.iodigital.com/contribute) to see how!

# iO tech_hub

This blog is based on [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog).

For info about how to use the frontmatter for meta info check their docs or copy it from another blogpost.

## Installation

```bash
npm install
```

## Development

First, run the development server:

```bash
npm start
```

or

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing Setup

This project uses **Vitest** and **React Testing Library** for comprehensive testing with **122 tests** across **12 test files**.

### Overview

- **Test Runner**: Vitest (fast, modern test runner with hot module replacement)
- **Component Testing**: React Testing Library (for testing React components)
- **Environment**: jsdom (simulates a browser environment)
- **Mocking**: Vitest built-in mocking capabilities
- **Coverage**: Comprehensive testing of utilities and components

### Test Files Structure

Test files are colocated next to the files they test in organized folders:

```
tests/
├── setup.js                          # Global test setup and mocks
└── test-utils.jsx                     # Custom render utilities and mock data

components/
├── ContentListing/
│   ├── ContentListing.js
│   ├── ContentListing.test.jsx        # Component tests
│   └── index.js                       # Barrel export
├── ContributorsGrid/
│   ├── ContributorsGrid.js
│   ├── ContributorsGrid.test.jsx      # Component tests
│   └── index.js                       # Barrel export
├── HeroSection/
│   ├── HeroSection.js
│   ├── HeroSection.test.jsx           # Component tests
│   └── index.js                       # Barrel export
├── Pagination/
│   ├── Pagination.js
│   ├── Pagination.test.jsx            # Component tests
│   └── index.js                       # Barrel export
├── Tag/
│   ├── Tag.js
│   ├── Tag.test.jsx                   # Component tests
│   └── index.js                       # Barrel export
└── ThemeSwitch/
    ├── ThemeSwitch.js
    ├── ThemeSwitch.test.jsx           # Component tests
    └── index.js                       # Barrel export

lib/
├── formatSlug/
│   ├── formatSlug.js
│   ├── formatSlug.test.js             # Utility function tests
│   └── index.js                       # Barrel export
├── jobs/
│   ├── jobs.js
│   ├── jobs.test.js                   # Job-related function tests
│   └── index.js                       # Barrel export
├── shuffle/
│   ├── shuffle.js
│   ├── shuffle.test.js                # Array shuffling tests
│   └── index.js                       # Barrel export
└── utils/
    ├── formatDate/
    │   ├── formatDate.js
    │   ├── formatDate.test.js          # Date formatting tests
    │   └── index.js                    # Barrel export
    ├── htmlEscaper/
    │   ├── htmlEscaper.js
    │   ├── htmlEscaper.test.js         # XSS prevention tests
    │   └── index.js                    # Barrel export
    └── kebabCase/
        ├── kebabCase.js
        ├── kebabCase.test.js           # String transformation tests
        └── index.js                    # Barrel export
```

### Running Tests

```bash
# Run tests once (default - perfect for CI/CD)
npm test
yarn test

# Run tests in watch mode (for development)
npm run test:watch
yarn test:watch

# Run tests with coverage
npm run test:coverage
yarn test:coverage

# Run tests with UI interface
npm run test:ui
yarn test:ui
```

### Test Coverage

#### ✅ Components (6 test files, 58 tests)

- **ContentListing** - List and grid layouts, author filtering, props handling
- **ContributorsGrid** - Grid display, contributor data, responsive layout
- **HeroSection** - Hero content, conditional elements, branding integration
- **Pagination** - Navigation, page calculations, accessibility
- **Tag** - Link generation, theme application, text transformation
- **ThemeSwitch** - Dark/light mode toggle, accessibility, keyboard navigation

#### ✅ Utilities (6 test files, 64 tests)

- **formatDate** - Date formatting, localization, error handling
- **formatSlug** - MDX slug generation, path handling
- **htmlEscaper** - XSS prevention, HTML entity escaping
- **jobs** - Job filtering, search, related job logic
- **kebabCase** - String transformation, special character handling
- **shuffle** - Array randomization, mutation behavior

### Writing Tests

#### Component Tests

Use the custom `render` function from `test-utils.jsx` which includes necessary providers:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../tests/test-utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interactions', () => {
    render(<MyComponent onSubmit={mockSubmit} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockSubmit).toHaveBeenCalled()
  })
})
```

#### Utility Function Tests

```javascript
import { describe, it, expect } from 'vitest'
import myUtility from './myUtility'

describe('myUtility', () => {
  it('transforms input correctly', () => {
    expect(myUtility('input')).toBe('expected output')
  })

  it('handles edge cases', () => {
    expect(myUtility(null)).toBe('fallback')
    expect(myUtility('')).toBe('')
  })
})
```

#### Mocking Best Practices

```javascript
import { vi } from 'vitest'

// Mock external components
vi.mock('../Link', () => ({
  default: ({ href, children }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}))

// Mock utilities with path awareness
vi.mock('../../lib/utils/kebabCase', () => ({
  default: (str) => str.toLowerCase().replace(/\s+/g, '-'),
}))

// Mock hooks
vi.mock('../../lib/hooks/useBrandingTheme', () => ({
  useBrandingTheme: vi.fn(() => ({ theme: 'blue' })),
}))
```

### Available Mock Data

The `test-utils.jsx` file provides commonly used mock data:

- `mockAuthor` - Sample author object with all required fields
- `mockPost` - Sample blog post object with frontmatter
- `mockContributor` - Sample contributor object for grid display

### Global Mocks

The following are automatically mocked in `setup.js`:

- `next/router` - Next.js router with push, back, reload methods
- `next/image` - Next.js Image component as img element
- `window.matchMedia` - For responsive/theme components
- `IntersectionObserver` - For scroll-based components
- `ResizeObserver` - For resize-aware components

### Configuration

The Vitest configuration is in `vitest.config.mjs`:

- **JSX Support**: Parses JSX in `.js` files using esbuild
- **Path Aliases**: `@/` points to project root for clean imports
- **Environment**: jsdom for DOM testing with React components
- **Globals**: Test utilities available without imports
- **Plugins**: React plugin for JSX transformation

### Best Practices Implemented

1. **📁 Colocated Tests** - Tests live next to source files for easy discovery
2. **♿ Accessibility First** - Use semantic queries (getByRole, getByLabelText)
3. **🎭 Smart Mocking** - Mock external dependencies, test your own code
4. **🔒 Security Testing** - XSS prevention and input validation tests
5. **📝 Descriptive Names** - Test names explain expected behavior clearly
6. **🎯 User-Focused** - Test user interactions, not implementation details
7. **🏗️ Organized Structure** - Barrel files and folder organization
8. **⚡ Performance** - Fast test execution with parallel runs
9. **🔧 Error Handling** - Comprehensive edge case and error testing
10. **📊 Statistical Testing** - For non-deterministic functions (shuffle)

### Quality Metrics

- ✅ **122 tests** across **12 test suites**
- ✅ **100% passing** test rate
- ✅ **Zero warnings** or errors
- ✅ **Comprehensive coverage** of components and utilities
- ✅ **Security-focused** testing for XSS prevention
- ✅ **Accessibility testing** for ARIA and keyboard navigation
- ✅ **Error handling** for edge cases and invalid inputs
- ✅ **Performance optimized** with parallel execution

### Troubleshooting

#### Common Issues

1. **Import Path Errors**: Check `vitest.config.mjs` alias configuration
2. **JSX Parse Errors**: Ensure esbuild loader is configured for `.js` files
3. **Mock Not Working**: Verify mock path matches exact import path
4. **Component Not Rendering**: Use custom render from `test-utils.jsx`
5. **Async Tests Failing**: Ensure proper await/async handling in tests

#### Development Workflow

1. **Write failing test** describing expected behavior
2. **Implement feature** to make test pass
3. **Refactor code** while keeping tests green
4. **Add edge case tests** for robustness
5. **Update documentation** if needed

## Contributing

Check the guidelines in the [Wiki](https://github.com/iodigital-com/io-technology/wiki)

### Updating Dependencies

If you want to help by keeping our dependencies up te date, first read the [updating guide](./UPDATING.md).

## Contributors

Thank you to all our [contributors](https://github.com/iodigital-com/io-technology/graphs/contributors) ❤️

<a href="https://github.com/iodigital-com/io-technology/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=iodigital-com/io-technology" />
</a>
