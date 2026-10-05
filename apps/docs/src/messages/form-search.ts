import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '検索や絞り込みのフォームは、送信した条件がURLに残るGETのフォームにすると、リンクを共有したりブラウザの戻るで前の条件に戻ったりできます。`@k8ordo/state`と組み合わせると、フォームの制約とURLの状態を1つのスキーマで書けます。',
  en: 'A search or filter form works best as a GET form: the conditions land in the URL, so the link can be shared and the back button returns to the previous ones. With `@k8ordo/state`, one schema describes both the form’s constraints and the URL state.',
});

export const shareTitle = message({
  ja: 'URLの状態とスキーマを共有する',
  en: 'Share one schema with the URL state',
});

export const shareDescription = message({
  ja: '`@k8ordo/state`の`definePageState`で、URLに置く状態の`url`スキーマを書きます。同じスキーマを`formFields`に渡せば、フォームの制約もそこから作られます。',
  en: 'Write the `url` schema of a `definePageState` from `@k8ordo/state`, and pass the same schema to `formFields`. The form’s constraints come from it too.',
});

export const shareMini = message({
  ja: 'このスキーマは、`useAppState`がブラウザで値を読むときにも使うので、クライアントのバンドルに入ります。`zod/mini`で書くとバンドルを小さくできます。',
  en: '`useAppState` reads the URL with this schema in the browser, so it ends up in the client bundle. Writing it with `zod/mini` keeps that small.',
});

export const formTitle = message({
  ja: 'stateを渡さずにuseFormを呼ぶ',
  en: 'Call useForm without a state',
});

export const formDescription = message({
  ja: '送信を受け取るServer Actionが無いので、`useForm`には入力欄の情報だけを渡します。入力欄の初期値には、`useAppState`で読んだいまの状態を`defaultValue`で渡します。',
  en: 'There is no Server Action to receive the submission, so `useForm` takes the fields alone. Each field starts from the current state, read with `useAppState` and handed over as `defaultValue`.',
});

export const formCheck = message({
  ja: 'stateが無くても、送信のときの検証は行います。スキーマに合わない条件は、URLに書き込まれる前に止まります。',
  en: 'Without a state it is still checked on submit, so a filter that breaks its schema never reaches the URL.',
});

export const formTraverse = message({
  ja: '入力欄の値はDOMが持つので、ブラウザの戻るでURLが変わっても、入力欄の値は変わりません。入力欄もURLの条件に合わせたいときは、`<form key={search}>`のようにURLが変わるたびにフォームを作り直します。',
  en: 'The DOM keeps the values, so going back changes the URL but not what the fields show. To make the fields follow the URL too, rebuild the form whenever it changes, with `<form key={search}>`.',
});

export const routerTitle = message({
  ja: '送信はページの読み込みにならない',
  en: 'The submission is not a page load',
});

export const routerDescription = message({
  ja: '`@k8ordo/router`の下では、同じパスへのGETのフォームの送信をルーターが受け取り、ページの読み込みではなく状態の更新として扱います。スクロールの位置もフォーカスもそのまま保たれます。',
  en: 'Under `@k8ordo/router`, a GET submission to the same pathname is taken by the router and treated as a state update, not a page load. Scroll position and focus stay where they were.',
});

export const routerNoJs = message({
  ja: 'JavaScriptが無いときは、ふつうのGETのフォームとして送信され、同じURLにたどり着きます。',
  en: 'Without JavaScript it is an ordinary GET form, and it arrives at the same URL.',
});

export const booleanTitle = message({
  ja: '真偽値は`z.stringbool()`で書く',
  en: 'Write booleans with `z.stringbool()`',
});

export const booleanDescription = message({
  ja: 'URLに置く真偽値は、`z.stringbool()`で書きます。チェックボックスは`update()`が書くのと同じ`true`の綴りを送るので、フォームの送信でできるURLと、`update()`が書くURLが一致します。',
  en: 'A boolean in the URL is a `z.stringbool()`. Its checkbox submits the same spelling of `true` that `update()` writes, so the URL the form lands on and the one `update()` writes agree.',
});

export const booleanUi = message({
  ja: '`@k8ordo/ui`の`Checkbox`には、展開した`value`が届きません。`z.stringbool()`の欄は、素の`<input>`に`input`を展開して描いてください。',
  en: 'A spread `value` does not reach `@k8ordo/ui`’s `Checkbox`. Draw a `z.stringbool()` field as a plain `<input>` with `input` spread onto it.',
});

export const serverTitle = message({
  ja: 'サーバーで条件を読む',
  en: 'Read the conditions on the server',
});

export const serverDescription = message({
  ja: '`@k8ordo/server`では、ページで`search`としてURLのスキーマを書き出すと、検証済みの条件を受け取って描画できます。JavaScriptが届く前から、検索結果を含んだページを返せます。',
  en: 'Under `@k8ordo/server`, a page that exports the url schema as `search` receives the parsed conditions and renders with them, so the results are in the page before JavaScript arrives.',
});

export const serverStatic = message({
  ja: '`@k8ordo/static`のようにサーバーで条件を読めない場合は、サーバーの描画には既定値が使われ、ハイドレーションのあとで送信した条件が反映されます。',
  en: 'Where the server cannot read them, as under `@k8ordo/static`, the server render shows the defaults and the submitted conditions appear after hydration.',
});

export const demoTitle = message({
  ja: '絞り込みのフォームを試す',
  en: 'Try a filter form',
});

export const demoDescription = message({
  ja: '@k8ordo/formのランディングと同じデモです。送信すると、このページのURLが書き換わります。',
  en: 'The same demo as on the @k8ordo/form landing. Submitting it rewrites this page’s URL.',
});

export const demoSteps = [
  message({
    ja: 'キーワードを入れて「絞り込む」を押すと、URLに`?q=`が付きます。ページは読み込み直されません。',
    en: 'Type a keyword and press “Filter”. The URL gains `?q=`, and the page does not reload.',
  }),
  message({
    ja: '「在庫ありのみ」にチェックして送ると、URLに`inStock=true`が付きます。',
    en: 'Check “In stock only” and submit. The URL gains `inStock=true`.',
  }),
  message({
    ja: 'ブラウザの戻るを押すと、URLとstateの行が前の条件に戻ります。入力欄の値はそのまま残ります。',
    en: 'Press the browser’s back button. The URL and the state line return to the previous conditions; the fields keep what you entered.',
  }),
] as const;
