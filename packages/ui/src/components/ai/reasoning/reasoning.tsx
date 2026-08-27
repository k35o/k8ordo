'use client';

import type { FC, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { SparklesIcon } from '../../icons';
import { Collapsible } from '../_internal/collapsible';

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
  const messages = useMessages();

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onChange={onChange}
      icon={
        <span className="text-fg-subtle">
          <SparklesIcon size="sm" />
        </span>
      }
      label={isStreaming ? messages.reasoningStreaming : messages.reasoning}
    >
      <div className="text-fg-mute text-sm leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </Collapsible>
  );
};
