import { fileURLToPath } from 'node:url';

import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('../', import.meta.url));

// Vitest uses the same source modules as the libraries, without a separate bundle step.
export default defineConfig({
  root,
  resolve: {
    // Vite 8 resolves @nextgis/* using the repository tsconfig.json paths.
    tsconfigPaths: true,
    // Matches the browser-only Node util fallback from the former Webpack setup.
    alias: [{ find: /^util$/, replacement: 'util/' }],
  },
  define: {
    __TEST__: true,
    __DEV__: true,
    __BROWSER__: true,
    __GLOBAL__: false,
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: false,
    __CJS__: false,
    __NODE_JS__: false,
    __VERSION__: JSON.stringify('test'),
    __COMMIT__: JSON.stringify('test'),
  },
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    proxy: {
      '/__ngw_demo': {
        target: 'https://demo.nextgis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__ngw_demo/, ''),
      },
      '/__ngw_sandbox': {
        target: 'https://sandbox.nextgis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__ngw_sandbox/, ''),
      },
    },
  },
  test: {
    globals: true,
    testTimeout: 15_000,
    hookTimeout: 30_000,
    restoreMocks: true,
    clearMocks: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      // Cover only source modules loaded by the tests; including every package
      // would force Vitest to transform unrelated Cesium entrypoints.
      exclude: [
        '**/*.d.ts',
        '**/*.json',
        'tests/**',
        'packages/cesium-map-adapter/**',
        'packages/ngw-cesium/**',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/specs/*.spec.ts'],
          exclude: configDefaults.exclude,
        },
      },
      {
        extends: true,
        test: {
          name: 'internet',
          include: ['tests/internet-specs/**/*.spec.ts'],
          exclude: [
            ...configDefaults.exclude,
            'tests/internet-specs/ngw-orm.spec.ts',
          ],
        },
      },
    ],
  },
});
