'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';
import { Button, Code } from '@k8ordo/ui';

import * as m from '../../messages';

const CHOICES: ReadonlyArray<{
  value: ColorSchemePreference;
  label: () => string;
}> = [
  { value: 'system', label: m.colorScheme.demoSystem },
  { value: 'light', label: m.colorScheme.demoLight },
  { value: 'dark', label: m.colorScheme.demoDark },
];

export function SchemeDemo() {
  const { scheme, preference, setPreference } = useColorScheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        {CHOICES.map((choice) => (
          <Button
            aria-pressed={preference === choice.value}
            color={preference === choice.value ? 'primary' : 'base'}
            key={choice.value}
            onAction={() => {
              setPreference(choice.value);
            }}
            variant={preference === choice.value ? 'solid' : 'outline'}
          >
            {choice.label()}
          </Button>
        ))}
      </div>
      <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
        <dt className="text-fg-mute">scheme</dt>
        <dd>
          <Code>{scheme}</Code>
        </dd>
        <dt className="text-fg-mute">preference</dt>
        <dd>
          <Code>{preference}</Code>
        </dd>
      </dl>
    </div>
  );
}
