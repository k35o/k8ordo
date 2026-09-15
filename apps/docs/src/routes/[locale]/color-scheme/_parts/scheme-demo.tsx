'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';
import { Button, Code } from '@k8ordo/ui';

import * as m from '../../../../messages';

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
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div className="flex flex-wrap gap-3">
        {CHOICES.map((choice) => (
          <Button
            aria-pressed={preference === choice.value}
            color={preference === choice.value ? 'primary' : 'base'}
            key={choice.value}
            onClick={() => {
              setPreference(choice.value);
            }}
            variant={preference === choice.value ? 'solid' : 'outline'}
          >
            {choice.label()}
          </Button>
        ))}
      </div>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex gap-3">
          <dt className="text-fg-mute">{m.colorScheme.demoScheme()}</dt>
          <dd>
            <Code>{scheme}</Code>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-fg-mute">{m.colorScheme.demoPreference()}</dt>
          <dd>
            <Code>{preference}</Code>
          </dd>
        </div>
      </dl>
    </div>
  );
}
