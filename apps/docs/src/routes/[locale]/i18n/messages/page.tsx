import type { Message } from '@k8ordo/i18n';
import { Code, Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const s = m.i18nMessages;

const NAV = `// src/messages/nav.ts
import { message } from '@k8ordo/i18n';

export const home = message({ ja: 'ホーム', en: 'Home' });

export const search = message({ ja: '検索', en: 'Search' });`;

const CART = `// src/messages/cart.ts
import { message } from '@k8ordo/i18n';

import { locales } from '../i18n';

export const items = message({
  ja: (count: number) => \`\${String(count)} 件\`,
  en: (count) =>
    \`\${String(count)} \${locales.pluralRules().select(count) === 'one' ? 'item' : 'items'}\`,
});

export const updated = message({
  ja: (date: Date) =>
    \`\${locales.dateTimeFormat({ dateStyle: 'long' }).format(date)} 更新\`,
  en: (date) =>
    \`Updated \${locales.dateTimeFormat({ dateStyle: 'long' }).format(date)}\`,
});`;

const NAV_LIST = `// src/components/nav-list.tsx
import type { Message } from '@k8ordo/i18n';

export type NavItem = { href: string; label: Message };

export function NavList({ items }: { items: readonly NavItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href}>{item.label()}</a>
        </li>
      ))}
    </ul>
  );
}`;

const LOCALE_NAMES = `// src/locale-names.ts
import type { Variants } from '@k8ordo/i18n';

export const LOCALE_NAMES: Variants<string> = {
  ja: '日本語',
  en: 'English',
};`;

const FROZEN = `// src/data/menu.ts
import * as m from '../messages';

export const MENU_LABELS = [m.nav.home(), m.nav.search()];`;

const KEPT = `// src/data/menu.ts
import type { Message } from '@k8ordo/i18n';

import * as m from '../messages';

export const MENU_LABELS: readonly Message[] = [m.nav.home, m.nav.search];`;

const INDEX = `// src/messages/index.ts
export * as nav from './nav';
export * as cart from './cart';
export * as 'static' from './static';`;

const HEADER = `// src/components/header.tsx
import * as m from '../messages';

export function Header() {
  return (
    <header>
      <a href="/">{m.nav.home()}</a>
      <span>{m.static.title()}</span>
    </header>
  );
}`;

const PASS_STRING_PAGE = `// src/routes/[locale]/share/page.tsx
import * as m from '../../../messages';
import { CopyLink } from './_parts/copy-link';

export default function SharePage() {
  return <CopyLink copied={m.share.copied()} label={m.share.copyLink()} />;
}`;

const PASS_STRING_CLIENT = `// src/routes/[locale]/share/_parts/copy-link.tsx
'use client';

import { useState } from 'react';

export function CopyLink({ copied, label }: { copied: string; label: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(location.href).then(() => {
          setDone(true);
        });
      }}
      type="button"
    >
      {done ? copied : label}
    </button>
  );
}`;

const IMPORT_CLIENT = `// src/routes/[locale]/share/_parts/copy-link.tsx
'use client';

import { useState } from 'react';

import * as m from '../../../../messages';

export function CopyLink() {
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(location.href).then(() => {
          setDone(true);
        });
      }}
      type="button"
    >
      {done ? m.share.copied() : m.share.copyLink()}
    </button>
  );
}`;

const CHECKS: ReadonlyArray<{ code: string; reason: Message }> = [
  { code: "message({ ja: 'ホーム' })", reason: s.checks.missing },
  {
    code: "message({ ja: 'ホーム', en: 'Home', fr: 'Accueil' })",
    reason: s.checks.extra,
  },
  {
    code: "message({ ja: '件数', en: () => 'Items' })",
    reason: s.checks.mixed,
  },
  {
    code: 'message({ ja: (count: number) => …, en: (count: string) => … })',
    reason: s.checks.parameters,
  },
  { code: "nav.home('x')", reason: s.checks.textArgument },
  { code: "cart.items('3')", reason: s.checks.wrongArgument },
];

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TR = 'border-border-mute border-b';

export default function I18nMessagesPage() {
  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/messages">
      <DocSection description={s.text.description} title={s.text.title}>
        <CodeBlock code={NAV} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.text.fallback()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.values.description} title={s.values.title}>
        <CodeBlock code={CART} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.values.grammar()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.values.why()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.values.annotate()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.values.noMix()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.values.timeZone()}</Rich>
          </li>
        </ul>
        <p>
          <LocaleAnchor path="/:locale/i18n/formatting">
            {s.values.formattingLink()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.types.description} title={s.types.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.types.props()}</Rich>
        </p>
        <CodeBlock code={NAV_LIST} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.types.variants()}</Rich>
        </p>
        <CodeBlock code={LOCALE_NAMES} lang="ts" />
      </DocSection>

      <DocSection description={s.checks.description} title={s.checks.title}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.checks.codeColumn()}</th>
                <th className={TH}>{s.checks.reasonColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {CHECKS.map((row) => (
                <tr className={TR} key={row.code}>
                  <td className="py-3 pr-6 align-top">
                    <Code>{row.code}</Code>
                  </td>
                  <td className="py-3">
                    <Rich>{row.reason()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.checks.diagnostic()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.checks.beforeRegister()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.checks.runtime()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.renderTime.description}
        title={s.renderTime.title}
      >
        <Heading level="h3">
          <Rich>{s.renderTime.frozenTitle()}</Rich>
        </Heading>
        <CodeBlock code={FROZEN} lang="ts" />
        <Heading level="h3">
          <Rich>{s.renderTime.keptTitle()}</Rich>
        </Heading>
        <CodeBlock code={KEPT} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.renderTime.other()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/i18n/integrations">
            <Rich>{s.renderTime.formLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={s.where.description} title={s.where.title}>
        <CodeBlock code={INDEX} lang="ts" />
        <CodeBlock code={HEADER} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.where.reserved()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.where.groups()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.where.site()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.boundary.description} title={s.boundary.title}>
        <Heading level="h3">
          <Rich>{s.boundary.stringTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.boundary.stringDescription()}</Rich>
        </p>
        <CodeBlock code={PASS_STRING_PAGE} lang="tsx" />
        <CodeBlock code={PASS_STRING_CLIENT} lang="tsx" />
        <Heading level="h3">
          <Rich>{s.boundary.importTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.boundary.importDescription()}</Rich>
        </p>
        <CodeBlock code={IMPORT_CLIENT} lang="tsx" />
        <Heading level="h3">
          <Rich>{s.boundary.sharedTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.boundary.sharedDescription()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.bundle.description} title={s.bundle.title}>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.bundle.client()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.bundle.server()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.bundle.dictionary()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.bundle.measure()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
