import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import type { ReactNode } from 'react';

import { locales } from '../i18n';

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
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return (
    // Provider のスクリプトが hydrate 前に dark クラスを付けるので、html の
    // 属性だけはサーバーの出力と一致しない。それが目的の差分なので警告を抑える。
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
      </head>
      {/* Provider が hydrate 前に dark を付けるスクリプトを先頭に描くので、
          body の中で全部を包む */}
      <body className="bg-bg-surface text-fg-base antialiased">
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}
