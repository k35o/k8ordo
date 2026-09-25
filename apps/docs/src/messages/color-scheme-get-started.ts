import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'パッケージを入れ、ルートレイアウトに Provider を 1 つ置き、切替を 1 つ書き、クラスを読むスタイルを用意するまでの手順です。これで、ダークを選んだ訪問者のページは最初の描画からダークになり、何も選んでいない訪問者は OS の設定に追従します。',
  en: 'Install the package, put one provider in the root layout, write one switcher, and style with the class it sets. With that, a visitor who chose dark gets a page that is dark from the first paint, and a visitor who chose nothing follows the OS setting.',
});

export const owns = {
  title: message({
    ja: '持つもの、持たないもの',
    en: 'What it owns, and what it does not',
  }),
  description: message({
    ja: '訪問者のカラースキームは、揃っていなければならない 3 つの値でできています。訪問者が選んだもの、システムが答えるもの、画面に出ているものです。このパッケージはこの 3 つと、それらを結ぶ規則を持ち、受け持つのは `<html>` に `dark` クラスを付けるところまでです。',
    en: 'A visitor’s colour scheme is three values that have to agree: what they chose, what the system says, and what is on screen. This package owns all three and the rule between them, and stops at the `dark` class on `<html>`.',
  }),
  choice: message({
    ja: '訪問者が選んだもの: `light`、`dark`、または未選択（既定値に従い、既定ではシステムに追従）。localStorage に保存されます。',
    en: 'What the visitor chose: `light`, `dark`, or nothing, which follows the default (the system, unless told otherwise). Kept in localStorage.',
  }),
  system: message({
    ja: 'システムが答えるもの: `prefers-color-scheme`。ページを開いている間の変化にも追従します。',
    en: 'What the system says: `prefers-color-scheme`, followed for as long as the page is open.',
  }),
  screen: message({
    ja: '画面に出ているもの: `<html>` の `dark` クラス。最初の描画の前に付け、その後も合わせ続けます。',
    en: 'What is on screen: the `dark` class on `<html>`, put there before the first paint and kept in step afterwards.',
  }),
  notTitle: message({
    ja: '持たないもの',
    en: 'What it does not own',
  }),
  notColours: message({
    ja: '色。`dark` がどんな色を意味するかはスタイルシートが決めます。@k8ordo/ui のトークンでも、クラスを読む自前の CSS でも構いません。',
    en: 'The colours. What `dark` looks like is the stylesheet’s business — @k8ordo/ui’s tokens, or any CSS of your own that reads the class.',
  }),
  notStorage: message({
    ja: '保存の仕組み。保存先は @k8ordo/state の `defineLocalState` で、このパッケージはそれを 1 つ宣言し、`useAppState` を通して読み書きします。localStorage のキーも、行を JSON にする方法も、このパッケージには書かれていません。インラインスクリプトは定義の `inlineRead()` を使います。',
    en: 'The storage. The row is an @k8ordo/state `defineLocalState`; this package declares one and reads and writes it through `useAppState`. Neither the localStorage key nor how the row is serialized is written anywhere in this package: the inline script uses the definition’s `inlineRead()`.',
  }),
  notServer: message({
    ja: 'サーバーでの推測。Cookie もヘッダーも使いません。サーバーは既定値で描き、最初の描画を正しくするのはインラインスクリプトです。',
    en: 'A guess on the server. No cookie, no header: the server renders the default, and the inline script is what makes the first paint right.',
  }),
};

export const install = {
  title: message({
    ja: 'インストール',
    en: 'Installation',
  }),
  description: message({
    ja: '`@k8ordo/state` と `zod` は peer dependency なので、一緒に入れます。設定は `@k8ordo/state` のローカル状態として保存され、そのスキーマが zod のスキーマだからです。',
    en: '`@k8ordo/state` and `zod` are peer dependencies, so install them alongside: the preference is stored as an `@k8ordo/state` local state, and its schema is a zod schema.',
  }),
  columnPackage: message({
    ja: 'パッケージ',
    en: 'Package',
  }),
  columnVersion: message({
    ja: 'バージョン',
    en: 'Version',
  }),
  columnPurpose: message({
    ja: '用途',
    en: 'Needed for',
  }),
  purposeState: message({
    ja: '設定の保存先（localStorage）',
    en: 'where the preference is kept (localStorage)',
  }),
  purposeReact: message({
    ja: 'Provider と hook',
    en: 'the provider and the hook',
  }),
  purposeZod: message({
    ja: '`@k8ordo/state` が読む 1 フィールドのスキーマ',
    en: 'the one-field schema `@k8ordo/state` reads',
  }),
  purposeTypescript: message({
    ja: '同梱の型定義（任意）',
    en: 'the shipped type declarations (optional)',
  }),
  purposeTypesReact: message({
    ja: 'React の型（任意）',
    en: 'React’s types (optional)',
  }),
};

export const provider = {
  title: message({
    ja: 'ルートレイアウトに Provider を置く',
    en: 'Put the provider in the root layout',
  }),
  description: message({
    ja: '`<ColorSchemeProvider>` はルートレイアウトの `<body>` の中で、全体を包むように置きます。Provider はクライアントコンポーネントなので、ルートレイアウトは Server Component のままで構いません。このサイトのルートレイアウトも同じ形です。',
    en: '`<ColorSchemeProvider>` goes in the root layout, inside `<body>`, around everything. The provider is a client component, so the root layout stays a Server Component. This site’s root layout has the same shape.',
  }),
  bodyTitle: message({
    ja: 'なぜ `<body>` の中で全体を包むのか',
    en: 'Why inside `<body>`, around everything',
  }),
  bodyDescription: message({
    ja: 'Provider は、受け取った children より前に、インラインの `<script>` を描きます。HTML パーサーはそこに着いた時点でスクリプトを実行するので、ページの中身に着く前に `<html>` にクラスが付きます。Provider より前に置いたものは、クラスが付く前にパースされ、描画されることがあります。このパッケージのために `<head>` へ置くものはありません。',
    en: 'The provider renders an inline `<script>` before its children. The HTML parser runs it as soon as it reaches it, so the class is on `<html>` before the parser reaches anything the page renders. Anything placed before the provider is parsed — and may be painted — before the class is on. This package needs nothing in `<head>`.',
  }),
  hydrationTitle: message({
    ja: 'なぜ `<html>` に `suppressHydrationWarning` が要るのか',
    en: 'Why `<html>` needs `suppressHydrationWarning`',
  }),
  hydrationDescription: message({
    ja: 'スクリプトは、サーバーが描いていない `class="dark"` を `<html>` に足します。React は hydrate するとき、document にある `<html>` の属性を、描画する props と突き合わせ、開発時にはこの `class` を不一致として報告します。hydrate は属性を書き戻さないので、クラスはそのまま残ります。この差分は意図したものなので、`<html>` の `suppressHydrationWarning` で報告を止めます。止まるのは `<html>` 自身の属性の報告だけで、ページの中の不一致はこれまでどおり報告されます。',
    en: 'The script adds `class="dark"` to `<html>`, which the server did not render. When React hydrates, it compares the attributes on `<html>` in the document with the props it renders, and in development it reports that `class` as a mismatch. Hydration does not write attributes back, so the class stays. The difference is intended, so `suppressHydrationWarning` on `<html>` silences the report. It covers `<html>`’s own attributes only: mismatches inside the page are still reported.',
  }),
};

export const switcher = {
  title: message({
    ja: '`useColorScheme()` で読み、変える',
    en: 'Read and change it with `useColorScheme()`',
  }),
  description: message({
    ja: 'クライアントコンポーネントから `useColorScheme()` を呼ぶと、Provider が決めた 3 つのメンバーが返ります。hook は Provider を読むだけで、document には触れません。切替とプレビューがずれないのは、決めているのが 1 つの Provider だからです。',
    en: 'Call `useColorScheme()` from a client component and it returns three members, decided by the provider. The hook only reads the provider and never touches the document; a switcher and a preview cannot disagree, because one provider decides for both.',
  }),
  columnMember: message({
    ja: 'メンバー',
    en: 'Member',
  }),
  columnType: message({
    ja: '型',
    en: 'Type',
  }),
  columnMeaning: message({
    ja: '意味',
    en: 'What it is',
  }),
  scheme: message({
    ja: '画面に出ているもの。訪問者の設定、Provider の既定値、またはシステムの答えです。',
    en: 'What is on screen: the preference, the provider’s default, or the system’s answer.',
  }),
  preference: message({
    ja: "訪問者が選んだもの。何も保存されていなければ `'system'` です。",
    en: "What the visitor chose; `'system'` when nothing is stored.",
  }),
  setPreference: message({
    ja: "設定を保存します。`'system'` を渡すと設定を保存せず、再び既定値に従います。",
    en: "Stores a preference; `'system'` stores no preference and follows the default again.",
  }),
  choicesDescription: message({
    ja: '3 つの選択肢をそのまま並べる切替です。`preference` が今選ばれているものを、`scheme` が画面に出ている結果を示します。',
    en: 'A switcher that offers all three choices. `preference` marks the one chosen; `scheme` shows the result on screen.',
  }),
  toggleTitle: message({
    ja: 'トグルは `scheme` から反転する',
    en: 'A toggle flips `scheme`',
  }),
  toggleDescription: message({
    ja: "2 択のトグルは `preference` ではなく `scheme` を見て、反対の値を保存します。何も選んでいない間 `preference` は `'system'` なので、それを見ても次にどちらへ行くかは決まりません。トグルを押すと選択が保存され、既定値には従わなくなります。戻れるようにしたいなら `'system'` の選択肢も用意します。このサイトのヘッダーの切替は、このトグルです。",
    en: "A two-way toggle reads `scheme`, not `preference`, and stores the other side. While nothing is chosen `preference` is `'system'`, which does not say which way to go. Pressing the toggle stores a choice, and the default no longer applies; offer `'system'` as well if visitors should be able to go back. The switcher in this site’s header is such a toggle.",
  }),
  systemTitle: message({
    ja: "`'system'` は「選んでいない」こと",
    en: "`'system'` is the absence of a choice",
  }),
  systemDescription: message({
    ja: "`setPreference('system')` は設定を保存せず、`preference` の無い行（`{}`）を書きます。そのあと適用されるのは Provider の `defaultPreference` です。`preference` は、一度も選んでいない訪問者でも、選んだあと戻した訪問者でも `'system'` です。`defaultPreference` を `'dark'` にしていても同じです。",
    en: "`setPreference('system')` stores no preference: the row is written without `preference` (`{}`), and the provider’s `defaultPreference` applies again. `preference` reads `'system'` for a visitor who never chose and for one who chose and went back, even when `defaultPreference` is `'dark'`.",
  }),
  outsideTitle: message({
    ja: 'Provider の外では例外を投げる',
    en: 'Outside the provider it throws',
  }),
  outsideDescription: message({
    ja: '`useColorScheme()` は、上に `<ColorSchemeProvider>` が無いと次のエラーを投げます。黙って既定値を返すことはありません。',
    en: '`useColorScheme()` throws the following error when there is no `<ColorSchemeProvider>` above it. It never falls back to a default silently.',
  }),
  beforeHydrationTitle: message({
    ja: 'hydrate される前の値',
    en: 'Before hydration',
  }),
  beforeHydrationDescription: message({
    ja: "サーバーは localStorage を読めないので、サーバーが描く `scheme` は既定値です（`defaultPreference` が `'system'` なら `'light'`）。`scheme` から選んだアイコンやラベルは、hydrate されるまでその値を表示します。最初の描画から正しくなければならないものは、`dark:` のようにクラスを読む CSS で出し分けます。",
    en: "The server cannot read localStorage, so the `scheme` it renders is the default (`'light'` when `defaultPreference` is `'system'`). An icon or a label chosen from `scheme` shows that value until hydration. Anything that must be right from the first paint is switched by CSS that reads the class, such as `dark:`.",
  }),
  beforeHydrationLink: message({
    ja: 'サーバーが描くものの詳細',
    en: 'More on what the server renders',
  }),
};

export const defaults = {
  title: message({
    ja: '既定値を変える',
    en: 'Change the default',
  }),
  description: message({
    ja: "`defaultPreference` は、訪問者が何も選んでいない間に適用される値です。既定は `'system'` で、`prefers-color-scheme` に従います。`'light'` か `'dark'` を渡すと、訪問者が選ぶまではその値が適用されます。",
    en: "`defaultPreference` is what applies while the visitor has chosen nothing. It is `'system'` unless told otherwise, which follows `prefers-color-scheme`; pass `'light'` or `'dark'` and that value applies until the visitor chooses.",
  }),
  notStored: message({
    ja: '既定値は保存されません。あとで既定値を変えると、選んでいない訪問者はみな新しい既定値に移り、選んだ訪問者は自分の選択のままです。インラインスクリプトにも同じ既定値が埋め込まれるので、最初の描画も新しい既定値で始まります。',
    en: 'The default is never stored. Change it later and every visitor who never chose moves with it, while those who chose keep their choice. The inline script carries the same default, so the first paint starts from it too.',
  }),
};

export const styling = {
  title: message({
    ja: 'クラスでスタイルを当てる',
    en: 'Style with the class',
  }),
  description: message({
    ja: 'このパッケージが出力するのはクラス 1 つです。そのクラスの下で何が変わるかは CSS が決めます。',
    en: 'What this package produces is one class. What changes under it is decided by CSS.',
  }),
  uiTitle: message({
    ja: '@k8ordo/ui と使う',
    en: 'With @k8ordo/ui',
  }),
  uiDescription: message({
    ja: '@k8ordo/ui のセマンティックトークンは `.dark` の下で切り替わります。`styles.css` でも `tailwind.css` でも同じなので、コンポーネントも `bg-bg-base` のようなユーティリティも、追加の設定なしでクラスに従います。CSS の `color-scheme` プロパティもクラスに合わせて設定されるので、スクロールバーやフォーム部品も一緒に暗くなります。`tailwind.css` は `dark:` と `light:` のバリアントもクラスを読むように宣言しているので、自前のマークアップでもそのまま使えます。',
    en: '@k8ordo/ui’s semantic tokens switch under `.dark`, in `styles.css` and `tailwind.css` alike, so the components and utilities such as `bg-bg-base` follow the class with nothing else to set up. The CSS `color-scheme` property is set to follow the class too, so scrollbars and form controls turn dark with the rest. `tailwind.css` also declares the `dark:` and `light:` variants to read the class, so they work in your own markup as they are.',
  }),
  tailwindTitle: message({
    ja: 'Tailwind CSS だけで使う',
    en: 'With Tailwind CSS alone',
  }),
  tailwindDescription: message({
    ja: 'Tailwind CSS 4 の `dark:` バリアントは、既定では `prefers-color-scheme` を読みます。そのままでは OS の設定に従い、訪問者の選択を無視します。クラスを読むように宣言し直します。@k8ordo/ui の `tailwind.css` がしている宣言と同じものです。',
    en: 'Tailwind CSS 4’s `dark:` variant reads `prefers-color-scheme` by default, so on its own it follows the OS and ignores the visitor’s choice. Redeclare it to read the class — the same declaration @k8ordo/ui’s `tailwind.css` makes.',
  }),
  plainTitle: message({
    ja: '素の CSS で使う',
    en: 'With plain CSS',
  }),
  plainDescription: message({
    ja: '色をクラスに結びつけます。このパッケージは CSS の `color-scheme` プロパティを設定しない（@k8ordo/ui ならトークンと一緒に設定している）ので、フォーム部品やスクロールバーのようなブラウザ自身の描画も合わせたいなら、色と一緒に宣言します。',
    en: 'Tie the colours to the class. This package does not set the CSS `color-scheme` property (@k8ordo/ui sets it beside its tokens), so declare it next to the colours if the browser’s own rendering, such as form controls and scrollbars, should follow too.',
  }),
};

export const next = {
  title: message({
    ja: '次に読む',
    en: 'Next steps',
  }),
  howItWorks: message({
    ja: '仕組み: 解決の規則、最初の描画の前に走るスクリプト、その後の追従、保存行、保証すること、テスト',
    en: 'How it works: the resolution rule, the script that runs before the first paint, staying in step, the stored row, what it guarantees, and testing',
  }),
  state: message({
    ja: '@k8ordo/state: 設定が置かれているローカル状態',
    en: '@k8ordo/state: the local state the preference lives in',
  }),
  theming: message({
    ja: '@k8ordo/ui のテーマ: `.dark` の下で切り替わるトークン',
    en: '@k8ordo/ui theming: the tokens that switch under `.dark`',
  }),
};
