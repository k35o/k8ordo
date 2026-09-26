import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import * as root from '../components';
import * as ai from '../components/ai';
import * as response from '../components/ai/response';
import * as codeBlock from '../components/data-display/code-block';
import * as icons from '../components/icons';
import { catalog } from './json-render/catalog';

// CodeBlock は server-only を import する。ここでは export の名前を読むだけなので外す
vi.mock('server-only', () => ({}));

const RENAMED_IN_CATALOG: ReadonlyMap<string, string> = new Map([
  ['AlertIcon', 'StatusIcon'],
  ['ToastProvider', 'Toast'],
  ['useToast', 'Toast'],
]);

const OBSERVER =
  'コールバックに報告するだけで自分では何も描かない。spec には報告を受け取るコードが無い';
const CHAT =
  '生成 UI を載せる側のチャット。アプリがメッセージの流れから組み立てるもので、spec が置くものではない';

const LEFT_OUT: ReadonlyMap<string, string> = new Map([
  ['InView', OBSERVER],
  ['Resize', OBSERVER],
  ['UIProvider', 'アプリが生成 UI も含めた全体の外側に 1 度だけ置く'],
  [
    'PortalRootProvider',
    'アプリ自身の createPortal のための配線。生成 UI のオーバーレイは自分で面を開く',
  ],
  ['usePortalRoot', 'PortalRootProvider を読むだけの hook'],
  ['Conversation', CHAT],
  ['Message', CHAT],
  ['PromptInput', CHAT],
  ['Reasoning', CHAT],
  ['Suggestion', CHAT],
  ['ToolInvocation', CHAT],
  ['Attachment', CHAT],
  ['Source', CHAT],
  ['Response', CHAT],
  [
    'CodeBlock',
    'サーバーでハイライトする async の Server Component。生成 UI はクライアントで描くので置けず、置けば shiki をブラウザに送ることになる',
  ],
  [
    'Prose',
    'Markdown が描いた素の HTML を整える入れ物。spec が置くのは自分の見た目を持つ部品なので、効くものが無い（流れは Stack で組む）',
  ],
]);

// 部品を export するエントリをすべて見る。/ai と /code-block は root に出ていない
const exported = [
  ...Object.keys(root),
  ...Object.keys(ai),
  ...Object.keys(response),
  ...Object.keys(codeBlock),
];
const iconExports = new Set(Object.keys(icons));
const catalogNames: readonly string[] = catalog.componentNames;

// アイコンは 1 つずつではなく、name で絵柄を選ぶ Icon 1 項目として載る
const entryOf = (name: string): string | undefined => {
  if (catalogNames.includes(name)) {
    return name;
  }
  return (
    RENAMED_IN_CATALOG.get(name) ?? (iconExports.has(name) ? 'Icon' : undefined)
  );
};

const unaccounted = (): string[] =>
  exported
    .filter((name) => entryOf(name) === undefined && !LEFT_OUT.has(name))
    .toSorted();

const unreachedEntries = (): string[] => {
  const reached = new Set(exported.map((name) => entryOf(name)));
  return catalogNames.filter((name) => !reached.has(name)).toSorted();
};

const staleTableEntries = (): string[] => [
  ...[...RENAMED_IN_CATALOG.keys(), ...LEFT_OUT.keys()].filter(
    (name) => !exported.includes(name),
  ),
  ...[...RENAMED_IN_CATALOG.values()].filter(
    (name) => !catalogNames.includes(name),
  ),
  ...[...LEFT_OUT.keys()].filter((name) => catalogNames.includes(name)),
];

const readDoc = (path: string): string =>
  readFileSync(join(import.meta.dirname, '../..', path), 'utf8');

const section = (markdown: string, heading: string): string => {
  const start = markdown.indexOf(`\n## ${heading}\n`);
  if (start === -1) {
    return '';
  }
  const end = markdown.indexOf('\n## ', start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
};

const namesIn = (text: string): string[] =>
  [...text.matchAll(/`(?<name>\w+)`/gu)].map((m) => m.groups?.name ?? '');

const SUPPORTED_LIST =
  /^Supported components \(\*\*all (?<count>\d+)\*\*, both frameworks\):\n\n(?<list>(?:- .+\n)+)/mu;

const readmeSupportedList = (): { count: number; names: string[] } => {
  const groups = SUPPORTED_LIST.exec(readDoc('README.md'))?.groups;
  return {
    count: Number(groups?.count),
    names: namesIn(groups?.list ?? '').toSorted(),
  };
};

describe('カタログと公開している部品の対応', () => {
  it('公開している部品はどれもカタログに載るか、理由付きで除外されている', () => {
    expect(unaccounted()).toStrictEqual([]);
  });

  it('カタログの項目はどれも公開している部品を指している', () => {
    expect(unreachedEntries()).toStrictEqual([]);
  });

  it('別名と除外の表は、実在する export とカタログの項目だけを指している', () => {
    expect(staleTableEntries()).toStrictEqual([]);
  });

  it('除外した export はどれも generative-ui.md の除外の節に名前がある', () => {
    const namedInDocs = namesIn(
      section(
        readDoc('docs/references/generative-ui.md'),
        'What the catalog leaves out',
      ),
    );

    expect(
      [...LEFT_OUT.keys()].filter((name) => !namedInDocs.includes(name)),
    ).toStrictEqual([]);
  });
});

describe('README の生成 UI 対応部品一覧', () => {
  it('カタログの全項目を挙げ、書いてある数も項目数と一致する', () => {
    expect(readmeSupportedList()).toStrictEqual({
      count: catalogNames.length,
      names: catalogNames.toSorted(),
    });
  });
});
