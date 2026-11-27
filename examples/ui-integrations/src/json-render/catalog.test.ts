import { describe, expect, it } from 'vite-plus/test';

import { validateGeneratedSpec } from './catalog';

const specWithTarget = (element: Record<string, unknown>) => ({
  root: 'root',
  elements: {
    root: {
      type: 'Stack',
      props: { direction: 'column' },
      children: ['target'],
    },
    target: element,
  },
});

type Result = ReturnType<typeof validateGeneratedSpec>;

const issuesOf = (result: Result) => (result.ok ? [] : result.issues);

const messages = (result: Result): string[] =>
  issuesOf(result).map((issue) => issue.message);

const repairPromptOf = (result: Result): string =>
  result.ok ? '' : result.repairPrompt;

describe('validateGeneratedSpec', () => {
  it('新しい API のキーだけで構成された spec を受け入れる', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Dialog',
        props: { triggerLabel: '開く', title: '設定', side: 'bottom' },
        children: [],
      }),
    );

    expect(result).toMatchObject({ ok: true });
  });

  it('$bindState で状態に結んだ値は、描画前の形のまま受け入れる', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Checkbox',
        props: {
          name: 'agree',
          label: '規約に同意する',
          defaultChecked: { $bindState: '/form/agree' },
        },
        children: [],
      }),
    );

    expect(result).toMatchObject({ ok: true });
  });

  it('null の prop は、描くときと同じく書かなかったものとして受け入れる', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Button',
        props: { label: '保存', href: null },
        children: [],
      }),
    );

    expect(result).toMatchObject({ ok: true });
  });

  it('日付を YYYY-MM-DD 以外の書式で書いた spec を弾く', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'DatePicker',
        props: { name: 'checkIn', label: 'チェックイン', min: '2023/01/20' },
        children: [],
      }),
    );

    expect(result.ok).toBe(false);
    expect(messages(result)).toContainEqual(
      expect.stringContaining('DatePicker.min'),
    );
  });

  it('value を省いた Progress（進み具合の分からない表示）を受け入れる', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Progress',
        props: { label: '読み込み中' },
        children: [],
      }),
    );

    expect(result).toMatchObject({ ok: true });
  });

  it('RangeSlider の defaultValue は [下側, 上側] の 2 つ組だけを受け入れる', () => {
    const pair = validateGeneratedSpec(
      specWithTarget({
        type: 'RangeSlider',
        props: { name: 'price', label: '価格', defaultValue: [20, 80] },
        children: [],
      }),
    );
    const triple = validateGeneratedSpec(
      specWithTarget({
        type: 'RangeSlider',
        props: { name: 'price', label: '価格', defaultValue: [20, 50, 80] },
        children: [],
      }),
    );

    expect(pair).toMatchObject({ ok: true });
    expect(triple.ok).toBe(false);
  });

  it('ColorPicker の色は #rrggbb だけを受け入れる', () => {
    const colorOf = (defaultValue: string) =>
      validateGeneratedSpec(
        specWithTarget({
          type: 'ColorPicker',
          props: {
            name: 'accent',
            label: 'テーマの色',
            defaultValue,
            swatches: [{ value: '#0D9488', label: 'ティール' }],
          },
          children: [],
        }),
      );

    expect(colorOf('#f97316')).toMatchObject({ ok: true });
    expect(colorOf('#f80').ok).toBe(false);
    expect(colorOf('orange').ok).toBe(false);
  });

  it('Combobox は候補を 1 つ以上要る', () => {
    const withOptions = (options: readonly unknown[]) =>
      validateGeneratedSpec(
        specWithTarget({
          type: 'Combobox',
          props: { name: 'prefecture', label: '都道府県', options },
          children: [],
        }),
      );

    expect(withOptions([{ value: 'tokyo', label: '東京都' }])).toMatchObject({
      ok: true,
    });
    expect(withOptions([]).ok).toBe(false);
  });

  it('スキーマに無いキーを未知のプロパティとして報告する', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Dialog',
        // 旧 API。zod は未知キーを黙って落とすため、検出しないと既定の
        // side で描画されてしまう。
        props: { triggerLabel: '開く', title: '設定', type: 'bottom' },
        children: [],
      }),
    );

    expect(result.ok).toBe(false);
    expect(messages(result)).toContainEqual(
      expect.stringContaining('Unknown prop "type"'),
    );
  });

  it('未知のプロパティを要素キー付きで修復プロンプトに載せる', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Button',
        props: { label: '保存', onClick: 'submit' },
        children: [],
      }),
    );

    expect(result.ok).toBe(false);
    const unknownPropIssue = issuesOf(result).find((issue) =>
      issue.message.includes('Unknown prop "onClick"'),
    );
    expect(unknownPropIssue?.elementKey).toBe('target');
    expect(repairPromptOf(result)).toContain('[target]');
  });

  it('旧い enum 値は値エラーとして報告する', () => {
    const result = validateGeneratedSpec(
      specWithTarget({
        type: 'Button',
        props: { label: '保存', color: 'gray' },
        children: [],
      }),
    );

    expect(result.ok).toBe(false);
    expect(messages(result)).toContainEqual(
      expect.stringContaining('Button.color'),
    );
  });

  it('未知のコンポーネント名を報告する', () => {
    const result = validateGeneratedSpec(
      specWithTarget({ type: 'Marquee', props: {}, children: [] }),
    );

    expect(result.ok).toBe(false);
    expect(messages(result)).toContainEqual(
      expect.stringContaining('Unknown component type "Marquee"'),
    );
  });
});
