'use client';

import { Code } from '@k8ordo/ui';
import type { FC } from 'react';

import type { MessageKey } from '../i18n';
import { useTranslation } from '../i18n';

export const T: FC<{ k: MessageKey }> = ({ k }) => {
  const { t } = useTranslation();
  const text = t(k);
  // 文言中の `code` をインラインコードとして描画する（奇数番目が code 部分）
  const parts = text.split(/`([^`]+)`/u);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? <Code key={`${k}-${String(index)}`}>{part}</Code> : part,
  );
};
