'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';
import { Button, Code } from '@k8ordo/ui';

import * as m from '../../messages';

import styles from './scheme-demo.module.css';

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
    <div className={styles.root}>
      <div className={styles.choices}>
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
