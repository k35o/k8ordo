import type { ReactNode } from 'react';

import { Hydrated } from '../components/hydrated';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">home</a> <a href="/slow">slow</a>{' '}
          <a href="/search?q=quick">search</a> <a href="/waits">waits</a>{' '}
          <a href="/gone">gone</a> <a href="/shelf">shelf</a>{' '}
          <a href="/shelf/tardy">tardy</a>
        </nav>
        <Hydrated />
        <main>{children}</main>
      </body>
    </html>
  );
}
