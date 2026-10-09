import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkDeploy;

const STATIC_OUTPUT = `dist/
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
  ssr/
  package.json`;

const LOG = 'k8ordo: wrote 4 routes and 404.html and sitemap.xml';

const DOWNLOAD = '<a download href="/report.csv">Report</a>';

const SITE = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
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

const REDIRECTS = `# @k8ordo/framework: built URLs the rules below would also catch
/posts/1 /posts/1 200
/posts/1/index.rsc /posts/1/index.rsc 200
/posts/2 /posts/2 200
/posts/2/index.rsc /posts/2/index.rsc 200
# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell
/posts/:p1 /posts/!fallback/ 200
/posts/:p1/index.rsc /posts/!fallback/index.rsc 200`;

const STATIC_VERCEL = `import { framework } from '@k8ordo/framework/vite';
import { vercel } from '@k8ordo/framework/vercel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'static' }), vercel()],
});`;

const PREVIEW = `vite build
vite preview`;

const SERVER_OUTPUT = `dist/
  server.js
  package.json
  rsc/
    index.js
  ssr/
  client/
    assets/
      index-1a2b.js
      index-1a2b.js.br
      index-1a2b.js.gz`;

const START = 'PORT=8080 HOST=0.0.0.0 node dist/server.js';

const EXTERNAL = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'server' })],
  environments: {
    rsc: { resolve: { external: ['better-sqlite3'] } },
  },
});`;

const SERVE = `import { serve } from '@k8ordo/framework/serve';

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

const VERCEL = `import { framework } from '@k8ordo/framework/vite';
import { vercel } from '@k8ordo/framework/vercel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'server' }), vercel()],
});`;

const BASE = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/docs/',
  plugins: [framework({ mode: 'static' })],
});`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function FrameworkDeployPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/deploy">
      <DocSection id="static" title={t.staticTitle}>
        <p>
          <Rich>{t.staticLead()}</Rich>
        </p>
        <DocSubsection id="output" title={t.outputTitle}>
          <CodeBlock code={STATIC_OUTPUT} lang="text" />
          <Items items={t.outputList} />
          <p>
            <Rich>{t.outputPayload()}</Rich>
            <LocaleAnchor path="/:locale/framework/how-it-works">
              {m.framework.navHowItWorks()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
          <p>
            <Rich>{t.outputServe()}</Rich>
          </p>
          <CodeBlock code={LOG} lang="text" title="vite build" />
          <p>
            <Rich>{t.outputLog()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="host" title={t.hostTitle}>
          <p>
            <Rich>{t.hostRequire()}</Rich>
          </p>
          <Items items={t.hostList} />
          <p>
            <Rich>{t.hostUnknown()}</Rich>
          </p>
          <Note>
            <p>
              <Rich>{t.hostStatus()}</Rich>
            </p>
          </Note>
        </DocSubsection>
        <DocSubsection id="download" title={t.downloadTitle}>
          <CodeBlock code={DOWNLOAD} lang="html" />
          <p>
            <Rich>{t.hostDownload()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="not-found" title={t.notFoundTitle}>
          <p>
            <Rich>{t.notFoundOnce()}</Rich>
          </p>
          <p>
            <Rich>{t.notFoundHydrate()}</Rich>
          </p>
          <p>
            <Rich>{t.notFoundSite()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="sitemap" title={t.sitemapTitle}>
          <CodeBlock
            code={SITE}
            lang="ts"
            marks={{ 9: 'highlight' }}
            title="vite.config.ts"
          />
          <CodeBlock
            code={SITEMAP}
            lang="xml"
            title="dist/client/sitemap.xml"
          />
          <p>
            <Rich>{t.sitemapWrite()}</Rich>
          </p>
          <p>
            <Rich>{t.sitemapNone()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="redirects" title={t.redirectsTitle}>
          <CodeBlock
            code={REDIRECTS}
            lang="text"
            title="dist/client/_redirects"
          />
          <p>
            <Rich>{t.redirectsWrite()}</Rich>
            <LocaleAnchor path="/:locale/framework/params">
              {m.framework.navParams()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
          <p>
            <Rich>{t.redirectsBuilt()}</Rich>
          </p>
          <p>
            <Rich>{t.redirectsOwn()}</Rich>
          </p>
          <p>
            <Rich>{t.redirectsBase()}</Rich>
          </p>
          <Note>
            <p>
              <Rich>{t.redirectsAssets()}</Rich>
            </p>
          </Note>
        </DocSubsection>
        <DocSubsection id="cloudflare" title={t.cloudflareTitle}>
          <p>
            <Rich>{t.cloudflareWorkers()}</Rich>
          </p>
          <p>
            <Rich>{t.cloudflareNotFound()}</Rich>
          </p>
          <p>
            <Rich>{t.cloudflareLimits()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="static-vercel" title={t.staticVercelTitle}>
          <CodeBlock code={STATIC_VERCEL} lang="ts" title="vite.config.ts" />
          <p>
            <Rich>{t.staticVercelOutput()}</Rich>
          </p>
          <p>
            <Rich>{t.staticVercelWarn()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="other-hosts" title={t.otherHostsTitle}>
          <p>
            <Rich>{t.otherHostsRules()}</Rich>
          </p>
          <Items items={t.otherHostsList} />
          <p>
            <Rich>{t.otherHostsMore()}</Rich>
          </p>
          <p>
            <Rich>{t.otherHostsPages()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="preview" title={t.localTitle}>
          <CodeBlock code={PREVIEW} lang="bash" />
          <p>
            <Rich>{t.localPreview()}</Rich>
          </p>
          <p>
            <Rich>{t.localFiles()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="server" title={t.serverTitle}>
        <p>
          <Rich>{t.serverLead()}</Rich>
        </p>
        <DocSubsection id="server-output" title={t.serverOutputTitle}>
          <CodeBlock code={SERVER_OUTPUT} lang="text" />
          <p>
            <Rich>{t.outputHandler()}</Rich>
          </p>
          <Items items={t.serverOutputList} />
          <p>
            <Rich>{t.outputDeps()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="start" title={t.startTitle}>
          <CodeBlock code={START} lang="bash" />
          <p>
            <Rich>{t.startRun()}</Rich>
          </p>
          <Items items={t.startEnv} />
          <p>
            <Rich>{t.startStop()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="external" title={t.externalTitle}>
          <CodeBlock
            code={EXTERNAL}
            lang="ts"
            marks={{ 7: 'highlight' }}
            title="vite.config.ts"
          />
          <p>
            <Rich>{t.externalWhy()}</Rich>
          </p>
          <p>
            <Rich>{t.externalInstall()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="serve" title={t.serveTitle}>
          <CodeBlock code={SERVE} lang="js" title="serve.js" />
          <p>
            <Rich>{t.serveRun()}</Rich>
          </p>
          <Items items={t.serveOptions} />
          <p>
            <Rich>{t.serveReturn()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="answers" title={t.answersTitle}>
          <p>
            <Rich>{t.answersFiles()}</Rich>
          </p>
          <Items items={t.answersList} />
          <p>
            <Rich>{t.answersSafe()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="handler" title={t.handlerTitle}>
          <CodeBlock code={HANDLER} lang="js" title="render.js" />
          <p>
            <Rich>{t.handlerExport()}</Rich>
          </p>
          <CodeBlock code={RUNTIMES} lang="js" />
          <p>
            <Rich>{t.handlerRuntime()}</Rich>
          </p>
          <CodeBlock code={WRANGLER} lang="json" title="wrangler.jsonc" />
          <p>
            <Rich>{t.handlerFiles()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.handlerNode()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
        <DocSubsection id="proxy" title={t.proxyTitle}>
          <p>
            <Rich>{t.proxyOrigin()}</Rich>
            <LocaleAnchor path="/:locale/framework/actions">
              {m.framework.navActions()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
          <p>
            <Rich>{t.proxyServe()}</Rich>
          </p>
          <p>
            <Rich>{t.proxyBuild()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="vercel" title={t.vercelTitle}>
          <CodeBlock code={VERCEL} lang="ts" title="vite.config.ts" />
          <p>
            <Rich>{t.vercelOutput()}</Rich>
          </p>
          <p>
            <Rich>{t.vercelFunction()}</Rich>
          </p>
          <p>
            <Rich>{t.vercelBundle()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="tabs" title={t.tabsTitle}>
        <p>
          <Rich>{t.tabsScript()}</Rich>
        </p>
        <p>
          <Rich>{t.tabsReload()}</Rich>
        </p>
        <p>
          <Rich>{t.tabsMode()}</Rich>
        </p>
      </DocSection>

      <DocSection id="base" title={t.baseTitle}>
        <CodeBlock
          code={BASE}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.baseConfig()}</Rich>
        </p>
        <Items items={[...t.baseList, t.baseRedirect]} />
        <p>
          <Rich>{t.baseStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.baseServer()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.baseRefused()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
