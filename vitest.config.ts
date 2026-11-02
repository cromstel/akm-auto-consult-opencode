import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: { globals: true, environment: 'node' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // server-only guards RSC boundaries; tests exercise server modules directly.
      'server-only': path.resolve(__dirname, 'tests/stubs/server-only.ts'),
    },
  },
});
