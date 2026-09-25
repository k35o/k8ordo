/**
 * This site's own `[locale]` layout and shell, cut down to the part the guides
 * talk about. Kept in one place so every page that shows them shows the same
 * excerpt.
 */
export const SITE_LAYOUT = `// src/routes/[locale]/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../../i18n';
import { LocaleShell } from './_parts/locale-shell';

export const { paramsSchema } = locales;

export default function LocaleLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) {
  return <LocaleShell locale={params.locale}>{children}</LocaleShell>;
}`;

export const SITE_SHELL = `// src/routes/[locale]/_parts/locale-shell.tsx
'use client';

import { usePathname } from '@k8ordo/router';
import { UIProvider } from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { locales } from '../../../i18n';

export function LocaleShell({
  locale: param,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const locale = locales.is(param)
    ? param
    : (locales.delocalize(pathname).locale ?? locales.default);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <UIProvider>{children}</UIProvider>;
}`;
