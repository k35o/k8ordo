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

  it('href には http(s) の URL と、/ 1 つで始まるパスを書ける', () => {
    expect([
      ...catalogPropIssues('Anchor', {
        label: 'Docs',
        href: 'https://example.com/docs',
      }),
      ...catalogPropIssues('Anchor', { label: 'Docs', href: '/docs' }),
      ...catalogPropIssues('Anchor', { label: 'Top', href: '/' }),
    ]).toStrictEqual([]);
  });

  it.each([
    ['スキームを省いた別のサイト', '//evil.example/docs'],
    ['\\ で書いた別のサイト', '/\\evil.example/docs'],
    ['タブを挟んで // になる別のサイト', '/\t/evil.example/docs'],
    ['改行を挟んで // になる別のサイト', '/\n/evil.example/docs'],
  ])('href の %s は報告する', (_, href) => {
    expect(catalogPropIssues('Anchor', { label: 'Docs', href })).toStrictEqual([
      'Anchor.href: Only an http:// or https:// URL, or a path starting with a single /, is allowed',
    ]);
  });

  it.each([
    ['Table', {}],
    ['DataTable', { label: '在庫' }],
  ])('%s のセルの数が列の数と違う行を、行の位置で報告する', (type, own) => {
    expect(
      catalogPropIssues(type, {
        ...own,
        columns: [{ label: '品名' }, { label: '数' }],
        rows: [['りんご', '3'], ['みかん'], ['ぶどう', '5', '箱']],
      }),
    ).toStrictEqual([
      `${type}.rows.1: Expected 2 cells (one per column), received 1`,
      `${type}.rows.2: Expected 2 cells (one per column), received 3`,
    ]);
  });

  it('Table の行と列の食い違いは、ほかの prop の誤りと一緒に報告する', () => {
    expect(
      catalogPropIssues('Table', {
        caption: 3,
        columns: [{ label: '品名' }, { label: '数' }],
        rows: [['みかん']],
      }),
    ).toStrictEqual([
      'Table.caption: Invalid input: expected string, received number',
      'Table.rows.0: Expected 2 cells (one per column), received 1',
    ]);
  });

  it('Table の列そのものが誤っていれば、行と列は比べない', () => {
    expect(
      catalogPropIssues('Table', {
        columns: [{ label: 3 }, { label: '数' }],
        rows: [['みかん']],
      }),
    ).toStrictEqual([expect.stringContaining('Table.columns.0.label')]);
  });

  it('Table の行と列を、後で解決しない prop どうしで確かめる', () => {
    expect(
      catalogPropIssues(
        'Table',
        {
          caption: { $state: '/caption' },
          columns: [{ label: '品名' }, { label: '数' }],
          rows: [['みかん']],
        },
        { unresolved: ['caption'] },
      ),
    ).toStrictEqual([
      'Table.rows.0: Expected 2 cells (one per column), received 1',
    ]);
  });

  it('Table の rows を後で解決するときは、行と列を確かめない', () => {
    expect(
      catalogPropIssues(
        'Table',
        { columns: [{ label: '品名' }], rows: { $state: '/rows' } },
        { unresolved: ['rows'] },
      ),
    ).toStrictEqual([]);
  });

  const SORT_OPTIONS = [
    { value: 'new', label: '新しい順' },
    { value: 'popular', label: '人気順' },
  ];

  it.each(['Select', 'Radio', 'RadioCard', 'ListBox'])(
    '%s の defaultValue が選択肢の値に無ければ報告する',
    (type) => {
      expect(
        catalogPropIssues(type, {
          name: 'sort',
          label: '並び順',
          options: SORT_OPTIONS,
          defaultValue: '人気順',
        }),
      ).toStrictEqual([
        `${type}.defaultValue: Expected the value of an option ("new" | "popular"), received "人気順"`,
      ]);
    },
  );

  it.each(['CheckboxGroup', 'CheckboxCard'])(
    '%s の defaultValue のうち、選択肢の値に無いものを位置付きで報告する',
    (type) => {
      expect(
        catalogPropIssues(type, {
          name: 'sort',
          label: '並び順',
          options: SORT_OPTIONS,
          defaultValue: ['new', 'price'],
        }),
      ).toStrictEqual([
        `${type}.defaultValue.1: Expected the value of an option ("new" | "popular"), received "price"`,
      ]);
    },
  );

  it('選択肢の値を defaultValue に書いた欄には何も返さない', () => {
    expect([
      ...catalogPropIssues('Select', {
        name: 'sort',
        label: '並び順',
        options: SORT_OPTIONS,
        defaultValue: 'popular',
      }),
      ...catalogPropIssues('CheckboxGroup', {
        name: 'sort',
        label: '並び順',
        options: SORT_OPTIONS,
        defaultValue: ['new', 'popular'],
      }),
    ]).toStrictEqual([]);
  });

  it('選択肢に無い defaultValue は、ほかの prop の誤りと一緒に報告する', () => {
    expect(
      catalogPropIssues('Select', {
        name: 'sort',
        label: 3,
        options: SORT_OPTIONS,
        defaultValue: '人気順',
      }),
    ).toStrictEqual([
      expect.stringContaining('Select.label'),
      'Select.defaultValue: Expected the value of an option ("new" | "popular"), received "人気順"',
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
