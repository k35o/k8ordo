import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '訪問者が選んだ配色は、`@k8ordo/state`のローカル状態としてlocalStorageに保存されます。このパッケージが持っているのは定義1つだけで、キーの決め方もタブ同士の同期も`@k8ordo/state`の仕組みです。このページでは、保存される行の中身とフックを通さずに読む方法を説明します。あわせて、タブ同士がそろう仕組みと、アプリのほかの設定との並べ方も紹介します。',
  en: 'The visitor’s choice is stored in localStorage as an `@k8ordo/state` local state. This package holds one definition and nothing more; how the key is built and how tabs stay in sync are `@k8ordo/state`’s. This page covers what the row holds and reading it without the hook, then how tabs agree and keeping the application’s other preferences beside it.',
});

export const definitionTitle = message({
  ja: '`colorSchemeState`の定義',
  en: 'The `colorSchemeState` definition',
});

export const definitionDescription = message({
  ja: '保存先の定義は`colorSchemeState`としてexportしていて、中身はこれですべてです。',
  en: 'The definition is exported as `colorSchemeState`, and this is all of it.',
});

export const definitionKey = message({
  ja: '名前が`color-scheme`なので、localStorageのキーは`k8ordo-state:color-scheme`になります。キーは`colorSchemeState.storageKey`で読めるので、文字列で書く必要はありません。',
  en: 'The name is `color-scheme`, so the localStorage key is `k8ordo-state:color-scheme`. It can be read as `colorSchemeState.storageKey`, with no need to spell it out.',
});

export const definitionOptional = message({
  ja: '`preference`は省略できるフィールドで、省略されていることが「何も選んでいない」を表します。そのため、初めて訪れたときのOSの設定が、選択として残ることはありません。',
  en: '`preference` is optional, and its absence is what “nothing chosen” means. What the OS said on the first visit is therefore never kept as a choice.',
});

export const rowsTitle = message({
  ja: '保存される行',
  en: 'What the row holds',
});

export const rowsDescription = message({
  ja: '行が書かれるのは、`setPreference`を呼んだときだけです。呼び方ごとに、行は次のようになります。',
  en: 'A row is written only when `setPreference` is called. Here is the row after each call.',
});

export const rowsNever = message({
  ja: '一度も選んでいない：行がありません。`localStorage.getItem`は`null`を返します。',
  en: 'Never chose: there is no row, and `localStorage.getItem` returns `null`.',
});

export const rowsDark = message({
  ja: '`setPreference(\'dark\')`：`{"preference":"dark"}`が書かれます。',
  en: '`setPreference(\'dark\')`: `{"preference":"dark"}` is written.',
});

export const rowsLight = message({
  ja: '`setPreference(\'light\')`：`{"preference":"light"}`が書かれます。',
  en: '`setPreference(\'light\')`: `{"preference":"light"}` is written.',
});

export const rowsSystem = message({
  ja: "`setPreference('system')`：`{}`が書かれます。行は消えず、`preference`の無いオブジェクトが残ります。",
  en: "`setPreference('system')`: `{}` is written. The row stays, holding an object with no `preference`.",
});

export const rowsSame = message({
  ja: '`preference`の無い`{}`は、読む側にとっては行が無いのと同じです。どちらも「何も選んでいない」として読まれ、プロバイダの既定値が使われます。',
  en: 'To a reader, `{}` with no `preference` is the same as no row: both read as nothing chosen, and the provider’s default applies.',
});

export const rowsDefault = message({
  ja: '既定値は保存されません。そのため、あとで`defaultPreference`を変えると、まだ選んでいない訪問者はみな新しい既定値に移ります。',
  en: 'The default is never stored, so changing `defaultPreference` later moves every visitor who has not chosen.',
});

export const rowsTiming = message({
  ja: '`setPreference`を呼ぶと、新しい値は次の描画からすぐに使われます。localStorageへの書き込みはその直後に、同じタイミングのほかの更新とまとめて行われます。',
  en: 'After `setPreference`, the new value is used from the very next render. The write to localStorage follows right after, batched with any other update made at the same time.',
});

export const readTitle = message({
  ja: 'フックを通さずに読む',
  en: 'Read it without the hook',
});

export const readDescription = message({
  ja: '保存された選択だけが欲しいときは、どのClient Componentからでも`useAppState(colorSchemeState)`で読めます。`@k8ordo/state`のストアはキーごとに1つなので、プロバイダと同じ値を読みます。',
  en: 'When only the stored choice is wanted, any Client Component can read it with `useAppState(colorSchemeState)`. `@k8ordo/state` keeps one store per key, so it reads what the provider reads.',
});

export const readCaveat = message({
  ja: "返るのは保存された`preference`で、`'light'`か`'dark'`か`undefined`です。解決した`scheme`ではないので、画面に出ている配色が欲しいなら`useColorScheme()`を使います。サーバーでの描画とハイドレーションの描画では、何も保存されていないときの値である`undefined`を返します。",
  en: "What comes back is the stored `preference`: `'light'`, `'dark'` or `undefined`. It is not the resolved `scheme`; for what is on screen, use `useColorScheme()`. In the server render and the hydration render it is `undefined`, the value for nothing stored.",
});

export const readInline = message({
  ja: '最初の描画の前に動く自分のインラインスクリプトで同じ行を読むなら、`colorSchemeState.inlineRead()`を使います。保存された行のオブジェクトに評価されるJavaScriptの式を返し、行が読めないときは`null`になります。スクリプトの中ではスキーマが走らないので、使うフィールドは自分で確かめてください。',
  en: 'An inline script of your own that runs before the first paint reads the same row with `colorSchemeState.inlineRead()`. It returns a JavaScript expression that evaluates to the stored object, or to `null` when the row cannot be read. No schema runs inside a script, so check each field you use.',
});

export const readInlineLink = message({
  ja: '@k8ordo/stateでハイドレーションの前に値を読む',
  en: 'Reading a value before hydration with @k8ordo/state',
});

export const tabsTitle = message({
  ja: 'タブ同士がそろう',
  en: 'Tabs agree',
});

export const tabsDescription = message({
  ja: '`@k8ordo/state`のローカル状態は、自分のキーについての`storage`イベントを購読しています。そのため、別のタブで選び直した配色はこのタブのプロバイダにも届き、`<html>`のクラスもその場で変わります。別のタブでlocalStorageを消した場合も同じです。',
  en: '`@k8ordo/state`’s local state listens for `storage` events on its key. A choice made in another tab therefore reaches this tab’s provider too, and the class on `<html>` changes in place. The same goes for localStorage cleared in another tab.',
});

export const tabsSameTab = message({
  ja: '`storage`イベントは、書き込んだタブ自身には届きません。同じタブで`localStorage.setItem`を直接呼んでも、プロバイダは再読み込みするまで気づかないので、選択を変えるときは`setPreference`を使います。',
  en: 'A `storage` event never reaches the tab that wrote. A `localStorage.setItem` in the same tab goes unnoticed by the provider until a reload, so change the choice through `setPreference`.',
});

export const besideTitle = message({
  ja: 'ほかの設定と並べる',
  en: 'Other preferences beside it',
});

export const besideDescription = message({
  ja: 'アプリがほかにも表示の設定を持つなら、別の名前で自分の`defineLocalState`を定義します。このサイトの縦書きと横書きの設定もそうで、配色とは別の行に保存しています。',
  en: 'When the application has other display preferences, give each its own `defineLocalState` under another name. This site’s writing-mode preference is one, stored in a row apart from the colour scheme.',
});

export const besideModule = message({
  ja: "定義は`'use client'`の無いモジュールに置きます。`'use client'`のファイルからexportすると、Server Componentには定義ではなくclient referenceが届くからです。",
  en: "Keep the definition in a module without `'use client'`: exported from a `'use client'` file, it reaches a Server Component as a client reference, not as the definition.",
});

export const besideCollision = message({
  ja: "アプリの中で`defineLocalState('color-scheme', …)`をもう1つ定義しないでください。`@k8ordo/state`のストアは名前で共有されるので、2つの定義が同じ行とストアを取り合います。",
  en: "Do not define another `defineLocalState('color-scheme', …)` in the application. `@k8ordo/state` shares stores by name, so the two definitions would fight over one row and one store.",
});

export const besideLink = message({
  ja: '@k8ordo/stateの状態の置き場所',
  en: 'Where @k8ordo/state keeps state',
});
