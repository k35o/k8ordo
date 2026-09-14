'use client';

import type { Message } from '@k8ordo/i18n';

import { STORYBOOK_URL } from '../constants';
import * as m from '../messages';
import { LocaleAnchor } from './locale-anchor';

/** 第一階層はパッケージ。増えたらここに 1 行足す。 */
const PACKAGE_LINKS = [
  { path: '/ui', label: '@k8ordo/ui' },
  { path: '/form', label: '@k8ordo/form' },
  { path: '/state', label: '@k8ordo/state' },
  { path: '/router', label: '@k8ordo/router' },
  { path: '/static', label: '@k8ordo/static' },
  { path: '/server', label: '@k8ordo/server' },
  { path: '/i18n', label: '@k8ordo/i18n' },
];

/**
 * セクションを持つパッケージは、その列を立てる。今は UI だけで、他のパッケージ
 * の設計ガイドは npm パッケージに同梱されているのでサイトに列を持たない。
 */
const SECTION_GROUPS: Array<{
  name: string;
  links: Array<{ path: string; label: Message }>;
  external?: Array<{ href: string; label: string }>;
}> = [
  {
    name: 'UI',
    links: [
      { path: '/ui/get-started', label: m.nav.getStarted },
      { path: '/ui/theming', label: m.nav.theming },
      { path: '/ui/i18n', label: m.nav.i18n },
      { path: '/ui/components', label: m.nav.components },
      { path: '/ui/hooks', label: m.nav.hooks },
      { path: '/ui/helpers', label: m.nav.helpers },
      { path: '/ui/ai/chat', label: m.nav.aiChat },
      { path: '/ui/ai/generative-ui', label: m.nav.generativeUi },
      { path: '/ui/ai/agents', label: m.nav.aiAgents },
    ],
    external: [{ href: STORYBOOK_URL, label: 'Storybook' }],
  },
];

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: 'https://www.npmjs.com/search?q=%40k8ordo', label: 'npm' },
];

const linkClass =
  'text-fg-mute hover:text-fg-base text-sm transition-colors duration-150 ease-out';

export function Footer() {
  return (
    <footer className="border-border-mute bg-bg-base border-t">
      {/* パッケージが増えると列が増えるため、固定のグリッドではなく flex で並べる */}
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:justify-between md:gap-20 md:px-8">
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
            {m.footer.tagline()}
          </p>
        </div>
        <nav aria-label={m.footer.packages()} className="flex flex-col gap-3">
          <span className="text-fg-subtle text-xs font-bold tracking-normal">
            {m.footer.packages()}
          </span>
          <ul className="flex flex-col gap-2">
            {PACKAGE_LINKS.map((link) => (
              <li key={link.path}>
                <LocaleAnchor className={linkClass} path={link.path} unstyled>
                  {link.label}
                </LocaleAnchor>
              </li>
            ))}
          </ul>
        </nav>
        {SECTION_GROUPS.map((group) => (
          <nav
            aria-label={`${group.name} — ${m.footer.docs()}`}
            className="flex flex-col gap-3"
            key={group.name}
          >
            <span className="text-fg-subtle text-xs font-bold tracking-normal">
              {group.name}
            </span>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.path}>
                  <LocaleAnchor className={linkClass} path={link.path} unstyled>
                    {link.label()}
                  </LocaleAnchor>
                </li>
              ))}
              {group.external?.map((link) => (
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
        ))}
        <nav aria-label={m.footer.resources()} className="flex flex-col gap-3">
          <span className="text-fg-subtle text-xs font-bold tracking-normal">
            {m.footer.resources()}
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
          {m.footer.typesetting()}
        </p>
      </div>
    </footer>
  );
}
