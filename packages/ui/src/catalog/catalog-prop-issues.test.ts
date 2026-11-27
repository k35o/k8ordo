import { describe, expect, it } from 'vite-plus/test';
import { z } from 'zod';

import { catalog, catalogPropIssues } from './index';

type NestedObject = {
  path: ReadonlyArray<string | number>;
  closed: boolean;
  keys: string[];
};

const nestedObjectsIn = (
  node: unknown,
  path: ReadonlyArray<string | number>,
): NestedObject[] => {
  if (typeof node !== 'object' || node === null) {
    return [];
  }
  const inside = Object.entries(node).flatMap(
    ([keyword, child]: [string, unknown]) => {
      if (
        keyword === 'properties' &&
        typeof child === 'object' &&
        child !== null
      ) {
        return Object.entries(child).flatMap(
          ([key, schema]: [string, unknown]) =>
            nestedObjectsIn(schema, [...path, key]),
        );
      }
      if (keyword === 'items') {
        return nestedObjectsIn(child, [...path, 0]);
      }
      if (keyword === 'prefixItems' && Array.isArray(child)) {
        return child.flatMap((schema: unknown, index) =>
          nestedObjectsIn(schema, [...path, index]),
        );
      }
      return nestedObjectsIn(child, path);
    },
  );
  if (path.length === 0 || !('type' in node) || node.type !== 'object') {
    return inside;
  }
  const properties =
    'properties' in node &&
    typeof node.properties === 'object' &&
    node.properties !== null
      ? node.properties
      : {};
  const here: NestedObject = {
    path,
    closed:
      'additionalProperties' in node && node.additionalProperties === false,
    keys: Object.keys(properties),
  };
  return [here, ...inside];
};

const propsWith = (
  path: ReadonlyArray<string | number>,
  value: unknown,
): unknown =>
  path.reduceRight<unknown>(
    (inner, key) =>
      typeof key === 'number'
        ? Array.from({ length: key + 1 }, () => inner)
        : { [key]: inner },
    value,
  );

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

  it.each([
    ['Table', {}, 'label, align'],
    ['DataTable', { label: '在庫' }, 'label, align, sortable'],
  ])(
    '%s の列に書いた知らないキーを、列の位置と書けるキーを付けて報告する',
    (type, own, allowed) => {
      expect(
        catalogPropIssues(type, {
          ...own,
          columns: [{ label: '品名' }, { label: '数', width: 80 }],
          rows: [['りんご', '3']],
        }),
      ).toStrictEqual([
        `${type}.columns.1: Unknown prop "width". Allowed props: ${allowed}.`,
      ]);
    },
  );

  it('入れ子のオブジェクトの知らないキーは、1 つずつ報告する', () => {
    expect(
      catalogPropIssues('Accordion', {
        items: [{ title: 'Q', content: 'A', open: true, icon: 'plus' }],
      }),
    ).toStrictEqual([
      'Accordion.items.0: Unknown prop "open". Allowed props: title, content, defaultOpen.',
      'Accordion.items.0: Unknown prop "icon". Allowed props: title, content, defaultOpen.',
    ]);
  });

  it('入れ子の中の入れ子の知らないキーも、位置を付けて報告する', () => {
    expect(
      catalogPropIssues('SideNav', {
        label: 'ドキュメント',
        groups: [
          {
            title: 'はじめに',
            links: [
              { label: '概要', href: '/' },
              { label: '導入', href: '/install', target: '_blank' },
            ],
          },
        ],
      }),
    ).toStrictEqual([
      'SideNav.groups.0.links.1: Unknown prop "target". Allowed props: label, href, current.',
    ]);
  });

  it('省ける配列の中のオブジェクトの知らないキーも報告する', () => {
    expect(
      catalogPropIssues('ColorPicker', {
        name: 'brand',
        label: 'ブランドの色',
        swatches: [{ value: '#0ea5e9', label: '空', name: 'sky' }],
      }),
    ).toStrictEqual([
      'ColorPicker.swatches.0: Unknown prop "name". Allowed props: value, label.',
    ]);
  });

  it('RadioCard の選択肢では、説明と無効も書けるキーに挙げる', () => {
    expect(
      catalogPropIssues('RadioCard', {
        name: 'plan',
        label: 'プラン',
        options: [{ value: 'free', label: 'Free', price: 0 }],
      }),
    ).toStrictEqual([
      'RadioCard.options.0: Unknown prop "price". Allowed props: value, label, description, disabled.',
    ]);
  });

  it('入れ子の知らないキーは、ほかの prop の誤りや最上位の知らない prop と一緒に報告する', () => {
    expect(
      catalogPropIssues('Tabs', {
        label: 3,
        tabs: [{ label: '概要', content: '...', icon: 'info' }],
        variant: 'pill',
      }),
    ).toStrictEqual([
      'Tabs.label: Invalid input: expected string, received number',
      'Tabs.tabs.0: Unknown prop "icon". Allowed props: label, content.',
      'Tabs: Unknown prop "variant". Allowed props: label, tabs.',
    ]);
  });

  it('どの項目でも、props の中に置くオブジェクトは知らないキーを受け付けず、書けるキーを挙げて報告する', () => {
    const nested = Object.entries(catalog).flatMap(([name, entry]) =>
      nestedObjectsIn(z.toJSONSchema(entry.props, { io: 'input' }), []).map(
        ({ path, closed, keys }) => ({
          name,
          path,
          at: [name, ...path].join('.'),
          closed,
          keys,
        }),
      ),
    );

    expect(nested.map(({ at }) => at)).toStrictEqual(
      expect.arrayContaining(['Table.columns.0', 'SideNav.groups.0.links.0']),
    );
    expect(
      nested.map(({ name, path, at, closed }) => ({
        at,
        closed,
        reported: catalogPropIssues(
          name,
          propsWith(path, { notAProp: true }),
        ).filter((issue) => issue.startsWith(`${at}: Unknown prop`)),
      })),
    ).toStrictEqual(
      nested.map(({ at, keys }) => ({
        at,
        closed: true,
        reported: [
          `${at}: Unknown prop "notAProp". Allowed props: ${keys.join(', ')}.`,
        ],
      })),
    );
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
