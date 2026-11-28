'use client';

import { useTransition } from 'react';
import type { FC } from 'react';

export const CardAction: FC<{
  action: () => void | Promise<void>;
  className: string;
  labelledBy: string;
}> = ({ action, className, labelledBy }) => {
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
          await action();
        });
      }}
      type="button"
    />
  );
};
