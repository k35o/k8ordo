import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'スキーマの形を変えたあとも、前のスキーマが保存した値を読めるようになります。`version`と`migrate`で、古い値を今の形に変換します。',
  en: 'Keep reading the values an older schema saved after the shape changes. `version` and `migrate` turn an old value into the current shape.',
});

export const salvageTitle = message({
  ja: '`version`が無いとき',
  en: 'Without `version`',
});

export const salvageBeforeCallout = message({
  ja: '前のスキーマ`{ layout, pageSize }`が保存した値',
  en: 'Saved by the previous schema `{ layout, pageSize }`',
});

export const salvageAfterCallout = message({
  ja: '今のスキーマ`{ view, pageSize }`で読んだ値。`layout`は読まれず、`view`は既定値になる。書き戻さない',
  en: 'Read by the current schema `{ view, pageSize }`: `layout` is never read, and `view` starts from its default. Not written back',
});

export const salvageField = message({
  ja: '`version`を渡さない定義は、値のオブジェクトをそのまま保存します。古いスキーマが保存した値も、ほかの入力と同じくフィールドごとに読みます。今のスキーマが受け付けるフィールドは値を保ち、それ以外は既定値に戻ります。',
  en: 'Without `version`, the saved value is the bare values object. A value an older schema saved is read field by field, like any other input: every field the current schema accepts keeps its value, and the rest fall back to their defaults.',
});

export const salvageAdded = message({
  ja: 'フィールドを足した：足したフィールドは既定値から始まり、ほかの値はそのまま残ります。',
  en: 'A field was added: it starts from its default, and the other values stay.',
});

export const salvageTightened = message({
  ja: '制約を厳しくした：新しい制約に合わない値だけが既定値に戻ります。',
  en: 'A constraint was tightened: only the values that no longer fit fall back to their defaults.',
});

export const salvageRenamed = message({
  ja: 'フィールドの名前を変えた：古い名前の値は読まれず、新しいフィールドは既定値になります。上の`layout`と`view`がこの場合です。',
  en: 'A field was renamed: the value under the old name is never read, and the new field starts from its default. `layout` and `view` above are this case.',
});

export const salvageMeaning = message({
  ja: '値の意味を変えた：古い値がそのまま新しい意味で読まれます。合わない値は既定値に戻ります。',
  en: 'A value changed meaning: the old value is read with the new meaning, or falls back to its default when it no longer fits.',
});

export const salvageWhen = message({
  ja: '前の2つは、そのままで正しく動きます。後の2つはエラーにならず、値が失われるか別の意味で読まれます。`version`と`migrate`で今の形に変換します。',
  en: 'The first two work as they are. The last two raise no error: the value is lost or read with another meaning. `version` and `migrate` convert them into the current shape.',
});

export const versionTitle = message({
  ja: '`version`と`migrate`',
  en: '`version` and `migrate`',
});

export const versionStory = message({
  ja: "`defineLocalState`と`defineCookieState`は、3つ目の引数に`version`と`migrate`を取ります。この例では、バージョンを宣言する前に保存した値が`{ layout: 'list' | 'cards' }`の形でした。`migrate`はその`layout`を今の`view`に変換します。",
  en: "`defineLocalState` and `defineCookieState` take `version` and `migrate` as their third argument. Here the values saved before the version existed had the shape `{ layout: 'list' | 'cards' }`, and `migrate` turns that `layout` into the current `view`.",
});

export const versionEnvelope = message({
  ja: 'バージョンを持つ値は、`[version, values]`の形で保存されます。バージョンの無い値は、バージョン`0`として読まれます。形が初めて変わったときに`version: 1`を宣言すると、今ある値は`0`から移行されます。',
  en: 'A versioned value is saved as `[version, values]`, and a value with no version reads as version `0`. Declaring `version: 1` when the shape first changes migrates the existing values from `0`.',
});

export const rowBeforeCallout = message({
  ja: 'バージョンを宣言する前に保存した値',
  en: 'Saved before the version existed',
});

export const rowAfterCallout = message({
  ja: '移行して書き戻した値',
  en: 'Migrated and written back',
});

export const versionPositive = message({
  ja: '`version`は1以上の整数です。それ以外を渡すと、定義の時点で`"prefs" version must be a positive integer, got 0`のようなエラーになります。',
  en: '`version` is a positive integer. Anything else fails as the definition is created, with an error like `"prefs" version must be a positive integer, got 0`.',
});

export const flowTitle = message({
  ja: '古い値を読む順',
  en: 'Reading an older value',
});

export const flowLead = message({
  ja: '`version`より古い値は、次の順に読まれます。',
  en: 'A value older than `version` is read in three steps.',
});

export const flowMigrate = message({
  ja: '`migrate(old, fromVersion)`が、古い値を今の形に変換します。`fromVersion`は、その値を保存したときのバージョンです。',
  en: '`migrate(old, fromVersion)` turns the old values into the current shape. `fromVersion` is the version the value was saved with.',
});

export const flowSalvage = message({
  ja: '返した値を、ほかの読み込みと同じくスキーマでフィールドごとに読みます。',
  en: 'What it returns passes the schema field by field, like any read.',
});

export const flowWriteBack = message({
  ja: 'ブラウザのストアが、結果を今のバージョンで書き戻します。',
  en: 'The browser store writes the result back in the current version.',
});

export const flowKeys = message({
  ja: '`migrate`が返すオブジェクトのキーはスキーマのキーです。ほかのキーを返すと型エラーになります。値は古いものをそのまま渡してかまいません。',
  en: '`migrate` returns an object with the schema’s keys; another key is a type error. Hand old values over as they are.',
});

export const flowCookie = message({
  ja: 'サーバーの`parseCookies`も移行して読みますが、書き戻しません。ページは応答に`Set-Cookie`を書けないためです。ハイドレーションのあとにブラウザが書き戻します。サーバーとブラウザは同じ値を読み、ハイドレーションで表示は変わりません。',
  en: 'On the server, `parseCookies` migrates too, but never writes back: a page cannot answer with `Set-Cookie`. The browser writes back after hydration. Both read the same values, so the display does not change at hydration.',
});

export const secondChangeTitle = message({
  ja: '次に形を変えるとき',
  en: 'The next change',
});

export const secondChangeStory = message({
  ja: '次に形を変えるときはバージョンを上げ、`migrate`の2つ目の引数`fromVersion`で分けます。この例では、バージョン`2`で`pageSize`を`perPage`に改めています。バージョン`0`の値もバージョン`1`の値も、1回の`migrate`で今の形になります。',
  en: 'On the next change, raise the version and branch on `migrate`’s second argument, `fromVersion`. Here version `2` renames `pageSize` to `perPage`. Values from version `0` and version `1` both reach the current shape in one `migrate`.',
});

export const edgesTitle = message({
  ja: 'バージョンの違いとエラー',
  en: 'Other versions and errors',
});

export const edgesLead = message({
  ja: '`version`を使うときは、次の点があります。',
  en: 'A few more things come with `version`.',
});

export const edgesNewer = message({
  ja: '新しいバージョンの値：次のデプロイを先に読み込んだタブが保存した値です。`migrate`を通さずにフィールドごとに読み、書き戻しません。新しいタブの値はそのまま残ります。',
  en: 'A newer value: one saved by a tab that loaded the next deploy first. It is read field by field without `migrate` and never written back, so the newer tab’s value stays.',
});

export const edgesThrow = message({
  ja: '`migrate`の中でエラーが起きた：何も保存されていないものとして既定値で読み、保存した値には触れません。`migrate`を直せば、次の読み込みで移行されます。',
  en: 'An error inside `migrate`: it reads as nothing saved, with the defaults, and the saved value is left as it was. Fix `migrate`, and the next load migrates it.',
});

export const edgesAdopt = message({
  ja: 'バージョンを宣言したばかり：保存の形が`[version, values]`に変わります。宣言する前のコードで動いているタブは、再読み込みするまでその値を何も保存されていないものとして読みます。',
  en: 'Just after adopting a version: the saved shape changes to `[version, values]`. A tab still running the code from before reads it as nothing saved until it reloads.',
});

export const edgesInlineRead = message({
  ja: '`inlineRead()`：今のバージョンの値しか返しません。ほかのバージョンの値は、ストアが移行するまで`null`です。詳しくは',
  en: '`inlineRead()`: it returns only the current version. A value of any other version is `null` until a store has migrated it. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const edgesSession = message({
  ja: '`defineSessionState`：`version`を取りません。保存した値はタブと一緒に消えます。古い形の値を持つのはデプロイをまたいで開いていたタブだけなので、フィールドごとに読むだけで足ります。',
  en: '`defineSessionState`: it takes no `version`. Its saved values are discarded with the tab. Only a tab kept open across a deploy holds an older shape, so reading field by field is enough.',
});
