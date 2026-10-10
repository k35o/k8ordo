import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerBase;

const CONFIG = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/docs/',
  plugins: [react()],
});`;

const LINKS = `href('/products'); // '/docs/products'
href('/'); // '/docs/'`;

const READ = `// at /docs/products
usePathname(); // '/products'`;

const HELPERS = `withBase('/products'); // '/docs/products'
withoutBase('/docs/products'); // '/products'
withoutBase('/docs'); // '/'
withoutBase('/elsewhere'); // null
withBase('/products', '/docs/'); // '/docs/products'`;

export default function RouterBasePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/base">
      <DocSection id="config" title={t.configTitle}>
        <CodeBlock
          code={CONFIG}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.configRead()}</Rich>
        </p>
        <p>
          <Rich>{t.configTable()}</Rich>
        </p>
      </DocSection>

      <DocSection id="links" title={t.linksTitle}>
        <CodeBlock code={LINKS} lang="ts" />
        <p>
          <Rich>{t.linksPrefix()}</Rich>
        </p>
        <p>
          <Rich>{t.frameworkBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/deploy">
            {m.framework.navDeploy()}
          </LocaleAnchor>
          <Rich>{t.frameworkAfter()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.statePitfall()}</Rich>
            <LocaleAnchor path="/:locale/state/links">
              {m.state.navLinks()}
            </LocaleAnchor>
            <Rich>{t.statePitfallAfter()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="read" title={t.readTitle}>
        <CodeBlock code={READ} lang="ts" />
        <p>
          <Rich>{t.readPathname()}</Rich>
        </p>
        <p>
          <Rich>{t.readMatch()}</Rich>
        </p>
        <p>
          <Rich>{t.readOutside()}</Rich>
        </p>
      </DocSection>

      <DocSection id="helpers" title={t.helpersTitle}>
        <CodeBlock
          callouts={{ 5: t.helpersExplicitCallout() }}
          code={HELPERS}
          lang="ts"
          marks={{ 5: 'highlight' }}
        />
        <p>
          <Rich>{t.helpersSteps()}</Rich>
        </p>
        <p>
          <Rich>{t.helpersExplicit()}</Rich>
        </p>
        <p>
          <Rich>{t.helpersRelative()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
