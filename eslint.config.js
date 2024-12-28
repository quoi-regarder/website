import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
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
    ignores: ['**/node_modules', '**/pnpm-lock.yaml', '**/tsconfig.json', '**/.nuxt', '.output']
  },
  ...compat.extends(
    '@nuxt/eslint-config',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended'
  ),
  {
    plugins: {
      vue,
      prettier,
      nuxt,
      '@typescript-eslint': typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },

    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'never'],

      'comma-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],

      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],

      'space-before-function-paren': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],

      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],

      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'strict'
        }
      ],

      'space-before-blocks': ['error', 'always'],

      'space-infix-ops': [
        'error',
        {
          int32Hint: false
        }
      ],

      'no-multi-spaces': [
        'error',
        {
          ignoreEOLComments: true
        }
      ],

      'vue/multi-word-component-names': 0,
      'vue/html-indent': ['error', 2],

      'vue/comma-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],

      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 0
        }
      ],

      'vue/keyword-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],

      'vue/object-curly-spacing': ['error', 'always'],

      'vue/key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'strict'
        }
      ],

      'vue/arrow-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],

      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/block-spacing': ['error', 'always'],

      'vue/brace-style': [
        'error',
        'stroustrup',
        {
          allowSingleLine: true
        }
      ],

      'vue/space-infix-ops': [
        'error',
        {
          int32Hint: false
        }
      ],

      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 5
          }
        }
      ],

      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
