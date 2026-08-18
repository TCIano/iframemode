import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '*.config.*', 'env.d.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['src/**/*.ts', 'src/**/*.vue'],
  })),
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.vitest.json'],
        extraFileExtensions: ['.vue'],
      },
    },
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  perfectionist.configs['recommended-alphabetical'],
  {
    // create.js 为 Node 脚本，声明 Node 全局变量
    files: ['create.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      vue: pluginVue,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'perfectionist/sort-imports': ['error', {
        type: 'natural',
        order: 'asc',
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        newlinesBetween: 'always',
        internalPattern: ['@/**'],
      }],
    },
  },
  {
    // ant-design-vue 插件类型与 Vue App.use 签名不兼容，入口豁免 unsafe-argument（放在规则主块之后覆盖生效）
    files: ['src/main.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  prettier,
)
