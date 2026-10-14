'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';
import { Button, Code, Radio, Skeleton } from '@k8ordo/ui';
import { Suspense, use, useId } from 'react';
import { browser } from 'react-dom';

import * as m from '../../../messages';

import styles from './switcher-demo.module.css';

const t = m.colorSchemeSwitcher;

const isPreference = (value: string): value is ColorSchemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

function Toggle() {
  const { scheme, setPreference } = useColorScheme();

  // 文言は scheme から選ばず両方を描く。dark クラスは最初の描画の前に
  // 付いているので、ハイドレーションを待たずに正しいほうが見える
  return (
    <Button
      color="base"
      onClick={() => {
        setPreference(scheme === 'dark' ? 'light' : 'dark');
      }}
      variant="outline"
    >
      <span className={styles.toDark}>{t.demoToDark()}</span>
      <span className={styles.toLight}>{t.demoToLight()}</span>
    </Button>
  );
}

// 選択と値の表示は保存された設定から決まるので、サーバーの推測を描かずに
// ブラウザで描く
function Choice() {
  use(browser('the stored preference is in localStorage'));
  const labelId = useId();
  const { scheme, preference, setPreference } = useColorScheme();

  return (
    <div className={styles.choice}>
      <div className={styles.field}>
        <p className={styles.fieldLabel} id={labelId}>
          {t.demoChoiceLabel()}
        </p>
        <Radio
          aria-labelledby={labelId}
          name="color-scheme-demo"
          onChange={(value) => {
            if (isPreference(value)) setPreference(value);
          }}
          options={[
            { value: 'system', label: t.demoSystem() },
            { value: 'light', label: t.demoLight() },
            { value: 'dark', label: t.demoDark() },
          ]}
          value={preference}
        />
      </div>
      <dl className={styles.values}>
        <dt className={styles.term}>scheme</dt>
        <dd>
          <Code>{scheme}</Code>
        </dd>
        <dt className={styles.term}>preference</dt>
        <dd>
          <Code>{preference}</Code>
        </dd>
      </dl>
    </div>
  );
}

export function SwitcherDemo() {
  return (
    <div className={styles.root}>
      <div>
        <Toggle />
      </div>
      <Suspense fallback={<Skeleton size="lg" />}>
        <Choice />
      </Suspense>
    </div>
  );
}
