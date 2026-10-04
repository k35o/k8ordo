import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '訪問者の設定は、@k8ordo/stateのふつうのローカル状態としてlocalStorageに保存されます。このパッケージが持つのは定義1つだけで、キーも行の形もタブ間の同期も@k8ordo/stateのものです。行の中身、hookを通さずに読む方法、タブ同士の揃い方、アプリのほかの設定との並べ方を説明します。',
  en: 'The visitor’s preference is stored in localStorage as an ordinary @k8ordo/state local state. This package holds one definition and nothing more: the key, the row’s shape and the sync between tabs are @k8ordo/state’s. This page covers what the row holds, reading it without the hook, how tabs agree, and keeping the application’s other preferences beside it.',
});

export const definition = {
  title: message({
    ja: '定義は`colorSchemeState` 1つ',
    en: 'One definition: `colorSchemeState`',
  }),
  description: message({
    ja: '設定の保存先の定義は`colorSchemeState`としてexportされており、中身はこれですべてです。',
    en: 'The definition of where the preference is kept is exported as `colorSchemeState`, and this is all of it.',
  }),
  key: message({
    ja: 'キーは`color-scheme`なので、localStorageのキーは`k8ordo-state:color-scheme`です（`colorSchemeState.storageKey`）。`preference`は省略可能で、省略されていることが「選んでいない」を表します。',
    en: 'The key is `color-scheme`, so the localStorage key is `k8ordo-state:color-scheme` (`colorSchemeState.storageKey`). `preference` is optional, and its absence is what “nothing chosen” means.',
  }),
};

export const rows = {
  title: message({
    ja: '保存される行',
    en: 'What the row holds',
  }),
  description: message({
    ja: '行が書かれるのは`setPreference`を呼んだときだけです。Providerの既定値は保存されません。',
    en: 'A row is written only when `setPreference` is called; the provider’s default is never stored.',
  }),
  columnWhen: message({
    ja: '操作',
    en: 'When',
  }),
  columnRow: message({
    ja: '保存される行',
    en: 'The stored row',
  }),
  never: message({
    ja: '一度も選んでいない',
    en: 'Never chose',
  }),
  noRow: message({
    ja: '行なし（`getItem`は`null`）',
    en: 'no row (`getItem` returns `null`)',
  }),
  systemRow: message({
    ja: "`'system'`に戻しても行は消えず、`preference`の無い`{}`が残ります。`preference`を読む側にとっては、行が無いのと同じです。",
    en: "Going back to `'system'` does not remove the row: `{}` remains, with no `preference` in it. Anything that reads `preference` treats it the same as no row.",
  }),
};

export const read = {
  title: message({
    ja: 'ほかの場所から読む',
    en: 'Reading it elsewhere',
  }),
  description: message({
    ja: 'hookを通さずに行を読みたいときは、どのクライアントコンポーネントからでも`useAppState(colorSchemeState)`を呼べます。@k8ordo/stateにはProviderが無く、ストアはキーごとに1つなので、`<ColorSchemeProvider>`と同じ値を読みます。',
    en: 'To read the row without the hook, call `useAppState(colorSchemeState)` from any client component. @k8ordo/state has no provider and keeps one store per key, so it reads what `<ColorSchemeProvider>` reads.',
  }),
  caveat: message({
    ja: "返るのは保存された`preference`（`'light' | 'dark' | undefined`）で、解決した`scheme`ではありません。画面に出ているものが欲しいなら`useColorScheme()`を使います。サーバーでの描画とhydrateの描画では、何も保存されていないときの値`undefined`を返します。",
    en: "What comes back is the stored `preference` (`'light' | 'dark' | undefined`), not the resolved `scheme`; for what is on screen, use `useColorScheme()`. On the server and in the hydration render it is the nothing-stored value, `undefined`.",
  }),
  inlineRead: message({
    ja: '最初の描画の前に同じ行を読みたい自前のインラインスクリプトには`colorSchemeState.inlineRead()`があります。保存されたオブジェクト（読めなければ`null`）に評価されるJavaScriptの式を返します。スキーマは走らないので、使うフィールドは自分で確かめます。',
    en: 'An inline script of your own that needs the row before the first paint has `colorSchemeState.inlineRead()`: it returns a JavaScript expression that evaluates to the stored object, or to `null` when there is none it can read. The schema does not run there, so check each field you use.',
  }),
  inlineReadLink: message({
    ja: '@k8ordo/state:ハイドレーション前に読む',
    en: '@k8ordo/state: Reading before hydration',
  }),
};

export const tabs = {
  title: message({
    ja: 'タブ同士が揃う',
    en: 'Tabs agree',
  }),
  description: message({
    ja: '@k8ordo/stateのローカル状態は、自分のキーの`storage`イベントを購読しています。別のタブで選んだ設定も、別のタブでlocalStorageを消したことも、このタブのProviderに届き、クラスもその場で変わります。',
    en: '@k8ordo/state’s local state listens for `storage` events on its key. A choice made in another tab, or localStorage cleared there, reaches this tab’s provider, and the class changes in place.',
  }),
  sameTab: message({
    ja: "`storage`イベントは、書き込んだタブ自身には届きません。同じタブで`localStorage.setItem('k8ordo-state:color-scheme', …)`と直接書いても、Providerは再読み込みまで気づきません。変えるときは`setPreference`を通します。",
    en: "A `storage` event never reaches the tab that wrote. Writing `localStorage.setItem('k8ordo-state:color-scheme', …)` by hand in the same tab goes unnoticed by the provider until a reload. Change it through `setPreference`.",
  }),
};

export const beside = {
  title: message({
    ja: 'ほかの設定と並べる',
    en: 'Other preferences beside it',
  }),
  description: message({
    ja: "アプリがほかにも見た目の設定を持つなら、別のキーで自分の`defineLocalState`を定義します。このサイトの縦書きと横書きの設定がそうで、カラースキームとは別の行に保存されます。定義は`'use client'`の無いモジュールに置きます。`'use client'`のファイルからexportすると、Server Componentには定義ではなくclient referenceが届くからです。",
    en: "When the application has other display preferences, define a `defineLocalState` of its own under another key. This site’s writing-mode preference is one, stored in a row apart from the colour scheme. Keep the definition in a module without `'use client'`: exported from a `'use client'` file, it reaches a Server Component as a client reference, not as the definition.",
  }),
  collision: message({
    ja: "アプリで`defineLocalState('color-scheme', …)`を別に定義しないでください。@k8ordo/stateのストアはキーで共有されるので、2つの定義が同じ行と同じストアを取り合います。",
    en: "Do not define another `defineLocalState('color-scheme', …)` in the application: @k8ordo/state shares stores by key, so the two definitions would fight over one row and one store.",
  }),
  link: message({
    ja: '@k8ordo/stateの状態の置き場所',
    en: 'Where @k8ordo/state keeps state',
  }),
};
