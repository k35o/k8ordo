'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import { Button } from '@k8ordo/ui';

import * as m from '../../../messages';

export function ToggleDemo() {
  const { scheme, setPreference } = useColorScheme();
  const next = scheme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      color="base"
      onClick={() => {
        setPreference(next);
      }}
      variant="outline"
    >
      {next === 'dark'
        ? m.colorSchemeGetStarted.tryToDark()
        : m.colorSchemeGetStarted.tryToLight()}
    </Button>
  );
}
