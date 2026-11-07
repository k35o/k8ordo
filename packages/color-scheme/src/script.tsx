'use client';

// state も effect も持たないが client の部品にする。Server Component だと
// 描いた本文が Flight のペイロードに入り、全ページの .rsc と HTML の中の
// flight data に同じ数百バイトが載る。遷移で届く script は動かないので本文は
// HTML にだけあればよく、client の部品ならペイロードには props だけが載って、
// SSR と hydrate がそれぞれ scriptFor から同じ本文を作る

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
  return <script nonce={nonce}>{scriptFor(options)}</script>;
}
