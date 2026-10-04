'use client';

import * as m from '../messages';

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: 'https://www.npmjs.com/search?q=%40k8ordo', label: 'npm' },
];

/** `wide`: サイドバーのあるページでは、枠を画面いっぱいに広げる。 */
export function Footer({ wide }: { wide: boolean }) {
  const frame = wide ? '' : ' mx-auto max-w-6xl';
  return (
    <footer className="border-border-mute bg-page border-t">
      <div
        className={`flex flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-8${frame}`}
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
        className={`border-border-subtle flex flex-wrap items-baseline justify-between gap-4 border-t px-6 py-4 md:px-8${frame}`}
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
