'use client';

import { useId } from 'react';
import type { FC, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';

type Props = {
  icon?: ReactNode;
  label: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
  children: ReactNode;
};

export const Collapsible: FC<Props> = ({
  icon,
  label,
  isOpen,
  defaultOpen = false,
  onChange,
  children,
}) => {
  const [open, setOpen] = useControllableState<boolean>({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange,
  });
  const panelId = useId();

  return (
    <div className="border-border-mute bg-bg-subtle overflow-hidden rounded-xl border text-sm">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left text-fg-mute transition-colors duration-150 ease-out hover:bg-bg-mute',
          FOCUS_RING_NO_BORDER,
        )}
        onClick={() => {
          setOpen(!open);
        }}
        type="button"
      >
        {icon !== undefined && (
          <span className="flex shrink-0 items-center">{icon}</span>
        )}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronIcon direction={open ? 'up' : 'down'} size="sm" />
      </button>
      <div className="px-3 pt-2 pb-3" hidden={!open} id={panelId}>
        {children}
      </div>
    </div>
  );
};
