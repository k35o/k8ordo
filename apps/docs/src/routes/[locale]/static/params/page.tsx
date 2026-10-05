import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  paramsTypingSections,
  paramsUsingSections,
} from '../../../../components/framework-guide/params';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.staticParams;

const PATHS = `import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { listProductIds } from './src/routes/_data/catalog';

export default defineConfig({
  plugins: [
    framework({
      paths: async () => {
        const ids = await listProductIds();
        return ids.map((id) => \`/products/\${String(id)}\`);
      },
    }),
  ],
});`;

const LOCALES = `import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [framework({ paths: locales.paths })],
});`;

const PARTIAL = `const slugs = ['hello-world', 'second-post'];

framework({
  paths: (patterns) =>
    locales.paths(patterns).flatMap((pathname) =>
      pathname.endsWith('/:slug')
        ? slugs.map((slug) => pathname.replace(':slug', slug))
        : [pathname],
    ),
});`;

export default function StaticParamsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/params">
      {paramsTypingSections()}

      <DocSection
        description={t.pathsDescription}
        id="paths"
        title={t.pathsTitle}
      >
        <CodeBlock
          code={PATHS}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight', 11: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.pathsMissing()}</Rich>
        </p>
        <p>
          <Rich>{t.pathsForm()}</Rich>
        </p>
        <p>
          <Rich>{t.pathsRedirect()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.expandDescription}
        id="expand"
        title={t.expandTitle}
      >
        <p>
          <Rich>{t.expandSite()}</Rich>
        </p>
        <CodeBlock
          code={LOCALES}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.expandPartial()}</Rich>
        </p>
        <CodeBlock code={PARTIAL} lang="ts" title="vite.config.ts" />
      </DocSection>

      {paramsUsingSections('static')}

      <DocSection
        description={t.stopsDescription}
        id="stops"
        title={t.stopsTitle}
      >
        <ul>
          {t.stopsList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
