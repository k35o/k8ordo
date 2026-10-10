import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '登録済みのデータを、今の値を入れた入力欄で編集するフォームを作ります。`isDirty`で変更の有無を読み、リセットで元の値に戻します。',
  en: 'Build a form that edits a saved record, with the current values filled in. Read whether anything changed from `isDirty`, and revert with a reset.',
});

export const defaultsTitle = message({
  ja: '今の値の渡し方',
  en: 'Passing the current values',
});

export const defaultsHow = message({
  ja: '今の値は`defaultValue`で渡します。チェックボックスは`defaultChecked`です。入力欄は非制御なので、`value`と`onChange`で値を持つ必要はありません。',
  en: 'Pass the current values as `defaultValue`, or `defaultChecked` for a checkbox. The fields are uncontrolled, so there is no `value` or `onChange` to wire up.',
});

export const defaultsOrder = message({
  ja: '`defaultValue`は、`input`を展開する前に書きます。送信に失敗したあとは、`input`が送信した値を`defaultValue`として持ち、前に書いた今の値を上書きします。それ以外のときは`input`に`defaultValue`が無いので、今の値が入力欄に入ります。',
  en: 'Write `defaultValue` before spreading `input`. After a failed submission, `input` carries the submitted value as `defaultValue` and overrides the current value written before it. Otherwise `input` has no `defaultValue`, so the field shows the current value.',
});

export const defaultsPitfall = message({
  ja: '`input`のあとに`defaultValue`を書くと、送信に失敗したときも今の値で上書きされ、入力した内容が消えます。',
  en: 'Written after the spread, `defaultValue` replaces the submitted value with the current one, so a failed submission wipes out what was typed.',
});

export const dirtyTitle = message({
  ja: '変更の検知',
  en: 'Detecting changes',
});

export const dirtyMeaning = message({
  ja: '`form.isDirty`は、どれかの入力欄の値が描画したときから変わっていれば`true`になります。行の追加や削除も変更として数えます。',
  en: '`form.isDirty` is `true` once any field differs from the value it was rendered with. Adding or removing a row counts as a change too.',
});

export const dirtyCost = message({
  ja: '`useForm`は各入力欄の今の値を、描画したときの既定値（`defaultValue`や`defaultChecked`）とDOM上で比べます。キーを押すたびに再描画されることはなく、`isDirty`が切り替わるときだけ再描画されます。',
  en: '`useForm` compares each field in the DOM with the default it was rendered with (`defaultValue` or `defaultChecked`). Typing does not re-render; only a change of `isDirty` does.',
});

export const dirtyLeave = message({
  ja: '上のコードは、変更を保存せずにページを離れようとしたときに確認を出します。',
  en: 'The code above asks for confirmation before leaving the page with unsaved changes.',
});

export const dirtyPitfall = message({
  ja: '送信ボタンを`disabled={!form.isDirty}`で止めるのはおすすめしません。サーバーで描画したHTMLでは`isDirty`が`false`なので、JavaScriptが読み込まれるまで押せません。送信に失敗したあとも`isDirty`は`false`に戻るので、何も直さずに送り直すこともできません。',
  en: 'Avoid disabling the submit button with `disabled={!form.isDirty}`. In the server-rendered HTML `isDirty` is `false`, so the button cannot be pressed until JavaScript loads. After a failed submission `isDirty` is `false` again, so the same values cannot be resubmitted without an edit.',
});

export const resetTitle = message({
  ja: 'リセット',
  en: 'Reset',
});

export const resetButton = message({
  ja: '`type="reset"`のボタンを押すと、ブラウザがすべての入力欄を`defaultValue`に戻します。`useForm`はこのリセットを検知します。表示していたエラーを消し、`isDirty`を`false`に戻します。',
  en: 'A `type="reset"` button makes the browser put every field back to its `defaultValue`. `useForm` detects the reset, clears the errors it was showing, and sets `isDirty` back to `false`.',
});

export const resetAction = message({
  ja: 'Server Actionが終わったあとは、Reactがフォームを同じようにリセットします。送信に失敗したときは、`defaultValue`を`input`より前に書いていれば、リセットされても入力は消えません。',
  en: 'After a Server Action, React resets the form the same way. After a failed submission, with `defaultValue` written before `input`, the reset keeps what was typed.',
});

export const demoTitle = message({
  ja: '編集フォームのデモ',
  en: 'Edit form demo',
});

export const demoDescription = message({
  ja: '登録済みの登壇情報を編集するフォームで、今の値を`defaultValue`で渡しています。',
  en: 'A form that edits a saved talk, with the current values passed as `defaultValue`.',
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
