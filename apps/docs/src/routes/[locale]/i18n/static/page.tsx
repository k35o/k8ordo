import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nStatic;

const CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [framework({ mode: 'static', paths: locales.paths })],
});`;

const PATHS = `locales.paths(['/:locale', '/:locale/about']);
// ['/ja', '/en', '/ja/about', '/en/about']`;

const SLUGS = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';
import { readSlugs } from './src/posts';

const expandSlugs = async (paths: string[]) => {
  const slugs = await readSlugs();
  return paths.flatMap((path) =>
    path.includes('/:slug')
      ? slugs.map((slug) => path.replace('/:slug', \`/\${slug}\`))
      : [path],
  );
};

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      paths: (patterns) => expandSlugs(locales.paths(patterns)),
    }),
  ],
});`;

const NOT_FOUND = `'use client';

import * as m from '../../messages';

export default function NotFound() {
  return (
    <main>
      <h1>{m.notFound.title()}</h1>
      <p>{m.notFound.description()}</p>
    </main>
  );
}`;

export default function I18nStaticPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/static">
      <DocSection
        description={t.pathsDescription}
        id="paths"
        title={t.pathsTitle}
      >
        <CodeBlock
          code={CONFIG}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="vite.config.ts"
        />
        <CodeBlock code={PATHS} lang="ts" />
        <p>
          <Rich>{t.pathsSegment()}</Rich>
        </p>
        <p>
          <Rich>{t.pathsRequest()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.otherDescription}
        id="other-params"
        title={t.otherTitle}
      >
        <p>
          <Rich>{t.otherError()}</Rich>
        </p>
        <CodeBlock
          code={SLUGS}
          lang="ts"
          marks={{ 20: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.otherExpand()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.notFoundDescription}
        id="not-found"
        title={t.notFoundTitle}
      >
        <p>
          <Rich>{t.notFoundSentinel()}</Rich>
        </p>
        <p>
          <Rich>{t.notFoundAfresh()}</Rich>
        </p>
        <p>
          <Rich>{t.notFoundClient()}</Rich>
        </p>
        <CodeBlock
          code={NOT_FOUND}
          lang="tsx"
          marks={{ 1: 'highlight' }}
          title="routes/[locale]/not-found.tsx"
        />
        <p>
          <Rich>{t.notFoundLang()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.notFoundServer()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
