import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  oxc: {},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    // jsdom NO está como environment global — es extremadamente lento para 156 tests
    // de lógica pura (utils, schemas, repos, queries) que no necesitan DOM.
    // Solo los 116 archivos que usan @testing-library/react o jsx tienen anotación @vitest-environment jsdom explícita.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        '**/node_modules/**',
        '**/__tests__/**',
        'src/**/*.types.ts',
        'src/**/contracts/**',
        'src/**/ports/**',
      ],
      thresholds: {
        lines: 5,
        functions: 25,
        branches: 25,
        statements: 5,
      },
    },
  },
});
