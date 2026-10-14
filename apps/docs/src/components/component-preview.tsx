import { CodeBlock } from '@k8ordo/ui/code-block';
import type { FC, ReactNode } from 'react';

import { PreviewArea } from './preview-area';
import type { Stage } from './preview-area';

import styles from './component-preview.module.css';

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
  <div className={styles.root}>
    <PreviewArea stage={stage}>{children}</PreviewArea>
    <div className={styles.code}>
      <CodeBlock code={code} lang={lang} />
    </div>
  </div>
);
