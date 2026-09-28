import type { CoverageOptions } from 'vitest/node';

/** Shared coverage settings. Packages add their own `include` and per-layer `thresholds`. */
export const coverage = {
  provider: 'v8',
  reporter: ['text-summary', 'json-summary', 'lcov'],
  reportsDirectory: 'coverage',
  exclude: ['**/*.test.{ts,tsx}', '**/*.config.*', '**/dist/**', '**/.next/**'],
} satisfies CoverageOptions;

type LayerThresholds = Record<
  string,
  { statements: number; branches: number; functions: number; lines: number }
>;

/** Layer gates from decision 0009. Keys are globs relative to the package root. */
export const apiLayerThresholds: LayerThresholds = {
  'src/modules/*/domain/**': { statements: 90, branches: 90, functions: 90, lines: 90 },
  'src/modules/*/application/**': { statements: 80, branches: 80, functions: 80, lines: 80 },
};
