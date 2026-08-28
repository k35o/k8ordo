'use client';

import { localizeHref, useLocale } from '../i18n';

// パッケージ先頭の URL 構成では /ui 自体に実体がない。索引ページを置く代わりに
// パッケージの入口である Get Started へ送る。
export function UiRedirect() {
  const locale = useLocale();

  navigation.navigate(localizeHref('/ui/get-started', locale), {
    history: 'replace',
  });

  return null;
}
