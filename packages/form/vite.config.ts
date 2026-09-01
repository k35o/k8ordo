import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    entry: ['src/**/*.ts', '!src/**/*.test.ts'],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    unbundle: true,
  },
  test: {
    globals: true,
    coverage: { all: false, provider: 'v8' },
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'derive', color: 'blue' },
          include: ['src/**/*.test.ts'],
        },
      },
    ],
  },
});
