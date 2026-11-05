import type { ReactNode } from 'react';

import { scriptFor } from './scheme';
import type { ColorSchemeScriptOptions } from './scheme';

export type ColorSchemeScriptProps = ColorSchemeScriptOptions & {
  /**
   * The nonce the page's `Content-Security-Policy` lets inline scripts run
   * with — under `@k8ordo/framework`'s server mode, `nonce()` from
   * `@k8ordo/framework/server`. A policy that allows the script by its hash
   * instead names `colorSchemeScriptHash()`.
   */
  readonly nonce?: string;
};

/**
 * The inline script that puts the class on `<html>` before the first paint,
 * and the theme-color `<meta>` in `<head>` when it is given the colours.
 * Goes in the root layout's `<head>`, which `@k8ordo/framework` writes ahead
 * of every stylesheet: a script after a stylesheet waits for it to load, and
 * the browser may paint the page in the meantime.
 */
export function ColorSchemeScript({
  nonce,
  ...options
}: ColorSchemeScriptProps): ReactNode {
  // nonce={undefined} と書くと、Server Component の props としてペイロードに
  // "nonce" の名前が残る。静的ビルドのファイルには nonce を一切残さないので、
  // 渡されないときは属性ごと書かない
  const signed = nonce === undefined ? {} : { nonce };
  return <script {...signed}>{scriptFor(options)}</script>;
}
