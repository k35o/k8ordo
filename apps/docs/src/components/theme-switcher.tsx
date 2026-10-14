'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import { DarkModeIcon, IconButton, LightModeIcon } from '@k8ordo/ui';

import * as m from '../messages';

import styles from './theme-switcher.module.css';

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
      <span className={styles.toDark}>
        <DarkModeIcon />
      </span>
      <span className={styles.toLight}>
        <LightModeIcon />
      </span>
    </IconButton>
  );
}
