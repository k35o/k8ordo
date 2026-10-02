import { CodeBlock } from '@k8ordo/ui/code-block';
import type { FC, ReactNode } from 'react';

import { PreviewArea } from './preview-area';
import type { Stage } from './preview-area';

type Props = {
  children: ReactNode;
  code: string;
  lang?: 'tsx' | 'ts';
  stage?: Stage;
};

export const ComponentPreview: FC<Props> = ({
  children,
  code,
  lang = 'tsx',
  stage,
}) => (
  <div className="flex flex-col gap-2">
    <PreviewArea stage={stage}>{children}</PreviewArea>
    <CodeBlock code={code} lang={lang} />
  </div>
);
