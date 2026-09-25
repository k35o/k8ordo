'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';

import { getMessages } from '../../../i18n/current';
import { IconButton } from '../../buttons/icon-button';
import { AlertIcon, CheckIcon, CopyIcon } from '../../icons';

// CopyButton（ui の整理で足す部品）が入るまでの、コードブロック専用の最小版
export const CopyButton: FC<{ value: string }> = ({ value }) => {
  const messages = getMessages();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') return undefined;
    const timer = setTimeout(() => {
      setStatus('idle');
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [status]);

  return (
    <>
      <IconButton
        label={messages.codeBlockCopy}
        onAction={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setStatus('copied');
          } catch {
            setStatus('failed');
          }
        }}
        size="sm"
      >
        {status === 'idle' && <CopyIcon size="sm" />}
        {status === 'copied' && <CheckIcon size="sm" />}
        {status === 'failed' && <AlertIcon size="sm" status="error" />}
      </IconButton>
      <span className="sr-only" role="status">
        {status === 'copied' && messages.copied}
        {status === 'failed' && messages.copyFailed}
      </span>
    </>
  );
};
