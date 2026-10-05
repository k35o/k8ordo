import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  baseSection,
  tabsSection,
} from '../../../../components/framework-guide/deploy';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverDeploy;

const OUTPUT = `dist/
  rsc/
    index.js
  ssr/
  client/
    assets/
      index-1a2b.js
      index-1a2b.js.br
      index-1a2b.js.gz`;

const SERVE = `import { serve } from '@k8ordo/server/serve';

const server = await serve({ port: 3000, host: '0.0.0.0' });
console.log(server.url);`;

const HANDLER = `import handler from './dist/rsc/index.js';

const response = await handler(
  new Request('https://example.com/products/1'),
);
console.log(response.status);`;

const RUNTIMES = `// Deno
Deno.serve(handler);

// Bun
Bun.serve({ fetch: handler });

// Cloudflare Workers
export default { fetch: handler };`;

const WRANGLER = `{
  "main": "worker.js",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "dist/client" }
}`;

const VERCEL = `import { framework } from '@k8ordo/server';
import { vercel } from '@k8ordo/server/vercel';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework(), vercel()] });`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function ServerDeployPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/deploy">
      <DocSection
        description={t.outputDescription}
        id="output"
        title={t.outputTitle}
      >
        <CodeBlock code={OUTPUT} lang="text" />
        <Items items={t.outputList} />
        <p>
          <Rich>{t.outputDeps()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serveDescription}
        id="serve"
        title={t.serveTitle}
      >
        <CodeBlock code={SERVE} lang="js" title="serve.js" />
        <Items items={t.serveOptions} />
        <p>
          <Rich>{t.serveTest()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.answersDescription}
        id="answers"
        title={t.answersTitle}
      >
        <Items items={t.answersList} />
        <p>
          <Rich>{t.answersSafe()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.handlerDescription}
        id="handler"
        title={t.handlerTitle}
      >
        <CodeBlock code={HANDLER} lang="js" title="render.js" />
        <p>
          <Rich>{t.handlerRuntime()}</Rich>
        </p>
        <CodeBlock code={RUNTIMES} lang="js" />
        <p>
          <Rich>{t.handlerFiles()}</Rich>
        </p>
        <CodeBlock code={WRANGLER} lang="json" title="wrangler.jsonc" />
        <p>
          <Rich>{t.handlerTogether()}</Rich>
        </p>
        <p>
          <Rich>{t.handlerNode()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.proxyDescription}
        id="proxy"
        title={t.proxyTitle}
      >
        <p>
          <Rich>{t.proxyServe()}</Rich>
        </p>
        <p>
          <Rich>{t.proxyBuild()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.vercelDescription}
        id="vercel"
        title={t.vercelTitle}
      >
        <CodeBlock code={VERCEL} lang="ts" title="vite.config.ts" />
        <p>
          <Rich>{t.vercelOutput()}</Rich>
        </p>
        <p>
          <Rich>{t.vercelBundle()}</Rich>
        </p>
      </DocSection>

      {tabsSection('server')}
      {baseSection('server')}
    </DocPage>
  );
}
