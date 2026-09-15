'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import { DarkModeIcon, IconButton, LightModeIcon } from '@k8ordo/ui';

import * as m from '../messages';

export function ThemeSwitcher() {
  const { scheme, setPreference } = useColorScheme();

  return (
    <IconButton
      label={
        scheme === 'light'
          ? m.common.switchToDarkMode()
          : m.common.switchToLightMode()
      }
      onClick={() => {
        setPreference(scheme === 'light' ? 'dark' : 'light');
      }}
    >
      {scheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
