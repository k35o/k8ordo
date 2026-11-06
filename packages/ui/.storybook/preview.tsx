import { defineLocales } from '@k8ordo/i18n';
import type { Preview } from '@storybook/react-vite';

import { UIProvider } from '../src/components/providers';
import { definitions } from './locales';

import '../src/styles/index.css';
import './preview.css';

// Storybook は日本語のアプリとして描く（デザインは日本語の組版に合わせてある）。
// ロケール集合を定義しないと、組み込みの文言は英語になる。
defineLocales(definitions);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Toggle Color Theme.',
      defaultValue: 'light',
      toolbar: {
        title: 'Color Scheme',
        items: [
          { value: 'light', title: 'Light Mode', icon: 'sun' },
          { value: 'dark', title: 'Dark Mode', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    writingMode: {
      description: 'Toggle Writing Mode.',
      defaultValue: 'horizontal',
      toolbar: {
        title: 'Writing Mode',
        items: [
          {
            value: 'horizontal',
            title: '横書き',
            icon: 'menu',
          },
          {
            value: 'vertical',
            title: '縦書き',
            icon: 'sidebar',
          },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    backgrounds: { disable: true },
    layout: 'fullscreen',
    mockingDate: new Date(2023, 0, 2, 12, 34, 56),
    determinism: true,
    a11y: {
      test: 'error',
    },
  },
  beforeEach: ({ globals, parameters }) => {
    const theme =
      parameters.theme ?? globals.theme ?? ('light' as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
  decorators: [
    (Story, { globals, parameters }) => {
      const writingMode =
        parameters.writingMode ??
        globals.writingMode ??
        ('horizontal' as 'horizontal' | 'vertical');
      return (
        <UIProvider>
          <div
            className={writingMode === 'vertical' ? 'writing-v story' : 'story'}
          >
            <Story />
          </div>
        </UIProvider>
      );
    },
  ],
};

export default preview;
