import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  baseSection,
  tabsSection,
} from '../../../../components/framework-guide/deploy';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.staticDeploy;

const OUTPUT = `dist/
  client/
    index.html
    index.rsc
    products/
      index.html
      index.rsc
      1/
        index.html
        index.rsc
    old/
      index.html
    404.html
    sitemap.xml
    assets/
  rsc/
  ssr/`;

const LOG = 'k8ordo: wrote 4 routes and 404.html and sitemap.xml';

const DOWNLOAD = '<a download href="/report.csv">Report</a>';

const SITE = `import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      paths: () => ['/products/1'],
      site: 'https://example.com',
    }),
  ],
});`;

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc></url>
  <url><loc>https://example.com/products</loc></url>
  <url><loc>https://example.com/products/1</loc></url>
</urlset>`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function StaticDeployPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/deploy">
      <DocSection
        description={t.outputDescription}
        id="output"
        title={t.outputTitle}
      >
        <CodeBlock code={OUTPUT} lang="text" />
        <Items items={t.outputList} />
        <p>
          <Rich>{t.outputLog()}</Rich>
        </p>
        <CodeBlock code={LOG} lang="text" title="vite build" />
      </DocSection>

      <DocSection
        description={t.arriveDescription}
        id="arrive"
        title={t.arriveTitle}
      >
        <p>
          <Rich>{t.arriveNavigate()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.hostDescription} id="host" title={t.hostTitle}>
        <Items items={t.hostList} />
        <p>
          <Rich>{t.hostUnknown()}</Rich>
        </p>
        <p>
          <Rich>{t.hostDownload()}</Rich>
        </p>
        <CodeBlock code={DOWNLOAD} lang="html" />
        <Note>
          <p>
            <Rich>{t.hostStatus()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.notFoundDescription}
        id="not-found"
        title={t.notFoundTitle}
      >
        <p>
          <Rich>{t.notFoundHydrate()}</Rich>
        </p>
        <p>
          <Rich>{t.notFoundSite()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.sitemapDescription}
        id="sitemap"
        title={t.sitemapTitle}
      >
        <CodeBlock
          code={SITE}
          lang="ts"
          marks={{ 8: 'highlight' }}
          title="vite.config.ts"
        />
        <CodeBlock code={SITEMAP} lang="xml" title="dist/client/sitemap.xml" />
        <p>
          <Rich>{t.sitemapNone()}</Rich>
        </p>
      </DocSection>

      {tabsSection('static')}
      {baseSection('static')}
    </DocPage>
  );
}
