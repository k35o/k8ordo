'use client';

import { useEffect } from 'react';

import { detectLocale } from '../i18n';

/**
 * `/` はロケールを持たない唯一の URL で、訪問者の言語に振り分けるためだけに
 * ある。振り分けは effect で行う。描画中に navigation を触ると、このページを
 * 事前描画するビルド（ブラウザではない）で落ちる。
 */
export default function RootRedirect() {
  useEffect(() => {
    navigation.navigate(`/${detectLocale()}/`, { history: 'replace' });
  }, []);

  return null;
}
