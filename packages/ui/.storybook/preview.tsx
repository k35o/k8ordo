import { defineLocales } from '@k8ordo/i18n';
import type { Preview } from '@storybook/react-vite';
import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';

import { UIProvider } from '../src/components/providers';
import { definitions } from './locales';

import '../src/styles/index.css';

// Storybook は日本語のアプリとして描く（デザインは日本語の組版に合わせてある）。
// ロケール集合を定義しないと、組み込みの文言は英語になる。
defineLocales(definitions);

const ApplayThemeByStorybook: FC<{ theme: 'light' | 'dark' }> = memo(
  function ApplayThemeByStorybook({ theme }) {
    const [prevTheme, setPrevTheme] = useState<'light' | 'dark' | null>(null);

    if (prevTheme !== theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      setPrevTheme(theme);
    }

    return null;
  },
);

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
  decorators: [
    (Story, { globals, parameters }) => {
      const theme =
        parameters.theme ?? globals.theme ?? ('light' as 'light' | 'dark');
      const writingMode =
        parameters.writingMode ??
        globals.writingMode ??
        ('horizontal' as 'horizontal' | 'vertical');
      useEffect(() => {
        document.body.classList.add(
          'text-fg-base',
          'tracking-none',
          'bg-bg-base',
          'font-medium',
          'antialiased',
        );
      }, []);
      return (
        <UIProvider>
          <ApplayThemeByStorybook theme={theme} />
          <div
            className={
              writingMode === 'vertical'
                ? 'writing-v min-h-svh p-6'
                : 'min-h-svh p-6'
            }
          >
            <Story />
          </div>
        </UIProvider>
      );
    },
  ],
};

export default preview;
