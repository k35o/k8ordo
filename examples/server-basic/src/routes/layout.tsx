import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { href } from '@k8ordo/framework';
import { nonce } from '@k8ordo/framework/server';
import type { ReactNode } from 'react';

import { SchemeToggle } from './_parts/scheme';
import { Where } from './_parts/where';

// ディレクティブなし = Server Component（既定）
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // スクリプトがサーバーの描いていない dark を足すので、その差分は報告させない
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 描く前に <html> へクラスを付けるインラインスクリプトを、この応答の
            nonce で署名する */}
        <ColorSchemeProvider nonce={nonce()}>
          <nav>
            {/* Navigation API の下では素の <a> がそのままクライアント遷移 */}
            <a href={href('/')}>home</a>{' '}
            <a href={href('/products')}>products</a>{' '}
            <a href={href('/products/:id', { id: 1 })}>product 1</a>{' '}
            <a href={href('/guide')}>guide</a>{' '}
            <a href={href('/members')}>members</a> <SchemeToggle />
          </nav>
          <Where />
          <main>{children}</main>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
