/**
 * コードから入力欄の値を変え、打ち込んだときと同じく input イベントで知らせる。
 *
 * React が value を書いても DOM のイベントは出ないので、フォーム側
 * （@k8ordo/form の useForm は input イベントで dirty・ルール・エラーの解除を
 * 見る）は変化に気づけない。値が変わらなかったときは出さない。
 */
export const commitInputValue = (
  input: HTMLInputElement,
  value: string,
): void => {
  if (input.value === value) {
    return;
  }
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
