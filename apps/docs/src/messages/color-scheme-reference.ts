import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`がexportするコンポーネントとフック、値、型の一覧です。入口は`@k8ordo/color-scheme`の1つだけです。',
  en: 'The component, hook, values and types `@k8ordo/color-scheme` exports. There is one entry point, `@k8ordo/color-scheme`.',
});

export const providerSummary = message({
  ja: 'ルートレイアウトの`<body>`の中で、ページ全体を包むプロバイダです。最初の描画の前に`<html>`へ`dark`クラスを付けるインラインスクリプトを描き、そのあともクラスを合わせ続けます。',
  en: 'The provider that goes in the root layout, inside `<body>`, around the whole page. It renders the inline script that puts `dark` on `<html>` before the first paint, and keeps the class in step afterwards.',
});

export const providerDefault = message({
  ja: "何も選んでいない訪問者に出す配色です。`'system'`ならOSの設定に従い、`'light'`か`'dark'`なら訪問者が選ぶまでその配色にします。省略すると`'system'`です。",
  en: "What a visitor who chose nothing gets. `'system'` follows the OS setting; `'light'` or `'dark'` holds every visitor there until they choose. Defaults to `'system'`.",
});

export const providerNonce = message({
  ja: 'インラインスクリプトに付けるnonceです。`@k8ordo/server`では`nonce()`を渡します。ハッシュで許可するときは渡しません。',
  en: 'The nonce to put on the inline script; under `@k8ordo/server`, pass `nonce()`. Leave it out when the script is allowed by hash.',
});

export const providerChildren = message({
  ja: 'ページ全体です。スクリプトはこれより前に描かれます。',
  en: 'The whole page. The script is rendered ahead of it.',
});

export const providerCaveats = [
  message({
    ja: "`'use client'`のモジュールからexportしているので、Server Componentのルートレイアウトからそのまま描けます。",
    en: "It is exported from a `'use client'` module, so a root layout that is a Server Component renders it as it is.",
  }),
  message({
    ja: '`<html>`には`suppressHydrationWarning`を付けます。スクリプトが付けた`class`はサーバーのHTMLに無いので、開発時のReactが食い違いとして報告するからです。',
    en: 'Give `<html>` `suppressHydrationWarning`. The `class` the script adds is not in the server’s HTML, and React reports it as a mismatch in development.',
  }),
  message({
    ja: 'アプリに1つだけ置きます。プロバイダはそれぞれがスクリプトを描いてクラスを書くので、2つあると食い違うことがあります。',
    en: 'Put exactly one in the application. Each provider renders its own script and writes the class, so two of them can disagree.',
  }),
  message({
    ja: "サーバーは保存された選択もOSの設定も読めないので、既定値で描きます。既定値が`'system'`なら、サーバーが描く配色は`'light'`です。",
    en: "A server can read neither the stored choice nor the OS setting, so it renders the default; with a `'system'` default, that is `'light'`.",
  }),
] as const;

export const hookSummary = message({
  ja: 'いま画面に出ている配色と、訪問者の選択、選択を変える関数を返します。Client Componentの中で使います。',
  en: 'Returns the scheme on screen, the visitor’s choice, and a function that changes it. Use it in Client Components.',
});

export const hookReturns = message({
  ja: '`scheme`と`preference`、`setPreference`をまとめたオブジェクトです。',
  en: 'An object holding `scheme`, `preference` and `setPreference`.',
});

export const hookScheme = message({
  ja: '画面に出ている配色です。訪問者の選択か、プロバイダの既定値か、OSの設定のどれかから決まります。',
  en: 'What is on screen: from the visitor’s choice, the provider’s default, or the OS setting.',
});

export const hookPreference = message({
  ja: "訪問者が選んだものです。何も選んでいないときは`'system'`です。",
  en: "What the visitor chose; `'system'` while nothing is chosen.",
});

export const hookSetPreference = message({
  ja: "選んだものを保存します。`'system'`を渡すと保存していた選択を消し、プロバイダの既定値に戻ります。",
  en: "Stores a choice. `'system'` clears the stored one, so the provider’s default applies again.",
});

export const hookCaveats = [
  message({
    ja: 'プロバイダの外で呼ぶと、`useColorScheme needs <ColorSchemeProvider> above it`で始まるエラーを投げます。既定値を黙って返すことはありません。',
    en: 'Called outside the provider, it throws an error starting with `useColorScheme needs <ColorSchemeProvider> above it`. It never quietly falls back to the default.',
  }),
  message({
    ja: 'プロバイダが決めた値を読むだけで、`<html>`のクラスにもlocalStorageにも触れません。',
    en: 'It only reads what the provider decided, and never touches the class on `<html>` or localStorage.',
  }),
  message({
    ja: 'サーバーでの描画とハイドレーションの描画では、サーバーの推測を返します。保存された選択とOSの設定は、その直後の描画から読みます。',
    en: 'In the server render and the hydration render it returns the server’s guess. The stored choice and the OS setting are read from the render right after.',
  }),
] as const;

export const hookExample = message({
  ja: 'トグルと3択の作り方は「切り替えのボタンを作る」を見てください。',
  en: 'See “Build a switch” for a toggle and a three-way choice.',
});

export const stateSummary = message({
  ja: '設定の保存先を表す、`@k8ordo/state`の`defineLocalState`の定義そのものです。localStorageの`k8ordo-state:color-scheme`に、`preference`を1つだけ持つ行として保存します。',
  en: 'Where the preference lives: the `@k8ordo/state` `defineLocalState` definition itself. It is stored in localStorage under `k8ordo-state:color-scheme`, as a row with one field, `preference`.',
});

export const stateKind = message({
  ja: "状態の置き場所の種類です。localStorageなので`'local'`です。",
  en: "The kind of place the state lives in: `'local'`, for localStorage.",
});

export const stateKey = message({
  ja: '`@k8ordo/state`の中での名前です。ストアはこの名前ごとに1つ作られます。',
  en: 'Its name within `@k8ordo/state`. There is one store per name.',
});

export const stateSchema = message({
  ja: '定義に渡したスキーマです。',
  en: 'The schema the definition was given.',
});

export const stateStorageKey = message({
  ja: 'localStorageのキーです。`k8ordo-state:`に`key`をつなげたものです。',
  en: 'The localStorage key: `k8ordo-state:` followed by `key`.',
});

export const stateInlineRead = message({
  ja: 'インラインスクリプトに書くためのJavaScriptの式を返します。式は保存された行のオブジェクトに評価され、読めないときは`null`になります。',
  en: 'Returns a JavaScript expression for an inline script. It evaluates to the stored row’s object, or to `null` when the row cannot be read.',
});

export const stateCaveats = [
  message({
    ja: "`useAppState(colorSchemeState)`を使うと、フックを通さずに保存された`preference`を読めます。返るのは`'light' | 'dark' | undefined`で、解決した`scheme`ではありません。",
    en: "`useAppState(colorSchemeState)` reads the stored `preference` without the hook. It returns `'light' | 'dark' | undefined`, not the resolved `scheme`.",
  }),
  message({
    ja: '選択を変えるときは`setPreference`を使います。同じタブで`localStorage.setItem`を直接呼んでも、プロバイダは再読み込みまで気づきません。',
    en: 'Change the choice through `setPreference`. A `localStorage.setItem` in the same tab goes unnoticed by the provider until a reload.',
  }),
  message({
    ja: "アプリで`defineLocalState('color-scheme', …)`をもう1つ定義しないでください。ストアは名前で共有されるので、2つの定義が同じ行を取り合います。",
    en: "Do not define another `defineLocalState('color-scheme', …)` in the application. Stores are shared by name, so the two definitions would fight over one row.",
  }),
] as const;

export const hashSummary = message({
  ja: "プロバイダが描くインラインスクリプトのSHA-256を、CSPのソースの形（`'sha256-…'`）で返します。nonceを使わずにスクリプトを許可するポリシーに入れます。",
  en: "Resolves to the SHA-256 of the provider’s inline script as a CSP source, `'sha256-…'`, for a policy that allows the script without a nonce.",
});

export const hashDefault = message({
  ja: 'プロバイダに渡している`defaultPreference`です。既定値はスクリプトの文字列に入るので、この値でハッシュが変わります。',
  en: 'The `defaultPreference` the provider is given. The default is written into the script, so the hash depends on it.',
});

export const hashReturns = message({
  ja: "`'sha256-…'`のように、前後の引用符まで含んだCSPのソースです。",
  en: "A CSP source such as `'sha256-…'`, quotes included.",
});

export const hashCaveats = [
  message({
    ja: 'ハッシュの値をポリシーに書き写さず、ポリシーを書く場所で毎回呼びます。スクリプトの文字列はインストールした版のもので、更新で変わることがあるからです。',
    en: 'Call it wherever the policy is written, every time, rather than copying its value: the script is the installed version’s, and an update may change it.',
  }),
  message({
    ja: '`@k8ordo/server`のように応答ごとのnonceを付けられるなら、ハッシュは要りません。',
    en: 'Where every response can carry a nonce, as under `@k8ordo/server`, the hash is not needed.',
  }),
] as const;

export const colorSchemeSummary = message({
  ja: '画面に出せる配色です。`scheme`の型です。',
  en: 'A scheme that can be on screen; the type of `scheme`.',
});

export const preferenceSummary = message({
  ja: "配色か`'system'`です。訪問者の選択としての`'system'`は「何も選んでいない」で、プロバイダの既定値に従います。既定値としての`'system'`は、OSの設定に従います。",
  en: "A scheme, or `'system'`. As a visitor’s choice, `'system'` is nothing chosen, so the provider’s default applies; as that default, it follows the OS setting.",
});

export const providerPropsSummary = message({
  ja: '`ColorSchemeProvider`のpropsの型です。プロバイダを包むコンポーネントを自分で作るときに使います。',
  en: 'The props of `ColorSchemeProvider`, for a component of your own that wraps it.',
});

export const hookTypeSummary = message({
  ja: '`useColorScheme()`の戻り値の型です。フックの値をpropsで受け取るコンポーネントに使います。',
  en: 'What `useColorScheme()` returns, for a component that receives it as props.',
});
