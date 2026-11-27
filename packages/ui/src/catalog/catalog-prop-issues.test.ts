import { describe, expect, it } from 'vite-plus/test';

import { catalogPropIssues } from './index';

describe('catalogPropIssues', () => {
  it('正しい props には何も返さない', () => {
    expect(catalogPropIssues('Button', { label: 'OK' })).toStrictEqual([]);
  });

  it('型の合わない値と知らない prop を報告する', () => {
    expect(
      catalogPropIssues('Button', { label: 1, colour: 'primary' }),
    ).toStrictEqual([
      expect.stringContaining('Button.label'),
      expect.stringContaining('Unknown prop "colour"'),
    ]);
  });

  it('形式が後で解決する prop は値を確かめない', () => {
    expect(
      catalogPropIssues(
        'TextField',
        {
          name: 'nickname',
          label: 'ニックネーム',
          defaultValue: { $bindState: '/form/nickname' },
        },
        { unresolved: ['defaultValue'] },
      ),
    ).toStrictEqual([]);
  });

  it('形式が後で解決する prop は必須でも欠けたことにしない', () => {
    expect(
      catalogPropIssues(
        'Button',
        { label: { $state: '/label' } },
        { unresolved: ['label'] },
      ),
    ).toStrictEqual([]);
  });

  it('入力欄の label が無ければ報告する', () => {
    expect(catalogPropIssues('TextField', { name: 'nickname' })).toStrictEqual([
      expect.stringContaining('TextField.label'),
    ]);
  });

  it('ListBox の label が無ければ報告する', () => {
    expect(
      catalogPropIssues('ListBox', {
        name: 'sort',
        options: [{ value: 'new', label: '新しい順' }],
      }),
    ).toStrictEqual([expect.stringContaining('ListBox.label')]);
  });

  it('TextField の type には、日付や時刻を含む 1 行の欄の種類を書ける', () => {
    expect(
      catalogPropIssues('TextField', {
        name: 'checkIn',
        label: 'チェックイン',
        type: 'date',
      }),
    ).toStrictEqual([]);
  });

  it('TextField の type に、ほかの項目が描く password と number は書けない', () => {
    expect([
      ...catalogPropIssues('TextField', {
        name: 'secret',
        label: '合言葉',
        type: 'password',
      }),
      ...catalogPropIssues('TextField', {
        name: 'count',
        label: '個数',
        type: 'number',
      }),
    ]).toStrictEqual([
      expect.stringContaining('TextField.type'),
      expect.stringContaining('TextField.type'),
    ]);
  });

  it.each([
    ['date', '2026-11-27'],
    ['time', '09:30'],
    ['time', '09:30:15'],
    ['datetime-local', '2026-11-27T09:30'],
    ['datetime-local', '2026-11-27T09:30:15'],
    ['month', '2026-11'],
    ['week', '2026-W48'],
  ])(
    'TextField の type が %s なら、その書式の defaultValue %s を書ける',
    (type, defaultValue) => {
      expect(
        catalogPropIssues('TextField', {
          name: 'when',
          label: '日時',
          type,
          defaultValue,
        }),
      ).toStrictEqual([]);
    },
  );

  it.each([
    ['date', '2026/11/27', 'YYYY-MM-DD'],
    ['date', '2026-02-30', 'YYYY-MM-DD'],
    ['time', '9:30', 'HH:MM or HH:MM:SS'],
    [
      'datetime-local',
      '2026-11-27 09:30',
      'YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS',
    ],
    ['month', '2026-13', 'YYYY-MM'],
    ['week', '2026-48', 'YYYY-Www'],
  ])(
    'TextField の type が %s なら、書式の違う defaultValue %s を報告する',
    (type, defaultValue, format) => {
      expect(
        catalogPropIssues('TextField', {
          name: 'when',
          label: '日時',
          type,
          defaultValue,
        }),
      ).toStrictEqual([
        `TextField.defaultValue: Expected ${format} for type "${type}", received "${defaultValue}"`,
      ]);
    },
  );

  it('日付や時刻でない TextField の defaultValue は、書式を問わない', () => {
    expect([
      ...catalogPropIssues('TextField', {
        name: 'note',
        label: 'メモ',
        defaultValue: '2026/11/27',
      }),
      ...catalogPropIssues('TextField', {
        name: 'mail',
        label: 'メールアドレス',
        type: 'email',
        defaultValue: '2026/11/27',
      }),
    ]).toStrictEqual([]);
  });

  it('TextField の defaultValue の書式は、ほかの prop の誤りと一緒に報告する', () => {
    expect(
      catalogPropIssues('TextField', {
        name: 3,
        label: '日時',
        type: 'date',
        defaultValue: '2026/11/27',
      }),
    ).toStrictEqual([
      expect.stringContaining('TextField.name'),
      'TextField.defaultValue: Expected YYYY-MM-DD for type "date", received "2026/11/27"',
    ]);
  });

  it('後で解決すると言われても、知らない prop は報告する', () => {
    expect(
      catalogPropIssues(
        'Button',
        { label: 'OK', colour: { $state: '/colour' } },
        { unresolved: ['colour'] },
      ),
    ).toStrictEqual([expect.stringContaining('Unknown prop "colour"')]);
  });
});
