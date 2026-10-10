import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerBindParams;

const LINKS = `import { bindParams } from '@k8ordo/router';

import { locales } from './i18n';

export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));`;

const USAGE = `import { href, navigateTo } from './links';

href('/:locale/products/:id', { id: '42' }); // '/ja/products/42'
href('/:locale', { locale: 'en' }); // '/en'
navigateTo('/:locale/products');`;

const OPTIONS = `navigateTo('/:locale', undefined, { history: 'replace' });
navigateTo('/:locale', { locale: 'en' }, { history: 'replace' });
navigateTo('/:locale', { history: 'replace' });`;

const MATCH = `import { useMatch } from '@k8ordo/router';

import { href } from '../links';

export function DocsLink() {
  const inDocs = useMatch('/:locale/docs/*') !== null;
  return (
    <a aria-current={inDocs ? 'page' : undefined} href={href('/:locale/docs')}>
      Docs
    </a>
  );
}`;

export default function RouterBindParamsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/bind-params">
      <DocSection id="bind" title={t.bindTitle}>
        <CodeBlock
          code={LINKS}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight', 7: 'highlight' }}
          title="src/links.ts"
        />
        <p>
          <Rich>{t.bindTakes()}</Rich>
        </p>
        <p>
          <Rich>{t.bindImport()}</Rich>
        </p>
      </DocSection>

      <DocSection id="usage" title={t.usageTitle}>
        <CodeBlock
          callouts={{ 4: t.usageOverrideCallout() }}
          code={USAGE}
          lang="ts"
          marks={{ 4: 'highlight' }}
        />
        <p>
          <Rich>{t.usagePattern()}</Rich>
        </p>
        <p>
          <Rich>{t.usageOverride()}</Rich>
        </p>
        <p>
          <Rich>{t.usageTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection id="locale" title={t.localeTitle}>
        <CodeBlock
          code={MATCH}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/components/docs-link.tsx"
        />
        <p>
          <Rich>{t.localeSource()}</Rich>
          <LocaleAnchor path="/:locale/i18n/routing">
            {m.i18n.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.localeMatch()}</Rich>
        </p>
      </DocSection>

      <DocSection id="source" title={t.sourceTitle}>
        <p>
          <Rich>{t.sourceEachCall()}</Rich>
        </p>
        <p>
          <Rich>{t.sourceOnce()}</Rich>
        </p>
        <p>
          <Rich>{t.sourceAgnostic()}</Rich>
        </p>
      </DocSection>

      <DocSection id="options" title={t.optionsTitle}>
        <CodeBlock
          callouts={{ 1: t.optionsUndefined(), 3: t.optionsSecond() }}
          code={OPTIONS}
          lang="ts"
          marks={{ 1: 'highlight', 3: 'highlight' }}
        />
        <p>
          <Rich>{t.optionsThird()}</Rich>
        </p>
        <p>
          <Rich>{t.optionsWhy()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.optionsPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
