'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';

import { useMessages } from '../../../i18n/context';
import { AlertIcon, CheckIcon, CopyIcon } from '../../icons';
import { Button } from '../button';
import { IconButton } from '../icon-button';

type Result = { status: 'copied' | 'failed'; count: number };

// 結果を見せておく時間。過ぎたら元のアイコンに戻し、もう一度押せることを示す
const RESULT_MS = 2000;

export const CopyButton: FC<{
  value: string | (() => string | Promise<string>);
  label?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ value, label, iconOnly = false, size = 'md', disabled = false }) => {
  const messages = useMessages();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (result === null) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setResult(null);
    }, RESULT_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [result]);

  const settle = (status: Result['status']) => {
    setResult((previous) => ({ status, count: (previous?.count ?? 0) + 1 }));
  };

  const copy = async () => {
    try {
      // 値を待ってから書き込むと、Safari はクリックの操作から外れたとみなして
      // 拒む。Promise のまま ClipboardItem に渡し、書き込みはクリックの中で始める
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': typeof value === 'function' ? value() : value,
        }),
      ]);
      settle('copied');
    } catch {
      settle('failed');
    }
  };

  const iconSize = iconOnly ? size : size === 'lg' ? 'md' : 'sm';
  const icon =
    result?.status === 'copied' ? (
      <span className="text-fg-success contents">
        <CheckIcon size={iconSize} />
      </span>
    ) : result?.status === 'failed' ? (
      <span className="text-fg-error contents">
        <AlertIcon size={iconSize} status="error" />
      </span>
    ) : (
      <CopyIcon size={iconSize} />
    );
  const name = label ?? messages.copy;

  return (
    <>
      {iconOnly ? (
        <IconButton
          disabled={disabled}
          label={name}
          onAction={copy}
          size={size}
        >
          {icon}
        </IconButton>
      ) : (
        <Button
          disabled={disabled}
          onAction={copy}
          size={size}
          startIcon={icon}
          variant="outline"
        >
          {name}
        </Button>
      )}
      {/* ボタンの名前は変えずに、結果だけを読み上げる。押し直したときも
          読み上げ直すよう、結果ごとに要素を作り直す */}
      <span className="sr-only" role="status">
        {result === null ? null : (
          <span key={result.count}>
            {result.status === 'copied' ? messages.copied : messages.copyFailed}
          </span>
        )}
      </span>
    </>
  );
};
