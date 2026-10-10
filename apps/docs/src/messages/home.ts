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
  ja: 'ボタンもダイアログもServer Componentに置けるReactのコンポーネント集です。メニューやツールチップはPopover APIで最前面に開くので、`z-index`を調整する必要はありません。',
  en: 'React components, buttons and dialogs included, that you can place in a Server Component. Menus and tooltips open in the top layer through the Popover API, with no `z-index` to tune.',
});

export const memberFormDescription = message({
  ja: 'zodのスキーマから、HTMLの制約属性とサーバーの検証を作るReactのフォームライブラリです。制約はHTMLの属性に入るので、JavaScriptの読み込み前からブラウザが入力を確かめます。',
  en: 'A React form library that derives HTML constraint attributes and server-side validation from a zod schema. The constraints are HTML attributes, so the browser checks input before JavaScript loads.',
});

export const memberStateDescription = message({
  ja: 'URLや履歴エントリ、localStorage、Cookieの値を`useState`のように読み書きします。どこに置いた値もzodのスキーマで型付けし、同じフックで扱えます。',
  en: 'Reads and writes values in the URL, the history entry, localStorage and cookies like `useState`. Wherever a value lives, a zod schema types it and one hook handles it.',
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
  ja: '主要な4つのブラウザがすべて対応した時点（Baseline newly available）で、新しい機能を使います。その30か月後のwidely availableは待ちません。ポリフィルとフォールバックは持たないので、古いブラウザでは動きません。',
  en: 'A feature is used as soon as all four core browsers ship it (Baseline newly available). We do not wait the further 30 months for widely available. There are no polyfills or fallbacks, so old browsers are not supported.',
});

export const disciplineReact = message({
  ja: 'Reactの最新に追従する',
  en: 'Always on the latest React',
});

export const disciplineReactDescription = message({
  ja: 'React 19とServer Componentsを前提にし、新しい書き方が出れば取り入れます。互換性のために古い書き方は残しません。どのパッケージも書き方は1つです。',
  en: 'React 19 and Server Components are assumed, and new idioms are adopted as they arrive. No old idioms are kept for compatibility. Every package has one way to write each thing.',
});

export const disciplineTypes = message({
  ja: 'TypeScript Safe',
  en: 'TypeScript safe',
});

export const disciplineTypesDescription = message({
  ja: '間違った使い方は、書いた時点で型エラーになるように作っています。ドキュメントや生成物も型から作るので、実装と食い違いません。',
  en: 'Wrong usage is a type error as soon as you write it. Docs and generated files are built from the types, so they match the implementation.',
});

export const disciplineAgents = message({
  ja: 'エージェントが読める',
  en: 'Readable by agents',
});

export const disciplineAgentsDescription = message({
  ja: 'どのパッケージも、自分のドキュメントをnpmパッケージに同梱しています。エージェントは`node_modules/@k8ordo/<name>/docs/`から、インストールしたバージョンのドキュメントを読めます。',
  en: 'Every package ships its own documentation inside the npm package. An agent reads the docs for the installed version from `node_modules/@k8ordo/<name>/docs/`.',
});
