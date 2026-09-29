import type { KeyboardEvent, MouseEvent } from 'react';

// フォームの送信中、readOnly の効かない部品は disabled の代わりに
// aria-disabled を付け、値を変える操作をここで捨てる。フォーカスを持ったまま
// disabled になると、Chromium と WebKit はフォーカスを body へ落とす

/**
 * checkbox と radio を包む label の onClickCapture に渡す。
 *
 * click の既定の動作を止めればブラウザは切り替えを戻すが、戻すのは click を
 * 配り終えたあとで、その間に React の値の追跡が切り替わったほうを覚える。
 * すると onChange が呼ばれ、次に本当に切り替えたときの onChange は落ちる。
 * 捕捉のうちに伝播を止め、React の変更の検出まで届かせない
 */
export const ignoreClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};

const STEP_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

/** range の値をキーで動かすのは keydown の既定の動作なので、それを止める */
export const ignoreStepKeys = (event: KeyboardEvent): void => {
  if (STEP_KEYS.has(event.key)) {
    event.preventDefault();
  }
};

/**
 * select は矢印キーなどに加えて、Space と F4 で一覧を開き、文字のキーで
 * その文字から始まる候補を選ぶ。ctrl や meta の付いたキーはブラウザの
 * ショートカットなので通す
 */
export const ignoreSelectKeys = (event: KeyboardEvent): void => {
  const typed = event.key.length === 1 && !event.ctrlKey && !event.metaKey;
  if (typed || event.key === 'F4' || STEP_KEYS.has(event.key)) {
    event.preventDefault();
  }
};
