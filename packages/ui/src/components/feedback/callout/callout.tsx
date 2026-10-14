import { clsx } from 'clsx';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import {
  STATUS_ICON,
  STATUS_MESSAGE_KEY,
  STATUS_SURFACE,
} from '../../_internal/status-tone';
import { AlertIcon } from '../../icons';
import type { Status } from './../../../types/variables';

import highContrast from '../../_internal/high-contrast.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './callout.module.css';

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
      className={clsx(styles.root, highContrast.edge, STATUS_SURFACE[tone])}
      role="note"
    >
      {/* アイコンの箱を本文の 1 行の高さにして、1 行目（見出し）の縦の真ん中に置く。
          箱全体の真ん中に置くと、本文が長いときに見出しから離れる */}
      <span className={clsx(styles.icon, STATUS_ICON[tone])}>
        <AlertIcon size="md" status={tone} />
        <span className={srOnly.srOnly}>
          {messages[STATUS_MESSAGE_KEY[tone]]}
        </span>
      </span>
      <div className={styles.body}>
        {label === undefined ? null : <p className={styles.label}>{label}</p>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
