import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '配色を切り替えるボタンは、`useColorScheme()`が返す値で作ります。このページでは、ライトとダークを行き来するトグルと、「システム」を含む3択の作り方を紹介します。あわせて、既定値の変え方と、ハイドレーションの前にサーバーの推測を表示しない方法も説明します。',
  en: 'A switch is built from what `useColorScheme()` returns. This page builds a toggle between light and dark and a three-way choice that includes the system, then covers changing the default and keeping the server’s guess off screen before hydration.',
});

export const hookTitle = message({
  ja: '`useColorScheme()`が返すもの',
  en: 'What `useColorScheme()` returns',
});

export const hookDescription = message({
  ja: 'Client Componentで`useColorScheme()`を呼ぶと、ルートレイアウトのプロバイダが決めた値が3つ返ります。',
  en: 'Call `useColorScheme()` in a Client Component and it returns three things, decided by the provider in the root layout.',
});

export const hookScheme = message({
  ja: "`scheme`：画面に出ている配色で、`'light'`か`'dark'`です。訪問者の選択か、プロバイダの既定値か、OSの設定のどれかから決まります。",
  en: "`scheme`: what is on screen, `'light'` or `'dark'`. It comes from the visitor’s choice, the provider’s default, or the OS setting.",
});

export const hookPreference = message({
  ja: "`preference`：訪問者が選んだもので、`'light'`か`'dark'`か`'system'`です。何も選んでいないときは`'system'`になります。",
  en: "`preference`: what the visitor chose, `'light'`, `'dark'` or `'system'`. It is `'system'` while nothing is chosen.",
});

export const hookSetPreference = message({
  ja: "`setPreference`：選んだものを保存する関数です。`'system'`を渡すと保存していた選択を消し、プロバイダの既定値に戻ります。",
  en: "`setPreference`: stores a choice. Passing `'system'` clears the stored choice, so the provider’s default applies again.",
});

export const hookOnlyReads = message({
  ja: 'フックはプロバイダが決めた値を読むだけで、`<html>`のクラスにもlocalStorageにも触れません。ページの中に切り替えのボタンがいくつあっても、決めているのは1つのプロバイダなので、表示が食い違うことはありません。',
  en: 'The hook only reads what the provider decided; it never touches the class on `<html>` or localStorage. However many switches a page has, one provider decides for all of them, so they never disagree.',
});

export const toggleTitle = message({
  ja: '2択のトグルを作る',
  en: 'Build a two-way toggle',
});

export const toggleDescription = message({
  ja: 'ライトとダークを行き来するだけなら、`scheme`を見て反対の値を保存します。',
  en: 'To flip between light and dark, read `scheme` and store the other one.',
});

export const toggleWhyScheme = message({
  ja: "`preference`ではなく`scheme`を見るのは、何も選んでいない間の`preference`が`'system'`で、次にどちらへ切り替えればよいかが分からないからです。",
  en: "It reads `scheme`, not `preference`, because while nothing is chosen `preference` is `'system'`, which does not say which way to go.",
});

export const toggleStores = message({
  ja: 'トグルを一度押すと選択が保存され、それ以降はOSの設定を変えても配色は変わりません。OSの設定に従う状態へ戻れるようにしたいなら、次の3択にします。このサイトのヘッダーにある切り替えのボタンも、このトグルです。',
  en: 'One press stores a choice, and from then on changing the OS setting no longer changes the scheme. To let visitors go back to following the OS, offer the three-way choice below. The switch in this site’s header is this toggle.',
});

export const choiceTitle = message({
  ja: '「システム」を含む3択にする',
  en: 'Offer the system as a third choice',
});

export const choiceDescription = message({
  ja: 'OSの設定に従う状態も選べるようにするなら、`preference`をそのまま選択肢の値にします。',
  en: 'To let the visitor choose to follow the OS as well, use `preference` as the value of the choice.',
});

export const choiceSystem = message({
  ja: "`setPreference('system')`は、保存していた選択を消します。そのため`preference`は、一度も選んでいない訪問者でも、選んだあとで「システム」に戻した訪問者でも`'system'`になります。",
  en: "`setPreference('system')` clears the stored choice. So `preference` reads `'system'` both for a visitor who never chose and for one who chose and went back.",
});

export const choiceScheme = message({
  ja: '「システム」の選択肢に`scheme`を添えておくと、OSの設定からいまどちらの配色になっているかが分かります。',
  en: 'Showing `scheme` beside the system option tells the visitor which scheme the OS setting gives right now.',
});

export const defaultTitle = message({
  ja: '既定値を変える',
  en: 'Change the default',
});

export const defaultDescription = message({
  ja: "何も選んでいない訪問者に出す配色は、プロバイダの`defaultPreference`で決めます。指定しなければ`'system'`で、OSの設定に従います。",
  en: "What a visitor who chose nothing gets is the provider’s `defaultPreference`. Left out, it is `'system'`, which follows the OS setting.",
});

export const defaultNotStored = message({
  ja: '既定値は保存されません。あとで既定値を変えると、まだ選んでいない訪問者はみな新しい既定値で表示され、選んだことのある訪問者は自分の選択のままです。インラインスクリプトにも同じ既定値が入るので、最初の描画から新しい既定値で描かれます。',
  en: 'The default is never stored. Change it later, and every visitor who has not chosen moves to the new default, while those who chose keep their choice. The inline script carries the same default, so the first paint starts from it too.',
});

export const defaultSystemLabel = message({
  ja: "既定値が`'system'`でないときは、3択の「システム」という呼び方が合わなくなります。`preference`の`'system'`は「OSに従う」ではなく「何も選んでいない」という意味なので、選択肢の文言も「既定」などにしてください。",
  en: "With a default other than `'system'`, a “System” option no longer says what it does: as a preference, `'system'` means “nothing chosen”, not “follow the OS”. Label it something like “Default” instead.",
});

export const defaultCsp = message({
  ja: 'CSPでインラインスクリプトをハッシュで許可しているなら、`colorSchemeScriptHash()`にも同じ既定値を渡します。既定値はスクリプトの文字列に入るので、既定値を変えるとハッシュも変わるからです。',
  en: 'If a CSP allows the inline script by hash, give `colorSchemeScriptHash()` the same default. The default is written into the script, so changing it changes the hash.',
});

export const beforeTitle = message({
  ja: 'ハイドレーションの前にサーバーの推測を出さない',
  en: 'Keep the server’s guess off screen',
});

export const beforeDescription = message({
  ja: "サーバーはlocalStorageを読めないので、プロバイダは既定値で描きます。既定値が`'system'`なら、サーバーが描く`scheme`は`'light'`です。そのため`scheme`から選んだアイコンや文言は、ハイドレーションが終わるまでサーバーの推測を表示します。",
  en: "A server cannot read localStorage, so the provider renders the default there; with a `'system'` default, the `scheme` it renders is `'light'`. An icon or a label chosen from `scheme` therefore shows the server’s guess until hydration.",
});

export const beforeClass = message({
  ja: 'ページの色そのものは、インラインスクリプトが付けた`dark`クラスに従うので、最初の描画から正しく出ます。食い違うのは、Reactの描画で選んだマークアップだけです。直し方は2つあります。',
  en: 'The page’s colours are right from the first paint, because they follow the `dark` class the inline script put on. Only markup chosen in React’s render is off, and there are two ways to fix it.',
});

export const bothTitle = message({
  ja: '両方を描いてCSSで片方を隠す',
  en: 'Render both and let CSS hide one',
});

export const bothText = message({
  ja: 'CSSで出し分けられるものは、両方の状態を描いておき、`dark:`バリアントで片方を隠します。クラスは最初の描画の前に付いているので、ハイドレーションを待たずに正しいほうが見えます。',
  en: 'Where CSS can do the switching, render both states and hide one with the `dark:` variant. The class is on before the first paint, so the right one shows without waiting for hydration.',
});

export const bothVariant = message({
  ja: 'この`dark:`は、`<html>`のクラスを読むように宣言したバリアントです。@k8ordo/uiの`tailwind.css`はすでに宣言していますが、Tailwind CSSの既定の`dark:`はOSの設定を読みます。',
  en: 'This `dark:` is a variant declared to read the class on `<html>`. @k8ordo/ui’s `tailwind.css` already declares it, but Tailwind CSS’s default `dark:` reads the OS setting.',
});

export const bothVariantLink = message({
  ja: 'Tailwind CSSだけで使うときの宣言',
  en: 'Declaring it with Tailwind CSS alone',
});

export const browserTitle = message({
  ja: 'ブラウザで描くまで待つ',
  en: 'Wait for the browser',
});

export const browserText = message({
  ja: 'アイコンの差し替えのように、CSSでは出し分けにくいものもあります。その場合は、そのマークアップを描くコンポーネントで`use(browser())`を呼び、`<Suspense>`の中に置きます。`browser`は`react-dom`からimportします。サーバーは推測の代わりに`fallback`をHTMLに書き、中身はブラウザで描かれます。',
  en: 'Some things are awkward to switch with CSS, such as swapping an icon. For those, call `use(browser())` in the component that renders the markup, and put it inside a `<Suspense>`; `browser` comes from `react-dom`. The server writes the `fallback` into the HTML instead of a guess, and the content is rendered in the browser.',
});

export const browserFallback = message({
  ja: '`fallback`には、アイコンと同じ大きさの空の要素を置きます。アイコンに差し替わったときに、ボタンの大きさが変わらないようにするためです。ボタンそのものはサーバーのHTMLに入っているので、ハイドレーションが終わればすぐに押せます。',
  en: 'Give the `fallback` an empty element the size of the icon, so the button keeps its size when the icon arrives. The button itself is in the server’s HTML, so it works as soon as hydration finishes.',
});

export const browserPitfall = message({
  ja: '`<Suspense>`は省けません。上に`<Suspense>`が無いと、サーバーでの描画は`fallback`を置く場所が無いので失敗します。',
  en: 'The `<Suspense>` is not optional. Without one above it, the server render has nowhere to put the fallback, and fails.',
});

export const demoTitle = message({
  ja: 'このサイトの配色で試す',
  en: 'Try it on this site',
});

export const demoDescription = message({
  ja: 'トグルと3択を、どちらもこのサイトのプロバイダにつないでいます。どちらを操作しても、このサイト全体の配色が変わります。',
  en: 'A toggle and a three-way choice, both wired to this site’s provider. Either one changes the colour scheme of the whole site.',
});

export const demoSteps = [
  message({
    ja: '3択で「システム」を選ぶと、`preference`は`system`になり、`scheme`にはOSの設定から決まった配色が入ります。',
    en: 'Choose “System”. `preference` becomes `system`, and `scheme` shows the scheme the OS setting gives.',
  }),
  message({
    ja: '「ダークにする」か「ライトにする」のボタンを押すと、画面に出ていた配色の反対が保存され、3択の選択も「ダーク」か「ライト」に移ります。',
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
  en: 'Colour scheme',
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
