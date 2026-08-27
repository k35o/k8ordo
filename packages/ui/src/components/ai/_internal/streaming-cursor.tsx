import type { FC } from 'react';

export const StreamingCursor: FC = () => (
  <span
    aria-hidden
    className="bg-fg-base ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.15em] rounded-xs motion-safe:animate-pulse"
  />
);
