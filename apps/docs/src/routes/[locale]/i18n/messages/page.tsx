import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nMessages;

const NAV = `import { message } from '@k8ordo/i18n';

export const home = message({ ja: 'ホーム', en: 'Home' });

export const search = message({ ja: '検索', en: 'Search' });`;

const MISSING = `export const save = message({ ja: '保存' });`;

const CART = `import { message } from '@k8ordo/i18n';

export const added = message({
  ja: (name: string) => \`\${name}をカートに入れました\`,
  en: (name) => \`Added \${name} to your cart\`,
});`;

const CALL = `import { added } from '../messages/cart';

added('Lamp');
added(3);`;

const HEADER = `import { home, search } from '../messages/nav';

export function Header() {
  return (
    <nav>
      <a href="/">{home()}</a>
      <a href="/search">{search()}</a>
    </nav>
  );
}`;

const MENU = `import type { Message } from '@k8ordo/i18n';

import { home, search } from '../messages/nav';

export const MENU = [home(), search()];
export const MENU: readonly Message[] = [home, search];`;

const NAV_LIST = `import type { Message } from '@k8ordo/i18n';

type NavItem = { href: string; label: Message };

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

const SHARE_SECTION = `import { copied, copyLink } from '../messages/share';
import { CopyLink } from './copy-link';

export function ShareSection() {
  return <CopyLink copied={copied()} label={copyLink()} />;
}`;

const COPY_LINK_PROPS = `'use client';

import { useState } from 'react';

type Props = { copied: string; label: string };

export function CopyLink({ copied, label }: Props) {
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

const COPY_LINK_IMPORT = `'use client';

import { useState } from 'react';

import { copied, copyLink } from '../messages/share';

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
      {done ? copied() : copyLink()}
    </button>
  );
}`;

export default function I18nMessagesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/messages">
      <DocSection id="text" title={t.textTitle}>
        <CodeBlock code={NAV} lang="ts" title="src/messages/nav.ts" />
        <p>
          <Rich>{t.textKeys()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 1: t.textMissingCallout() }}
          code={MISSING}
          lang="ts"
        />
        <p>
          <Rich>{t.textCheck()}</Rich>
        </p>
        <p>
          <Rich>{t.textNoLocale()}</Rich>
          <LocaleAnchor path="/:locale/i18n/locales">
            {m.i18n.navLocales()}
          </LocaleAnchor>
          <Rich>{t.linkAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="values" title={t.valuesTitle}>
        <CodeBlock
          code={CART}
          lang="ts"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="src/messages/cart.ts"
        />
        <p>
          <Rich>{t.valuesFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.valuesTemplate()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 4: t.valuesCallout() }}
          code={CALL}
          lang="ts"
          title="src/lib/cart-notice.ts"
        />
        <p>
          <Rich>{t.valuesFormatBefore()}</Rich>
          <LocaleAnchor path="/:locale/i18n/formatting">
            {m.i18n.navFormatting()}
          </LocaleAnchor>
          <Rich>{t.linkAfter()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.valuesUntyped()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="where" title={t.whereTitle}>
        <CodeBlock
          code={HEADER}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="src/components/header.tsx"
        />
        <p>
          <Rich>{t.whereIndex()}</Rich>
        </p>
        <p>
          <Rich>{t.whereNear()}</Rich>
        </p>
      </DocSection>

      <DocSection id="render" title={t.renderTitle}>
        <CodeBlock
          code={MENU}
          lang="ts"
          marks={{ 5: 'remove', 6: 'add' }}
          title="src/lib/menu.ts"
        />
        <p>
          <Rich>{t.renderFixed()}</Rich>
        </p>
        <p>
          <Rich>{t.renderWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.renderKeep()}</Rich>
        </p>
      </DocSection>

      <DocSection id="props" title={t.propsTitle}>
        <CodeBlock
          code={NAV_LIST}
          lang="tsx"
          marks={{ 3: 'highlight', 10: 'highlight' }}
          title="src/components/nav-list.tsx"
        />
        <p>
          <Rich>{t.propsType()}</Rich>
        </p>
        <p>
          <Rich>{t.propsArgs()}</Rich>
        </p>
      </DocSection>

      <DocSection id="boundary" title={t.boundaryTitle}>
        <p>
          <Rich>{t.boundaryRule()}</Rich>
        </p>
        <DocSubsection id="pass-string" title={t.boundaryStringTitle}>
          <CodeBlock
            code={SHARE_SECTION}
            lang="tsx"
            marks={{ 5: 'highlight' }}
            title="src/components/share-section.tsx"
          />
          <CodeBlock
            code={COPY_LINK_PROPS}
            lang="tsx"
            title="src/components/copy-link.tsx"
          />
          <p>
            <Rich>{t.boundaryString()}</Rich>
          </p>
          <Note>
            <p>
              <Rich>{t.boundaryMeasure()}</Rich>
            </p>
          </Note>
        </DocSubsection>
        <DocSubsection id="import" title={t.boundaryImportTitle}>
          <CodeBlock
            code={COPY_LINK_IMPORT}
            lang="tsx"
            marks={{ 5: 'highlight', 19: 'highlight' }}
            title="src/components/copy-link.tsx"
          />
          <p>
            <Rich>{t.boundaryImport()}</Rich>
          </p>
          <p>
            <Rich>{t.boundaryImportFit()}</Rich>
          </p>
          <p>
            <Rich>{t.boundaryMoreBefore()}</Rich>
            <LocaleAnchor path="/:locale/i18n/how-it-works">
              {m.i18n.navHowItWorks()}
            </LocaleAnchor>
            <Rich>{t.linkAfter()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="shared" title={t.boundarySharedTitle}>
          <p>
            <Rich>{t.boundaryShared()}</Rich>
          </p>
          <p>
            <Rich>{t.boundarySharedUse()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>
    </DocPage>
  );
}
