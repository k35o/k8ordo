import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
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

const HELPERS = `withBase('/products'); // '/docs/products'
withoutBase('/docs/products'); // '/products'
withoutBase('/docs'); // '/'
withoutBase('/elsewhere'); // null`;

const EXPLICIT = "withBase('/products', '/docs/'); // '/docs/products'";

export default function RouterBasePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/base">
      <DocSection
        description={t.configDescription}
        id="config"
        title={t.configTitle}
      >
        <CodeBlock
          code={CONFIG}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.configTable()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.linksDescription}
        id="links"
        title={t.linksTitle}
      >
        <CodeBlock code={LINKS} lang="ts" />
        <p>
          <Rich>{t.linksString()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.frameworkNote()}</Rich>
          </p>
        </Note>
        <Pitfall>
          <p>
            <Rich>{t.statePitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.readDescription}
        id="read"
        title={t.readTitle}
      >
        <p>
          <Rich>{t.readCompare()}</Rich>
        </p>
        <p>
          <Rich>{t.readOutside()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.helpersDescription}
        id="helpers"
        title={t.helpersTitle}
      >
        <CodeBlock code={HELPERS} lang="ts" />
        <p>
          <Rich>{t.helpersNull()}</Rich>
        </p>
        <p>
          <Rich>{t.helpersExplicit()}</Rich>
        </p>
        <CodeBlock code={EXPLICIT} lang="ts" />
        <p>
          <Rich>{t.helpersRelative()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
