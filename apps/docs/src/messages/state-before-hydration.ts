import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'テーマのクラスのように、最初の描画より前に`<html>`へ反映したい値があります。`useAppState`はハイドレーションのあとに動くので、それでは間に合いません。このページでは、localStorageやsessionStorageの状態を、インラインスクリプトで先に読む方法を説明します。',
  en: 'Some values have to reach `<html>` before the first paint, such as a theme class. `useAppState` runs after hydration, which is too late for them. This page covers reading a local or session state ahead of time, from an inline script.',
});

export const whyTitle = message({
  ja: 'キーを手で書かない',
  en: 'Never spell the key by hand',
});

export const whyDescription = message({
  ja: 'よくあるのは、保存キーとJSONの形をスクリプトの文字列に直接書く方法です。しかしそれでは、キーや保存の形が変わった瞬間に、定義と食い違ってしまいます。',
  en: 'The usual way is an inline script with the storage key and the JSON shape written into a string. That drifts from the definition the moment either one changes.',
});

export const whyHalves = message({
  ja: '`defineLocalState`と`defineSessionState`の定義は、そのどちらも持っています。`storageKey`はストアが書き込むキーで、`inlineRead()`はインラインの`<script>`に埋め込むJavaScriptの式を返します。この式は、ブラウザで評価されると、その定義の置き場所に保存されたオブジェクトになります。',
  en: 'A `defineLocalState` or `defineSessionState` definition carries both. `storageKey` is the key the store writes under, and `inlineRead()` returns a JavaScript expression for an inline `<script>`, which evaluates in the browser to the object stored in that definition’s own storage area.',
});

export const whyCookie = message({
  ja: '`inlineRead()`があるのは、localStorageとsessionStorageの定義だけです。Cookieの状態なら、リクエストを受け取るページでサーバーが`parseCookies`で読み、最初の描画から本当の値で描けます。',
  en: 'Only local and session definitions have `inlineRead()`. A cookie state is read on the server instead: where the page receives the request, `parseCookies` gives the real value from the first render.',
});

export const embedTitle = message({
  ja: 'inlineReadを埋め込む',
  en: 'Embed inlineRead',
});

export const embedDescription = message({
  ja: '`inlineRead()`が返すのは式なので、スクリプトの中で値として使います。',
  en: '`inlineRead()` returns an expression, so use it as a value inside the script.',
});

export const embedSuppress = message({
  ja: 'スクリプトはReactより先に`<html>`のクラスを変えるので、`<html>`には`suppressHydrationWarning`を付けます。ハイドレーションのあとは、ストアの値を正として扱ってください。',
  en: 'The script changes `<html>` before React hydrates it, so render that element with `suppressHydrationWarning`. From hydration on, treat the store as the source of truth.',
});

export const embedAnywhere = message({
  ja: '式は即時実行の関数なので、代入の右辺でも、関数の引数でも、三項演算子の中でも使えます。キーは`<`も含めてスクリプトの中で安全な形にエスケープされるので、どんなキーでも埋め込めます。',
  en: 'The expression is a self-invoking function, so it fits anywhere a value does: the right side of an assignment, an argument, a ternary. The key is escaped for a script context, `<` included, so any key is safe to emit.',
});

export const nullTitle = message({
  ja: 'nullになるとき',
  en: 'When it is null',
});

export const nullDescription = message({
  ja: '式は投げません。次のときは、`null`になります。',
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
  ja: 'ストレージそのものが読めない',
  en: 'storage cannot be read at all',
});

export const nullVersion = message({
  ja: '`version`を持つlocalStorageの状態で、行がほかの版で書かれている',
  en: 'for a local state with a `version`, the row was written by another version',
});

export const rawTitle = message({
  ja: '返ってくるのは生の行',
  en: 'What comes back is the raw row',
});

export const rawDescription = message({
  ja: 'スクリプトが動く時点では、まだどのモジュールも読み込まれていません。そのためスキーマは走らず、返ってくるのはフィールドごとに拾った状態ではなく、保存されていた生の行です。',
  en: 'When the script runs, no module has loaded yet, so the schema does not run: what comes back is the raw row as stored, not the salvaged state `useAppState` will show.',
});

export const rawFields = message({
  ja: "中身を信頼せず、必要なフィールドだけを、それぞれ自分で確かめて読んでください。上の例が`s && s.mode === 'dark'`と書いているのは、そのためです。",
  en: "Treat it as untrusted: read only the fields you need, each with its own check and fallback. That is why the example above writes `s && s.mode === 'dark'`.",
});

export const rawColorScheme = message({
  ja: 'は、この`inlineRead()`を使って、最初の描画の前に`<html>`へクラスを付けています。カラースキームを切り替えるなら、自分で書かずにこのパッケージを使ってください。',
  en: ' builds its pre-paint script on this `inlineRead()` to put a class on `<html>`. For a colour scheme, use it rather than writing your own.',
});
