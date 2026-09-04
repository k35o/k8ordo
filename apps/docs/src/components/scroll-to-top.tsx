'use client';

import { useEffect } from 'react';

/**
 * Navigation API は同一ドキュメント遷移後にスクロールをトップへ戻す挙動を仕様で
 * 定めているが、Chrome / Safari は未実装なので、push / replace 遷移では手動で
 * トップへ戻す。
 *
 * 戻る / 進む（traverse）はブラウザのスクロール復元に任せ、ここでは何もしない。
 */
function useScrollToTopOnNavigate(): void {
  useEffect(() => {
    const controller = new AbortController();
    navigation.addEventListener(
      'navigatesuccess',
      () => {
        const { transition } = navigation;
        const navigationType = transition?.navigationType;
        if (navigationType !== 'push' && navigationType !== 'replace') {
          return;
        }
        // 同一パスへの遷移（現在ページのリンク再クリック等）は読み位置を保つ
        const fromUrl = transition?.from.url;
        if (
          fromUrl !== null &&
          fromUrl !== undefined &&
          new URL(fromUrl).pathname === location.pathname
        ) {
          return;
        }
        // フラグメント遷移（#section）はブラウザのアンカースクロールを尊重する
        if (location.hash !== '') {
          return;
        }
        // Safari は遷移直後のスクロールを無視するため少し待つ。さらに top:0 は
        // 「現在位置と同じ座標へのスクロール」を最適化で無視され得るので、
        // -1（0 にクランプされる）を指定して確実に発火させる。
        setTimeout(() => {
          window.scrollTo({ left: 0, top: -1 });
        }, 10);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, []);
}

/** 遷移後のスクロール位置。描画するものは無い。 */
export function ScrollToTopOnNavigate() {
  useScrollToTopOnNavigate();
  return null;
}
