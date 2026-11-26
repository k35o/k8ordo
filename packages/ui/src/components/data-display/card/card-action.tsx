'use client';

import { useTransition } from 'react';
import type { FC } from 'react';

export const CardAction: FC<{
  className: string;
  labelledBy: string;
  onAction: () => void | Promise<void>;
}> = ({ className, labelledBy, onAction }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      aria-busy={isPending || undefined}
      aria-disabled={isPending || undefined}
      aria-labelledby={labelledBy}
      className={className}
      onClick={() => {
        if (isPending) {
          return;
        }
        startTransition(async () => {
          await onAction();
        });
      }}
      type="button"
    />
  );
};
