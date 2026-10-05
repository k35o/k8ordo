import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。',
  en: 'Common symptoms, what causes them, and how to fix them.',
});

export const flashTitle = message({
  ja: 'ダークを選んでいるのに、再読み込みすると一瞬ライトで表示される',
  en: 'With dark chosen, a reload flashes light first',
});

export const flashCause = message({
  ja: 'インラインスクリプトが、ページが描かれる前に走っていません。多いのは、CSPがスクリプトを止めている場合と、プロバイダを入れ子のレイアウトに置いているために、それより前の部分が先に描かれている場合です。',
  en: 'The inline script did not run before the page was painted. Most often a CSP blocked it, or the provider sits in a nested layout, so whatever comes before it is painted first.',
});

export const flashFix = message({
  ja: 'コンソールにCSPの違反が出ていれば、次の「CSPでスクリプトが止まる」を見てください。そうでなければ、プロバイダをルートレイアウトの`<body>`の中に置き、ページ全体を包むようにします。',
  en: 'If the console reports a CSP violation, see “A CSP blocks the script” below. Otherwise, move the provider into the root layout, inside `<body>`, around the whole page.',
});

export const cspTitle = message({
  ja: 'CSPでスクリプトが止まる',
  en: 'A CSP blocks the script',
});

export const cspCause = message({
  ja: 'スクリプトを制限するポリシーが、インラインスクリプトを許可していません。ハッシュで許可しているなら、プロバイダと違う`defaultPreference`でハッシュを計算しているか、古い版で計算した値を書き写していることがあります。',
  en: 'A policy that restricts scripts does not allow the inline one. When it is allowed by hash, the hash may have been computed for a different `defaultPreference` than the provider’s, or copied from an older version.',
});

export const cspFix = message({
  ja: "`@k8ordo/server`なら、プロバイダの`nonce`に`nonce()`を渡します。ハッシュで許可するなら、プロバイダと同じ`defaultPreference`を`colorSchemeScriptHash()`に渡し、ポリシーを書く場所で毎回計算します。`'unsafe-inline'`は、ページに紛れ込んだほかのインラインスクリプトまで許可してしまうので使いません。",
  en: "Under `@k8ordo/server`, give the provider `nonce={nonce()}`. By hash, pass `colorSchemeScriptHash()` the provider’s `defaultPreference` and compute it wherever the policy is written, every time. Do not reach for `'unsafe-inline'`, which also allows any other inline script that reaches the page.",
});

export const hydrationTitle = message({
  ja: '`<html>`でハイドレーションの食い違いが報告される',
  en: 'React reports a hydration mismatch on `<html>`',
});

export const hydrationCause = message({
  ja: "インラインスクリプトが付けた`class=\"dark\"`は、サーバーのHTMLにはありません。開発時のReactは`<html>`の属性を描画するpropsと比べ、この`class`を`A tree hydrated but some attributes of the server rendered HTML didn't match`という警告で報告します。",
  en: "The `class=\"dark\"` the inline script added is not in the server’s HTML. In development React compares `<html>`’s attributes with the props it renders and reports the `class` as `A tree hydrated but some attributes of the server rendered HTML didn't match`.",
});

export const hydrationFix = message({
  ja: '`<html>`に`suppressHydrationWarning`を付けます。報告が止まるのは`<html>`自身の属性だけで、ページの中の食い違いはこれまでどおり報告されます。ハイドレーションは属性を書き戻さないので、クラスはそのまま残ります。',
  en: 'Give `<html>` `suppressHydrationWarning`. It silences `<html>`’s own attributes only; mismatches inside the page are still reported. Hydration does not write attributes back, so the class stays.',
});

export const nativeTitle = message({
  ja: 'スクロールバーやフォーム部品の配色が、選んだ配色とずれる',
  en: 'Scrollbars and form controls do not match the chosen scheme',
});

export const nativeCause = message({
  ja: 'ブラウザが自分で描く部品の配色は、CSSの`color-scheme`プロパティで決まります。このパッケージはこのプロパティを設定しないので、@k8ordo/uiを使っていなければ宣言するものがありません。`color-scheme: light dark`と書いている場合は、ブラウザがOSの設定で選ぶので、訪問者の選択とずれます。',
  en: 'What the browser draws itself follows the CSS `color-scheme` property. This package does not set it, so without @k8ordo/ui nothing declares it. Declared as `color-scheme: light dark`, it lets the browser pick by the OS setting, which disagrees with the visitor’s choice.',
});

export const nativeFix = message({
  ja: '`:root`に`color-scheme: light`を、`.dark`に`color-scheme: dark`を宣言して、プロパティもクラスに従わせます。',
  en: 'Declare `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark`, so the property follows the class too.',
});

export const tailwindTitle = message({
  ja: 'Tailwind CSSの`dark:`が選んだ配色に従わない',
  en: 'Tailwind CSS’s `dark:` ignores the choice',
});

export const tailwindCause = message({
  ja: 'Tailwind CSS 4の`dark:`は、既定では`prefers-color-scheme`を読みます。そのため、OSの設定には従っても、訪問者が選んだ配色には従いません。',
  en: 'Tailwind CSS 4’s `dark:` reads `prefers-color-scheme` by default, so it follows the OS setting but not what the visitor chose.',
});

export const tailwindFix = message({
  ja: 'スタイルシートで`@custom-variant dark (&:where(.dark, .dark *));`を宣言し、`dark:`がクラスを読むようにします。@k8ordo/uiの`tailwind.css`を読み込んでいれば、すでに宣言されています。',
  en: 'Declare `@custom-variant dark (&:where(.dark, .dark *));` in the stylesheet so `dark:` reads the class. @k8ordo/ui’s `tailwind.css` already declares it.',
});

export const iconTitle = message({
  ja: 'アイコンや文言が、読み込んだ直後だけ反対の配色のものになる',
  en: 'An icon or label shows the other scheme just after loading',
});

export const iconCause = message({
  ja: 'サーバーは保存された選択を読めないので、既定値で描きます。`scheme`から選んだマークアップは、ハイドレーションが終わるまでその推測を表示します。',
  en: 'A server cannot read the stored choice, so it renders the default. Markup chosen from `scheme` shows that guess until hydration.',
});

export const iconFix = message({
  ja: '両方を描いて`dark:`で片方を隠すか、`use(browser())`を`<Suspense>`の中で呼んでブラウザでだけ描きます。詳しくは「切り替えのボタンを作る」を見てください。',
  en: 'Render both and hide one with `dark:`, or call `use(browser())` inside a `<Suspense>` so it renders in the browser only. See “Build a switch”.',
});

export const outsideTitle = message({
  ja: '`useColorScheme needs <ColorSchemeProvider> above it`というエラーが出る',
  en: '`useColorScheme needs <ColorSchemeProvider> above it`',
});

export const outsideCause = message({
  ja: '`useColorScheme()`を呼んだコンポーネントの上に、プロバイダがありません。プロバイダを入れ子のレイアウトに置いているか、テストで`wrapper`を渡していないことがよくあります。',
  en: 'There is no provider above the component that called `useColorScheme()`. Usually the provider sits in a nested layout, or a test renders without a `wrapper`.',
});

export const outsideFix = message({
  ja: 'プロバイダをルートレイアウトの`<body>`の中に置き、ページ全体を包みます。テストでは、プロバイダを`renderHook`の`wrapper`に渡します。',
  en: 'Put the provider in the root layout, inside `<body>`, around the whole page. In a test, pass it to `renderHook` as the `wrapper`.',
});

export const systemTitle = message({
  ja: 'OSの設定を変えても配色が変わらない',
  en: 'Changing the OS setting does nothing',
});

export const systemCause = message({
  ja: "OSの設定に従うのは、訪問者が何も選んでいない間だけです。一度でもライトかダークを選ぶと、その選択が優先されます。プロバイダの`defaultPreference`が`'system'`でない場合も、OSの設定は使われません。",
  en: "The OS setting is followed only while the visitor has chosen nothing; once they pick light or dark, that choice wins. With a `defaultPreference` other than `'system'`, the OS setting is not used either.",
});

export const systemFix = message({
  ja: "`setPreference('system')`を呼ぶと、保存していた選択が消えて既定値に戻ります。訪問者が自分で戻れるように、「システム」を含む3択を用意してください。",
  en: "`setPreference('system')` clears the stored choice, and the default applies again. Offer a three-way choice that includes the system so visitors can go back themselves.",
});

export const storageTitle = message({
  ja: 'localStorageを書き換えても表示が変わらない',
  en: 'Writing to localStorage changes nothing',
});

export const storageCause = message({
  ja: 'タブ同士は`storage`イベントで選択を伝え合いますが、このイベントは書き込んだタブ自身には届きません。そのため、同じタブで`localStorage.setItem`を直接呼んでも、プロバイダは再読み込みするまで気づきません。',
  en: 'Tabs pass the preference along with the `storage` event, which never reaches the tab that wrote. A `localStorage.setItem` in the same tab therefore goes unnoticed by the provider until a reload.',
});

export const storageFix = message({
  ja: '選択を変えるときは`setPreference`を使います。同じページを開いているほかのタブにも、そのまま伝わります。',
  en: 'Change the choice through `setPreference`. Other tabs with the site open follow along.',
});

export const scriptTitle = message({
  ja: 'テストで`Encountered a script tag`というエラーが出る',
  en: 'Tests log “Encountered a script tag”',
});

export const scriptCause = message({
  ja: 'テストのようにブラウザの中だけで描くと、Reactはプロバイダが描くインラインの`<script>`を実行しません。開発ビルドのReactは、そのことをエラーとしてコンソールに出します。',
  en: 'Rendered only in the browser, as in a test, React does not execute the provider’s inline `<script>`, and its development build logs that as an error.',
});

export const scriptFix = message({
  ja: 'テストが失敗したわけではないので、直す必要はありません。テストで見る`<html>`のクラスは、プロバイダのeffectが付けたものです。',
  en: 'Nothing failed, and there is nothing to fix. The class a test sees on `<html>` is the one the provider’s effect wrote.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
