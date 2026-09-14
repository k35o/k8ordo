'use client';

import { DarkModeIcon, IconButton, LightModeIcon } from '@k8ordo/ui';

import * as m from '../messages';
import { useTheme } from '../theme/context';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      label={
        theme === 'light'
          ? m.common.switchToDarkMode()
          : m.common.switchToLightMode()
      }
      onClick={toggleTheme}
    >
      {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
