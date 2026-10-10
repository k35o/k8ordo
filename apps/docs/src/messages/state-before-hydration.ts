import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'テーマのクラスのように、最初の描画より前に`<html>`へ反映したい値を、インラインスクリプトで読めるようになります。`useAppState`はハイドレーションのあとに動くので、それでは間に合いません。',
  en: 'You will be able to read a value from an inline script before the first paint, such as a theme class that has to be on `<html>`. `useAppState` runs after hydration, which is too late for that.',
});

export const whyTitle = message({
  ja: '`storageKey`と`inlineRead()`',
  en: '`storageKey` and `inlineRead()`',
});

export const whyKey = message({
  ja: '1行目の`storageKey`は、ストアがlocalStorageやsessionStorageに書き込むキーです。4行目の`inlineRead()`は、インラインの`<script>`に埋め込むJavaScriptの式を返します。この式をブラウザで評価すると、その置き場所に保存されたオブジェクトになります。',
  en: 'Line 1, `storageKey`, is the key the store writes under in localStorage or sessionStorage. Line 4, `inlineRead()`, returns a JavaScript expression for an inline `<script>`. Evaluated in the browser, it becomes the object stored in that place.',
});

export const whyDrift = message({
  ja: 'キーとJSONの形をスクリプトに直接書くと、どちらかを変えた時点で定義と食い違います。`inlineRead()`の式は定義から作られるので、変更に追従します。',
  en: 'A script with the key and the JSON shape written into it drifts the moment either changes. The expression from `inlineRead()` is built from the definition, so it follows every change.',
});

export const whyCookie = message({
  ja: '`inlineRead()`があるのは、localStorageとsessionStorageの定義だけです。Cookieの状態は、`@k8ordo/framework`のserverモードならサーバーが`parseCookies`で読み、最初の描画から保存した値を表示できます。',
  en: 'Only local and session definitions have `inlineRead()`. In `@k8ordo/framework`’s server mode, the server reads a cookie state with `parseCookies`, so the stored value shows from the first render.',
});

export const whyCookieSee = message({
  ja: '書き方は',
  en: ' For the setup, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const embedTitle = message({
  ja: '`<script>`への埋め込み',
  en: 'Embedding in a `<script>`',
});

export const embedValue = message({
  ja: '6行目で、式を値として埋め込みます。式は即時実行の関数です。代入の右辺にも関数の引数にも三項演算子の中にも書けます。キーは`<`も含めてエスケープされるので、どんなキーでも埋め込めます。',
  en: 'Line 6 embeds the expression as a value. The expression is a self-invoking function. It fits on the right side of an assignment, as an argument or inside a ternary. The key is escaped, `<` included, so any key can be embedded.',
});

export const embedSuppress = message({
  ja: 'スクリプトはReactより先に`<html>`のクラスを変えるので、18行目で`<html>`に`suppressHydrationWarning`を付けます。ハイドレーションのあとは、ストアの値を正として扱います。',
  en: 'The script changes the class of `<html>` before React hydrates it, so line 18 puts `suppressHydrationWarning` on `<html>`. After hydration, the store is the source of truth.',
});

export const nullTitle = message({
  ja: '`null`になるとき',
  en: 'When it is `null`',
});

export const nullLead = message({
  ja: '式がエラーになることはありません。次のときは`null`になります。',
  en: 'The expression never throws. It evaluates to `null` when:',
});

export const nullNothing = message({
  ja: '何も保存されていない',
  en: 'nothing is stored',
});

export const nullCorrupt = message({
  ja: '保存されたJSONが壊れている',
  en: 'the stored JSON is corrupt',
});

export const nullNotObject = message({
  ja: '値がオブジェクトではない（数や文字列、配列、`null`）',
  en: 'the value is not an object (a number, a string, an array or `null`)',
});

export const nullUnreadable = message({
  ja: 'ストレージが読めない',
  en: 'storage cannot be read',
});

export const nullVersion = message({
  ja: '`version`を持つlocalStorageの状態で、ほかのバージョンが書いた値が保存されている',
  en: 'for a local state with a `version`, the stored value was written by another version',
});

export const rawTitle = message({
  ja: 'スキーマを通る前の値',
  en: 'Value before the schema runs',
});

export const rawSchema = message({
  ja: 'スクリプトが動く時点では、まだモジュールが読み込まれていません。スキーマも`migrate`も走らず、保存された値がそのまま返ってきます。`useAppState`が返す、スキーマに合わないフィールドだけを既定値に戻した値とは違います。',
  en: 'When the script runs, no module has loaded yet. Neither the schema nor `migrate` runs, and what comes back is the stored value as it is. It is not the value `useAppState` returns, where only a field the schema rejects falls back to its default.',
});

export const rawFields = message({
  ja: "中身を信頼せず、必要なフィールドだけをそれぞれ確かめて読みます。「`<script>`への埋め込み」の例では、`s && s.mode === 'dark'`で確かめています。",
  en: "Treat it as untrusted and read only the fields you need, each with its own check. The example under Embedding in a `<script>` checks with `s && s.mode === 'dark'`.",
});

export const rawColorScheme = message({
  ja: 'は、`inlineRead()`で最初の描画の前に`<html>`へクラスを付けています。カラースキームの切り替えなら、このパッケージを使ってください。',
  en: ' puts a class on `<html>` before the first paint with `inlineRead()`. For a colour scheme switch, use that package.',
});
