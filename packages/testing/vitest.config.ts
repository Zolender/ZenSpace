import { coverage } from '@carrel/vitest-config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // Containers take a while to start on a cold machine.
    testTimeout: 120_000,
    hookTimeout: 120_000,
    coverage: { ...coverage, include: ['src/**'] },
  },
});
