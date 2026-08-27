'use client';

import { useHover } from '@k8ordo/ui';

export function UseHoverPreview() {
  const { isHovered, hoverProps } = useHover();

  return (
    <div className="flex flex-col gap-4">
      <div
        className="border-border-mute bg-bg-subtle rounded-lg border p-6 text-center"
        {...hoverProps}
      >
        Hover me
      </div>
      <p className="text-fg-base">
        State:{' '}
        <span className="font-medium">
          {isHovered ? 'Hovered' : 'Not hovered'}
        </span>
      </p>
    </div>
  );
}
