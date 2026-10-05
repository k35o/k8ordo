import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`が、何を材料に、いつ配色を決めているかを説明します。使い方を覚えるのに必要な内容ではありませんが、なぜそう書くのかが分かると、迷ったときに判断しやすくなります。',
  en: 'How `@k8ordo/color-scheme` decides the scheme, from what, and when. None of it is needed to use the package, but knowing why it is written this way makes the edge cases easier to reason about.',
});

export const ruleTitle = message({
  ja: '配色を決める1つの規則',
  en: 'One rule decides the scheme',
});

export const ruleDescription = message({
  ja: '配色は、訪問者の選択、プロバイダの既定値、OSの設定の順に見て決まります。',
  en: 'The scheme comes from the visitor’s choice, then the provider’s default, then the OS setting, in that order.',
});

export const ruleChoice = message({
  ja: "訪問者が`'light'`か`'dark'`を選んでいれば、その配色になります。",
  en: "If the visitor chose `'light'` or `'dark'`, that is the scheme.",
});

export const ruleDefault = message({
  ja: "選んでいなければ、プロバイダの`defaultPreference`を見ます。`'light'`か`'dark'`なら、その配色になります。",
  en: "If not, the provider’s `defaultPreference` is used when it is `'light'` or `'dark'`.",
});

export const ruleSystem = message({
  ja: "既定値も`'system'`なら、`(prefers-color-scheme: dark)`に一致するかどうかで、ダークかライトかが決まります。",
  en: "If the default is `'system'` too, `(prefers-color-scheme: dark)` decides between dark and light.",
});

export const ruleNone = message({
  ja: "保存された行がJSONのオブジェクトでないときや、`preference`が`'light'`でも`'dark'`でもないときは、「選んでいない」として読みます。行にあるほかのフィールドは読みません。",
  en: "A row that is not a JSON object, or whose `preference` is neither `'light'` nor `'dark'`, reads as nothing chosen. No other field in the row is read.",
});

export const ruleNotPinned = message({
  ja: "「選んでいない」は、初めて訪れたときのOSの答えを保存したものではありません。既定値が`'system'`なら、選んでいない訪問者はあとでOSの設定を変えても、そのまま追従します。",
  en: "“Nothing chosen” is not a snapshot of what the OS said on the first visit. With a `'system'` default, a visitor who never chose keeps following the OS when its setting changes later.",
});

export const readersTitle = message({
  ja: '規則を読む2か所',
  en: 'Two places apply the rule',
});

export const readersDescription = message({
  ja: 'この規則は2か所に書かれています。ハイドレーションのあとはプロバイダが使い、最初の描画の前はインラインスクリプトが使います。',
  en: 'The rule is written down twice: the provider applies it after hydration, and the inline script applies it before the first paint.',
});

export const readersWhy = message({
  ja: 'Reactが動き始めるのはJavaScriptを読み込んだあとで、その時点でブラウザはもう描画を始めているかもしれません。プロバイダのeffectだけでクラスを付けると、ページはまず既定値で描かれてから切り替わり、ダークを選んだ訪問者にはライトの画面が一瞬見えます。そのため、同じ規則をインラインスクリプトとしてもう一度書いています。',
  en: 'React only starts once its JavaScript has loaded, and by then the browser may already have painted. If the provider’s effect alone put the class on, the page would paint with the default and then flip, a flash of light for a visitor who chose dark. So the same rule is written a second time, as an inline script.',
});

export const readersScript = message({
  ja: "下は、`defaultPreference`が`'system'`のときにHTMLに書かれるスクリプトを、読みやすく整形したものです。",
  en: "Below is the script written into the HTML when `defaultPreference` is `'system'`, formatted for reading.",
});

export const readersScriptDefault = message({
  ja: 'プロバイダの既定値がここに入る',
  en: 'The provider’s default goes here',
});

export const readersHand = message({
  ja: "スクリプトの中ではスキーマが走らないので、保存された値は手で確かめています。`'light'`と`'dark'`以外を「選んでいない」として読むのは、ストアがスキーマで行を読んだときと同じ結果にするためです。",
  en: "No schema runs inside the script, so it checks the stored value by hand. It reads anything other than `'light'` or `'dark'` as nothing chosen, so that it agrees with what the store makes of the row through the schema.",
});

export const readersRow = message({
  ja: '行を読む部分は、`colorSchemeState.inlineRead()`が作った式です。localStorageのキーも行の形も`@k8ordo/state`の定義から取るので、プロバイダが書く行とずれることはありません。',
  en: 'The part that reads the row is the expression `colorSchemeState.inlineRead()` produces. The localStorage key and the row’s shape both come from the `@k8ordo/state` definition, so it cannot drift from the row the provider writes.',
});

export const firstChildTitle = message({
  ja: 'スクリプトはプロバイダの最初の子',
  en: 'The script is the provider’s first child',
});

export const firstChildDescription = message({
  ja: 'プロバイダは、受け取った`children`より前に`<script>`を描きます。ブラウザはHTMLを読み進めて`<script>`にたどり着いた時点でそれを実行するので、ページの中身にたどり着く前に`<html>`へクラスが付きます。',
  en: 'The provider renders the `<script>` ahead of the `children` it receives. The browser runs a `<script>` the moment the parser reaches it, so the class is on `<html>` before the parser reaches the page’s content.',
});

export const firstChildBody = message({
  ja: 'プロバイダを`<body>`の中でページ全体を包むように置くのは、このためです。プロバイダより前に置いたものは、クラスが付く前に描かれることがあります。スクリプトはプロバイダが自分で描くので、`<head>`に置くものはありません。',
  en: 'That is why the provider goes inside `<body>`, around the whole page: anything placed before it may be painted before the class is on. The provider renders the script itself, so nothing goes in `<head>`.',
});

export const firstChildHydration = message({
  ja: 'ハイドレーションのとき、Reactはこの`<script>`要素をそのまま引き継ぎ、もう一度実行することはありません。',
  en: 'On hydration React adopts the `<script>` element in place and does not run it again.',
});

export const hydrationTitle = message({
  ja: 'ハイドレーションの描画は何も書かない',
  en: 'The hydration render writes nothing',
});

export const hydrationDescription = message({
  ja: "サーバーにはlocalStorageも、尋ねるOSもありません。そのためプロバイダは、何も保存されておらずOSはライトだと仮定して描きます。`preference`は`'system'`で、`scheme`は既定値です。既定値が`'system'`なら`'light'`になります。",
  en: "A server has no localStorage and no OS to ask, so the provider renders as if nothing were stored and the OS were light: `preference` is `'system'`, and `scheme` is the default, or `'light'` when the default is `'system'`.",
});

export const hydrationGuess = message({
  ja: 'ブラウザでの最初の描画、つまりハイドレーションの描画も、サーバーと同じ推測を読みます。この推測をそのまま`<html>`に書くと、スクリプトがすでに正しく付けたクラスを外してしまいます。そこでプロバイダは、ハイドレーションの描画かどうかを`useSyncExternalStore`で見分け、その描画ではクラスを書きません。',
  en: 'The first render in the browser, the hydration render, reads the same guesses as the server. Writing them onto `<html>` would take off a class the script had already put right, so the provider tells the hydration render apart with `useSyncExternalStore` and writes nothing during it.',
});

export const hydrationNext = message({
  ja: '`useSyncExternalStore`は、ハイドレーションの描画ではサーバー用の値（`false`）を返し、そのすぐあとの描画からブラウザの値（`true`）を返します。ストアとOSの設定を読むのもその描画からなので、クラスを書くのは、スクリプトと同じ答えを知っている描画だけです。',
  en: '`useSyncExternalStore` returns the server value (`false`) in the hydration render and the browser value (`true`) from the render straight after. That is also the render from which the store and the OS setting are read, so the only renders that write the class know the same answer the script did.',
});

export const hydrationSuppress = message({
  ja: '`<html>`の`class`がサーバーのHTMLと食い違うのは、スクリプトが付けたからです。ハイドレーションは属性を書き戻さないのでクラスは残り、`suppressHydrationWarning`は開発時の警告だけを止めます。',
  en: 'The `class` on `<html>` differs from the server’s HTML because the script put it there. Hydration does not write attributes back, so the class stays; `suppressHydrationWarning` only silences the development warning.',
});

export const hydrationNoGuess = message({
  ja: 'Cookieやヘッダーを使って、サーバーで先回りして推測することはしません。サーバーが`scheme`から選んで描いたマークアップは、ハイドレーションが終わるまで推測のままです。',
  en: 'There is no cookie or header for the server to guess from earlier. Markup the server chose from `scheme` stays a guess until hydration.',
});

export const hydrationLink = message({
  ja: 'サーバーの推測を表示しない方法',
  en: 'Keeping the server’s guess off screen',
});

export const afterTitle = message({
  ja: 'その後の追従',
  en: 'Staying in step',
});

export const afterDescription = message({
  ja: 'ハイドレーションのあと、クラスを書くのはプロバイダだけです。材料のどれかが変わるたびに規則で決め直し、`scheme`が変わればeffectが`<html>`の`dark`を付け外しします。',
  en: 'After hydration the provider is the only thing that writes the class. Whenever an input changes it applies the rule again, and when `scheme` changes an effect adds or removes `dark` on `<html>`.',
});

export const afterChoice = message({
  ja: '訪問者が選んだとき：`setPreference`がストアを更新します。新しい値は次の描画から使われ、localStorageへの書き込みはその直後に行われます。',
  en: 'The visitor chooses: `setPreference` updates the store. The new value is used from the next render, and the write to localStorage follows right after.',
});

export const afterSystem = message({
  ja: "OSの設定が変わったとき：プロバイダは`matchMedia('(prefers-color-scheme: dark)')`の`change`を購読しています。既定値が`'system'`で何も選んでいなければ、ページを開いたままOSの設定を変えても追従します。",
  en: "The OS setting changes: the provider listens for `change` on `matchMedia('(prefers-color-scheme: dark)')`. With a `'system'` default and nothing chosen, the page follows the OS while it stays open.",
});

export const afterTabs = message({
  ja: '別のタブで変わったとき：`@k8ordo/state`のローカル状態は、このキーの`storage`イベントを購読しています。別のタブでの選択も、別のタブでlocalStorageを消したことも、このタブのプロバイダに届きます。',
  en: 'Another tab changes it: `@k8ordo/state`’s local state listens for `storage` events on this key. A choice made in another tab, or localStorage cleared there, reaches this tab’s provider.',
});

export const afterOne = message({
  ja: 'プロバイダは、アプリに1つだけ置きます。プロバイダはそれぞれがスクリプトを描いてクラスを書くので、`defaultPreference`の違うプロバイダが2つあると食い違います。`useColorScheme()`が読むのは、いちばん近いプロバイダです。',
  en: 'Put exactly one provider in the application. Each provider renders its own script and writes the class, so two with different `defaultPreference` values disagree. `useColorScheme()` reads the nearest one.',
});

export const inspectorTitle = message({
  ja: '材料と結果を見る',
  en: 'Watch the inputs and the result',
});

export const inspectorDescription = message({
  ja: "このページがいま読んでいる材料と、プロバイダが出した結果です。このサイトのプロバイダには`defaultPreference`を渡していないので、既定値は`'system'`です。",
  en: "What this page reads right now, and what the provider made of it. This site’s provider is given no `defaultPreference`, so the default is `'system'`.",
});

export const inspectorSteps = [
  message({
    ja: 'ヘッダーにある配色の切り替えボタンを押すと、`localStorage.getItem`と`useAppState`の行が変わり、結果の3行も変わります。',
    en: 'Press the colour scheme switch in the header. The `localStorage.getItem` and `useAppState` rows change, and so do all three results.',
  }),
  message({
    ja: "「システムに戻す」を押すと、`localStorage.getItem`の行は`'{}'`になり、`preference`は`system`になります。行は消えずに残ります。",
    en: "Press “Back to system”. The `localStorage.getItem` row becomes `'{}'`, and `preference` becomes `system`. The row stays rather than disappearing.",
  }),
  message({
    ja: 'その状態でOSの外観の設定を切り替えると、`matchMedia`の行と、結果の`scheme`とクラスの行が変わります。',
    en: 'Now switch your OS’s appearance setting. The `matchMedia` row changes, and so do the `scheme` and class results.',
  }),
  message({
    ja: 'このサイトを別のタブで開いて配色を切り替えると、こちらのタブの行もその場で変わります。',
    en: 'Open this site in another tab and switch the scheme there. The rows in this tab change in place.',
  }),
] as const;

// 実演（クライアント）が名指すのはここから下の文言だけなので、バンドルに載るのもこれだけで済む
export const inspectorInputs = message({
  ja: '材料',
  en: 'Inputs',
});

export const inspectorResult = message({
  ja: '結果',
  en: 'Result',
});

export const inspectorUnknown = message({
  ja: 'ブラウザで読みます',
  en: 'read in the browser',
});

export const inspectorReset = message({
  ja: 'システムに戻す',
  en: 'Back to system',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'What it guarantees',
});

export const guaranteesDescription = message({
  ja: 'ここまでの仕組みから、次のことが成り立ちます。',
  en: 'Put together, the mechanics above guarantee the following.',
});

export const guaranteeNoFlash = message({
  ja: 'ちらつかない：スクリプトは最初の描画の前に走り、プロバイダが書くのと同じ行を読みます。ダークのページは、最初からダークで読み込まれます。',
  en: 'No flash: the script runs before the first paint and reads the same row the provider writes, so a dark page loads dark.',
});

export const guaranteeDefault = message({
  ja: "選んでいなければ既定値に従う：既定値が`'system'`ならOSの設定に従い、初めて訪れたときのOSの答えに固定されることはありません。",
  en: "Nothing chosen follows the default: a `'system'` default follows the OS, and a visitor is never pinned to what the OS said on the first visit.",
});

export const guaranteeServer = message({
  ja: 'ハイドレーションでクラスが外れない：サーバーは既定値で描き、ハイドレーションの描画は何も書きません。クラスを書くのはそのあとの描画で、書くのはスクリプトがすでに付けたものと同じクラスです。',
  en: 'Hydration never takes the class off: the server renders the default and the hydration render writes nothing. The render after it writes the class, the same one the script already put there.',
});

export const guaranteeTabs = message({
  ja: 'タブ同士がそろう：選択は、`@k8ordo/state`のほかのローカル状態と同じく、`storage`イベントでタブの間を伝わります。',
  en: 'Tabs agree: the choice travels between tabs through the `storage` event, as any `@k8ordo/state` local state does.',
});

export const limitsTitle = message({
  ja: 'しないこと',
  en: 'What it does not do',
});

export const limitGuess = message({
  ja: 'サーバーで推測すること：Cookieもヘッダーも読みません。',
  en: 'Guess on the server: it reads no cookie and no header.',
});

export const limitClass = message({
  ja: 'クラスの名前や付ける要素を変えること：付けるのはいつも`<html>`の`dark`です。',
  en: 'Change the class or where it goes: it is always `dark`, on `<html>`.',
});

export const limitProperty = message({
  ja: 'CSSの`color-scheme`プロパティを設定すること：@k8ordo/uiのスタイルシートか、アプリのスタイルシートが宣言します。',
  en: 'Set the CSS `color-scheme` property: @k8ordo/ui’s stylesheet or the application’s declares it.',
});

export const limitContrast = message({
  ja: 'コントラストを保存すること：`prefers-contrast`と`forced-colors`はOSの設定で、スタイルシートがそれに従います。',
  en: 'Store a contrast preference: `prefers-contrast` and `forced-colors` are the OS’s settings, and the stylesheet follows them.',
});

export const limitPolicy = message({
  ja: 'CSPを決めること：スクリプトに付けるnonceも、ポリシーに書くハッシュも、アプリが渡します。',
  en: 'Decide a CSP: the application gives the nonce the script carries, or writes its hash into the policy.',
});
