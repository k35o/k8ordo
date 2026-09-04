'use client';

import { useClickAway } from '@k8ordo/ui';
import { useRef, useState } from 'react';

export function UseClickAwayPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(
    ref,
    () => {
      setIsOpen(false);
    },
    isOpen,
  );

  return (
    <div className="flex flex-col items-start gap-4">
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors"
        onClick={() => {
          setIsOpen(true);
        }}
        type="button"
      >
        Open Popup
      </button>
      {isOpen && (
        <div
          className="border-border-base bg-bg-base rounded-lg border p-4 text-sm shadow-md"
          ref={ref}
        >
          Click outside to close
        </div>
      )}
    </div>
  );
}
