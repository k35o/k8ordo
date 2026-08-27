'use client';

/**
 * 開いているポップオーバーのレイヤースタック。
 *
 * APG に合わせ、Escape は最も内側（最後に開かれた）1 枚だけを閉じる。
 * 各 Popover が window にリスナを張ると画面上の枚数だけ発火してしまうため、
 * リスナはモジュール全体で 1 つだけ持ち、スタック最上位へディスパッチする。
 */
const layers: Array<() => void> = [];

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.defaultPrevented) {
    return;
  }
  const top = layers.at(-1);
  if (!top) {
    return;
  }
  // ネイティブ modal dialog の close request（Modal の中で開いた場合）や
  // 外側レイヤーの Escape 処理へ届かせないため preventDefault は必須。
  event.preventDefault();
  top();
};

/**
 * ポップオーバーを最上位レイヤーとして積む。戻り値を呼ぶと取り除かれる。
 */
export const pushEscapeLayer = (close: () => void): (() => void) => {
  if (layers.length === 0) {
    window.addEventListener('keydown', handleKeyDown);
  }
  // 同じ close 関数を共有する複数レイヤーでも取り除く 1 枚を特定できるよう包む
  const layer = () => {
    close();
  };
  layers.push(layer);

  return () => {
    const index = layers.lastIndexOf(layer);
    if (index !== -1) {
      layers.splice(index, 1);
    }
    if (layers.length === 0) {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
};
