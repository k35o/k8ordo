'use client';

import type { FC } from 'react';

import { useMessages } from '../../../i18n/context';
import { CopyButton } from '../../buttons/copy-button';

// CodeBlock はサーバーで描くので辞書を読めない。名前だけをここで引いて渡す
export const CodeCopyButton: FC<{ value: string }> = ({ value }) => {
  const messages = useMessages();
  return (
    <CopyButton
      iconOnly
      label={messages.codeBlockCopy}
      size="sm"
      value={value}
    />
  );
};
