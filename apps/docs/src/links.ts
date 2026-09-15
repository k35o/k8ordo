import { bindParams } from '@k8ordo/router';
import type { RegisteredNavigablePattern } from '@k8ordo/router';

import { locales } from './i18n';

// ロケールはどのリンクにも要る区間なので、ここで 1 回だけ束ねる。i18n も
// router も互いを知らず、結ぶのはこの 1 行。パターンは `/:locale/…` と
// 綴ったままなので、生成された表の型がそのまま効く。
export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));

/**
 * ナビゲーションのデータが並べる行き先: ロケール以外に param を持たない
 * パターン。`href(path)` がそのまま通る形で、無いページは型で落ちる。
 */
export type SitePath = Exclude<
  Extract<RegisteredNavigablePattern, `/:locale${string}`>,
  `/:locale${string}:${string}`
>;
