/**
 * ストーリーの afterEach に渡すと、撮る前にフォーカスを外す。
 *
 * play の userEvent は押す要素に focus() でフォーカスを当てるので、押した
 * ボタンには :focus-visible のリングが付く（IconButton はツールチップも開く）。
 * マウスで押した人にはリングもツールチップも出ないので、その見た目で撮らせる。
 */
export const blurActiveElement = (): void => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
