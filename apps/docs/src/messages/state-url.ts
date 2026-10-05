import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'URLに置いた状態は、リンクを渡した相手にも同じ画面を見せます。その代わり、URLは文字列しか運ばず、誰でも書き換えられます。このページでは、`url`のスキーマの書き方と、書き換えられた値がどう読まれるかを説明します。',
  en: 'State in the URL shows the same screen to whoever you send the link to. In exchange, a URL carries only strings, and anyone can edit it. This page covers how to write the `url` schema, and how an edited value is read.',
});

export const absenceTitle = message({
  ja: 'どのフィールドも欠けてよいようにする',
  en: 'Let every field be missing',
});

export const absenceDescription = message({
  ja: 'URLのパラメータは、いつでも欠けえます。リンクを手で短くされることもあれば、フィールドを足す前に作られたリンクが開かれることもあります。',
  en: 'A URL parameter can always be missing. Someone trims the link by hand, or opens a link made before the field existed.',
});

export const absenceDefault = message({
  ja: 'そのため、どのフィールドにも`.default()`か`.optional()`を付けます。付け忘れたフィールドがあると、定義はモジュールを読み込んだ時点で、そのフィールドの名前を挙げて投げます。最初のクリックを待たずに、読み込んだ時点で分かります。',
  en: 'So every field gets a `.default()` or an `.optional()`. Forget one, and the definition throws as the module loads, naming the field: you find out before the first click, not after.',
});

export const absenceOptional = message({
  ja: '既定値を決められないフィールドは`.optional()`にします。パラメータが無ければ、値は`undefined`です。',
  en: 'A field with no sensible default takes `.optional()`, and reads as `undefined` when its parameter is absent.',
});

export const typesTitle = message({
  ja: '文字列から型を読む',
  en: 'Read types out of strings',
});

export const typesDescription = message({
  ja: 'URLが運ぶのは文字列だけです。そのため、スキーマは文字列から自分の型を読み出せる書き方にします。',
  en: 'A URL carries only strings, so each field is written to read its own type out of one.',
});

export const typesString = message({
  ja: '文字列：`z.string()`のまま受けます。選択肢の決まった値は`z.enum()`です。',
  en: 'Strings: `z.string()` as it is, or `z.enum()` for a fixed set of choices.',
});

export const typesNumber = message({
  ja: '数：`z.coerce.number()`で受けます。`?page=2`の`"2"`が`2`になります。',
  en: 'Numbers: `z.coerce.number()`, which turns the `"2"` of `?page=2` into `2`.',
});

export const typesBoolean = message({
  ja: '真偽値：`z.stringbool()`で受けます。`"true"`を`true`として読み、`true`を書くときは`"true"`と書きます。',
  en: 'Booleans: `z.stringbool()`, which reads `"true"` as `true` and writes `true` back as `"true"`.',
});

export const typesArray = message({
  ja: '配列：`z.array()`で受けます。同じ名前のパラメータを繰り返して書き（`?tags=sale&tags=new`）、既定値は`[]`にします。',
  en: 'Arrays: `z.array()`, written as the same parameter repeated (`?tags=sale&tags=new`), with `[]` as the default.',
});

export const typesRepeated = message({
  ja: '配列ではないフィールドのパラメータが繰り返されたときは、最初の値を読みます。スキーマに無いパラメータは読まずに残すので、`utm_source`のようなほかの用途のパラメータとも並べられます。',
  en: 'When the parameter of a field that is not an array is repeated, the first value is read. Parameters the schema does not declare are left alone, so they sit happily next to something like `utm_source`.',
});

export const refusedTitle = message({
  ja: '読み込みの時点で拒まれる書き方',
  en: 'What is refused as the module loads',
});

export const refusedDescription = message({
  ja: '`update()`は、書いた値をいったんクエリ文字列にしてから読み直し、その結果を描画に出します。訪問者が開いたURLと同じ道を通すためです。そのため、自分が書いたクエリを読み返せないフィールドは、書くたびに既定値へ戻ってしまいます。そうなると決まっている書き方は、モジュールの読み込みで拒まれます。',
  en: '`update()` writes the values into a query string and reads them back before rendering, the same road a visitor’s URL takes. A field that cannot read back its own query would land on its default on every write, so the spellings certain to do that are refused when the module loads.',
});

export const refusedBoolean = message({
  ja: '1つ目は、`z.boolean()`と`z.coerce.boolean()`です。URLの`"false"`は、`z.boolean()`にとっては真偽値ではなく、`z.coerce.boolean()`にとっては`true`です。配列の要素に書いても拒まれ、エラーは`url boolean fields must use z.stringbool()`で始まります。',
  en: 'The first is `z.boolean()` and `z.coerce.boolean()`. The URL’s `"false"` is no boolean to `z.boolean()`, and is `true` to `z.coerce.boolean()`. They are refused as an array’s item too, with an error beginning `url boolean fields must use z.stringbool()`.',
});

export const refusedArray = message({
  ja: '2つ目は、`.optional()`の配列と、`[]`以外を既定値にした配列です。パラメータが無いことと空の配列は同じURLなので、既定値が`[]`でないと、空の配列を書けなくなるからです。エラーは`url array fields must default to []`で始まります。',
  en: 'The second is an array that is `.optional()` or defaults to anything but `[]`. An absent parameter and an empty list are the same URL, so with any other default an empty list could never be written. The error begins `url array fields must default to []`.',
});

export const refusedDate = message({
  ja: 'URLで表せない値は、書こうとした時点で拒まれます。たとえば`z.date()`のフィールドに`Date`を渡すと、`update()`や`href`がフィールドの名前を挙げて投げます。',
  en: 'A value no URL can spell is refused the moment something writes it. Hand a `z.date()` field a `Date`, and `update()` or `href` throws, naming the field.',
});

export const salvageTitle = message({
  ja: '書き換えられた値を読む',
  en: 'Read a hand-edited URL',
});

export const salvageDescription = message({
  ja: 'URLは誰でも書き換えられるので、スキーマに合わない値が届くことがあります。そうした値はそのフィールドだけが既定値に戻り、ほかのフィールドは読めた値を保ちます。読むときに投げることはありません。',
  en: 'Anyone can edit a URL, so values the schema rejects do arrive. Such a value falls back to that field’s default while the other fields keep what they read, and reading never throws.',
});

export const salvageArray = message({
  ja: '配列は1つのフィールドとして扱います。要素が1つでも拒まれれば、配列全体が`[]`に戻ります。',
  en: 'An array counts as one field: a single rejected item resets the whole array to `[]`.',
});

export const salvageRefine = message({
  ja: 'スキーマ全体に付けた`.refine()`は、フィールドごとに拾ったあとの組み合わせに対して、もう一度走ります。組み合わせが拒まれたときは、すべてのフィールドが既定値に戻ります。そのため`.refine()`は、すべてが既定値の状態を受け付けなければなりません。受け付けないと、定義が読み込みの時点で投げます。',
  en: 'A `.refine()` on the whole schema runs once more over what the fields salvaged. When it rejects the combination, every field falls back to its default, so the refine must accept the all-defaults value. If it does not, the definition throws as the module loads.',
});

export const canonicalTitle = message({
  ja: '既定値を省いた、いつも同じURL',
  en: 'One URL per state, defaults left out',
});

export const canonicalDescription = message({
  ja: 'クエリを書くときは、既定値と同じフィールドを省きます。同じ状態からはいつも同じ、いちばん短いURLができるので、リンクやブックマーク、キャッシュのキーがそろいます。',
  en: 'A field at its default is left out of the query. The same state always gives the same, shortest URL, so links, bookmarks and cache keys agree.',
});

export const canonicalOrder = message({
  ja: 'パラメータは、スキーマに書いた順に並びます。手で`?page=1`と書かれたURLも同じように読めます。この`page=1`は、`url`の値を変える次の`update()`がクエリを書き直すときに省かれます。',
  en: 'Parameters follow the order the schema declares them in. A URL with a hand-written `?page=1` reads the same, and the next `update()` that changes a url value rewrites the query without it.',
});

export const demoTitle = message({
  ja: 'URLの読み方を試す',
  en: 'Try reading a URL',
});

export const demoDescription = message({
  ja: '入力したクエリを、上の`catalogState`と同じ定義の`parseUrl`で読みます。その下には、読んだ値から`search`で作り直したクエリを表示します。このページのURLは書き換えません。',
  en: 'The query you type is read by `parseUrl` on the same definition as `catalogState` above. Below it is the query `search` writes back from what was read. This page’s own URL is left alone.',
});

export const demoSteps = [
  message({
    ja: '`page=2`を`page=0`に書き換えると、`page`だけが既定値の`1`に戻り、`q`は`"lamp"`のまま残ります。',
    en: 'Change `page=2` to `page=0`. Only `page` falls back to its default `1`, and `q` stays `"lamp"`.',
  }),
  message({
    ja: '末尾に`&inStock=yes`を足すと、`inStock`が`true`になります。作り直したクエリでは`inStock=true`と書かれます。',
    en: 'Add `&inStock=yes` to the end. `inStock` becomes `true`, and the rebuilt query spells it `inStock=true`.',
  }),
  message({
    ja: 'さらに`&tags=sale&tags=new`を足すと、`tags`が配列として読まれます。そのうち`new`を`old`に変えると、選択肢に無い値が混ざるので、`tags`全体が`[]`に戻ります。',
    en: 'Add `&tags=sale&tags=new` as well, and `tags` reads as an array. Change `new` to `old`, a value outside the choices, and the whole of `tags` goes back to `[]`.',
  }),
] as const;

export const demoLabel = message({
  ja: 'クエリ',
  en: 'Query',
});

export const demoCanonical = message({
  ja: '作り直したクエリ',
  en: 'Rebuilt query',
});

export const demoEmpty = message({
  ja: '空（すべて既定値）',
  en: 'empty (all defaults)',
});
