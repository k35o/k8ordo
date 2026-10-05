import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
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

const CALL = `cart.added('Lamp');
cart.added(3);`;

const INDEX = `export * as nav from './nav';
export * as cart from './cart';`;

const HEADER = `import * as m from '../messages';

export function Header() {
  return <a href="/">{m.nav.home()}</a>;
}`;

const MENU = `import type { Message } from '@k8ordo/i18n';

import * as m from '../messages';

export const MENU = [m.nav.home(), m.nav.search()];
export const MENU: readonly Message[] = [m.nav.home, m.nav.search];`;

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

const SHARE_PAGE = `import * as m from '../../../messages';
import { CopyLink } from './_parts/copy-link';

export default function SharePage() {
  return (
    <CopyLink copied={m.share.copied()} label={m.share.copyLink()} />
  );
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

export default function I18nMessagesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/messages">
      <DocSection description={t.textDescription} id="text" title={t.textTitle}>
        <CodeBlock code={NAV} lang="ts" title="messages/nav.ts" />
        <p>
          <Rich>{t.textCheck()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 1: t.textMissingCallout() }}
          code={MISSING}
          lang="ts"
        />
        <p>
          <Rich>{t.textNoLocale()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.valuesDescription}
        id="values"
        title={t.valuesTitle}
      >
        <CodeBlock
          code={CART}
          lang="ts"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="messages/cart.ts"
        />
        <p>
          <Rich>{t.valuesTemplate()}</Rich>
        </p>
        <CodeBlock callouts={{ 2: t.valuesCallout() }} code={CALL} lang="ts" />
        <p>
          <Rich>{t.valuesFormat()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.valuesPitfall()}</Rich>
          </p>
        </Pitfall>
        <Note>
          <p>
            <Rich>{t.valuesUntyped()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.whereDescription}
        id="where"
        title={t.whereTitle}
      >
        <CodeBlock code={INDEX} lang="ts" title="messages/index.ts" />
        <CodeBlock
          code={HEADER}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="header.tsx"
        />
        <p>
          <Rich>{t.whereNear()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.whereReserved()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.renderDescription}
        id="render"
        title={t.renderTitle}
      >
        <CodeBlock
          code={MENU}
          lang="ts"
          marks={{ 5: 'remove', 6: 'add' }}
          title="data/menu.ts"
        />
        <p>
          <Rich>{t.renderWhy()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.propsDescription}
        id="props"
        title={t.propsTitle}
      >
        <CodeBlock
          code={NAV_LIST}
          lang="tsx"
          marks={{ 3: 'highlight', 10: 'highlight' }}
          title="nav-list.tsx"
        />
        <p>
          <Rich>{t.propsArgs()}</Rich>
        </p>
        <p>
          <Rich>{t.propsSite()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.boundaryDescription}
        id="boundary"
        title={t.boundaryTitle}
      >
        <DocSubsection id="pass-string" title={t.boundaryStringTitle}>
          <p>
            <Rich>{t.boundaryString()}</Rich>
          </p>
          <CodeBlock
            code={SHARE_PAGE}
            lang="tsx"
            marks={{ 6: 'highlight' }}
            title="routes/[locale]/share/page.tsx"
          />
          <CodeBlock
            code={COPY_LINK_PROPS}
            lang="tsx"
            title="routes/[locale]/share/_parts/copy-link.tsx"
          />
        </DocSubsection>
        <DocSubsection id="import" title={t.boundaryImportTitle}>
          <p>
            <Rich>{t.boundaryImport()}</Rich>
          </p>
          <CodeBlock
            code={COPY_LINK_IMPORT}
            lang="tsx"
            marks={{ 5: 'highlight', 19: 'highlight' }}
            title="routes/[locale]/share/_parts/copy-link.tsx"
          />
          <p>
            <Rich>{t.boundaryMore()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="shared" title={t.boundarySharedTitle}>
          <p>
            <Rich>{t.boundaryShared()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>
    </DocPage>
  );
}
