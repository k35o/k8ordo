import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スライドの何枚目かのように、リンクで共有したいがサーバーには要らない値は、URLのフラグメントに置けます。こうした値は`hash`に置きます。',
  en: 'A value a link should carry but the server has no use for, such as which slide is showing, can live in the fragment of the URL. That value goes in `hash`.',
});

export const defineTitle = message({
  ja: '`hash`のスキーマ',
  en: 'The `hash` schema',
});

export const defineOne = message({
  ja: 'フラグメントは1本の文字列なので、`hash`にはフィールドのオブジェクトではなく、値1つ分のスキーマを渡します。値は状態の`hash`というフィールドになり、`url`や`entry`の値と一緒に`useAppState`から返ります。',
  en: 'A fragment is one string, so `hash` takes a schema for one value, not an object of fields. The value is the field `hash` of the state, returned by `useAppState` beside the `url` and `entry` values.',
});

export const defineRules = message({
  ja: 'スキーマの決まりは`url`と同じです。値が無いときのために`.default()`か`.optional()`を付け、真偽値は`z.stringbool()`で書きます。`url`か`entry`に`hash`という名前のフィールドがあると、定義の時点でエラーになります。',
  en: 'The schema follows the rules of `url`: give it `.default()` or `.optional()` for when there is no value, and write a boolean as `z.stringbool()`. A `url` or `entry` field named `hash` beside it is an error when the definition is made.',
});

export const defineServer = message({
  ja: 'フラグメントはサーバーに送られないので、サーバーの描画とハイドレーションの描画は既定値で行われます。',
  en: 'A fragment is never sent to the server, so the server render and the hydration render show the default.',
});

export const writeTitle = message({
  ja: '書き込み',
  en: 'Writing',
});

export const writeLike = message({
  ja: "書き込みも`url`と同じです。既定では今の履歴エントリを書き換え、`{ history: 'push' }`を付けると履歴エントリを足します。既定値を書くと、URLからフラグメントが消えます。続けて書いたときは、`url`の書き込みと同じように間引かれます。",
  en: "Writing works as it does for `url`. By default it rewrites the current history entry, and `{ history: 'push' }` adds one. Writing the default removes the fragment from the URL. A run of writes is thinned out as `url` writes are.",
});

export const writeScroll = message({
  ja: 'フラグメントを書いても、画面の位置は動きません。ただし、その値と同じidの要素がページにあれば、ブラウザはそこへスクロールします。',
  en: 'Writing a fragment does not move the viewport. If an element on the page has that value as its id, though, the browser scrolls to it.',
});

export const writeLink = message({
  ja: 'リンクは`href()`で組めます。`hash`の値がフラグメントになります。',
  en: 'Build a link with `href()`. The `hash` value becomes the fragment.',
});

export const anchorTitle = message({
  ja: 'ページ内リンクとの共存',
  en: 'Living with in-page links',
});

export const anchorRead = message({
  ja: 'スキーマが受け付けないフラグメントは、この状態の値として扱いません。上のスキーマなら、`#main`は既定値の`1`と読まれ、URLにはそのまま残ります。',
  en: 'A fragment the schema rejects is not treated as this state’s value. Under the schema above, `#main` reads as the default, `1`, and stays in the URL as it is.',
});

export const anchorKeep = message({
  ja: 'この状態で既定値を書いても、`url`や`entry`の値を書いても、`#main`は消えません。既定値でない値を書いたときだけ、フラグメントが置き換わります。',
  en: 'Neither writing the default nor writing a `url` or `entry` value removes `#main`. Only a value other than the default replaces the fragment.',
});

export const anchorFollow = message({
  ja: '訪問者がページ内リンクをたどると、値は既定値に戻ります。スライドのように値を保ちたい画面では、ページ内リンクへの移動をアプリの側で止めます。',
  en: 'When a visitor follows an in-page link, the value goes back to its default. A screen that must keep the value, such as a slide deck, stops moves to in-page links itself.',
});
