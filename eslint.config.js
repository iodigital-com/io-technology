const nextConfig = require('eslint-config-next/core-web-vitals')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const tseslint = require('typescript-eslint')

// eslint-config-next@16 bundles two plugins incompatible with ESLint 10:
//
// 1. eslint-plugin-react@7.37.5 uses context.getFilename() (removed in ESLint 10).
//    Strip the react plugin and its rules from the "next" config object.
//
// 2. eslint-config-next/parser (Babel-based) returns a scopeManager without
//    addGlobals(), which ESLint 10 requires. Replace it with typescript-eslint
//    parser which is already included and ESLint-10-compatible.
const patchedNextConfig = nextConfig.map((item) => {
  if (item.name !== 'next') return item

  const { react: _react, ...pluginsWithoutReact } = item.plugins || {}
  const rulesWithoutReact = Object.fromEntries(
    Object.entries(item.rules || {}).filter(([key]) => !key.startsWith('react/'))
  )

  return {
    ...item,
    plugins: pluginsWithoutReact,
    rules: rulesWithoutReact,
    languageOptions: {
      ...item.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  }
})

module.exports = [
  // Migrate .eslintignore into flat config
  {
    ignores: ['node_modules/**'],
  },
  ...patchedNextConfig,
  prettierRecommended,
  {
    rules: {
      'no-unused-vars': 0,
      'react/no-unescaped-entities': 0,
      // React Compiler rules — only relevant when using the React Compiler,
      // which this project does not. Disable them so the standard React
      // patterns used here (setState in mount-only effects, useMemo for
      // dynamic component creation, Math.random keys) are not flagged.
      'react-hooks/static-components': 0,
      'react-hooks/set-state-in-effect': 0,
      'react-hooks/purity': 0,
      'react-hooks/use-memo': 0,
      'react-hooks/preserve-manual-memoization': 0,
      'react-hooks/immutability': 0,
      'react-hooks/globals': 0,
      'react-hooks/refs': 0,
      'react-hooks/error-boundaries': 0,
      'react-hooks/set-state-in-render': 0,
      'react-hooks/config': 0,
      'react-hooks/gating': 0,
      'react-hooks/unsupported-syntax': 0,
      'react-hooks/incompatible-library': 0,
    },
  },
]
