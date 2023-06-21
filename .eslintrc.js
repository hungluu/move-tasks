module.exports = {
  extends: [
    'eslint:recommended',
    'standard'
    // for react only
    // "standard-jsx"
  ],
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  ignorePatterns: [
    'node_modules',
    '.yarn',
    '**/index.js',
    '**/index.d.ts'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'consistent-return': 'warn',
    complexity: [
      'warn',
      {
        max: 15
      }
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: 'let',
        next: '*'
      },
      {
        blankLine: 'any',
        prev: 'let',
        next: 'let'
      },
      {
        blankLine: 'any',
        prev: 'let',
        next: 'const'
      },
      {
        blankLine: 'always',
        prev: 'const',
        next: '*'
      },
      {
        blankLine: 'any',
        prev: 'const',
        next: 'const'
      },
      {
        blankLine: 'any',
        prev: 'const',
        next: 'let'
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return'
      }
    ],
    'react/prop-types': 'off' // Disable prop-types as we use TypeScript for type checking
  },
  overrides: [
    {
      files: '*.{ts,tsx}',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'standard',
        // for react only
        // "standard-jsx",
        'standard-with-typescript'
      ],
      env: {
        browser: true,
        es6: true
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: require.resolve('./tsconfig.json'),
        ecmaVersion: 8,
        ecmaFeatures: {
          experimentalObjectRestSpread: true
        }
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off'
      }
    },
    // for jest only
    {
      files: '*.{spec,test}.{ts,tsx,js}',
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style'
      ]
    }
  ]
}
