'use client';

import { useEffect } from 'react';

import { locales } from '../i18n/locales';

/**
 * `/` はロケールを持たない唯一の URL で、訪問者の言語に振り分けるためだけに
 * ある。振り分けは effect で行う。描画中に navigation を触ると、このページを
 * 事前描画するビルド（ブラウザではない）で落ちる。
 */
export default function RootRedirect() {
  useEffect(() => {
    navigation.navigate(
      locales.localize('/', locales.negotiate(navigator.languages)),
      { history: 'replace' },
    );
  }, []);

  // 描画するものは無いが、title だけは持つ。ルートレイアウトが title を
  // 持たないので、これが無いとこの 1 枚だけ無題になる。
  return <title>k8ordo</title>;
}
