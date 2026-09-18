import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリケーションのカラースキーム軸を持つ。訪問者の設定（light / dark / 未設定＝既定値に従い、既定ではシステム追従）を localStorage に置き、システムの設定と突き合わせて `<html>` の `dark` クラスに解決する。ルートレイアウトに置く 1 つの Provider が、最初の描画の前に付けるインラインスクリプトの描画も、hydrate 後の追従も担い、hook はそれを読むだけ。',
  en: 'Owns the colour-scheme axis of an application. The visitor’s preference (light, dark, or nothing, which follows the default: the system unless told otherwise) lives in localStorage, is resolved against the system, and becomes the `dark` class on `<html>`. One provider in the root layout renders the inline script that puts it there before the first paint and keeps it there after hydration; a hook reads it.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureNoFlash = message({
  ja: '最初の描画から正しい',
  en: 'Right from the first paint',
});

export const featureNoFlashDescription = message({
  ja: '`<ColorSchemeProvider>` が先頭にインラインスクリプトを描く。Provider が書く行と同じ行を読み、React が読み込まれる前に `dark` を付けるので、ダークのページが一瞬ライトで光らない。`<head>` に置くものは無い。',
  en: '`<ColorSchemeProvider>` renders an inline script as its first child. It reads the row the provider writes and puts `dark` on before React loads, so a dark page never flashes light. Nothing goes in `<head>`.',
});

export const featureSystem = message({
  ja: '未設定は既定でシステムに追従',
  en: 'Absence follows the system by default',
});

export const featureSystemDescription = message({
  ja: '保存されるのは訪問者が選んだときだけ。選んでいなければ Provider の `defaultPreference` に従う。既定の `system` は `prefers-color-scheme` の変化にその場で追従し、初回に見たシステムの値に固定されない。',
  en: 'A preference is stored only when the visitor chose one. Otherwise the provider’s `defaultPreference` applies; `system`, the default unless told otherwise, follows `prefers-color-scheme` as it changes — never pinned to what the system said on the first visit.',
});

export const featureState = message({
  ja: '保存先は @k8ordo/state',
  en: 'Stored through @k8ordo/state',
});

export const featureStateDescription = message({
  ja: "`defineLocalState('color-scheme')` の 1 行が保存先。localStorage のキーも行の JSON もここには書かれず、タブ間の同期も古い行のサルベージも state のもの。",
  en: "One `defineLocalState('color-scheme')` is where it lives. Neither the localStorage key nor the row’s JSON is spelled here; cross-tab sync and salvage of an old row are state’s.",
});

export const featureHook = message({
  ja: '決めるのは 1 か所、読むのはどこでも',
  en: 'One place decides, any place reads',
});

export const featureHookDescription = message({
  ja: 'クラスを書くのは Provider だけ。`useColorScheme()` は `{ scheme, preference, setPreference }` を読むだけの hook なので、切替ボタンとプレビューがずれようがない。',
  en: 'Only the provider writes the class. `useColorScheme()` is a hook that reads `{ scheme, preference, setPreference }` and nothing more, so a switcher and a preview cannot disagree.',
});

export const demoTitle = message({
  ja: 'このサイト自身が実演',
  en: 'This site is the demo',
});

export const demoDescription = message({
  ja: 'ヘッダーの切替ボタンも、このページの選択肢も、同じ `useColorScheme()` です。「システム」に戻すと保存した設定が外れ、OS の設定に追従します。',
  en: 'The switcher in the header and the choices below are the same `useColorScheme()`. Choosing “system” drops the stored preference and follows the OS again.',
});

export const demoScheme = message({
  ja: '今の表示',
  en: 'On screen',
});

export const demoPreference = message({
  ja: '設定',
  en: 'Preference',
});

export const demoSystem = message({
  ja: 'システム',
  en: 'System',
});

export const demoLight = message({
  ja: 'ライト',
  en: 'Light',
});

export const demoDark = message({
  ja: 'ダーク',
  en: 'Dark',
});

export const exampleTitle = message({
  ja: '全体像',
  en: 'The whole of it',
});

export const exampleDescription = message({
  ja: "ルートレイアウトに Provider を 1 つ、切替に hook を 1 つ。それ以外に書くものはありません。`setPreference('system')` で保存した設定を外すと、Provider の `defaultPreference` がまた適用されます。既定の `'system'` なら OS の設定に追従します。",
  en: "One provider in the root layout, one hook in the switcher. There is nothing else to write. `setPreference('system')` drops the stored preference, and the provider’s `defaultPreference` applies again; with the default, `'system'`, that means following the OS.",
});

export const docsTitle = message({
  ja: '設計ガイド',
  en: 'Design guide',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/color-scheme/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/color-scheme/docs/`.',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});
