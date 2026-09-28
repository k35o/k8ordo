import { CodeBlock } from '@k8ordo/ui/code-block';
import type { FC, ReactNode } from 'react';

import { PreviewArea } from './preview-area';

type Props = {
  children: ReactNode;
  code: string;
  lang?: 'tsx' | 'ts';
};

export const ComponentPreview: FC<Props> = ({
  children,
  code,
  lang = 'tsx',
}) => (
  <div className="flex flex-col gap-2">
    <PreviewArea>{children}</PreviewArea>
    <CodeBlock code={code} lang={lang} />
  </div>
);
