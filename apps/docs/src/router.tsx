'use client';

import type { RouterProps } from '@funstack/router';
import { Router as FunStackRouter } from '@funstack/router';
import { useEffect } from 'react';
import type { FC } from 'react';

/**
 * Navigation API は同一ドキュメント遷移後にスクロールをトップへ戻す挙動を仕様で
 * 定めているが、Chrome / Safari は未実装で、funstack もこれをアプリ側に委ねている。
 * そのため push / replace 遷移では手動でトップへ戻す。
 * 参照: node_modules/@funstack/router/dist/docs/FaqPage.tsx
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
        // 「現在位置と同じ座標へのスクロール」を最適化で無視され得るので、funstack の
        // 参照実装に倣い -1（0 にクランプされる）を指定して確実に発火させる。
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

// UIProvider はここではなく locale-layout に置く。組み込み文言の辞書が
// URL のロケールで決まるため、ロケールが分かる層でしか正しく渡せない。
export const Router: FC<RouterProps> = (props) => {
  useScrollToTopOnNavigate();

  return <FunStackRouter {...props} />;
};
