import type { ReactNode } from 'react';

import { locales } from '../i18n/locales';
import { themeState } from '../theme/state';

import '../styles/globals.css';

// hydrate 前に dark クラスを付けるスクリプト。保存行の読み方は定義側
// （`inlineRead()`）が出すので、キーや JSON の形をここに複写しない。スキーマは
// まだ走らないので、読むのは mode だけ、値も自分で確かめる。
const THEME_INIT = `const s = ${themeState.inlineRead()};
const mode = s && s.mode;
if (mode === 'dark' || (mode !== 'light' && matchMedia('(prefers-color-scheme:dark)').matches)) {
  document.documentElement.classList.add('dark');
}`;

export default function Root({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  // lang はサーバーが書いた HTML の時点で正しくないと、クローラも読み上げも
  // 間違ったまま読む。ロケールは URL の先頭区間にしか無い。
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return (
    // 下のスクリプトが hydrate 前に dark クラスを付けるので、html の属性だけは
    // サーバーの出力と一致しない。それが目的の差分なので警告を抑える。
    // <title> はここには無い。React 19 が各ページの <title> を head に持ち上げる
    // ので、ここにも書くと 2 つ並ぶ。
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta
          content="k8ordo - React libraries that use Baseline features without holding back"
          name="description"
        />
        <script>{THEME_INIT}</script>
      </head>
      <body className="bg-bg-surface text-fg-base antialiased">{children}</body>
    </html>
  );
}
