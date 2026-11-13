declare module '*.mdx' {
  import type { ReactNode } from 'react';

  const MDXContent: (props: Record<string, unknown>) => ReactNode;
  export default MDXContent;
}
