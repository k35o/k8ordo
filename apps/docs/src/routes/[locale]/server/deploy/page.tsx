import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { BaseGuide } from '../../../../components/framework-guide/base';
import {
  Cell,
  GuideTable,
  Paragraph,
  Row,
} from '../../../../components/framework-guide/prose';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const DEFAULT_DIST = "'dist'";
const DEFAULT_HOST = "'localhost'";

const OUTPUT = `dist/
  rsc/
    index.js
  ssr/
  client/
    assets/`;

const SERVE = `// serve.js
import { serve } from '@k8ordo/server/serve';

await serve({ port: 3000, host: '0.0.0.0' });`;

const SMOKE = `// scripts/smoke.js
import { serve } from '@k8ordo/server/serve';

const server = await serve({ dist: 'dist', port: 0 });
const response = await fetch(\`\${server.url}/products/1\`);
console.log(response.status);
await server.close();`;

const HANDLER = `// render.js
import handler from './dist/rsc/index.js';

const response = await handler(
  new Request('https://example.com/products/1'),
);
console.log(response.status, response.headers.get('content-type'));`;

const RUNTIMES = `// Deno
Deno.serve(handler);

// Bun
Bun.serve({ fetch: handler });

// Cloudflare Workers — worker.js
export default { fetch: handler };`;

const WRANGLER = `// wrangler.jsonc
{
  "main": "worker.js",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "dist/client" }
}`;

const ROUTES_DIR = `// vite.config.ts
import { framework } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ routesDir: 'app/routes' })],
});`;

export default function ServerDeployPage() {
  const t = m.serverDeploy;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/deploy">
      <DocSection description={t.outputDescription} title={t.outputTitle}>
        <CodeBlock code={OUTPUT} lang="bash" />
        <Paragraph text={t.outputDeps} />
      </DocSection>

      <DocSection description={t.serveDescription} title={t.serveTitle}>
        <CodeBlock code={SERVE} lang="ts" />
        <GuideTable
          head={[
            t.optionsTable.option,
            t.optionsTable.defaultValue,
            t.optionsTable.meaning,
          ]}
        >
          <Row>
            <Cell nowrap>
              <Code>dist</Code>
            </Cell>
            <Cell nowrap>
              <Code>{DEFAULT_DIST}</Code>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.dist()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>port</Code>
            </Cell>
            <Cell nowrap>
              <Code>3000</Code>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.port()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>host</Code>
            </Cell>
            <Cell nowrap>
              <Code>{DEFAULT_HOST}</Code>
            </Cell>
            <Cell>
              <Rich>{t.optionsTable.host()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <GuideTable head={[t.handleTable.field, t.handleTable.meaning]}>
          <Row>
            <Cell nowrap>
              <Code>port</Code>
            </Cell>
            <Cell>
              <Rich>{t.handleTable.port()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>url</Code>
            </Cell>
            <Cell>
              <Rich>{t.handleTable.url()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>close()</Code>
            </Cell>
            <Cell>
              <Rich>{t.handleTable.close()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <Paragraph text={t.serveTest} />
        <CodeBlock code={SMOKE} lang="ts" />
      </DocSection>

      <DocSection description={t.answersFiles} title={t.answersTitle}>
        <Paragraph text={t.answersHandler} />
        <Paragraph text={t.answersSafe} />
        <Paragraph text={t.answersStatuses}>
          <LocaleAnchor path="/:locale/server/errors">
            {m.server.navErrors()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>

      <DocSection description={t.handlerDescription} title={t.handlerTitle}>
        <CodeBlock code={HANDLER} lang="ts" />
        <Paragraph text={t.handlerRuntimes} />
        <CodeBlock code={RUNTIMES} lang="ts" />
        <Paragraph text={t.handlerImports} />
        <Paragraph text={t.handlerFiles} />
        <CodeBlock code={WRANGLER} lang="json" />
        <Paragraph text={t.handlerMethods} />
        <Paragraph text={t.handlerOrigin} />
      </DocSection>

      <BaseGuide mode="server" />

      <DocSection description={t.routesDirDescription} title={t.routesDirTitle}>
        <CodeBlock code={ROUTES_DIR} lang="ts" />
      </DocSection>
    </DocPage>
  );
}
