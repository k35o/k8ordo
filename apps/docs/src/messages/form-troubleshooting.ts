import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'よくつまずく症状と、その原因、直し方をまとめています。',
  en: 'Common symptoms, what causes them, and how to fix them.',
});

export const missingTitle = message({
  ja: 'parseFormが「FormDataに無い」というエラーを投げる',
  en: 'parseForm throws that a field is missing from the FormData',
});

export const missingCause = message({
  ja: 'スキーマにある入力欄の名前が、送信された`FormData`にありません。多くの場合、その入力欄に`input`を展開し忘れているか、条件によって入力欄を描いていません。',
  en: 'A field in the schema never arrived in the submitted `FormData`. Usually its `input` was never spread, or the field is not rendered under some condition.',
});

export const missingFix = message({
  ja: 'すべての入力欄に`input`を展開し、`.optional()`の付いたオブジェクトの中の入力欄も必ず描きます。何も選ばなければ値を送らないラジオボタンや`<select>`、チェックボックスは、このエラーの対象外です。',
  en: 'Spread `input` onto every field, and always render the fields inside an `.optional()` object. Radios, `<select>` and checkboxes, which send nothing when left alone, are exempt.',
});

export const optionalTitle = message({
  ja: '.optional()を付けたのに、空欄のままだと通らない',
  en: 'A field marked .optional() still rejects an empty value',
});

export const optionalCause = message({
  ja: '空のテキスト欄は、値が無いのではなく`""`を送ります。`.optional()`は値が無い場合を許すだけなので、`.min(1)`のような検証は`""`に対してそのまま働きます。',
  en: 'An empty text field submits `""`, not nothing. `.optional()` only allows a missing value, so a check such as `.min(1)` still applies to `""`.',
});

export const optionalFix = message({
  ja: '空欄を許したいときは、`z.union([z.literal(\'\'), z.string().min(3)])`のように`""`を受け付けるスキーマを書きます。ただしこの場合、`.min(3)`はどちらの枝を確かめるか決まらないため、ブラウザでは確かめず`dropped`に載ります。',
  en: 'Write a schema that accepts `""`, such as `z.union([z.literal(\'\'), z.string().min(3)])`. The `.min(3)` then sits inside a union whose branch cannot be picked, so the browser does not check it and it is listed in `dropped`.',
});

export const miniTitle = message({
  ja: 'zod/miniで書いたら、文言が「Invalid input」になる',
  en: 'With zod/mini, every message reads “Invalid input”',
});

export const miniCause = message({
  ja: '`zod/mini`は、バンドルを小さく保つために、文言の辞書を自動では読み込みません。辞書が無いと、どのエラーも`Invalid input`になります。',
  en: '`zod/mini` does not load a message locale by default, to keep the bundle small. Without one, every error reads `Invalid input`.',
});

export const miniFix = message({
  ja: 'サーバーで最初に読み込まれるモジュールで`z.config(z.locales.ja())`のように辞書を読み込むか、スキーマの検証ごとに文言を書きます。',
  en: 'Load a locale with `z.config(z.locales.en())` in a module the server loads first, or write a message on each check.',
});

export const radioTitle = message({
  ja: '送信に失敗したあと、ラジオボタンの選択が戻らない',
  en: 'A radio selection is lost after a failed submission',
});

export const radioCause = message({
  ja: '自分で書いたラジオボタンに`input`をそのまま展開しています。送信のあとは`input`に前回の値が`defaultValue`として入り、各ラジオボタンの`value`とぶつかります。',
  en: 'The enum’s `input` is spread onto hand-written radios. After a submission `input` carries the previous choice as `defaultValue`, which collides with each radio’s own `value`.',
});

export const radioFix = message({
  ja: '`input`からは`name`と`required`だけを渡し、`state.values`を見て選択肢ごとに`defaultChecked`を決めます。`@k8ordo/ui`の`Radio`と`RadioCard`なら、そのまま展開できます。',
  en: 'Take only `name` and `required` from `input`, and set `defaultChecked` per option from `state.values`. `@k8ordo/ui`’s `Radio` and `RadioCard` take the spread as it is.',
});

export const focusTitle = message({
  ja: '同じ失敗を返すと、2回目はフォーカスが移らない',
  en: 'Focus does not move when the same failure comes back',
});

export const focusCause = message({
  ja: '`useForm`は、返ってきたstateを中身と`token`で見分けます。自分で組み立てたstateに新しい`token`が無いと、同じ内容の2回目の失敗は前と同じ返事とみなされます。',
  en: '`useForm` tells responses apart by their content and `token`. A hand-built state without a fresh `token` makes a second identical failure look like the same response.',
});

export const focusFix = message({
  ja: '`parseForm`が返した`state`を広げて使うか、自分で組み立てるときは毎回新しい`token`を入れます。',
  en: 'Build on the `state` that `parseForm` returned, or give a hand-built state a fresh `token` every time.',
});

export const hiddenTitle = message({
  ja: '隠れたステップのエラーにフォーカスが移らない',
  en: 'Focus does not reach an error in a hidden step',
});

export const hiddenCause = message({
  ja: '`hidden`の付いたステップの中の入力欄は、フォーカスを受け取れません。',
  en: 'A field inside a `hidden` step cannot take focus.',
});

export const hiddenFix = message({
  ja: '新しいstateが届いたら、エラーのあるステップへ描画の中で切り替えます。詳しくは「複数ステップのフォーム」を見てください。',
  en: 'When a new state arrives, switch to the step holding the error during render. See “Multi-step forms”.',
});

export const stringboolTitle = message({
  ja: 'stringboolのチェックボックスが「on」を送る',
  en: 'A stringbool checkbox submits “on”',
});

export const stringboolCause = message({
  ja: '`@k8ordo/ui`の`Checkbox`には、展開した`value`が届きません。そのため、ブラウザの既定の`on`が送られます。',
  en: 'A spread `value` does not reach `@k8ordo/ui`’s `Checkbox`, so the box submits the browser’s default `on`.',
});

export const stringboolFix = message({
  ja: '`z.stringbool()`の欄は、素の`<input {...field.input} />`で描きます。',
  en: 'Render a `z.stringbool()` field as a plain `<input {...field.input} />`.',
});

export const numberTitle = message({
  ja: 'NumberFieldの範囲のエラーだけ、文言がzodと違う',
  en: 'NumberField’s range error is not worded like zod',
});

export const numberCause = message({
  ja: '`NumberField`は`type="text"`で描くので、ブラウザは`min`と`max`を確かめません。範囲の外の値は`NumberField`が自分で知らせ、その文言は`@k8ordo/ui`の辞書のものです。',
  en: '`NumberField` renders `type="text"`, so the browser does not check `min` and `max`. It reports an out-of-range value itself, in `@k8ordo/ui`’s wording.',
});

export const numberFix = message({
  ja: '文言をzodにそろえたいときは、`TextField`に`type="number"`のまま展開します。ブラウザが範囲を確かめ、`useForm`がzodの文言を出します。',
  en: 'To keep zod’s wording, spread the derived `type="number"` onto a `TextField`. The browser checks the range, and `useForm` shows zod’s message.',
});

export const causeLabel = message({
  ja: '原因',
  en: 'Cause',
});

export const fixLabel = message({
  ja: '直し方',
  en: 'Fix',
});
