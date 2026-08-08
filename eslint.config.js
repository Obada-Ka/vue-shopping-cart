import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.history/**']
  },

  js.configs.recommended,

  // Type-checked rules — required for no-unsafe-* (real type info, not
  // just syntax parsing) to catch `any` leaking through inference.
  ...tseslint.configs.recommendedTypeChecked,

  ...vue.configs['flat/recommended'],

  // Config files (vite.config.ts, eslint.config.js) aren't covered by
  // tsconfig.app.json, so they don't get type-aware linting.
  {
    files: ['*.config.ts', '*.config.js'],
    ...tseslint.configs.disableTypeChecked
  },

  {
    // Type-checked linting only applies to files covered by tsconfig.app.json
    // (i.e. src/**). Config files like vite.config.ts / eslint.config.js are
    // handled by tsconfig.node.json and don't need type-aware rules.
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue']
      }
    },
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json'
        }
      }
    },
    rules: {
      // ─────────────────────────────────────────────
      // BAN `any` — no escape hatch from the type system.
      // Sanctioned alternative: `unknown` + narrowing, or a zod schema
      // at the boundary (see src/lib/apiClient.ts for the pattern).
      // ─────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true }
      ],

      // ─────────────────────────────────────────────
      // LAYER BOUNDARY ENFORCEMENT
      // components → composables/lib/utils only
      // features   → components/composables/lib/utils, never other features, never pages
      // pages      → features/components/composables (top of the stack)
      // ─────────────────────────────────────────────
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/components',
              from: ['./src/features', './src/pages'],
              message:
                'components/ is the design-system layer — it cannot depend on features/ or pages/. Move shared logic into composables/ or utils/ instead.'
            },
            {
              target: ['./src/composables', './src/lib', './src/utils'],
              from: ['./src/features', './src/pages', './src/components'],
              message:
                'composables/, lib/, and utils/ are foundation layers — they cannot depend on components/, features/, or pages/.'
            },
            {
              target: './src/features',
              from: './src/pages',
              message:
                'features/ cannot depend on pages/. Pages compose features, not the other way around.'
            },
            {
              // Only layers OUTSIDE features/ are restricted to the barrel —
              // files inside a feature may freely import their own siblings
              // (e.g. authStore.ts importing ../types is fine; LoginPage.vue
              // importing @/features/auth/store/authStore directly is not).
              target: [
                './src/app',
                './src/pages',
                './src/components',
                './src/composables',
                './src/lib',
                './src/utils'
              ],
              from: './src/features/*/!(index.ts)',
              message:
                "Do not import a feature's internals directly. Import from the feature's public API (e.g. '@/features/auth') instead of reaching into its components/composables/store."
            }
          ]
        }
      ],

      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-self-import': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },

  // Test files: relax return-type strictness (test bodies are verbose enough)
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  // Disable stylistic rules that conflict with Prettier
  {
    rules: {
      ...(await import('eslint-config-prettier')).default.rules
    }
  }
)
