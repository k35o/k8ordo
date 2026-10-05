'use client';

import * as m from '../messages';
import { FRAME } from './frame';

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: 'https://www.npmjs.com/search?q=%40k8ordo', label: 'npm' },
];

export function Footer() {
  return (
    <footer className="border-border-mute bg-page border-t">
      <div
        className={`${FRAME} flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between`}
      >
        <div className="flex flex-col gap-2">
          <span className="flex items-baseline gap-1">
            <span className="font-m-plus-2 font-palt text-fg-base font-bold">
              k8ordo
            </span>
            <span
              aria-hidden
              className="bg-primary-border inline-block size-1.5 rounded-full"
            />
          </span>
          <p className="text-fg-mute break-phrase text-sm">
            {m.footer.tagline()}
          </p>
        </div>
        <nav aria-label={m.footer.resources()}>
          <ul className="flex gap-6">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="text-fg-mute hover:text-fg-base text-sm transition-colors duration-150 ease-out"
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
      <div
        className={`${FRAME} border-border-subtle flex flex-wrap items-baseline justify-between gap-4 border-t py-4`}
      >
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
