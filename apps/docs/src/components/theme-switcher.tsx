'use client';

import { DarkModeIcon, IconButton, LightModeIcon } from '@k8ordo/ui';

import { useTranslation } from '../i18n';
import { useTheme } from '../theme/context';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <IconButton
      label={
        theme === 'light'
          ? t('common.switchToDarkMode')
          : t('common.switchToLightMode')
      }
      onClick={toggleTheme}
    >
      {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
