import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import {
  STATUS_ICON,
  STATUS_MESSAGE_KEY,
  STATUS_SURFACE,
} from '../../_internal/status-tone';
import { AlertIcon } from '../../icons';
import { cn } from './../../../helpers/cn';
import type { Status } from './../../../types/variables';

type Props = {
  tone: Status;
  label?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'className' | 'style'>;

export const Callout: FC<Props> = ({ tone, label, children, ...rest }) => {
  const messages = getMessages();

  return (
    <div
      {...rest}
      className={cn(
        'flex items-start gap-3 rounded-lg p-4',
        HIGH_CONTRAST_EDGE,
        STATUS_SURFACE[tone],
      )}
      role="note"
    >
      {/* アイコンの箱を本文の 1 行の高さにして、1 行目（見出し）の縦の真ん中に置く。
          箱全体の真ん中に置くと、本文が長いときに見出しから離れる */}
      <span
        className={cn('flex h-lh shrink-0 items-center', STATUS_ICON[tone])}
      >
        <AlertIcon size="md" status={tone} />
        <span className="sr-only">{messages[STATUS_MESSAGE_KEY[tone]]}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {label === undefined ? null : <p className="font-bold">{label}</p>}
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};
