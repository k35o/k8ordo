import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  filesSection,
  routerSection,
} from '../../../../components/framework-guide/reference';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.serverReference;
const RUNTIME = '@k8ordo/server/runtime';

const CONFIG = `import { framework } from '@k8ordo/server';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework()] });`;

const COOKIES = `cookies().get('session');
cookies().set('session', token, { maxAge: 60 * 60 * 24 });
cookies().delete('session');`;

const SERVE = `import { serve } from '@k8ordo/server/serve';

const server = await serve({ port: 3000 });
console.log(server.url);`;

const VERCEL = `import { framework } from '@k8ordo/server';
import { vercel } from '@k8ordo/server/vercel';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework(), vercel()] });`;

export default function ServerReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/reference">
      <DocSection
        description={t.entriesDescription}
        id="entries"
        title={t.entriesTitle}
      >
        <ul>
          {t.entriesList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <ApiEntry
        from="@k8ordo/server"
        id="framework"
        name="framework"
        params={[
          {
            name: 'options.routesDir',
            type: 'string',
            description: t.frameworkRoutesDir,
          },
        ]}
        returns={{ type: 'PluginOption[]', description: t.frameworkReturns }}
        signature="framework(options?: ServerOptions): PluginOption[]"
        summary={t.frameworkSummary}
      >
        <CodeBlock code={CONFIG} lang="ts" title="vite.config.ts" />
      </ApiEntry>

      {filesSection('server')}
      {routerSection()}

      <ApiEntry
        caveats={t.cookiesCaveats}
        fields={[
          {
            name: 'get',
            type: '(name: string) => string | undefined',
            description: t.cookiesGet,
          },
          {
            name: 'has',
            type: '(name: string) => boolean',
            description: t.cookiesHas,
          },
          {
            name: 'set',
            type: '(name: string, value: string, options?: CookieOptions) => void',
            description: t.cookiesSet,
          },
          {
            name: 'delete',
            type: '(name: string, scope?: { path?: string; domain?: string }) => void',
            description: t.cookiesDelete,
          },
        ]}
        from={RUNTIME}
        id="cookies"
        name="cookies"
        signature="cookies(): Cookies"
        summary={t.cookiesSummary}
      >
        <CodeBlock code={COOKIES} lang="ts" />
      </ApiEntry>

      <ApiEntry
        fields={[
          { name: 'path', type: 'string', description: t.cookieOptionsPath },
          {
            name: 'domain',
            type: 'string',
            description: t.cookieOptionsDomain,
          },
          {
            name: 'maxAge',
            type: 'number',
            description: t.cookieOptionsMaxAge,
          },
          {
            name: 'expires',
            type: 'Date',
            description: t.cookieOptionsExpires,
          },
          {
            name: 'httpOnly',
            type: 'boolean',
            description: t.cookieOptionsHttpOnly,
          },
          {
            name: 'secure',
            type: 'boolean',
            description: t.cookieOptionsSecure,
          },
          {
            name: 'sameSite',
            type: "'strict' | 'lax' | 'none'",
            description: t.cookieOptionsSameSite,
          },
        ]}
        from={RUNTIME}
        id="cookie-options"
        name="CookieOptions"
        signature={`type CookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};`}
        summary={t.cookieOptionsSummary}
      />

      <ApiEntry
        caveats={t.responseHeadersCaveats}
        from={RUNTIME}
        id="response-headers"
        name="responseHeaders"
        signature="responseHeaders(): Headers"
        summary={t.responseHeadersSummary}
      />

      <ApiEntry
        caveats={t.requestHeadersCaveats}
        from={RUNTIME}
        id="request-headers"
        name="requestHeaders"
        signature="requestHeaders(): Headers"
        summary={t.requestHeadersSummary}
      />

      <ApiEntry
        caveats={t.redirectCaveats}
        from={RUNTIME}
        id="redirect"
        name="redirect"
        params={[{ name: 'to', type: 'string', description: t.redirectTo }]}
        returns={{ type: 'never', description: t.redirectReturns }}
        signature="redirect(to: string): never"
        summary={t.redirectSummary}
      />

      <ApiEntry
        caveats={t.nonceCaveats}
        from={RUNTIME}
        id="nonce"
        name="nonce"
        signature="nonce(): string"
        summary={t.nonceSummary}
      />

      <ApiEntry
        fields={[
          { name: 'request', type: 'Request', description: t.guardRequest },
          {
            name: 'params',
            type: 'ParamsOf<P>',
            description: t.guardParams,
          },
        ]}
        from={RUNTIME}
        id="guard"
        name="Guard"
        signature={`type Guard<P extends string = string> = (context: {
  request: Request;
  params: ParamsOf<P>;
}) => Response | void | Promise<Response | void>;`}
        summary={t.guardSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'headers',
            type: 'Headers',
            description: t.routeRequestHeaders,
          },
          {
            name: 'cookies',
            type: 'ReadonlyMap<string, string>',
            description: t.routeRequestCookies,
          },
        ]}
        from={RUNTIME}
        id="route-request"
        name="RouteRequest"
        signature={`type RouteRequest = {
  headers: Headers;
  cookies: ReadonlyMap<string, string>;
};`}
        summary={t.routeRequestSummary}
      />

      <ApiEntry
        from={RUNTIME}
        id="redirect-target"
        name="RedirectTarget"
        signature={`type RedirectTarget =
  | string
  | { to: string; permanent?: boolean };`}
        summary={t.redirectTargetSummary}
      />

      <ApiEntry
        caveats={t.serveCaveats}
        fields={[
          { name: 'port', type: 'number', description: t.servePortField },
          { name: 'url', type: 'string', description: t.serveUrl },
          {
            name: 'close',
            type: '() => Promise<void>',
            description: t.serveClose,
          },
        ]}
        from="@k8ordo/server/serve"
        id="serve"
        name="serve"
        params={[
          { name: 'options.dist', type: 'string', description: t.serveDist },
          { name: 'options.port', type: 'number', description: t.servePort },
          { name: 'options.host', type: 'string', description: t.serveHost },
        ]}
        returns={{ type: 'Promise<Server>', description: t.serveReturns }}
        signature="serve(options?: ServeOptions): Promise<Server>"
        summary={t.serveSummary}
      >
        <CodeBlock code={SERVE} lang="ts" title="serve.js" />
      </ApiEntry>

      <ApiEntry
        caveats={t.vercelCaveats}
        from="@k8ordo/server/vercel"
        id="vercel"
        name="vercel"
        returns={{ type: 'Plugin', description: t.vercelReturns }}
        signature="vercel(): Plugin"
        summary={t.vercelSummary}
      >
        <CodeBlock code={VERCEL} lang="ts" title="vite.config.ts" />
      </ApiEntry>
    </DocPage>
  );
}
