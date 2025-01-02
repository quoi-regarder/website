import vue from 'eslint-plugin-vue'
import nuxt from 'eslint-plugin-nuxt'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      '**/node_modules',
      '**/.nuxt',
      '**/.output',
      '**/*.lock.yaml',
      '**/*.json',
      '**/supabase/**',
      '**/dist/**'
    ]
  },
  ...compat.extends(
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended'
  ),
  {
    plugins: {
      vue,
      nuxt,
      '@typescript-eslint': typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2022, // Latest stable ECMAScript version
      sourceType: 'module', // Suitable for ES modules
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          jsx: true // Enable JSX if used in your files
        }
      }
    },

    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-function-paren': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'space-before-blocks': ['error', 'always'],
      'space-infix-ops': ['error'],
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],

      // Vue-specific rules
      'vue/multi-word-component-names': 'off',
      'vue/html-indent': ['error', 2],
      'vue/comma-spacing': ['error', { before: false, after: true }],
      'vue/script-indent': ['error', 2, { baseIndent: 0 }],
      'vue/keyword-spacing': ['error', { before: true, after: true }],
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'vue/arrow-spacing': ['error', { before: true, after: true }],
      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/block-spacing': ['error', 'always'],
      'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'vue/space-infix-ops': ['error'],
      'vue/max-attributes-per-line': ['error', { singleline: { max: 5 } }],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/html-self-closing': 'off',
      'vue/valid-v-for': 'off',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Nuxt-specific rules
      'nuxt/no-cjs-in-config': 'error', // Disallow the use of `require()` in Nuxt files
      'nuxt/no-env-in-context': 'warn' // Suggest using `$config` instead of `process.env` (recommended in Nuxt 3)
    }
  }
]
