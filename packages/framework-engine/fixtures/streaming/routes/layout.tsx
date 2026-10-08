import type { ReactNode } from 'react';

import { Hydrated } from './_parts/hydrated';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">home</a> <a href="/slow">slow</a>{' '}
          <a href="/search?q=quick">search</a> <a href="/waits">waits</a>{' '}
          <a href="/gone">gone</a>
        </nav>
        <Hydrated />
        <main>{children}</main>
      </body>
    </html>
  );
}
