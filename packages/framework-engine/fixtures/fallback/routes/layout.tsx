import type { ReactNode } from 'react';

export default function RootLayout({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  return (
    <html lang="en">
      <body data-pathname={pathname}>{children}</body>
    </html>
  );
}
