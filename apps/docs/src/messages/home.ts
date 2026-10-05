import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'Baselineに入った機能を、制限なく使うReactのライブラリ群',
  en: 'React libraries that use Baseline features without holding back',
});

export const exploreUi = message({
  ja: 'UIを見る',
  en: 'Explore UI',
});

export const membersTitle = message({
  ja: 'パッケージ',
  en: 'Packages',
});

export const memberUiDescription = message({
  ja: 'セマンティックなデザイントークンと国際化、生成UIのアダプタを備えたReactのコンポーネント集です。',
  en: 'React components with semantic design tokens, i18n, and generative-UI adapters.',
});

export const memberFormDescription = message({
  ja: 'スキーマを1つ書けば、HTMLの制約属性とエラーの文言、サーバーでの検証がそこから決まります。値はDOMが持つので、JavaScriptが無くても動きます。',
  en: 'Derives HTML constraint attributes, messages, and server-side validation from one zod schema. The DOM holds the values, so it works without JavaScript.',
});

export const memberStateDescription = message({
  ja: '状態を「どこに置くか」で宣言します。URLや履歴エントリ、Web Storage、Cookieに置く状態はスキーマで型付けし、メモリに置く状態は型の付いた箱として扱います。',
  en: 'Declares state by where it lives — URL, history entry, localStorage, sessionStorage, a cookie, memory — with one zod schema for each boundary place and a typed box for memory, riding the Navigation API.',
});

export const disciplineTitle = message({
  ja: '共通の前提',
  en: 'Shared commitments',
});

export const disciplinePlatform = message({
  ja: 'Baselineだけ',
  en: 'Baseline only',
});

export const disciplinePlatformDescription = message({
  ja: '主要な4つのブラウザがそろった時点（Baseline newly available）で、新しい機能を使います。そこから30か月後のwidely availableは待ちません。ポリフィルもフォールバックも持たないので、古いブラウザでは動きません。古いブラウザを切り捨てたのではなく、最初からそこで動くように作っていないのです。',
  en: 'A feature is fair game the moment it reaches Baseline newly available — shipped in all four core browsers — rather than 30 months later at widely available. With no polyfills and no fallbacks it runs only on current browsers — it did not drop the old ones, it never ran on them.',
});

export const disciplineReact = message({
  ja: 'Reactの最新に追従する',
  en: 'Always on the latest React',
});

export const disciplineReactDescription = message({
  ja: 'React 19とServer Componentsを前提にし、新しい書き方が出れば取り入れます。互換性のための古い書き方は残さないので、どのパッケージでも書き方が1つに保たれます。',
  en: 'React 19 and Server Components are assumed, and each new idiom is adopted as it lands. No compatibility path is kept around, so there is only ever one way to write it.',
});

export const disciplineTypes = message({
  ja: 'TypeScript Safe',
  en: 'TypeScript safe',
});

export const disciplineTypesDescription = message({
  ja: '型は、書いたものを後から確かめるためではなく、間違ったものを書けなくするために使います。ドキュメントや生成物も型から作るので、実装とずれることがありません。',
  en: 'Types are not there to check what you wrote after the fact — they are there to make the mistake unwritable. Docs and generated artifacts are derived from the types, so they cannot drift from the implementation.',
});

export const disciplineAgents = message({
  ja: 'エージェントが読める',
  en: 'Readable by agents',
});

export const disciplineAgentsDescription = message({
  ja: 'どのパッケージも、自分のドキュメントをnpmパッケージに同梱しています。AIはインストールした版のドキュメントをそのまま読むので、別の場所へ写して同期させる手間も、版が食い違う心配もありません。',
  en: 'Every package ships its own documentation inside its npm package, so an agent reads the exact version you installed — nothing to copy, nothing to re-sync, no version drift.',
});
