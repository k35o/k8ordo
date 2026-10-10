import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`useColorScheme()`の戻り値で、ライトとダークのトグルと「システム」を含む3択を作ります。ハイドレーションの前に表示が食い違わない書き方も扱います。',
  en: 'Build a light/dark toggle and a three-way choice with “System” from what `useColorScheme()` returns, and keep markup from showing the wrong scheme before hydration.',
});

export const hookTitle = message({
  ja: '戻り値',
  en: 'Return value',
});

export const hookThree = message({
  ja: 'Client Componentで呼ぶと、ルートレイアウトのプロバイダが決めた値が3つ返ります。',
  en: 'Called in a Client Component, it returns three values decided by the provider in the root layout.',
});

export const hookScheme = message({
  ja: "`scheme`：画面に出ている配色で、`'light'`か`'dark'`です。訪問者の選択があればその値、無ければプロバイダの既定値です。既定値が`'system'`ならOSの設定に従います。",
  en: "`scheme`: what is on screen, `'light'` or `'dark'`. It is the visitor’s choice if there is one, otherwise the provider’s default, which follows the OS setting when it is `'system'`.",
});

export const hookPreference = message({
  ja: "`preference`：訪問者が選んだ値で、`'light'`か`'dark'`か`'system'`です。何も選んでいないときは`'system'`です。",
  en: "`preference`: what the visitor chose, `'light'`, `'dark'` or `'system'`. It is `'system'` while nothing is chosen.",
});

export const hookSetPreference = message({
  ja: "`setPreference`：選んだ値を保存する関数です。`'system'`を渡すと保存した値を消し、プロバイダの既定値に戻ります。",
  en: "`setPreference`: stores a choice. Passing `'system'` clears the stored choice, and the provider’s default applies again.",
});

export const hookOnlyReads = message({
  ja: 'フックはプロバイダが決めた値を読むだけで、`<html>`のクラスにもlocalStorageにも触りません。ボタンがいくつあっても1つのプロバイダが決めるので、表示は食い違いません。',
  en: 'The hook only reads what the provider decided. It never touches the class on `<html>` or localStorage. However many switches a page has, one provider decides for all of them, so they never disagree.',
});

export const toggleTitle = message({
  ja: '2択のトグル',
  en: 'Two-way toggle',
});

export const toggleNextCallout = message({
  ja: '`scheme`の反対の値',
  en: 'The opposite of `scheme`',
});

export const toggleScheme = message({
  ja: 'ライトとダークを行き来するだけなら、`scheme`の反対の値を保存します。`preference`からは、次に切り替える先が分かりません。',
  en: 'To flip between light and dark, store the opposite of `scheme`. `preference` does not tell you which way to go.',
});

export const toggleStores = message({
  ja: '一度押すと選択が保存され、それ以降はOSの設定を変えても配色は変わりません。OSの設定に戻せるようにするなら、次の3択にします。',
  en: 'One press stores a choice, and from then on changing the OS setting no longer changes the scheme. To let visitors go back to following the OS, offer the three-way choice below.',
});

export const toggleHeader = message({
  ja: 'このサイトのヘッダーにある切り替えボタンも、このトグルです。',
  en: 'The switch in this site’s header is this toggle.',
});

export const choiceTitle = message({
  ja: '「システム」を含む3択',
  en: 'Three-way choice with “System”',
});

export const choicePreference = message({
  ja: 'OSの設定に従う状態も選べるようにするなら、`preference`をそのまま選択肢の値にします。',
  en: 'To let the visitor choose to follow the OS as well, use `preference` as the value of the choice.',
});

export const choiceSystem = message({
  ja: "一度も選んでいない訪問者も、選んだあとで「システム」に戻した訪問者も、`preference`は`'system'`です。",
  en: "`preference` reads `'system'` both for a visitor who never chose and for one who chose and went back.",
});

export const choiceScheme = message({
  ja: '「システム」の選択肢に`scheme`を添えると、OSの設定でいまどちらの配色になっているかが分かります。',
  en: 'Showing `scheme` beside the “System” option tells the visitor which scheme the OS setting gives right now.',
});

export const defaultTitle = message({
  ja: '既定値',
  en: 'Default',
});

export const defaultProp = message({
  ja: "何も選んでいない訪問者に出す配色は、プロバイダの`defaultPreference`で決めます。省略すると`'system'`で、OSの設定に従います。",
  en: "What a visitor who chose nothing gets is the provider’s `defaultPreference`. Left out, it is `'system'`, which follows the OS setting.",
});

export const defaultNotStored = message({
  ja: '既定値は保存されません。あとで既定値を変えると、まだ選んでいない訪問者には新しい既定値の配色が出ます。選んだことのある訪問者は自分の選択のままです。インラインスクリプトにも同じ既定値が入るので、最初の描画から新しい既定値で描かれます。',
  en: 'The default is never stored. Change it later, and every visitor who has not chosen moves to the new default, while those who chose keep their choice. The inline script carries the same default, so the first paint starts from it too.',
});

export const defaultSystemLabel = message({
  ja: "既定値が`'system'`でないときは、「システム」という選択肢の名前が合いません。`preference`の`'system'`は「何も選んでいない」という意味なので、選択肢の文言は「既定」などにします。",
  en: "With a default other than `'system'`, a “System” option no longer says what it does: as a preference, `'system'` means “nothing chosen”. Label it something like “Default” instead.",
});

export const defaultCsp = message({
  ja: 'CSPでインラインスクリプトをハッシュで許可しているなら、`colorSchemeScriptHash()`にも同じ既定値を渡します。既定値はスクリプトの文字列に入るので、変えるとハッシュも変わります。詳しくは',
  en: 'If a CSP allows the inline script by hash, give `colorSchemeScriptHash()` the same default. The default is written into the script, so changing it changes the hash. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const beforeTitle = message({
  ja: 'ハイドレーション前の表示',
  en: 'Before hydration',
});

export const beforeGuess = message({
  ja: "サーバーはlocalStorageを読めないので、プロバイダは既定値で描きます。既定値が`'system'`なら、サーバーが描く`scheme`は`'light'`です。`scheme`で選んだアイコンや文言は、ハイドレーションが終わるまでサーバーが描いた`scheme`のまま表示されます。",
  en: "A server cannot read localStorage, so the provider renders the default there. With a `'system'` default, the `scheme` it renders is `'light'`. An icon or a label chosen from `scheme` keeps the server-rendered `scheme` until hydration.",
});

export const beforeClass = message({
  ja: 'ページの色は、インラインスクリプトが付けた`dark`クラスに従うので、最初の描画から正しく出ます。食い違うのは、Reactの描画で選んだマークアップだけです。直し方は2つあります。',
  en: 'The page’s colors are right from the first paint, because they follow the `dark` class that the inline script adds to `<html>`. Only markup chosen in React’s render is off, and there are two ways to fix it.',
});

export const bothTitle = message({
  ja: 'CSSでの出し分け',
  en: 'Switching with CSS',
});

export const bothText = message({
  ja: 'CSSで出し分けられるものは、両方の状態を描いて`dark:`バリアントで片方を隠します。ハイドレーションを待たずに正しいほうが見えます。',
  en: 'Where CSS can do the switching, render both states and hide one with the `dark:` variant. The right one shows without waiting for hydration.',
});

export const bothVariant = message({
  ja: 'この`dark:`は、`<html>`のクラスを読むように宣言したバリアントです。`@k8ordo/ui`の`tailwind.css`は宣言済みです。Tailwind CSSの既定の`dark:`はOSの設定を読むので、Tailwind CSSだけで使うときは',
  en: 'This `dark:` is a variant declared to read the class on `<html>`. `@k8ordo/ui`’s `tailwind.css` already declares it. Tailwind CSS’s default `dark:` reads the OS setting, so with Tailwind CSS alone declare it as in “With Tailwind CSS alone” on ',
});

export const bothVariantAfter = message({
  ja: 'の「Tailwind CSSのみ」のとおりに宣言します。',
  en: '.',
});

export const browserTitle = message({
  ja: 'ブラウザでの描画',
  en: 'Rendering in the browser',
});

export const browserText = message({
  ja: 'アイコンの差し替えのように、CSSでは出し分けにくいものもあります。そのマークアップを描くコンポーネントで`use(browser())`を呼び、`<Suspense>`の中に置きます。`browser`は`react-dom`からimportします。',
  en: 'Some things are awkward to switch with CSS, such as swapping an icon. For those, call `use(browser())` in the component that renders the markup, and put it inside a `<Suspense>`. `browser` comes from `react-dom`.',
});

export const browserFallback = message({
  ja: '`fallback`にアイコンと同じ大きさの空の要素を置くと、差し替わったときにボタンの大きさが変わりません。',
  en: 'Give the `fallback` an empty element the size of the icon, so the button keeps its size when the icon renders.',
});

export const browserPitfall = message({
  ja: '`<Suspense>`は省けません。無いとサーバーでの描画が失敗します。',
  en: 'The `<Suspense>` is not optional: without it, the server render fails.',
});

export const demoTitle = message({
  ja: 'トグルと3択のデモ',
  en: 'Toggle and choice demo',
});

export const demoDescription = message({
  ja: 'このサイトのプロバイダにつないだトグルと3択で、どちらを操作してもサイト全体の配色が変わります。',
  en: 'A toggle and a three-way choice wired to this site’s provider: either one changes the color scheme of the whole site.',
});

export const demoSteps = [
  message({
    ja: '3択で「システム」を選ぶと、`preference`は`system`になり、`scheme`にはOSの設定から決まった配色が入ります。',
    en: 'Choose “System”. `preference` becomes `system`, and `scheme` shows the scheme the OS setting gives.',
  }),
  message({
    ja: '「ダークにする」か「ライトにする」を押すと、画面に出ていた配色の反対が保存され、3択も「ダーク」か「ライト」に移ります。',
    en: 'Press “Switch to dark” or “Switch to light”. The opposite of what was on screen is stored, and the three-way choice moves to “Dark” or “Light”.',
  }),
  message({
    ja: '「システム」を選び直してからOSの外観の設定を切り替えると、`scheme`だけが変わり、`preference`は`system`のままです。',
    en: 'Choose “System” again, then switch your OS’s appearance setting. Only `scheme` changes; `preference` stays `system`.',
  }),
] as const;

export const demoToDark = message({
  ja: 'ダークにする',
  en: 'Switch to dark',
});

export const demoToLight = message({
  ja: 'ライトにする',
  en: 'Switch to light',
});

export const demoChoiceLabel = message({
  ja: '配色',
  en: 'Color scheme',
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
