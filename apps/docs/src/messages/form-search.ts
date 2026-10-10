import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '検索や絞り込みの条件をURLに残すGETのフォームを書けるようになります。フォームと`@k8ordo/state`が1つのスキーマを共有します。',
  en: 'Build a GET form that keeps search and filter conditions in the URL. The form and `@k8ordo/state` share one schema.',
});

export const shareTitle = message({
  ja: 'スキーマの共有',
  en: 'Sharing the schema',
});

export const sharePageState = message({
  ja: 'URLに置く状態は、`@k8ordo/state`の`definePageState`に`url`スキーマとして書きます。スキーマの書き方は',
  en: 'Describe URL state as the `url` schema of `definePageState` from `@k8ordo/state`. How to write that schema is covered in ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const shareFields = message({
  ja: 'そのスキーマをそのまま`formFields`に渡します。',
  en: 'Pass that same schema to `formFields`.',
});

export const shareServer = message({
  ja: '`@k8ordo/framework`のserverモードでは、同じスキーマを`search`としてexportすると、ページが検証済みの条件を受け取ります。詳しくは',
  en: 'In `@k8ordo/framework`’s server mode, a page that exports the same schema as `search` receives the validated conditions. See ',
});

export const formTitle = message({
  ja: 'GETのフォーム',
  en: 'GET form',
});

export const formNoState = message({
  ja: '送信を受け取るServer Actionが無いので、`useForm`には`fields`だけを渡します。第2引数（Server Actionが返す`state`）が無くても、送信のときの検証は行われます。スキーマに合わない条件はURLに書かれません。',
  en: 'There is no Server Action to receive the submission, so `useForm` takes `fields` alone. Without the second argument (the `state` an action returns), the form is still checked on submit. A condition that does not match the schema is never written to the URL.',
});

export const formDefault = message({
  ja: '入力欄には、`useAppState`で読んだ現在の値を`defaultValue`と`defaultChecked`で渡します。',
  en: 'Each field starts from the current value read with `useAppState`, passed as `defaultValue` or `defaultChecked`.',
});

export const formRouter = message({
  ja: '`@k8ordo/router`を使うと、同じパスへのGETの送信は状態の更新として扱われます。仕組みは',
  en: 'With `@k8ordo/router`, a GET submission to the same path becomes a state update. See ',
});

export const formTraverse = message({
  ja: '`defaultValue`と`defaultChecked`は最初の描画でしか使われません。そのため、戻るボタンでURLが変わっても入力欄の値は変わりません。入力欄もURLに合わせるには、`<form key={search}>`のようにURLが変わるたびにフォームを作り直します。',
  en: '`defaultValue` and `defaultChecked` only apply on the first render, so the back button changes the URL but not the fields. To make the fields follow the URL, rebuild the form whenever it changes, with `<form key={search}>`.',
});

export const demoTitle = message({
  ja: '絞り込みのデモ',
  en: 'Filter demo',
});

export const demoDescription = message({
  ja: 'このページのURLを実際に書き換えるGETのフォームです。',
  en: 'A GET form that rewrites this page’s actual URL.',
});

export const demoSteps = [
  message({
    ja: 'キーワードを入れて「絞り込む」を押すと、URLに`?q=`が付きます。ページは読み込み直されません。',
    en: 'Type a keyword and press “Filter”. The URL gains `?q=`, and the page does not reload.',
  }),
  message({
    ja: '「在庫ありのみ」にチェックして送信すると、URLに`inStock=true`が付きます。',
    en: 'Check “In stock only” and submit. The URL gains `inStock=true`.',
  }),
  message({
    ja: 'ブラウザの戻るボタンを押すと、URLとstateの値が前の条件に戻ります。',
    en: 'Press the browser’s back button. The URL and the state values return to the previous conditions.',
  }),
] as const;

export const booleanTitle = message({
  ja: '文字列のチェックボックス',
  en: 'Checkbox that submits a string',
});

export const boolean = message({
  ja: 'URLに置く真偽値は`z.stringbool()`で書きます。チェックボックスは、`update()`が`true`を書くときと同じ文字列を送ります。そのため、送信でできるURLと`update()`が書くURLは一致します。',
  en: 'A boolean in the URL is a `z.stringbool()`. Its checkbox submits the same string `update()` writes for `true`, so a submission produces the same URL as `update()`.',
});

export const booleanUi = message({
  ja: '`@k8ordo/ui`の`Checkbox`は、`input`に含まれる`value`を`<input>`に渡しません。この欄は素の`<input>`で描画します。詳しくは',
  en: '`@k8ordo/ui`’s `Checkbox` does not pass the `value` in `input` to its `<input>`. Render this field as a plain `<input>`. See ',
});
