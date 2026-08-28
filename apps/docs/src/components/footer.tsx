'use client';

import { STORYBOOK_URL } from '../constants';
import type { MessageKey } from '../i18n';
import { useTranslation } from '../i18n';
import { LocaleAnchor } from './locale-anchor';

const DOC_LINKS: Array<{ path: string; labelKey: MessageKey }> = [
  { path: '/ui/get-started', labelKey: 'nav.getStarted' },
  { path: '/ui/theming', labelKey: 'nav.theming' },
  { path: '/ui/i18n', labelKey: 'nav.i18n' },
  { path: '/ui/components', labelKey: 'nav.components' },
  { path: '/ui/hooks', labelKey: 'nav.hooks' },
  { path: '/ui/helpers', labelKey: 'nav.helpers' },
  { path: '/ui/ai/chat', labelKey: 'nav.aiChat' },
  { path: '/ui/ai/generative-ui', labelKey: 'nav.generativeUi' },
  { path: '/ui/ai/agents', labelKey: 'nav.aiAgents' },
];

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: STORYBOOK_URL, label: 'Storybook' },
  { href: 'https://www.npmjs.com/package/@k8ordo/ui', label: 'npm' },
];

const linkClass =
  'text-fg-mute hover:text-fg-base text-sm transition-colors duration-150 ease-out';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-border-mute bg-bg-base border-t">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1fr_auto_auto] md:gap-20 md:px-8">
        <div className="flex flex-col gap-4">
          <span className="flex items-baseline gap-1">
            <span className="font-m-plus-2 font-palt text-fg-base text-lg font-bold">
              k8ordo
            </span>
            <span
              aria-hidden
              className="bg-primary-border inline-block size-1.5 rounded-full"
            />
          </span>
          <p className="text-fg-mute break-phrase max-w-xs text-sm leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>
        <nav aria-label={t('footer.docs')} className="flex flex-col gap-3">
          <span className="text-fg-subtle text-xs font-bold tracking-normal">
            {t('footer.docs')}
          </span>
          <ul className="flex flex-col gap-2">
            {DOC_LINKS.map((link) => (
              <li key={link.path}>
                <LocaleAnchor className={linkClass} path={link.path} unstyled>
                  {t(link.labelKey)}
                </LocaleAnchor>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t('footer.resources')} className="flex flex-col gap-3">
          <span className="text-fg-subtle text-xs font-bold tracking-normal">
            {t('footer.resources')}
          </span>
          <ul className="flex flex-col gap-2">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className={linkClass}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-border-subtle mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 border-t p-6 md:px-8">
        <p className="text-fg-subtle text-xs">
          <span className="tabular-nums">© 2026</span> k8o — MIT License
        </p>
        <p className="text-fg-subtle text-xs tracking-normal">
          {t('footer.typesetting')}
        </p>
      </div>
    </footer>
  );
}
