import type { ReactNode } from 'react';

import { sawAtLoad } from '../evaluations';

sawAtLoad('layout');

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
