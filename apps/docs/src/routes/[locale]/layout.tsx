import type { ReactNode } from 'react';

import { locales } from '../../i18n';
import { LocaleShell } from './_parts/locale-shell';

// `/fr/ui` はこのパターンが答えない。スキーマが拒んだ pathname は表の次へ
// 進み、最後は not-found（404）になる。ビルドが paths で展開するのは
// locales.all だけなので、静的化でここが拒む pathname は生成されない。
// スキーマはロケール集合が自分で出す（Standard Schema）。zod は要らない。
// 生成器はこのファイルの文字列を走査して `export const paramsSchema` を探す
// ので、分割代入（`export const { paramsSchema } = locales`）では拾われない。
// 受理したロケールは、この描画の間の文言のロケールにもなる。
// oxlint-disable-next-line eslint/prefer-destructuring -- 生成器が読むのはこの綴り
export const paramsSchema = locales.paramsSchema;

// スキーマを export するファイルは Server Component でなければならない。
// `'use client'` のモジュールから export した値は、RSC 側には client reference
// の代理としてしか届かず、ハンドラがスキーマとして走らせられない。だから
// レイアウトの本体（フックを使う）は _parts/ の client component に置く。
// レイアウトが受け取る params はスキーマを宣言していても文字列のまま
// （not-found の下では何も検証されないため）。
export default function LocaleLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) {
  return <LocaleShell locale={params.locale}>{children}</LocaleShell>;
}
