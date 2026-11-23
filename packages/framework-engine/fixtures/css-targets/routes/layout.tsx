import type { ReactNode } from 'react';

import '../components/frame.css';
import { Box } from '../components/box';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Box />
        <main data-flip="">{children}</main>
      </body>
    </html>
  );
}
