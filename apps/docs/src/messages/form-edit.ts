import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '登録済みのデータを編集するフォームでは、入力欄に今の値を入れた状態で描きます。このページでは、今の値の渡し方と、変更があるかどうかを`isDirty`で知る方法、元に戻す操作を紹介します。',
  en: 'A form that edits a saved record renders with the current values already in place. This page covers handing it those values, knowing whether anything changed with `isDirty`, and putting things back.',
});

export const defaultsTitle = message({
  ja: '今の値を入力欄に入れる',
  en: 'Fill the fields with the current values',
});

export const defaultsDescription = message({
  ja: '今の値は`defaultValue`で渡します。チェックボックスなら`defaultChecked`です。値はDOMが持つので、`value`で制御する必要はありません。',
  en: 'Hand the current values over as `defaultValue`, or `defaultChecked` for a checkbox. The DOM keeps the values, so there is no need to control them with `value`.',
});

export const defaultsOrder = message({
  ja: '`defaultValue`は、`input`を展開する前に書いてください。送信に失敗したあとは、`input`に送信した値が`defaultValue`として入ります。後ろに展開した`input`が前の値を上書きするので、失敗のあとは送信した値が、それ以外のときは今の値が入力欄に入ります。',
  en: 'Write `defaultValue` before spreading `input`. After a failed submission, `input` carries the submitted value as `defaultValue`. Spread after yours, it overrides it, so the field shows what was sent after a failure and the current value otherwise.',
});

export const defaultsPitfall = message({
  ja: '`input`のあとに`defaultValue`を書くと、送信に失敗したときも今の値で上書きしてしまい、入力した内容が消えます。',
  en: 'Write `defaultValue` after the spread, and it overrides the submitted value too: a failed submission wipes out what the person typed.',
});

export const dirtyTitle = message({
  ja: '変更があるかどうかを知る',
  en: 'Know whether anything changed',
});

export const dirtyDescription = message({
  ja: '`form.isDirty`は、どれかの入力欄の値が描画したときから変わっていれば`true`になります。行の追加や削除も変更として数えます。',
  en: '`form.isDirty` is `true` once any field differs from the value it was rendered with. Adding or removing a row counts as a change too.',
});

export const dirtyCost = message({
  ja: '値を比べる相手は、入力欄の`defaultValue`です。DOMから直接読むので、キーを押すたびに再描画されることはなく、`isDirty`が切り替わるときだけ描き直されます。',
  en: 'It compares each control with its `defaultValue`, read straight from the DOM, so typing never re-renders: only a flip of `isDirty` does.',
});

export const dirtyLeave = message({
  ja: 'たとえば、変更を保存せずにページを離れようとしたときに確認を出せます。',
  en: 'For example, ask before the person leaves the page with unsaved changes.',
});

export const dirtyPitfall = message({
  ja: '送信ボタンを`disabled={!form.isDirty}`で止めるのはおすすめしません。サーバーが描いたHTMLでは`isDirty`がまだ`false`なので、JavaScriptが届くまでボタンを押せません。また、送信に失敗したあとは送信した値が新しい初期値になるため、何も直さずに送り直すこともできなくなります。',
  en: 'Avoid disabling the submit button with `disabled={!form.isDirty}`. In the server-rendered HTML `isDirty` is still `false`, so the button cannot be pressed until JavaScript arrives. After a failed submission the submitted values become the new defaults too, so sending again unchanged is no longer possible.',
});

export const resetTitle = message({
  ja: '元に戻す',
  en: 'Put things back',
});

export const resetDescription = message({
  ja: '`type="reset"`のボタンを押すと、ブラウザがすべての入力欄を`defaultValue`に戻します。`useForm`はこのリセットに気づき、表示していたエラーを消して`isDirty`を`false`に戻します。',
  en: 'A `type="reset"` button makes the browser put every field back to its `defaultValue`. `useForm` notices the reset, clears the errors it was showing, and takes `isDirty` back to `false`.',
});

export const resetAction = message({
  ja: 'Server Actionが終わったあと、Reactもフォームを同じようにリセットします。送信に失敗しても入力が消えないのは、送信した値が`defaultValue`として描かれ、リセットがその値に戻すからです。',
  en: 'React resets the form the same way after a Server Action. A failed submission keeps what was typed because the submitted values render as `defaultValue`, and the reset goes back to them.',
});

export const demoTitle = message({
  ja: '変更のある状態を試す',
  en: 'Try the dirty state',
});

export const demoDescription = message({
  ja: '登録済みの登壇情報を編集するフォームです。今の値を`defaultValue`で渡しています。',
  en: 'A form that edits a saved talk, with the current values handed over as `defaultValue`.',
});

export const demoSteps = [
  message({
    ja: 'タイトルを書き換えると、「変更あり」の表示に変わります。',
    en: 'Edit the title. The badge changes to “Changed”.',
  }),
  message({
    ja: '書き換えた文字を消して元のタイトルに戻すと、「変更なし」に戻ります。',
    en: 'Type the original title back. The badge returns to “No changes”.',
  }),
  message({
    ja: '公開のチェックを外してから「元に戻す」を押すと、値も表示も元に戻ります。',
    en: 'Uncheck “Public”, then press “Revert”. Both the values and the badge go back.',
  }),
] as const;

export const demoState = message({
  ja: '状態',
  en: 'State',
});

export const demoDirty = message({
  ja: '変更あり',
  en: 'Changed',
});

export const demoClean = message({
  ja: '変更なし',
  en: 'No changes',
});

export const demoLabelTitle = message({
  ja: 'タイトル',
  en: 'Title',
});

export const demoLabelPublic = message({
  ja: '公開する',
  en: 'Public',
});

export const demoSave = message({
  ja: '保存',
  en: 'Save',
});

export const demoReset = message({
  ja: '元に戻す',
  en: 'Revert',
});

export const demoSaved = message({
  ja: 'この値なら保存できます。',
  en: 'These values can be saved.',
});

export const demoTitleMissing = message({
  ja: 'タイトルを入力してください',
  en: 'Enter a title',
});

export const demoTitleTooLong = message({
  ja: 'タイトルは60文字までです',
  en: 'Keep the title to 60 characters',
});
