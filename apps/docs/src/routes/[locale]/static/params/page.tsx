import { Code } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { ParamsGuide } from '../../../../components/framework-guide/params';
import {
  Cell,
  GuideTable,
  Paragraph,
  Row,
} from '../../../../components/framework-guide/prose';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const PATHS = `// vite.config.ts
import { readFile } from 'node:fs/promises';

import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

type Product = { id: number };

export default defineConfig({
  plugins: [
    framework({
      paths: async () => {
        const products = JSON.parse(
          await readFile('data/products.json', 'utf8'),
        ) as Product[];
        return products.map(
          (product) => \`/products/\${String(product.id)}\`,
        );
      },
    }),
  ],
});`;

const EXPAND = `// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      paths: (patterns) =>
        patterns.flatMap((pattern) => {
          const segments = pattern.split('/');
          if (!segments.includes(':locale')) return [pattern];
          return ['ja', 'en'].map((locale) =>
            segments
              .map((segment) => (segment === ':locale' ? locale : segment))
              .join('/'),
          );
        }),
    }),
  ],
});`;

const SITE_CONFIG = `// vite.config.ts
import { framework } from '@k8ordo/static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [
    framework({
      site: 'https://ordo.k8o.me',
      paths: locales.paths,
    }),
    tailwindcss(),
  ],
});`;

const PARTIAL = `// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

const slugs = ['hello-world', 'second-post'];

export default defineConfig({
  plugins: [
    framework({
      paths: (patterns) =>
        locales
          .paths(patterns)
          .flatMap((pathname) => {
            const segments = pathname.split('/');
            if (!segments.includes(':slug')) return [pathname];
            return slugs.map((slug) =>
              segments
                .map((segment) => (segment === ':slug' ? slug : segment))
                .join('/'),
            );
          }),
    }),
  ],
});`;

const STOPS = [
  {
    when: m.staticParams.stopsTable.unresolved,
    error:
      'static build needs pathnames for /products/:id — supply them with the "paths" option',
  },
  {
    when: m.staticParams.stopsTable.unusable,
    error: 'the "paths" option supplied pathnames no route wants: /produtcs/2',
  },
  {
    when: m.staticParams.stopsTable.refused,
    error:
      'the "paths" option supplied pathnames a params schema refused: /products/shoes',
  },
  {
    when: m.staticParams.stopsTable.malformed,
    error:
      'the "paths" option supplied a pathname with a malformed escape: /products/%zz',
  },
  {
    when: m.staticParams.stopsTable.leaves,
    error:
      'the "paths" option supplied a pathname that leaves the output: /products/..%2F..',
  },
];

export default function StaticParamsPage() {
  const t = m.staticParams;
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/params">
      <ParamsGuide mode="static" />

      <DocSection description={t.pathsDescription} title={t.pathsTitle}>
        <CodeBlock code={PATHS} lang="ts" />
        <Paragraph text={t.pathsTaken} />
        <Paragraph text={t.pathsRedirects} />
      </DocSection>

      <DocSection description={t.expandDescription} title={t.expandTitle}>
        <CodeBlock code={EXPAND} lang="ts" />
        <Paragraph text={t.expandSite} />
        <CodeBlock code={SITE_CONFIG} lang="ts" />
        <Paragraph text={t.expandPartial} />
        <CodeBlock code={PARTIAL} lang="ts" />
      </DocSection>

      <DocSection description={t.stopsDescription} title={t.stopsTitle}>
        <GuideTable head={[t.stopsTable.when, t.stopsTable.error]}>
          {STOPS.map((stop) => (
            <Row key={stop.error}>
              <Cell>
                <Rich>{stop.when()}</Rich>
              </Cell>
              <Cell>
                <Code>{stop.error}</Code>
              </Cell>
            </Row>
          ))}
        </GuideTable>
      </DocSection>
    </DocPage>
  );
}
