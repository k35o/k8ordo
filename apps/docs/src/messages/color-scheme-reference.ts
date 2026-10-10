import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`がexportするコンポーネントとフック、値、型の一覧です。',
  en: 'Everything `@k8ordo/color-scheme` exports: the component, the hook, values and types.',
});

export const providerSummary = message({
  ja: 'ページ全体を包むプロバイダです。ルートレイアウトの`<body>`の中に置きます。最初の描画の前に`<html>`へ`dark`クラスを付けるインラインスクリプトを描画します。その後の変更でもクラスを更新します。',
  en: 'The provider that wraps the whole page. It goes in the root layout, inside `<body>`. It renders the inline script that puts `dark` on `<html>` before the first paint. It keeps the class updated after that.',
});

export const providerDefault = message({
  ja: "何も選んでいない訪問者に適用する値です。`'system'`ならOSの設定に従います。`'light'`か`'dark'`なら、訪問者が選ぶまでその配色になります。",
  en: "What applies to a visitor who has chosen nothing. `'system'` follows the OS setting. `'light'` or `'dark'` keeps every visitor on that scheme until they choose.",
});

export const providerNonce = message({
  ja: 'インラインスクリプトに付けるnonceです。`@k8ordo/framework`のserverモードでは`nonce()`を渡します。ハッシュで許可するときは省略します。',
  en: 'The nonce to put on the inline script. In `@k8ordo/framework`’s server mode, pass `nonce()`. Leave it out when the script is allowed by hash.',
});

export const providerChildren = message({
  ja: 'ページ全体です。スクリプトはこれより前に描画されます。',
  en: 'The whole page. The script is rendered before it.',
});

export const providerCaveats = [
  message({
    ja: "`'use client'`のモジュールからexportしているので、Server Componentのルートレイアウトからそのまま描画できます。",
    en: "It is exported from a `'use client'` module, so a root layout that is a Server Component can render it directly.",
  }),
  message({
    ja: '`<html>`には`suppressHydrationWarning`を付けます。スクリプトが付けた`class`はサーバーのHTMLに無く、開発時のReactが食い違いとして報告します。',
    en: 'Put `suppressHydrationWarning` on `<html>`. The `class` the script adds is not in the server HTML, and React reports it as a mismatch in development.',
  }),
  message({
    ja: 'アプリに1つだけ置きます。2つあると、それぞれがスクリプトを出力してクラスを付けるので、結果が食い違うことがあります。',
    en: 'Put exactly one in the application. With two, each outputs its own script and writes the class, and they can disagree.',
  }),
] as const;

export const hookSummary = message({
  ja: '画面に出ている配色と訪問者の選択、選択を変える関数を返します。Client Componentで使います。',
  en: 'Returns the scheme on screen, the visitor’s choice, and a function that changes it. Use it in a Client Component.',
});

export const hookReturns = message({
  ja: '`scheme`と`preference`、`setPreference`をまとめたオブジェクトです。',
  en: 'An object holding `scheme`, `preference` and `setPreference`.',
});

export const hookScheme = message({
  ja: '画面に出ている配色です。訪問者の選択、プロバイダの既定値、OSの設定の順で決まります。',
  en: 'What is on screen. It is decided by the visitor’s choice, then the provider’s default, then the OS setting.',
});

export const hookPreference = message({
  ja: "訪問者の選択です。何も選んでいないときは`'system'`です。",
  en: "What the visitor chose. `'system'` while nothing is chosen.",
});

export const hookSetPreference = message({
  ja: "選択を保存します。`'system'`を渡すと保存した選択を消し、プロバイダの既定値に戻ります。",
  en: "Stores a choice. `'system'` clears the stored choice, so the provider’s default applies again.",
});

export const hookCaveats = [
  message({
    ja: 'プロバイダの外で呼ぶと、`useColorScheme needs <ColorSchemeProvider> above it`で始まるエラーになります。既定値は返しません。',
    en: 'Called outside the provider, it throws an error starting with `useColorScheme needs <ColorSchemeProvider> above it`. It does not return the default.',
  }),
  message({
    ja: 'プロバイダが決めた値を読むだけです。`<html>`のクラスもlocalStorageも書き換えません。',
    en: 'It only reads what the provider decided. It never changes the class on `<html>` or localStorage.',
  }),
  message({
    ja: "サーバーの描画とハイドレーションの描画では、既定値から決めた値を返します。既定値が`'system'`なら`'light'`です。保存した選択とOSの設定は、その次の描画から反映されます。",
    en: "In the server render and the hydration render it returns the value decided from the default, which is `'light'` for a `'system'` default. The stored choice and the OS setting are reflected from the render after that.",
  }),
] as const;

export const hookExampleBefore = message({
  ja: 'トグルと3択の作り方は',
  en: 'A toggle and a three-way choice are built in the ',
});

export const hookExampleAfter = message({
  ja: 'を見てください。',
  en: ' guide.',
});

export const stateSummary = message({
  ja: '設定の保存先を表す、`@k8ordo/state`の`defineLocalState`の定義です。localStorageの`k8ordo-state:color-scheme`に、`preference`だけを持つオブジェクトとして保存します。',
  en: 'The `@k8ordo/state` `defineLocalState` definition that says where the preference is stored. It is saved in localStorage under `k8ordo-state:color-scheme`, as an object with one field, `preference`.',
});

export const stateKind = message({
  ja: "状態の置き場所の種類です。localStorageなので`'local'`です。",
  en: "The kind of place the state is stored in. `'local'`, for localStorage.",
});

export const stateKey = message({
  ja: '`@k8ordo/state`の中での名前です。ストアはこの名前ごとに1つです。',
  en: 'Its name within `@k8ordo/state`. There is one store per name.',
});

export const stateSchema = message({
  ja: '定義に渡したスキーマです。',
  en: 'The schema the definition was given.',
});

export const stateStorageKey = message({
  ja: 'localStorageのキーです。`k8ordo-state:`に`key`をつなげた値です。',
  en: 'The localStorage key: `k8ordo-state:` followed by `key`.',
});

export const stateInlineRead = message({
  ja: 'インラインスクリプトに書くJavaScriptの式を返します。式を評価すると保存したオブジェクトになり、値を読めないときは`null`になります。',
  en: 'Returns a JavaScript expression for an inline script. It evaluates to the stored object, or to `null` when the value cannot be read.',
});

export const stateCaveats = [
  message({
    ja: "`useAppState(colorSchemeState)`で、保存した`preference`をフックを通さずに読めます。値は`'light' | 'dark' | undefined`で、解決した`scheme`ではありません。",
    en: "`useAppState(colorSchemeState)` reads the stored `preference` without the hook. Its value is `'light' | 'dark' | undefined`, not the resolved `scheme`.",
  }),
  message({
    ja: '選択は`setPreference`で変えます。同じタブで`localStorage.setItem`を直接呼んだ値は、再読み込みまで画面に反映されません。',
    en: 'Change the choice through `setPreference`. A direct `localStorage.setItem` in the same tab is not reflected until a reload.',
  }),
  message({
    ja: "`defineLocalState('color-scheme', …)`をもう1つ定義しないでください。ストアは名前で共有されるので、2つの定義が同じ保存した値を読み書きします。",
    en: "Do not define another `defineLocalState('color-scheme', …)`. Stores are shared by name, so both definitions would read and write the same stored value.",
  }),
] as const;

export const hashSummary = message({
  ja: "プロバイダが描画するインラインスクリプトのSHA-256を、CSPのソースの形（`'sha256-…'`）で返します。nonceを使わずにスクリプトを許可するポリシーに入れます。",
  en: "Resolves to the SHA-256 of the provider’s inline script as a CSP source, `'sha256-…'`. Put it in a policy that allows the script without a nonce.",
});

export const hashDefault = message({
  ja: 'プロバイダに渡している`defaultPreference`です。既定値はスクリプトの文字列に入るので、この値でハッシュが変わります。',
  en: 'The `defaultPreference` the provider is given. The default is written into the script, so the hash depends on it.',
});

export const hashReturns = message({
  ja: "`'sha256-…'`のように、前後の引用符を含んだCSPのソースです。",
  en: "A CSP source such as `'sha256-…'`, quotes included.",
});

export const hashCaveats = [
  message({
    ja: 'ハッシュの値をポリシーに書き写さず、ポリシーを書く場所で毎回呼びます。スクリプトの文字列はインストールしたバージョンのもので、更新で変わることがあります。',
    en: 'Call it where the policy is written, every time, instead of copying its value. The script text belongs to the installed version, and an update may change it.',
  }),
  message({
    ja: '応答ごとにnonceを付けられるなら、ハッシュは要りません。',
    en: 'Where every response can carry a nonce, the hash is not needed.',
  }),
] as const;

export const hashExampleBefore = message({
  ja: 'ポリシーの組み立て方は',
  en: 'Building the policy is covered in the ',
});

export const hashExampleAfter = message({
  ja: 'を見てください。',
  en: ' guide.',
});

export const colorSchemeSummary = message({
  ja: '画面に出せる配色です。`scheme`の型です。',
  en: 'A scheme that can be on screen. The type of `scheme`.',
});

export const preferenceSummary = message({
  ja: "配色か`'system'`です。訪問者の選択としての`'system'`は「何も選んでいない」を表し、プロバイダの既定値に従います。既定値としての`'system'`はOSの設定に従います。",
  en: "A scheme, or `'system'`. As a visitor’s choice, `'system'` means nothing chosen, so the provider’s default applies. As that default, it follows the OS setting.",
});

export const providerPropsSummary = message({
  ja: '`ColorSchemeProvider`のpropsの型です。プロバイダを包むコンポーネントを自分で作るときに使います。',
  en: 'The props of `ColorSchemeProvider`. Use it for a component of your own that wraps the provider.',
});

export const hookTypeSummary = message({
  ja: '`useColorScheme()`の戻り値の型です。フックの値をpropsで受け取るコンポーネントに使います。',
  en: 'What `useColorScheme()` returns. Use it for a component that receives the hook’s value as props.',
});
