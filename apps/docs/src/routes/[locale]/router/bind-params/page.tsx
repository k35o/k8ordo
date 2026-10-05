import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
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

export default function RouterBindParamsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/bind-params">
      <DocSection
        description={t.bindDescription}
        id="bind"
        title={t.bindTitle}
      >
        <CodeBlock
          code={LINKS}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight', 7: 'highlight' }}
          title="src/links.ts"
        />
        <p>
          <Rich>{t.bindSite()}</Rich>
        </p>
        <p>
          <Rich>{t.bindImport()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.usageDescription}
        id="usage"
        title={t.usageTitle}
      >
        <CodeBlock code={USAGE} lang="ts" />
        <p>
          <Rich>{t.usageOverride()}</Rich>
        </p>
        <p>
          <Rich>{t.usageTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.sourceDescription}
        id="source"
        title={t.sourceTitle}
      >
        <p>
          <Rich>{t.sourceCurrent()}</Rich>
        </p>
        <p>
          <Rich>{t.sourceAgnostic()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.optionsDescription}
        id="options"
        title={t.optionsTitle}
      >
        <CodeBlock
          callouts={{ 3: t.optionsSecond() }}
          code={OPTIONS}
          lang="ts"
        />
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
