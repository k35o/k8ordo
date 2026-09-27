'use client';

import { RangeSlider } from '@k8ordo/ui';
import { useState } from 'react';

export function RangeSliderControlledPreview() {
  const [value, setValue] = useState<readonly [number, number]>([18, 26]);
  return (
    <div className="flex w-full flex-col gap-2">
      <RangeSlider
        aria-label="Temperature"
        max={40}
        min={0}
        onChange={setValue}
        value={value}
      />
      <p className="text-fg-mute text-sm tabular-nums">
        {value[0]}–{value[1]} °C
      </p>
    </div>
  );
}
