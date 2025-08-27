import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/types/**/*.ts', '**/*.test.*', '**/*.spec.*', '**/*.d.ts', '**/test/**', '**/__tests__/**'],
    },
  },
});
