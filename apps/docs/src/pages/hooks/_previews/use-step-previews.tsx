'use client';

import { useStep } from '@k8ordo/ui';

export function UseStepPreview() {
  const { count, back, next, isDisabledBack, isDisabledNext } = useStep({
    initialCount: 1,
    maxCount: 5,
  });

  return (
    <div className="flex items-center gap-4">
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-40"
        disabled={isDisabledBack}
        onClick={back}
        type="button"
      >
        Back
      </button>
      <span className="text-sm">
        Step <strong>{count}</strong> / 5
      </span>
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-40"
        disabled={isDisabledNext}
        onClick={next}
        type="button"
      >
        Next
      </button>
    </div>
  );
}
