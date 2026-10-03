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
  // CodeBlock は className を受け取らないので、子セレクタで角丸と枠を外し、
  // 上の線だけをプレビューとの区切りに残す。子孫にしないのは、CodeBlock の
  // ページのプレビューに描く CodeBlock まで枠を失うから
  <div className="border-border-mute overflow-hidden rounded-lg border [&>.ao-code-block]:rounded-none [&>.ao-code-block]:border-x-0 [&>.ao-code-block]:border-b-0">
    <PreviewArea stage={stage}>{children}</PreviewArea>
    <CodeBlock code={code} lang={lang} />
  </div>
);
