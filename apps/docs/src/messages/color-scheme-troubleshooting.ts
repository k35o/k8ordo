import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくある症状の原因と直し方です。エラー文で探すときは、ページの中を検索してください。',
  en: 'Common symptoms, their causes and their fixes. To look up an error, search this page for its wording.',
});

export const flashTitle = message({
  ja: '再読み込みで一瞬出るライト',
  en: 'Light theme flashing on reload',
});

export const flashCause = message({
  ja: 'インラインスクリプトが、最初の描画の前に走っていません。多いのは、CSPがスクリプトを止めている場合と、プロバイダが入れ子のレイアウトにあって外側が先に描かれる場合です。',
  en: 'The inline script did not run before the first paint. Usually a CSP blocked it, or the provider sits in a nested layout and whatever is outside it paints first.',
});

export const flashFix = message({
  ja: 'コンソールにCSPの違反が出ていれば、次の「CSPで止まるスクリプト」を見てください。出ていなければ、プロバイダをルートレイアウトの`<body>`の中に置き、ページ全体を包みます。',
  en: 'If the console reports a CSP violation, see “Inline script blocked by CSP” below. Otherwise move the provider into the root layout, inside `<body>`, around the whole page.',
});

export const cspTitle = message({
  ja: 'CSPで止まるスクリプト',
  en: 'Inline script blocked by CSP',
});

export const cspCause = message({
  ja: 'スクリプトを制限するポリシーが、インラインスクリプトを許可していません。ハッシュで許可している場合は、プロバイダと違う`defaultPreference`で計算したハッシュか、古いバージョンのハッシュを書き写していることがあります。',
  en: 'A policy that restricts scripts does not allow the inline one. When it is allowed by hash, the hash may have been computed for a different `defaultPreference` than the provider’s, or copied from an older version.',
});

export const cspFix = message({
  ja: "nonceで許可するなら、プロバイダの`nonce`にリクエストごとのnonceを渡します（`@k8ordo/framework`のserverモードでは`nonce()`）。ハッシュで許可するなら、プロバイダと同じ`defaultPreference`を`colorSchemeScriptHash()`に渡し、ポリシーを組み立てるたびに計算します。`'unsafe-inline'`は使いません。ほかのインラインスクリプトまで許可してしまいます。",
  en: "To allow it by nonce, pass the request’s nonce to the provider’s `nonce` (`nonce()` in `@k8ordo/framework`’s server mode). To allow it by hash, pass the provider’s `defaultPreference` to `colorSchemeScriptHash()` and compute the hash each time you build the policy, instead of copying it. Do not use `'unsafe-inline'`: it allows every other inline script too.",
});

export const hydrationTitle = message({
  ja: "`A tree hydrated but some attributes of the server rendered HTML didn't match`",
  en: "`A tree hydrated but some attributes of the server rendered HTML didn't match`",
});

export const hydrationCause = message({
  ja: 'インラインスクリプトが付けた`class="dark"`は、サーバーのHTMLにはありません。開発ビルドのReactは`<html>`の属性をpropsと比べ、この`class`の食い違いを警告します。',
  en: 'The `class="dark"` the inline script added is not in the server’s HTML. React’s development build compares `<html>`’s attributes with its props and warns about the `class`.',
});

export const hydrationFix = message({
  ja: '`<html>`に`suppressHydrationWarning`を付けます。止まるのは`<html>`自身の属性の警告だけです。ページの中の食い違いは、これまでどおり報告されます。ハイドレーションは属性を書き戻さないので、クラスは残ります。',
  en: 'Give `<html>` `suppressHydrationWarning`. It silences the warning for `<html>`’s own attributes only; mismatches inside the page are still reported. Hydration does not write attributes back, so the class stays.',
});

export const nativeTitle = message({
  ja: '配色に従わないフォーム部品',
  en: 'Form controls in the other scheme',
});

export const nativeCause = message({
  ja: 'ブラウザが自分で描く部品の配色は、CSSの`color-scheme`プロパティで決まります。このパッケージはこのプロパティを設定しません。`@k8ordo/ui`を使っていない場合は、自分で宣言します。`color-scheme: light dark`と書いている場合は、ブラウザがOSの設定で選ぶので、訪問者の選択とずれます。',
  en: 'What the browser draws itself follows the CSS `color-scheme` property. This package does not set it, so without `@k8ordo/ui` you declare it yourself. Declared as `color-scheme: light dark`, the browser picks by the OS setting, which can differ from the visitor’s choice.',
});

export const nativeFix = message({
  ja: '`:root`に`color-scheme: light`を、`.dark`に`color-scheme: dark`を宣言します。',
  en: 'Declare `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark`.',
});

export const tailwindTitle = message({
  ja: 'クラスを読まないTailwind CSSの`dark:`',
  en: 'Tailwind CSS’s `dark:` ignoring the class',
});

export const tailwindCause = message({
  ja: 'Tailwind CSS 4の`dark:`は、既定では`prefers-color-scheme`を読みます。OSの設定には従いますが、訪問者が選んだ配色には従いません。',
  en: 'Tailwind CSS 4’s `dark:` reads `prefers-color-scheme` by default. It follows the OS setting, not the visitor’s choice.',
});

export const tailwindFix = message({
  ja: 'スタイルシートで`@custom-variant dark (&:where(.dark, .dark *));`を宣言します。`dark:`がクラスを読むようになります。`@k8ordo/ui`の`tailwind.css`を読み込んでいれば、すでに宣言されています。',
  en: 'Declare `@custom-variant dark (&:where(.dark, .dark *));` in the stylesheet, and `dark:` reads the class. `@k8ordo/ui`’s `tailwind.css` already declares it.',
});

export const iconTitle = message({
  ja: '読み込み直後に反転するアイコン',
  en: 'An icon in the other scheme just after loading',
});

export const iconCause = message({
  ja: 'サーバーは保存した選択を読めないので、既定値で描きます。`scheme`で出し分けたマークアップは、ハイドレーションが終わるまで既定値の配色のままです。',
  en: 'The server cannot read the stored choice, so it renders the default. Markup that branches on `scheme` stays in the default scheme until hydration finishes.',
});

export const iconFix = message({
  ja: '両方を描いて`dark:`で片方を隠すか、`use(browser())`を`<Suspense>`の中で呼んでブラウザでだけ描きます。',
  en: 'Render both and hide one with `dark:`, or call `use(browser())` inside a `<Suspense>` so it renders in the browser only.',
});

export const outsideTitle = message({
  ja: '`useColorScheme needs <ColorSchemeProvider> above it`',
  en: '`useColorScheme needs <ColorSchemeProvider> above it`',
});

export const outsideCause = message({
  ja: '`useColorScheme()`を呼んだコンポーネントの上に、プロバイダがありません。よくあるのは、プロバイダが入れ子のレイアウトにある場合と、テストで`wrapper`を渡していない場合です。',
  en: 'There is no provider above the component that called `useColorScheme()`. Commonly the provider sits in a nested layout, or a test renders without a `wrapper`.',
});

export const outsideFix = message({
  ja: 'プロバイダをルートレイアウトの`<body>`の中に置き、ページ全体を包みます。テストでは、プロバイダを`renderHook`の`wrapper`に渡します。',
  en: 'Put the provider in the root layout, inside `<body>`, around the whole page. In a test, pass it to `renderHook` as the `wrapper`.',
});

export const systemTitle = message({
  ja: 'OSの設定に従わない配色',
  en: 'A scheme that ignores the OS setting',
});

export const systemCause = message({
  ja: "OSの設定に従うのは、訪問者が何も選んでいない間だけです。一度ライトかダークを選ぶと、その選択が優先されます。プロバイダの`defaultPreference`が`'system'`でない場合も、OSの設定は使われません。",
  en: "The OS setting applies only while the visitor has chosen nothing. Once they pick light or dark, that choice wins. With a `defaultPreference` other than `'system'`, the OS setting is not used either.",
});

export const systemFix = message({
  ja: "`setPreference('system')`を呼ぶと、保存した選択が消えて既定値に戻ります。訪問者が自分で戻せるように、切り替えには「システム」を含む3択を用意します。",
  en: "`setPreference('system')` clears the stored choice, and the default applies again. Give the switch a third option, “System”, so visitors can go back themselves.",
});

export const storageTitle = message({
  ja: '`localStorage`の書き換えを無視する配色',
  en: 'A scheme unchanged by a `localStorage` write',
});

export const storageCause = message({
  ja: 'タブの間では、`storage`イベントで選択を伝えます。このイベントは、書き込んだタブ自身では発火しません。同じタブで`localStorage.setItem`を直接呼んでも、プロバイダは再読み込みまで新しい値を読みません。',
  en: 'Tabs pass the choice along through the `storage` event, which never fires in the tab that wrote. A direct `localStorage.setItem` in the same tab goes unnoticed by the provider until a reload.',
});

export const storageFix = message({
  ja: '選択は`setPreference`で変えます。同じオリジンのページを開いているほかのタブにも伝わります。',
  en: 'Change the choice through `setPreference`. Other tabs on the same origin follow.',
});

export const scriptTitle = message({
  ja: '`Encountered a script tag while rendering React component`',
  en: '`Encountered a script tag while rendering React component`',
});

export const scriptCause = message({
  ja: 'テストのようにブラウザだけで描くと、Reactはプロバイダが描くインラインの`<script>`を実行しません。開発ビルドのReactは、そのことをコンソールにエラーとして出します。',
  en: 'Rendered in the browser only, as in a test, React does not execute the inline `<script>` the provider renders. Its development build logs that as an error.',
});

export const scriptFix = message({
  ja: 'テストが失敗したわけではないので、直すものはありません。テストで見る`<html>`のクラスは、プロバイダのeffectが付けています。',
  en: 'Nothing failed, so there is nothing to fix. The class a test sees on `<html>` is written by the provider’s effect.',
});

export const seeBefore = message({
  ja: '詳しくは',
  en: ' See ',
});

export const seeAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
