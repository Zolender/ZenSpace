import { apiLayerThresholds, coverage } from '@carrel/vitest-config';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // SWC instead of esbuild: Nest's dependency injection needs emitted decorator metadata.
  plugins: [swc.vite()],
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'unit', include: ['src/**/*.test.ts'] },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['test/**/*.int.test.ts'],
          testTimeout: 120_000,
          hookTimeout: 120_000,
        },
      },
    ],
    coverage: {
      ...coverage,
      include: ['src/**'],
      exclude: [...coverage.exclude, 'src/main.ts'],
      thresholds: apiLayerThresholds,
    },
  },
});
