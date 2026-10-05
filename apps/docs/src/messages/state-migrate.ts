import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'localStorageの行やCookieは、書いたコードより長く残ります。スキーマを変えたあとも前のコードが書いた行は残っていて、新しいコードがそれを読みます。このページでは、何もしないときに古い行がどう読まれるかと、`version`と`migrate`で形の変化を引き継ぐ方法を説明します。',
  en: 'A localStorage row or a cookie outlives the code that wrote it: after the schema changes, rows the old code wrote still come in to be read. This page covers how an old row reads when you do nothing, and how `version` and `migrate` carry rows across a change of shape.',
});

export const salvageTitle = message({
  ja: '何もしなければ、フィールドごとに拾う',
  en: 'Left alone, rows are salvaged field by field',
});

export const salvageDescription = message({
  ja: '古いスキーマが書いた行も、ほかの入力と同じくフィールドごとに読まれます。今のスキーマが受け付けるフィールドは値を保ち、それ以外は既定値に戻ります。',
  en: 'A row an older schema wrote is read field by field, like any other input: every field the current schema accepts keeps its value, and the rest land on their defaults.',
});

export const salvageAdded = message({
  ja: 'フィールドを足した：足したフィールドは既定値から始まり、ほかの値はそのまま残ります。これで正しく動きます。',
  en: 'A field was added: it starts from its default and everything else stays. That is right.',
});

export const salvageTightened = message({
  ja: '制約を厳しくした：新しい制約に合わない値だけが既定値に戻ります。これも正しい動きです。',
  en: 'A constraint was tightened: only the values that no longer fit fall back. That is right too.',
});

export const salvageRenamed = message({
  ja: 'フィールドの名前を変えた：古い名前の値は読まれず、新しいフィールドは何も言わずに既定値になります。',
  en: 'A field was renamed: the value under the old name is never read, and the new field silently starts from its default.',
});

export const salvageMeaning = message({
  ja: '値の意味を変えた：古い値が新しい意味で読まれるか、合わなければ黙って既定値に戻ります。',
  en: 'A value changed meaning: the old value is read with the new meaning, or silently resets when it no longer fits.',
});

export const salvageWhen = message({
  ja: '後の2つのように、拾うだけでは引き継げない変化には、`version`と`migrate`を使います。',
  en: 'For changes salvage cannot carry, like the last two, use `version` and `migrate`.',
});

export const versionTitle = message({
  ja: 'versionとmigrateを渡す',
  en: 'Pass version and migrate',
});

export const versionDescription = message({
  ja: '`defineLocalState`と`defineCookieState`は、3つ目の引数に`version`と`migrate`を取ります。',
  en: '`defineLocalState` and `defineCookieState` take `version` and `migrate` as their third argument.',
});

export const versionStory = message({
  ja: 'この例では、版を宣言する前の行が`{ layout: \'list\' | \'cards\' }`の形を持っていました。`migrate`は、その`layout`を今の`view`に読み替えています。',
  en: 'In this example, rows written before the version existed held `{ layout: \'list\' | \'cards\' }`, and `migrate` turns that `layout` into today’s `view`.',
});

export const versionEnvelope = message({
  ja: '版を持つ行は、`[version, values]`の形で保存されます。版の無い行は、版`0`として読みます。そのため、形が初めて変わったときに`version: 1`を宣言すれば、今ある行は`0`から移行されます。',
  en: 'A versioned row is stored as `[version, values]`, and a row with no version reads as version `0`. So declaring `version: 1` when the shape first changes migrates the existing rows from `0`.',
});

export const rowBeforeCallout = message({
  ja: '版を宣言する前の行',
  en: 'A row from before the version',
});

export const rowAfterCallout = message({
  ja: '移行して書き戻した行',
  en: 'The row after migration and write-back',
});

export const versionPositive = message({
  ja: '`version`は1以上の整数です。それ以外を渡すと、`"prefs" version must be a positive integer, got 0`のように定義が投げます。',
  en: '`version` is a positive integer. Anything else makes the definition throw: `"prefs" version must be a positive integer, got 0`.',
});

export const flowTitle = message({
  ja: '古い行が読まれる流れ',
  en: 'How an older row is read',
});

export const flowDescription = message({
  ja: '`version`より古い行は、次の順に読まれます。',
  en: 'A row older than `version` is read in three steps.',
});

export const flowMigrate = message({
  ja: '`migrate(old, fromVersion)`が、古い値を今の形に読み替えます。`fromVersion`は、その行を書いたときの版です。',
  en: '`migrate(old, fromVersion)` turns the old values into the current shape. `fromVersion` is the version the row was written with.',
});

export const flowSalvage = message({
  ja: '返した値を、ほかの読み込みと同じく、スキーマでフィールドごとに拾います。',
  en: 'What it returns passes the schema field by field, like any read.',
});

export const flowWriteBack = message({
  ja: 'ブラウザのストアが、結果を今の版で書き戻します。',
  en: 'The browser store writes the result back in the current version.',
});

export const flowKeys = message({
  ja: '`migrate`が返すのはスキーマのキーで、ほかのキーを返すと型エラーです。値は古いものをそのまま渡してかまいません。合わない値は、スキーマが拒んで既定値に戻します。',
  en: '`migrate` returns the schema’s keys; another key is a type error. Hand old values over as they are, and the schema rejects whatever does not fit.',
});

export const flowCookie = message({
  ja: 'サーバーの`parseCookies`も移行して読みますが、書き戻しません。ページは応答に`Set-Cookie`を書けないからです。ハイドレーションのあとにブラウザが書き戻し、サーバーとブラウザは同じ値を読むので、表示はちらつきません。',
  en: 'On the server, `parseCookies` migrates too, but never writes: a page cannot answer with `Set-Cookie`. The browser writes back after hydration, and both read the same values, so nothing flashes.',
});

export const nextTitle = message({
  ja: '次に形を変えるとき',
  en: 'The next change',
});

export const nextDescription = message({
  ja: '次に形を変えるときは、版を上げて、`migrate`の2つ目の引数`fromVersion`で分けます。',
  en: 'On the next change, raise the version and branch on `migrate`’s second argument, `fromVersion`.',
});

export const nextStory = message({
  ja: 'この例は、版2で`pageSize`を`perPage`に改めたときのものです。版`0`の行も版`1`の行も、1回の`migrate`で今の形になります。',
  en: 'Here version 2 renames `pageSize` to `perPage`. Rows from version `0` and version `1` both reach the current shape in one `migrate`.',
});

export const edgesTitle = message({
  ja: '気をつけること',
  en: 'What to watch for',
});

export const edgesDescription = message({
  ja: '版を持つ行には、次のような場合があります。',
  en: 'A few cases come with versioned rows.',
});

export const edgesNewer = message({
  ja: '新しい版の行：次のデプロイを先に読み込んだタブが書いた行です。移行せずにフィールドごとに拾い、書き戻しません。その行は、新しいタブのものだからです。',
  en: 'A newer row: one a tab that loaded the next deploy first has written. It is salvaged without `migrate` and never written back, since it belongs to that newer tab.',
});

export const edgesThrow = message({
  ja: '`migrate`が投げた：何も保存されていないものとして既定値で読み、行には触りません。直した`migrate`が、次の読み込みでやり直せます。',
  en: 'A throwing `migrate`: it reads as nothing stored, with the defaults showing, and the row stays as it was for a fixed `migrate` to try again.',
});

export const edgesAdopt = message({
  ja: '版を宣言したばかり：行の形が`[version, values]`に変わります。宣言する前のコードで動いているタブは、再読み込みするまで、その行を何も保存されていないものとして読みます。',
  en: 'Adopting a version: the row changes shape to `[version, values]`. A tab still running the code from before reads it as nothing stored until it reloads.',
});

export const edgesInlineRead = message({
  ja: '`inlineRead()`：今の版の行しか返しません。ハイドレーションの前にはスキーマも`migrate`も動かないので、ほかの版の行は、ストアが移行するまで`null`になります。',
  en: '`inlineRead()`: it hands out only the current version. Neither the schema nor `migrate` runs before hydration, so a row of any other version is `null` until a store has migrated it.',
});

export const edgesSession = message({
  ja: '`defineSessionState`：`version`を取りません。行はタブと一緒に消えるので、デプロイをまたいで開いていたタブの行も、拾うだけで足ります。',
  en: '`defineSessionState`: it takes no version. Its rows go with the tab, and salvage covers the rare one kept open across a deploy.',
});

export const edgesWithout = message({
  ja: '`version`を渡さなければ、何も変わりません。行は値のオブジェクトそのもので、古い行はフィールドごとに拾われます。',
  en: 'Without the option nothing changes: a row is the bare values object, salvaged field by field.',
});
