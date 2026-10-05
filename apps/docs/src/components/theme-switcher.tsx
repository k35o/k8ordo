'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import { DarkModeIcon, IconButton, LightModeIcon } from '@k8ordo/ui';

import * as m from '../messages';

export function ThemeSwitcher() {
  const { scheme, setPreference } = useColorScheme();

  // アイコンは scheme から選ばず両方を描く。dark クラスは最初の描画の前に
  // 付いているので、ハイドレーションを待たずに正しいほうが見える
  return (
    <IconButton
      label={m.common.toggleColorScheme()}
      onClick={() => {
        setPreference(scheme === 'light' ? 'dark' : 'light');
      }}
    >
      <span className="contents dark:hidden">
        <DarkModeIcon />
      </span>
      <span className="hidden dark:contents">
        <LightModeIcon />
      </span>
    </IconButton>
  );
}
