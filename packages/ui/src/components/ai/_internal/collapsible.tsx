'use client';

import { clsx } from 'clsx';
import { useId } from 'react';
import type { FC, ReactNode } from 'react';

import { useControllableState } from '../../../hooks/controllable-state';
import { ChevronIcon } from '../../icons';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './collapsible.module.css';

type Props = {
  icon?: ReactNode;
  label: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
  footer?: ReactNode;
  triggerId?: string;
  children: ReactNode;
};

export const Collapsible: FC<Props> = ({
  icon,
  label,
  isOpen,
  defaultOpen = false,
  onChange,
  footer,
  triggerId,
  children,
}) => {
  const [open, setOpen] = useControllableState<boolean>({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange,
  });
  const panelId = useId();

  return (
    <div className={styles.root}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={clsx(styles.trigger, focusRing.ringNoBorder)}
        id={triggerId}
        onClick={() => {
          setOpen(!open);
        }}
        type="button"
      >
        {icon !== undefined && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
        <ChevronIcon direction={open ? 'up' : 'down'} size="sm" />
      </button>
      <div className={styles.panel} hidden={!open} id={panelId}>
        {children}
      </div>
      {footer !== undefined && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
