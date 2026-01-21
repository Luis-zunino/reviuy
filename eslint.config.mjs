import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);

const eslintConfig = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      'dist/**',
      '*.min.js',
      '.vercel/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  {
    rules: {
      // Reglas de React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Reglas de React
      'react/react-in-jsx-scope': 'off', // Next.js no lo necesita
      'react/prop-types': 'off', // Usamos TypeScript

      // Reglas de TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',

      // Reglas generales
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-undef': 'off', // TypeScript lo maneja
      'no-useless-catch': 'warn', // De error a warning
    },
  },
];

export default eslintConfig;
