import type { ReactNode } from 'react';

import { DEFAULT_LOCALE, isLocale } from '../i18n';

import '../styles/globals.css';

export default function Root({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  // lang はサーバーが書いた HTML の時点で正しくないと、クローラも読み上げも
  // 間違ったまま読む。ロケールは URL の先頭区間にしか無い。
  const first = pathname.split('/')[1] ?? '';
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  return (
    // 下のスクリプトが hydrate 前に dark クラスを付けるので、html の属性だけは
    // サーバーの出力と一致しない。それが目的の差分なので警告を抑える。
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>k8ordo</title>
        <meta
          content="k8ordo - React UI Component Library"
          name="description"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@400..700&family=Noto+Sans+JP:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <script>
          {`// @k8ordo/state (defineLocalState 'theme') と同じ保存形式を読む
let mode = null;
try { mode = JSON.parse(localStorage.getItem('k8ordo-state:theme')).mode; } catch {}
if (mode === 'dark' || (mode !== 'light' && matchMedia('(prefers-color-scheme:dark)').matches)) {
  document.documentElement.classList.add('dark');
}`}
        </script>
      </head>
      <body className="bg-bg-surface text-fg-base antialiased">{children}</body>
    </html>
  );
}
