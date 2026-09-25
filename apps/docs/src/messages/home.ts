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
  ja: 'セマンティックなデザイントークン・i18n・生成UIアダプタを備えたReactコンポーネント。',
  en: 'React components with semantic design tokens, i18n, and generative-UI adapters.',
});

export const memberFormDescription = message({
  ja: 'スキーマ1つから HTML の制約属性・メッセージ・サーバー検証を導く。値は DOM が持つので、JavaScript が無くても動く。',
  en: 'Derives HTML constraint attributes, messages, and server-side validation from one zod schema. The DOM holds the values, so it works without JavaScript.',
});

export const memberStateDescription = message({
  ja: '状態を置き場所で宣言する。URL・履歴エントリ・localStorage・Cookie はそれぞれスキーマ1つで型付けし、メモリはスキーマのない型付きの箱にする。Navigation API に載せる。',
  en: 'Declares state by where it lives — URL, history entry, localStorage, a cookie, memory — with one zod schema for each boundary place and a typed box for memory, riding the Navigation API.',
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
  ja: 'コア4ブラウザに載った時点（Baseline newly available）で使う。その30か月後のwidely availableは待たない。ポリフィルもフォールバックも持たないので、最新のブラウザでしか動かない。古いブラウザを切ったのではなく、最初からそこでは動かない。',
  en: 'A feature is fair game the moment it reaches Baseline newly available — shipped in all four core browsers — rather than 30 months later at widely available. With no polyfills and no fallbacks it runs only on current browsers — it did not drop the old ones, it never ran on them.',
});

export const disciplineReact = message({
  ja: 'Reactの最新に追従する',
  en: 'Always on the latest React',
});

export const disciplineReactDescription = message({
  ja: 'React 19とServer Componentsを前提にし、新しい記法が出れば追う。互換のための古いパスを残さないので、書き方が一つに保たれる。',
  en: 'React 19 and Server Components are assumed, and each new idiom is adopted as it lands. No compatibility path is kept around, so there is only ever one way to write it.',
});

export const disciplineTypes = message({
  ja: 'TypeScript Safe',
  en: 'TypeScript safe',
});

export const disciplineTypesDescription = message({
  ja: '型は書いたものを後から確かめるためではなく、間違いを書けなくするために使う。ドキュメントも生成物も型から作られるので、実装からずれない。',
  en: 'Types are not there to check what you wrote after the fact — they are there to make the mistake unwritable. Docs and generated artifacts are derived from the types, so they cannot drift from the implementation.',
});

export const disciplineAgents = message({
  ja: 'エージェントが読める',
  en: 'Readable by agents',
});

export const disciplineAgentsDescription = message({
  ja: 'どのパッケージも自分のドキュメントをnpmパッケージに同梱する。AIはインストールした版そのものを読むので、写して同期させる手間も、版がずれる事故も起きない。',
  en: 'Every package ships its own documentation inside its npm package, so an agent reads the exact version you installed — nothing to copy, nothing to re-sync, no version drift.',
});
