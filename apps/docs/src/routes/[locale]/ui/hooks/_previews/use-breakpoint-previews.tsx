'use client';

import { useBreakpoint } from '@k8ordo/ui';

export function UseBreakpointPreview() {
  const isSm = useBreakpoint('sm');
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  const isXl = useBreakpoint('xl');
  const is2xl = useBreakpoint('2xl');

  return (
    <div className="flex flex-col gap-2">
      <p className="text-fg-base">
        sm (40rem): <span className="font-medium">{isSm ? 'Yes' : 'No'}</span>
      </p>
      <p className="text-fg-base">
        md (48rem): <span className="font-medium">{isMd ? 'Yes' : 'No'}</span>
      </p>
      <p className="text-fg-base">
        lg (64rem): <span className="font-medium">{isLg ? 'Yes' : 'No'}</span>
      </p>
      <p className="text-fg-base">
        xl (80rem): <span className="font-medium">{isXl ? 'Yes' : 'No'}</span>
      </p>
      <p className="text-fg-base">
        2xl (96rem): <span className="font-medium">{is2xl ? 'Yes' : 'No'}</span>
      </p>
    </div>
  );
}
