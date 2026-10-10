import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`が配色の決定と`dark`クラスの付け外しをいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/color-scheme` decides the scheme and toggles the `dark` class, and what it does and does not guarantee.',
});

export const ruleTitle = message({
  ja: '配色を決める規則',
  en: 'The rule',
});

export const ruleOrder = message({
  ja: '配色は次の順に決まります。',
  en: 'The scheme is decided in this order:',
});

export const ruleChoice = message({
  ja: "訪問者が`'light'`か`'dark'`を選んでいれば、その配色になります。",
  en: "If the visitor chose `'light'` or `'dark'`, that is the scheme.",
});

export const ruleDefault = message({
  ja: "選んでいなければ、プロバイダの`defaultPreference`を見ます。`'light'`か`'dark'`なら、その配色になります。",
  en: "Otherwise the provider’s `defaultPreference` is used, when it is `'light'` or `'dark'`.",
});

export const ruleSystem = message({
  ja: "既定値も`'system'`なら、`(prefers-color-scheme: dark)`に一致するかどうかで決まります。",
  en: "If the default is `'system'` too, `(prefers-color-scheme: dark)` decides.",
});

export const ruleNone = message({
  ja: "保存した値がJSONのオブジェクトでないときや、`preference`が`'light'`でも`'dark'`でもないときは、「選んでいない」として読みます。ほかのフィールドは読みません。",
  en: "A stored value that is not a JSON object, or whose `preference` is neither `'light'` nor `'dark'`, reads as nothing chosen. No other field is read.",
});

export const ruleNotPinned = message({
  ja: "「選んでいない」は、初めて訪れたときのOSの設定を保存したものではありません。既定値が`'system'`なら、選んでいない訪問者はあとでOSの設定を変えてもそれに従います。",
  en: "“Nothing chosen” is not the OS setting saved on the first visit. With a `'system'` default, a visitor who never chose follows the OS when its setting changes later.",
});

export const readersTitle = message({
  ja: 'スクリプトとプロバイダ',
  en: 'Script and provider',
});

export const readersScript = message({
  ja: "上は、`defaultPreference`が`'system'`のときにHTMLに書かれるインラインスクリプトを整形したコードです。同じ規則を、最初の描画の前はこのスクリプトが使い、ハイドレーションのあとはプロバイダが使います。",
  en: "Above is the inline script written into the HTML when `defaultPreference` is `'system'`, formatted for reading. The script applies the rule before the first paint, and the provider applies it after hydration.",
});

export const readersScriptDefault = message({
  ja: 'プロバイダの既定値がここに入る',
  en: 'The provider’s default goes here',
});

export const readersWhy = message({
  ja: 'Reactが動くのはJavaScriptを読み込んだあとで、ブラウザはその前に描画を始めることがあります。プロバイダのeffectだけでクラスを付けると、ダークを選んだ訪問者にライトの画面が一瞬見えます。',
  en: 'React starts after its JavaScript has loaded, and the browser may paint before that. If only the provider’s effect added the class, a visitor who chose dark would see a light page for a moment.',
});

export const readersHand = message({
  ja: 'スクリプトではスキーマを使えないので、保存した値は手で確かめます。結果は、ストアがスキーマで読んだときと同じです。保存した値を読む式は`colorSchemeState.inlineRead()`が作り、キーと値の形は`@k8ordo/state`の定義から取ります。',
  en: 'The script cannot use the schema, so it checks the stored value by hand and gets the same result as the store. `colorSchemeState.inlineRead()` builds the expression that reads the stored value, taking the key and shape from the `@k8ordo/state` definition.',
});

export const firstChildTitle = message({
  ja: 'スクリプトの位置',
  en: 'Script position',
});

export const firstChildOrder = message({
  ja: 'プロバイダは、受け取った`children`より前に`<script>`を描画します。ブラウザはHTMLを読み進めて`<script>`に着いた時点で実行するので、ページの中身より先に`<html>`へクラスが付きます。',
  en: 'The provider renders the `<script>` before the `children` it receives. The browser runs a `<script>` as soon as the parser reaches it, so the class is on `<html>` before the page’s content.',
});

export const firstChildBody = message({
  ja: 'プロバイダより前にある要素は、クラスが付く前に描画されることがあります。プロバイダをルートレイアウトの`<body>`の中に置き、ページ全体を包むのはこのためです。',
  en: 'Anything before the provider may be painted before the class is on. That is why the provider goes inside `<body>` in the root layout, around the whole page.',
});

export const firstChildHydration = message({
  ja: 'ハイドレーションのとき、Reactはこの`<script>`要素をそのまま引き継ぎ、もう一度は実行しません。',
  en: 'On hydration React adopts the `<script>` element in place and does not run it again.',
});

export const hydrationTitle = message({
  ja: 'ハイドレーションの描画',
  en: 'The hydration render',
});

export const hydrationGuess = message({
  ja: 'サーバーではlocalStorageも`matchMedia`も使えません。そのためプロバイダは、何も保存されておらずOSはライトだとして描画します。ブラウザでの最初の描画、つまりハイドレーションの描画も、サーバーと同じ値を読みます。',
  en: 'A server has neither localStorage nor `matchMedia`. The provider renders as if nothing were stored and the OS were light. The first render in the browser, the hydration render, reads the same values as the server.',
});

export const hydrationReadsStore = message({
  ja: 'この値をそのまま`<html>`に書くと、スクリプトが付けたクラスを外してしまいます。そこで`useReadsStore`はハイドレーションの描画で`false`を返し、その描画ではeffectがクラスを書きません。そのすぐあとの描画からは`true`を返します。ストアとOSの設定もその描画から読むので、クラスを書く描画はスクリプトと同じ配色になります。',
  en: 'Writing those values onto `<html>` would remove the class the script added. So `useReadsStore` returns `false` in the hydration render, and the effect writes no class there. It returns `true` from the render straight after. The store and the OS setting are also read from that render on, so the render that writes the class gets the same scheme as the script.',
});

export const hydrationMarkup = message({
  ja: 'Reactのハイドレーションも`<html>`の属性を書き戻しません。`scheme`から描画したマークアップでサーバーの値を表示しない方法は、',
  en: 'React’s hydration does not write `<html>`’s attributes back either. For markup rendered from `scheme`, the ',
});

export const see = message({
  ja: 'のページにあります。',
  en: ' page shows how to keep the server’s value off screen.',
});

export const afterTitle = message({
  ja: 'ハイドレーション後の更新',
  en: 'After hydration',
});

export const afterProvider = message({
  ja: 'ハイドレーションのあと、クラスを書くのはプロバイダだけです。保存した値かOSの設定が変わるたびに、規則で決め直します。`scheme`が変わると、effectが`<html>`の`dark`を付け外しします。',
  en: 'After hydration, only the provider writes the class. Whenever the stored value or the OS setting changes, it applies the rule again. When `scheme` changes, the effect adds or removes `dark` on `<html>`.',
});

export const afterChoice = message({
  ja: '訪問者が選んだとき：`setPreference`がストアを更新し、新しい値は次の描画に反映されます。localStorageへの書き込みは、同じタスクの終わりにまとめて行われます。',
  en: 'The visitor chooses: `setPreference` updates the store, and the new value shows in the next render. The write to localStorage is batched to the end of the same task.',
});

export const afterSystem = message({
  ja: "OSの設定が変わったとき：プロバイダは`matchMedia('(prefers-color-scheme: dark)')`の`change`を購読しています。",
  en: "The OS setting changes: the provider subscribes to `change` on `matchMedia('(prefers-color-scheme: dark)')`.",
});

export const afterTabs = message({
  ja: '別のタブで変わったとき：`@k8ordo/state`のローカル状態は、このキーと、`localStorage.clear()`で発火する`storage`イベントを購読しています。',
  en: 'Another tab changes it: `@k8ordo/state`’s local state subscribes to `storage` events for this key, and to the one `localStorage.clear()` sends.',
});

export const inspectorTitle = message({
  ja: '入力と結果のデモ',
  en: 'Inputs and result demo',
});

export const inspectorDescription = message({
  ja: 'このページがいま読んでいる入力と、プロバイダが出した結果です。',
  en: 'What this page reads right now, and what the provider decided from it.',
});

export const inspectorSteps = [
  message({
    ja: 'ヘッダーにある配色の切り替えボタンを押すと、`localStorage.getItem`と`useAppState`の行が変わり、結果の3行も変わります。',
    en: 'Press the scheme switch in the header. The `localStorage.getItem` and `useAppState` rows change, and so do all three result rows.',
  }),
  message({
    ja: "「システムに戻す」を押すと、`localStorage.getItem`の行は`'{}'`になり、`preference`は`system`になります。保存した値は消えず、`{}`が残ります。",
    en: "Press “Back to system”. The `localStorage.getItem` row becomes `'{}'`, and `preference` becomes `system`. The stored value is not removed; `{}` stays.",
  }),
  message({
    ja: "その状態でOSの外観の設定を切り替えると、`matchMedia`の行と、結果の`scheme`とクラスの行が変わります。このサイトのプロバイダに`defaultPreference`は渡していないので、既定値は`'system'`です。",
    en: "Now switch your OS’s appearance setting. The `matchMedia` row changes, and so do the `scheme` and class rows. This site’s provider is given no `defaultPreference`, so the default is `'system'`.",
  }),
  message({
    ja: 'このサイトを別のタブで開いて配色を切り替えると、こちらのタブの行もその場で変わります。',
    en: 'Open this site in another tab and switch the scheme there. The rows in this tab change in place.',
  }),
] as const;

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guaranteeFirstPaint = message({
  ja: 'インラインスクリプトが実行できれば、プロバイダの中身は`<html>`の`dark`クラスが決まった配色どおりになってから描画されます。',
  en: 'When the inline script may run, the provider’s content is painted after the `dark` class on `<html>` matches the decided scheme.',
});

export const guaranteeSameRule = message({
  ja: 'スクリプトとプロバイダは、同じ保存した値から同じ規則で配色を決めます。スキーマに合わない値は、どちらも「選んでいない」として読みます。',
  en: 'The script and the provider decide from the same stored value by the same rule. A value the schema rejects reads as nothing chosen in both.',
});

export const guaranteeHydration = message({
  ja: 'ハイドレーションの描画は`<html>`に書き込みません。スクリプトが付けたクラスは、ハイドレーションで外れません。',
  en: 'The hydration render writes nothing to `<html>`. Hydration never removes the class the script added.',
});

export const guaranteeDefault = message({
  ja: "何も選んでいない訪問者には既定値が適用されます。既定値が`'system'`なら、ページを開いたままでもOSの設定の変更に従います。",
  en: "A visitor who chose nothing gets the default. With a `'system'` default, the scheme follows changes to the OS setting while the page stays open.",
});

export const guaranteeWrite = message({
  ja: 'localStorageに書き込むのは、`setPreference`を呼んだときだけです。既定値も、初めて訪れたときのOSの設定も保存しません。',
  en: 'localStorage is written only when `setPreference` is called. Neither the default nor the OS setting on the first visit is stored.',
});

export const guaranteeTabs = message({
  ja: '別のタブで選んだ配色や、別のタブで消したlocalStorageは、このタブにも反映されます。',
  en: 'A choice made in another tab, or localStorage cleared there, is reflected in this tab.',
});

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonGuaranteeServer = message({
  ja: 'サーバーは訪問者の配色を推測しません。Cookieもヘッダーも読まず、既定値から描画します。',
  en: 'The server does not guess the visitor’s scheme. It reads no cookie and no header, and renders from the default.',
});

export const nonGuaranteeMarkup = message({
  ja: '`scheme`から描画したマークアップは、ハイドレーションが終わるまでサーバーで描画したときの値のままです。',
  en: 'Markup rendered from `scheme` keeps the server’s value until hydration ends.',
});

export const nonGuaranteeCsp = message({
  ja: 'CSPがインラインスクリプトを止めると、ハイドレーションまで`<html>`に`dark`クラスは付きません。nonceかハッシュは、アプリがポリシーに書きます。',
  en: 'If a CSP blocks the inline script, `<html>` gets no `dark` class until hydration. The application puts the nonce or the hash in its policy.',
});

export const nonGuaranteeTwoProviders = message({
  ja: 'プロバイダが2つあると、それぞれがスクリプトを出力してクラスを書きます。`defaultPreference`が違えば、配色が食い違います。',
  en: 'With two providers, each outputs its own script and writes the class. If their `defaultPreference` values differ, they disagree.',
});

export const nonGuaranteeSameTab = message({
  ja: '同じタブで`localStorage.setItem`を直接呼んだ値は、再読み込みまで反映されません。`storage`イベントは書き込んだタブでは発火しません。',
  en: 'A direct `localStorage.setItem` in the same tab is not reflected until a reload. The `storage` event does not fire in the tab that wrote.',
});

export const nonGuaranteeStyles = message({
  ja: '書くのは`<html>`の`dark`クラスだけです。色とCSSの`color-scheme`プロパティは設定せず、`prefers-contrast`と`forced-colors`も保存しません。',
  en: 'All it writes is the `dark` class on `<html>`. It sets neither colors nor the CSS `color-scheme` property, and stores neither `prefers-contrast` nor `forced-colors`.',
});

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
