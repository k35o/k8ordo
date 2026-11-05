import type { ReactNode } from 'react';

import { Hydrated } from '../components/hydrated';

import '../components/sheet.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>{"document.documentElement.classList.add('ran')"}</script>
      </head>
      <body>
        <Hydrated />
        <main>{children}</main>
      </body>
    </html>
  );
}
