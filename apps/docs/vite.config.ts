import { k8ordoStatic } from '@k8ordo/static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import { LOCALES } from './src/i18n/types';

export default defineConfig({
  server: {
    // プレビューツール等がポートを割り当てられるよう PORT を尊重する
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    k8ordoStatic({
      // ロケールは全ページに掛かる区間なので、埋まっていないパターンを
      // そのままロケールの数だけ展開する
      paths: (patterns) =>
        patterns.flatMap((pattern) =>
          LOCALES.map((locale) => pattern.replace('/:locale', `/${locale}`)),
        ),
    }),
    tailwindcss(),
  ],
});
