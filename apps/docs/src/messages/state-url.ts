import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`url`に置く状態のスキーマを書けるようになります。URLはリンクを渡した相手に同じ画面を見せますが、文字列しか運ばず、誰でも書き換えられます。',
  en: 'You will be able to write the `url` schema of a page state. A URL shows the same screen to whoever gets the link, but it carries only strings, and anyone can edit it.',
});

export const absenceTitle = message({
  ja: '既定値',
  en: 'Defaults',
});

export const absenceDefault = message({
  ja: 'フィールドを足す前に作られたリンクも開かれるので、URLのパラメータは欠けていることがあります。どのフィールドにも`.default()`か`.optional()`を付けます。付け忘れたときのエラーは',
  en: 'Links made before a field existed still get opened, so a URL parameter can be missing. Every field takes `.default()` or `.optional()`. The error for a field that lacks one is described on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const absenceOptional = message({
  ja: '既定値を決められないフィールドは、上の`sort`のように`.optional()`にします。パラメータが無ければ、値は`undefined`です。',
  en: 'A field with no sensible default takes `.optional()`, like `sort` above. When its parameter is absent, the value is `undefined`.',
});

export const typesTitle = message({
  ja: 'パラメータの型',
  en: 'Parameter types',
});

export const typesLead = message({
  ja: '各フィールドは、文字列から値を読める書き方にします。',
  en: 'Each field is written so that it parses its value from a string.',
});

export const typesString = message({
  ja: '文字列：`z.string()`で受けます。選択肢が決まっていれば`z.enum()`です。',
  en: 'Strings: `z.string()`, or `z.enum()` for a fixed set of choices.',
});

export const typesNumber = message({
  ja: '数：`z.coerce.number()`で受けます。`?page=2`の`"2"`が`2`になります。',
  en: 'Numbers: `z.coerce.number()`, which turns the `"2"` of `?page=2` into `2`.',
});

export const typesBoolean = message({
  ja: '真偽値：`z.stringbool()`で受けます。`"true"`を`true`と読み、`true`を`"true"`と書きます。',
  en: 'Booleans: `z.stringbool()`, which reads `"true"` as `true` and writes `true` as `"true"`.',
});

export const typesArray = message({
  ja: '配列：`z.array()`で受けます。同じ名前のパラメータを繰り返して書き（`?tags=sale&tags=new`）、既定値は`[]`にします。',
  en: 'Arrays: `z.array()`, written as the same parameter repeated (`?tags=sale&tags=new`), with `[]` as the default.',
});

export const typesRepeated = message({
  ja: '配列ではないフィールドのパラメータが繰り返されたときは、最初の値を読みます。`update()`はスキーマに無いパラメータを書き換えないので、`utm_source`のようなほかの用途のパラメータと並べられます。',
  en: 'When the parameter of a field that is not an array is repeated, the first value is read. `update()` leaves parameters the schema does not declare untouched, so they can sit next to one like `utm_source`.',
});

export const refusedTitle = message({
  ja: '拒まれる書き方',
  en: 'Refused schemas',
});

export const refusedBoolean = message({
  ja: '`update()`は書いた値をいったんクエリ文字列にしてから読み直すので、URLの`"false"`を読み戻せる書き方が要ります。`z.boolean()`は`"false"`を受け付けず、`z.coerce.boolean()`は`true`と読みます。どちらもフィールドにも配列の要素にも使えません。モジュールを読み込んだ時点で`url boolean fields must use z.stringbool()`で始まるエラーになります。',
  en: '`update()` writes the values into a query string and reads them back, so a field needs a spelling that reads the URL’s `"false"` back. `z.boolean()` does not accept `"false"`, and `z.coerce.boolean()` reads it as `true`. Neither is allowed, as a field or as an array’s item: the module throws as it loads, with an error beginning `url boolean fields must use z.stringbool()`.',
});

export const refusedArray = message({
  ja: '`.optional()`の配列や、`[]`以外を既定値にした配列も拒まれます。パラメータが無いことと空の配列は同じURLなので、既定値が`[]`でないと空の配列を書けません。エラーは`url array fields must default to []`で始まります。',
  en: 'An array that is `.optional()` or defaults to anything but `[]` is refused too. An absent parameter and an empty array are the same URL, so with any other default an empty array could never be written. The error begins `url array fields must default to []`.',
});

export const refusedDate = message({
  ja: 'URLで表せない値は、書こうとした時点で拒まれます。`z.date()`のフィールドに`Date`を渡すと、`update()`や`href`がエラーになります。エラー文はフィールドの名前と`has no URL serialization`を含みます。',
  en: 'A value no URL can carry is refused the moment something writes it. Hand a `z.date()` field a `Date`, and `update()` or `href` throws. The error names the field and contains `has no URL serialization`.',
});

export const salvageTitle = message({
  ja: 'スキーマに合わない値',
  en: 'Values the schema rejects',
});

export const salvageField = message({
  ja: 'スキーマに合わない値は、そのフィールドだけが既定値に戻ります。ほかのフィールドは読めた値を保ちます。読むときにエラーにはなりません。',
  en: 'A value the schema rejects resets only that field to its default. The other fields keep what they read. Reading never throws.',
});

export const salvageArray = message({
  ja: '配列は1つのフィールドとして扱います。要素が1つでも合わなければ、配列全体が`[]`に戻ります。',
  en: 'An array counts as one field. A single rejected item resets the whole array to `[]`.',
});

export const salvageRefine = message({
  ja: 'スキーマ全体に付けた`.refine()`は、フィールドごとに読んだあとの組み合わせを検証します。組み合わせが拒まれると、すべてのフィールドが既定値に戻ります。すべてが既定値の状態を`.refine()`が受け付けないと、モジュールを読み込んだ時点で`url schema rejects its own defaults`で始まるエラーになります。',
  en: 'A `.refine()` on the whole schema checks the combination after each field has been read. When it rejects the combination, every field falls back to its default. If the refine does not accept the all-defaults value, the module throws as it loads, with an error beginning `url schema rejects its own defaults`.',
});

export const canonicalTitle = message({
  ja: 'URLの正規化',
  en: 'Canonical URLs',
});

export const canonicalOmit = message({
  ja: '`search`と`href`は、既定値と同じフィールドをクエリから省きます。同じ状態からはいつも同じ、いちばん短いURLができます。同じ状態を指すリンクやブックマーク、キャッシュのキーが一致します。',
  en: '`search` and `href` leave out every field that sits at its default. The same state always gives the same, shortest URL. Links, bookmarks and cache keys that point at the same state agree.',
});

export const canonicalOrder = message({
  ja: 'パラメータは、スキーマに書いた順に並びます。既定値を手で書いた`?page=1`のようなURLも、省いたURLと同じ値に読めます。`url`の値を変える次の`update()`がクエリを書き直すとき、この`page=1`は省かれます。',
  en: 'Parameters follow the order the schema declares them in. A URL with a hand-written default such as `?page=1` reads to the same values as one without it. The next `update()` that changes a `url` value rewrites the query without that `page=1`.',
});

export const demoTitle = message({
  ja: 'クエリの読み取りデモ',
  en: 'Query reading demo',
});

export const demoDescription = message({
  ja: '入力したクエリを上の`catalogState`と同じ定義の`parseUrl`で読み、`search`で作り直したクエリと並べて表示します（このページのURLは変わりません）。',
  en: 'The query you type is read by `parseUrl` on the same definition as `catalogState` above, next to the query `search` writes back from it (this page’s own URL is left alone).',
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
    ja: 'さらに`&tags=sale&tags=new`を足すと、`tags`が配列として読まれます。`new`を`old`に変えると選択肢に無い値が混ざり、`tags`全体が`[]`に戻ります。',
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
