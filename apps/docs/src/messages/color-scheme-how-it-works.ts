import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Provider が何を材料に、いつ、どう決めているかを説明します。1 つの規則、それを最初の描画の前に当てるインラインスクリプト、その後の追従、設定が保存される行、そこから導かれる保証、そしてテストの書き方です。',
  en: 'What the provider decides, from what, and when: the one rule, the inline script that applies it before the first paint, how it stays in step afterwards, the row the preference is stored in, what all of that guarantees, and how to test it.',
});

export const rule = {
  title: message({
    ja: '1 つの規則',
    en: 'One rule',
  }),
  description: message({
    ja: "訪問者が選んだものが最優先で、次に Provider の `defaultPreference`、それが `'system'` ならシステムに尋ねます。画面に出るのは、この規則で解決した `scheme` だけです。",
    en: "What the visitor chose wins; then the provider’s `defaultPreference`; and when that is `'system'`, the system is asked. What reaches the screen is the `scheme` this rule resolves to, and nothing else.",
  }),
  columnStored: message({
    ja: '保存された `preference`',
    en: 'Stored `preference`',
  }),
  none: message({
    ja: 'なし',
    en: 'none',
  }),
  any: message({
    ja: 'どれでも',
    en: 'any',
  }),
  matches: message({
    ja: '一致する',
    en: 'matches',
  }),
  doesNotMatch: message({
    ja: '一致しない',
    en: 'does not match',
  }),
  invalid: message({
    ja: '保存行が JSON のオブジェクトでないときも、`preference` が `\'light\'` でも `\'dark\'` でもないとき（たとえば `{"preference":"sepia"}` や `{}`）も、「なし」として読みます。インラインスクリプトもストアも同じで、行にあるほかのフィールドはどちらも読みません。',
    en: 'A row that is not a JSON object, or whose `preference` is neither `\'light\'` nor `\'dark\'` (`{"preference":"sepia"}` or `{}`, say), reads as none, by the inline script and by the store alike. Neither reads any other field in the row.',
  }),
  notPinned: message({
    ja: "「なし」は、初回訪問時にシステムが答えた値を保存したものではありません。既定値が `'system'` なら、選んでいない訪問者は、あとで OS の設定を変えてもそれに従います。",
    en: "“None” is not a snapshot of what the system said on the first visit: with a `'system'` default, a visitor who never chose keeps following the OS when its setting changes later.",
  }),
};

export const panel = {
  title: message({
    ja: 'このページで見る',
    en: 'On this page',
  }),
  description: message({
    ja: "このページが今読んでいる材料と、その結果です。このサイトのルートレイアウトは `defaultPreference` を渡していないので `'system'` です。ヘッダーの切替を押す、OS の設定を変える、別のタブでこのサイトの設定を変える、のどれでも、対応する行がその場で変わります。`localStorage.getItem` の行は、一度も選んでいなければ `null`、`'system'` に戻したあとは `'{}'` です。",
    en: "The inputs this page reads right now, and the result. This site’s root layout passes no `defaultPreference`, so it is `'system'`. Press the switcher in the header, change the OS setting, or change the setting in another tab of this site, and the rows it affects change in place. The `localStorage.getItem` row is `null` if nothing was ever chosen, and `'{}'` after going back to `'system'`.",
  }),
  landingLink: message({
    ja: "`'system'` に戻す選択肢は、@k8ordo/color-scheme のトップにある実演で試せます。",
    en: "The choice that goes back to `'system'` is in the demo on the @k8ordo/color-scheme landing page.",
  }),
};

// 実演（クライアント）が名指すのはこのグループだけなので、バンドルに載る文言もこれだけで済む。
export const inspector = {
  inputs: message({
    ja: '材料',
    en: 'Inputs',
  }),
  result: message({
    ja: '結果',
    en: 'Result',
  }),
  unknown: message({
    ja: 'ブラウザで読みます',
    en: 'read in the browser',
  }),
};

export const script = {
  title: message({
    ja: '最初の描画の前',
    en: 'Before the first paint',
  }),
  description: message({
    ja: 'React が動くのは JavaScript が読み込まれてからで、その時点でブラウザはもう描画しているかもしれません。クラスを付けるのが effect だけなら、ページはまず既定値で描かれてから切り替わり、ダークを選んだ訪問者にはライトの画面が一瞬光ります。そこで Provider は同じ規則をもう一度インラインスクリプトとして書き、最初の子として描きます。',
    en: 'React runs only once its JavaScript has loaded, and by then the browser may already have painted. If an effect were the only thing putting the class on, the page would paint with the default and then flip, a flash of light for a visitor who chose dark. So the provider states the same rule a second time, as an inline script, and renders it as its first child.',
  }),
  readsTitle: message({
    ja: 'スクリプトが読むもの',
    en: 'What the script reads',
  }),
  readsRow: message({
    ja: '`colorSchemeState.inlineRead()` で読む `k8ordo-state:color-scheme` の行。ストアが書くのと同じ行です。',
    en: 'The `k8ordo-state:color-scheme` row, through `colorSchemeState.inlineRead()`: the same row the store writes.',
  }),
  readsValue: message({
    ja: "行の `preference` が `'light'` か `'dark'` のどちらかならその値、そうでなければ Provider に渡した `defaultPreference`。既定値はスクリプトの文字列に埋め込まれます。ここではスキーマが走らないので、値は手で確かめています。",
    en: "The row’s `preference` if it is exactly `'light'` or `'dark'`; otherwise the `defaultPreference` given to the provider, which is written into the script’s text. The schema does not run here, so the value is checked by hand.",
  }),
  readsSystem: message({
    ja: "こうして決まった値が `'system'` のときだけ、`matchMedia('(prefers-color-scheme: dark)')` の結果。",
    en: "`matchMedia('(prefers-color-scheme: dark)')`, only when the value picked that way is `'system'`.",
  }),
  writes: message({
    ja: "結果がダークなら `document.documentElement.classList.add('dark')`。クラスを外すことはなく、そのあとは何もしません。",
    en: "If the result is dark, `document.documentElement.classList.add('dark')`. It never removes the class, and does nothing after that.",
  }),
  codeDescription: message({
    ja: "`defaultPreference` が `'system'` のときに HTML に書かれるスクリプトを、読みやすく整形したものです。",
    en: "The script written into the HTML when `defaultPreference` is `'system'`, formatted for reading.",
  }),
  hydration: message({
    ja: 'hydrate のとき、React はこの `<script>` 要素をそのまま引き継ぎ、もう一度実行することはありません。',
    en: 'On hydration React adopts the `<script>` element in place and does not run it again.',
  }),
  csp: message({
    ja: 'インラインスクリプトなので、インラインスクリプトを禁じる Content Security Policy の下では実行されません。Provider は `nonce` を受け取りません。',
    en: 'Being an inline script, it does not run under a Content Security Policy that forbids inline scripts, and the provider takes no `nonce`.',
  }),
  serverTitle: message({
    ja: 'サーバーが描くもの',
    en: 'What the server renders',
  }),
  serverDescription: message({
    ja: "サーバーには localStorage も、尋ねるシステムもありません。Provider は「何も保存されておらず、システムはライト」として描きます。`preference` は `'system'`、`scheme` は `defaultPreference`（それが `'system'` なら `'light'`）です。HTML の `<html>` に `dark` クラスは無く、付けるのはスクリプトです。Cookie やヘッダーで先回りして推測することはしません。",
    en: "A server has no localStorage and no system to ask. The provider renders as if nothing were stored and the system were light: `preference` is `'system'`, and `scheme` is the `defaultPreference`, or `'light'` when that is `'system'`. `<html>` carries no `dark` class in the HTML; the script adds it. There is no cookie or header to guess earlier.",
  }),
  serverConsequence: message({
    ja: 'クラスを読む CSS は最初の描画から正しく出ます。一方、`scheme` から選んだマークアップ（アイコンやラベル）は、hydrate されるまでサーバーの値を表示します。最初から正しくなければならないものは、両方を描いて CSS で片方を隠します。',
    en: 'CSS that reads the class is right from the first paint. Markup chosen from `scheme`, such as an icon or a label, shows the server’s value until hydration. Anything that must be right from the start renders both and lets CSS hide one.',
  }),
  darkVariant: message({
    ja: 'この例は、クラスを読む `dark:` バリアント（@k8ordo/ui の `tailwind.css` が宣言するもの）を前提にしています。Tailwind CSS 4 の既定の `dark:` は `prefers-color-scheme` を読みます。',
    en: 'This example relies on a `dark:` variant that reads the class, as @k8ordo/ui’s `tailwind.css` declares. Tailwind CSS 4’s default `dark:` reads `prefers-color-scheme` instead.',
  }),
  darkVariantLink: message({
    ja: 'Get Started: クラスでスタイルを当てる',
    en: 'Get Started: Style with the class',
  }),
  serverBrowserOnly: message({
    ja: 'CSS で出し分けられないものは、React の `use(browser())`（`browser` は `react-dom` から）を `<Suspense>` の下で使うと、サーバーの HTML に含めずに済みます。サーバーは推測を書く代わりに fallback を書き、中身はブラウザで描かれます。',
    en: 'What CSS cannot switch can be left out of the server HTML with React’s `use(browser())` (`browser` from `react-dom`) under a `<Suspense>`: the server writes the fallback instead of a guess, and the content is rendered in the browser.',
  }),
  browserOnlyLink: message({
    ja: '@k8ordo/static: ブラウザが必要なコンポーネント',
    en: '@k8ordo/static: Components that need a browser',
  }),
};

export const step = {
  title: message({
    ja: 'その後の追従',
    en: 'Staying in step',
  }),
  description: message({
    ja: 'hydrate したあと、クラスを書くのは Provider だけです。材料のどれかが変わるたびに規則で解決し直し、`scheme` が変わったら effect で `<html>` の `dark` を付け外しします。',
    en: 'After hydration the provider is the only thing that writes the class. Whenever one of its inputs changes it resolves the rule again, and when `scheme` changes an effect toggles `dark` on `<html>`.',
  }),
  choice: message({
    ja: '訪問者が選んだとき: `setPreference` がストアを更新します。新しい値はすぐ次の描画に反映され、localStorage への書き込みはその直後にまとめて行われます。',
    en: 'The visitor chooses: `setPreference` updates the store. The new value is in the very next render, and the write to localStorage follows right after, batched.',
  }),
  system: message({
    ja: "システムが変わったとき: Provider は `matchMedia('(prefers-color-scheme: dark)')` の `change` を購読しています。何も選ばれておらず既定値が `'system'` なら、ページを開いたまま OS の設定を変えても、どちら向きにも追従します。",
    en: "The system changes: the provider subscribes to `change` on `matchMedia('(prefers-color-scheme: dark)')`. With nothing chosen and a `'system'` default, the page follows an OS change in either direction while it is open.",
  }),
  tabs: message({
    ja: '別のタブで変わったとき: @k8ordo/state のローカル状態は、このキーの `storage` イベントを購読しています。別のタブで選んだ設定も、別のタブで localStorage を消したことも、このタブの Provider に届きます。',
    en: 'Another tab changes it: @k8ordo/state’s local state listens for `storage` events on this key. A choice made in another tab, or localStorage cleared there, reaches this tab’s provider.',
  }),
  hydration: message({
    ja: 'hydrate のとき: hydrate する描画はサーバーと同じ推測を読み、何も書きません。クラスを書くのは、その直後にストアを読む描画です。スクリプトが付けたクラスが途中で外れることはありません。',
    en: 'Hydration: the render that hydrates reads the server’s guesses and writes nothing; the render straight after reads the store, and that one writes. The class the script put on is never taken off along the way.',
  }),
  sameTabTitle: message({
    ja: '同じタブで行を直接書き換えない',
    en: 'Do not write the row by hand in the same tab',
  }),
  sameTab: message({
    ja: "`storage` イベントは、書き込んだタブ自身には届きません。同じタブで `localStorage.setItem('k8ordo-state:color-scheme', …)` と直接書いても、Provider は再読み込みまで気づきません。変えるときは `setPreference` を通します。",
    en: "A `storage` event never reaches the tab that wrote. Writing `localStorage.setItem('k8ordo-state:color-scheme', …)` by hand in the same tab goes unnoticed by the provider until a reload. Change it through `setPreference`.",
  }),
  oneProviderTitle: message({
    ja: 'Provider は 1 つ',
    en: 'One provider',
  }),
  oneProvider: message({
    ja: 'Provider はルートレイアウトに 1 つだけ置きます。Provider はそれぞれがスクリプトを描いてクラスを書くので、`defaultPreference` の違う Provider が 2 つあれば食い違います。`useColorScheme()` が読むのは一番近い Provider です。',
    en: 'Put exactly one provider in the root layout. Each provider renders its own script and writes the class, so two providers with different `defaultPreference` values would disagree. `useColorScheme()` reads the nearest one.',
  }),
};

export const state = {
  title: message({
    ja: '保存先は `colorSchemeState`',
    en: 'Where it is stored: `colorSchemeState`',
  }),
  description: message({
    ja: '設定は @k8ordo/state のふつうのローカル状態として保存されます。その定義が `colorSchemeState` として export されており、中身はこれですべてです。',
    en: 'The preference is stored as an ordinary @k8ordo/state local state. Its definition is exported as `colorSchemeState`, and this is all of it.',
  }),
  key: message({
    ja: 'キーは `color-scheme` なので、localStorage のキーは `k8ordo-state:color-scheme` です（`colorSchemeState.storageKey`）。`preference` は省略可能で、省略されていることが「選んでいない」を表します。',
    en: 'The key is `color-scheme`, so the localStorage key is `k8ordo-state:color-scheme` (`colorSchemeState.storageKey`). `preference` is optional, and its absence is what “nothing chosen” means.',
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
    ja: '行なし（`getItem` は `null`）',
    en: 'no row (`getItem` returns `null`)',
  }),
  systemRow: message({
    ja: "`'system'` に戻しても行は消えず、`preference` の無い `{}` が残ります。`preference` を読む側にとっては、行が無いのと同じです。",
    en: "Going back to `'system'` does not remove the row: `{}` remains, with no `preference` in it. Anything that reads `preference` treats it the same as no row.",
  }),
  readTitle: message({
    ja: 'ほかの場所から読む',
    en: 'Reading it elsewhere',
  }),
  readDescription: message({
    ja: 'hook を通さずに行を読みたいときは、どのクライアントコンポーネントからでも `useAppState(colorSchemeState)` を呼べます。@k8ordo/state には Provider が無く、ストアはキーごとに 1 つなので、`<ColorSchemeProvider>` と同じ値を読みます。',
    en: 'To read the row without the hook, call `useAppState(colorSchemeState)` from any client component. @k8ordo/state has no provider and keeps one store per key, so it reads what `<ColorSchemeProvider>` reads.',
  }),
  readCaveat: message({
    ja: "返るのは保存された `preference`（`'light' | 'dark' | undefined`）で、解決した `scheme` ではありません。画面に出ているものが欲しいなら `useColorScheme()` を使います。サーバーでの描画と hydrate の描画では、何も保存されていないときの値 `undefined` を返します。",
    en: "What comes back is the stored `preference` (`'light' | 'dark' | undefined`), not the resolved `scheme`; for what is on screen, use `useColorScheme()`. On the server and in the hydration render it is the nothing-stored value, `undefined`.",
  }),
  inlineRead: message({
    ja: '最初の描画の前に同じ行を読みたい自前のインラインスクリプトには `colorSchemeState.inlineRead()` があります。保存されたオブジェクト（読めなければ `null`）に評価される JavaScript の式を返します。スキーマは走らないので、使うフィールドは自分で確かめます。',
    en: 'An inline script of your own that needs the row before the first paint has `colorSchemeState.inlineRead()`: it returns a JavaScript expression that evaluates to the stored object, or to `null` when there is none it can read. The schema does not run there, so check each field you use.',
  }),
  inlineReadLink: message({
    ja: '@k8ordo/state: ハイドレーション前に読む',
    en: '@k8ordo/state: Reading before hydration',
  }),
  collision: message({
    ja: "アプリで `defineLocalState('color-scheme', …)` を別に定義しないでください。@k8ordo/state のストアはキーで共有されるので、2 つの定義が同じ行と同じストアを取り合います。",
    en: "Do not define another `defineLocalState('color-scheme', …)` in the application: @k8ordo/state shares stores by key, so the two definitions would fight over one row and one store.",
  }),
  link: message({
    ja: '@k8ordo/state の状態の置き場所',
    en: 'Where @k8ordo/state keeps state',
  }),
};

export const guarantees = {
  title: message({
    ja: '保証すること',
    en: 'What it guarantees',
  }),
  description: message({
    ja: 'ここまでの仕組みを合わせると、次のことが成り立ちます。',
    en: 'Put together, the mechanics above guarantee the following.',
  }),
  noFlash: message({
    ja: 'ちらつきません。スクリプトは最初の描画の前に走り、Provider が書くのと同じ行を読みます。ダークのページはダークで読み込まれます。',
    en: 'No flash. The script runs before the first paint and reads the same row the provider writes; a dark page loads dark.',
  }),
  defaults: message({
    ja: "選んでいなければ既定値に、既定値が `'system'` ならシステムに従います。初回訪問時のシステムの値に固定されることはなく、JSON のオブジェクトでない行や、`preference` が `'light'` でも `'dark'` でもない行は「選んでいない」として読みます。",
    en: "Nothing chosen follows the default, and a `'system'` default follows the system. A visitor is never pinned to what the system said on their first visit, and a row that is not a JSON object, or whose `preference` is neither `'light'` nor `'dark'`, reads as nothing chosen.",
  }),
  server: message({
    ja: 'サーバーは既定値を描き、hydrate は document に触れません。hydrate する描画は何も書かず、そのあとの描画が、スクリプトがすでに付けたものと同じクラスを書きます。',
    en: 'The server renders the default, and hydration does not touch the document. The render that hydrates writes nothing; the render after it writes the class the script already put there.',
  }),
  tabs: message({
    ja: 'タブ同士が揃います。設定は、@k8ordo/state のほかのローカル状態と同じく `storage` イベントでタブ間に伝わります。',
    en: 'Tabs agree. The preference travels between tabs through the `storage` event, as any @k8ordo/state local state does.',
  }),
  limitsTitle: message({
    ja: 'しないこと',
    en: 'What it does not do',
  }),
  limitCookie: message({
    ja: 'サーバーで推測すること。Cookie もヘッダーも読みません。',
    en: 'Guess on the server: it reads no cookie and no header.',
  }),
  limitClass: message({
    ja: 'クラス名や付け先を変えること。付けるのは常に `<html>` の `dark` です。',
    en: 'Change the class or where it goes: it is always `dark`, on `<html>`.',
  }),
  limitProperty: message({
    ja: 'CSS の `color-scheme` プロパティを設定すること。',
    en: 'Set the CSS `color-scheme` property.',
  }),
  limitNonce: message({
    ja: 'インラインスクリプトに `nonce` を付けること。',
    en: 'Put a `nonce` on the inline script.',
  }),
};

export const types = {
  title: message({
    ja: 'export される型',
    en: 'Exported types',
  }),
  description: message({
    ja: '値の export は `ColorSchemeProvider`、`useColorScheme`、`colorSchemeState` の 3 つで、型の export は次の 4 つです。宣言どおりに示します。',
    en: 'The value exports are `ColorSchemeProvider`, `useColorScheme` and `colorSchemeState`; the type exports are these four, shown as declared.',
  }),
  columnName: message({
    ja: '型',
    en: 'Type',
  }),
  columnUse: message({
    ja: '使いどころ',
    en: 'What it is for',
  }),
  colorScheme: message({
    ja: '画面に出るもの。`scheme` の型です。',
    en: 'What can be on screen; the type of `scheme`.',
  }),
  preference: message({
    ja: "訪問者が選べるもの。`'system'` は何も選ばないことです。`preference` と `defaultPreference` の型です。",
    en: "What a visitor can choose, where `'system'` is choosing nothing; the type of `preference` and `defaultPreference`.",
  }),
  providerProps: message({
    ja: '`<ColorSchemeProvider>` の props。Provider を包む自前のコンポーネントに使います。',
    en: 'The props of `<ColorSchemeProvider>`, for a component of your own that wraps it.',
  }),
  hook: message({
    ja: '`useColorScheme()` の戻り値。それを props で受け取るコンポーネントに使います。',
    en: 'What `useColorScheme()` returns, for a component that receives it as a prop.',
  }),
};

export const testing = {
  title: message({
    ja: 'テスト',
    en: 'Testing',
  }),
  description: message({
    ja: 'このパッケージは localStorage、`<html>` のクラス、`matchMedia` を使うので、テストはブラウザで走らせます。テストの間では localStorage を消し、`<html>` から `dark` を外し、@k8ordo/state の `resetStateRegistry()` でストアを捨てます。hook は `<ColorSchemeProvider>` を wrapper にして描きます。',
    en: 'The package uses localStorage, the class on `<html>` and `matchMedia`, so test in a browser. Between tests, clear localStorage, remove `dark` from `<html>`, and drop the stores with @k8ordo/state’s `resetStateRegistry()`; render the hook with `<ColorSchemeProvider>` as the wrapper.',
  }),
  codeDescription: message({
    ja: 'Vitest のブラウザモードと vitest-browser-react で書いた例です。',
    en: 'An example with Vitest’s browser mode and vitest-browser-react.',
  }),
  system: message({
    ja: "`'system'` が解決される先は、テストを走らせるブラウザの `prefers-color-scheme` です。ダークを好むブラウザで確かめるときは、`@vitest/browser-playwright` の `playwright()` に `contextOptions: { colorScheme: 'dark' }` を渡します。",
    en: "What `'system'` resolves to is the test browser’s `prefers-color-scheme`. To test against a browser that prefers dark, pass `contextOptions: { colorScheme: 'dark' }` to `playwright()` from `@vitest/browser-playwright`.",
  }),
  script: message({
    ja: 'テストのようにクライアントだけで描くと、インラインスクリプトは実行されません。React はブラウザで自分が作ったインラインの `<script>` を実行せず、開発時にはそのことをコンソールにエラーとして出します。テストで確かめる `<html>` のクラスは、Provider の effect が書いたものです。',
    en: 'A client-only render, as in a test, does not run the inline script: React never executes an inline `<script>` it creates in the browser, and in development it logs an error saying so. The class a test sees on `<html>` is the one the provider’s effect wrote.',
  }),
  unmount: message({
    ja: '`resetStateRegistry()` の前にコンポーネントをアンマウントします。マウントされたままの hook は古いストアを持ち続けるからです。vitest-browser-react は、各テストの前に前のテストの描画を片付けます。',
    en: 'Unmount before `resetStateRegistry()`, because a hook that stays mounted keeps its old store. vitest-browser-react cleans up the previous test’s render before each test.',
  }),
};
