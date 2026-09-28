/**
 * ストーリーの afterEach に渡すと、撮る前にフォーカスを外す。
 *
 * play の userEvent は focus() でフォーカスを当てるので、押したボタンには
 * :focus-visible のリングが付く（IconButton はツールチップも開く）。ところが
 * onAction がすぐ終わるボタンは、保留中に付く disabled でフォーカスを落とす
 * ことがあり、落ちるかどうかは描画の時機で決まる。VRT が撮るたびにリングの
 * 有無が変わるので、どちらに転んでもフォーカスのない状態にそろえてから撮らせる。
 */
export const blurActiveElement = (): void => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
