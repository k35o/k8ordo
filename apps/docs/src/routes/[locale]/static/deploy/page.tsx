import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { BaseGuide } from '../../../../components/framework-guide/base';
import {
  Bullet,
  Bullets,
  Cell,
  GuideTable,
  Paragraph,
  Row,
} from '../../../../components/framework-guide/prose';
import { SITE_SHELL } from '../../../../components/framework-guide/site-samples';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const DEFAULT_ROUTES_DIR = "'src/routes'";

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

const LOG = `k8ordo: wrote 4 routes and 404.html and sitemap.xml`;

const TWO_NOT_FOUND = `a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares /docs/*, /*`;

const SITE = `// vite.config.ts
import { framework } from '@k8ordo/static';
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

const ROUTES_DIR = `// vite.config.ts
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ routesDir: 'app/routes' })],
});`;

export default function StaticDeployPage() {
  const t = m.staticDeploy;
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/deploy">
      <DocSection description={t.outputDescription} title={t.outputTitle}>
        <CodeBlock code={OUTPUT} lang="bash" />
        <Paragraph text={t.outputLog} />
        <CodeBlock code={LOG} lang="bash" />
      </DocSection>

      <DocSection description={t.arriveDescription} title={t.arriveTitle}>
        <Paragraph text={t.arrivePath} />
      </DocSection>

      <DocSection description={t.hostDescription} title={t.hostTitle}>
        <Bullets>
          <Bullet>
            <Rich>{t.hostIndex()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.hostRsc()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.host404()}</Rich>
          </Bullet>
        </Bullets>
        <Paragraph text={t.hostUnknown} />
        <Paragraph text={t.hostDownload} />
      </DocSection>

      <DocSection description={t.notFoundDescription} title={t.notFoundTitle}>
        <Paragraph text={t.notFoundOne} />
        <CodeBlock code={TWO_NOT_FOUND} lang="bash" />
        <Paragraph text={t.notFoundParams} />
        <Paragraph text={t.notFoundSite} />
        <CodeBlock code={SITE_SHELL} lang="tsx" />
        <Paragraph text={t.notFoundNone} />
      </DocSection>

      <BaseGuide mode="static" />

      <DocSection description={t.sitemapDescription} title={t.sitemapTitle}>
        <CodeBlock code={SITE} lang="ts" />
        <CodeBlock code={SITEMAP} lang="md" />
        <Paragraph text={t.sitemapDetails} />
      </DocSection>

      <DocSection description={t.optionsDescription} title={t.optionsTitle}>
        <GuideTable
          head={[
            t.optionsTable.option,
            t.optionsTable.defaultValue,
            t.optionsTable.meaning,
          ]}
        >
          <Row>
            <Cell nowrap>
              <Code>routesDir</Code>
            </Cell>
            <Cell nowrap>
              <Code>{DEFAULT_ROUTES_DIR}</Code>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.routesDir()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <LocaleAnchor path="/:locale/static/params">
                <Code>paths</Code>
              </LocaleAnchor>
            </Cell>
            <Cell nowrap>
              <Rich>{t.optionsTable.none()}</Rich>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.paths()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>site</Code>
            </Cell>
            <Cell nowrap>
              <Rich>{t.optionsTable.none()}</Rich>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.site()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <CodeBlock code={ROUTES_DIR} lang="ts" />
      </DocSection>

      <DocSection description={t.stopsDescription} title={t.stopsTitle}>
        <Bullets>
          <Bullet>
            <Rich>{t.stopsGrammar()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/routing">
              {m.static.navRouting()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsPaths()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/params">
              {m.static.navParams()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsAsyncSchema()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/params">
              {m.static.navParams()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsNotFound()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/errors">
              {m.static.navErrors()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsRedirectTarget()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/errors">
              {m.static.navErrors()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsActions()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/get-started">
              {m.nav.getStarted()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsThrow()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/errors">
              {m.static.navErrors()}
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <Rich>{t.stopsServerOnly()}</Rich> —{' '}
            <LocaleAnchor path="/:locale/static/boundaries">
              {m.static.navBoundaries()}
            </LocaleAnchor>
          </Bullet>
        </Bullets>
      </DocSection>

      <DocSection description={t.cannotDescription} title={t.cannotTitle}>
        <Paragraph text={t.cannotServer}>
          <LocaleAnchor path="/:locale/server">@k8ordo/server</LocaleAnchor>
        </Paragraph>
      </DocSection>
    </DocPage>
  );
}
