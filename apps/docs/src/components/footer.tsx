'use client';

import { PACKAGES } from '../data/packages';
import * as m from '../messages';
import { LocaleAnchor } from './locale-anchor';

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: 'https://www.npmjs.com/search?q=%40k8ordo', label: 'npm' },
];

const linkClass =
  'text-fg-mute hover:text-fg-base text-sm transition-colors duration-150 ease-out';

export function Footer() {
  return (
    <footer className="border-border-mute bg-bg-base border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-20">
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
          <nav
            aria-label={m.footer.resources()}
            className="flex flex-col gap-3"
          >
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
        {/* パッケージごとに 1 列。見出しがランディングへのリンクを兼ねるので、
            パッケージだけを並べた列は持たない */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <nav
              aria-label={`${pkg.name} — ${m.footer.docs()}`}
              className="flex flex-col gap-3"
              key={pkg.path}
            >
              <LocaleAnchor
                className="text-fg-base text-sm font-medium"
                path={pkg.path}
                unstyled
              >
                {pkg.name}
              </LocaleAnchor>
              <ul className="flex flex-col gap-2">
                {pkg.sections.map((section) => (
                  <li key={section.path}>
                    <LocaleAnchor
                      className={linkClass}
                      path={section.path}
                      unstyled
                    >
                      {section.label()}
                    </LocaleAnchor>
                  </li>
                ))}
                {pkg.external?.map((link) => (
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
        </div>
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
