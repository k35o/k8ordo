import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { SparklesIcon } from '../../icons';
import { Collapsible } from '../_internal/collapsible';

import styles from './reasoning.module.css';

type Props = {
  children: ReactNode;
  isStreaming?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
};

export const Reasoning: FC<Props> = ({
  children,
  isStreaming = false,
  isOpen,
  defaultOpen = false,
  onChange,
}) => {
  const messages = getMessages();

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onChange={onChange}
      icon={
        <span className={styles.icon}>
          <SparklesIcon size="sm" />
        </span>
      }
      label={isStreaming ? messages.reasoningStreaming : messages.reasoning}
    >
      <div className={styles.text}>{children}</div>
    </Collapsible>
  );
};
