import { CodeBlock as UICodeBlock } from '@k8ordo/ui/code-block';
import type { ComponentProps, FC } from 'react';

import styles from './code-block.module.css';

/** `@k8ordo/ui/code-block` の CodeBlock に、サイトの枠線を付けたもの */
export const CodeBlock: FC<ComponentProps<typeof UICodeBlock>> = (props) => (
  <div className={styles.root}>
    <UICodeBlock {...props} />
  </div>
);
