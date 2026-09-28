import type { StorybookConfig } from '@storybook/react-vite';

const SERVER_ONLY = '\0server-only';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
    'storybook-addon-mock-date',
    'storybook-addon-determinism',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['./public'],
  // CodeBlock はサーバーで描く部品で、server-only を import してブラウザに
  // 届かないようにしている。Storybook だけはそれをブラウザで描いて確かめる
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [
      ...(viteConfig.plugins ?? []),
      {
        name: 'server-only-in-storybook',
        enforce: 'pre',
        resolveId: (id) => (id === 'server-only' ? SERVER_ONLY : undefined),
        load: (id) => (id === SERVER_ONLY ? 'export {};' : undefined),
      },
    ],
  }),
};

export default config;
