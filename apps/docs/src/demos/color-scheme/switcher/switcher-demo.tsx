'use client';

import { useColorScheme } from '@k8ordo/color-scheme';
import type { ColorSchemePreference } from '@k8ordo/color-scheme';
import { Button, Code, Radio, Skeleton } from '@k8ordo/ui';
import { Suspense, use, useId } from 'react';
import { browser } from 'react-dom';

import * as m from '../../../messages';

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
      <span className="inline dark:hidden">{t.demoToDark()}</span>
      <span className="hidden dark:inline">{t.demoToLight()}</span>
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-fg-base text-sm font-bold" id={labelId}>
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

export function SwitcherDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Toggle />
      </div>
      <Suspense fallback={<Skeleton size="lg" />}>
        <Choice />
      </Suspense>
    </div>
  );
}
