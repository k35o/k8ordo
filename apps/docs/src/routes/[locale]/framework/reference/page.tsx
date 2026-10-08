import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkReference;
const SERVER = '@k8ordo/framework/server';

const CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      paths: () => ['/products/1', '/products/2'],
      site: 'https://example.com',
    }),
  ],
});`;

const ROOT = `import {
  bindParams,
  href,
  isNotFound,
  matchPath,
  navigateTo,
  normalizePathname,
  notFound,
  useMatch,
  usePathname,
  usePendingPathname,
  withBase,
} from '@k8ordo/framework';
import type {
  BoundLinks,
  BoundParams,
  ErrorProps,
  LayoutProps,
  MatchablePattern,
  MatchOptions,
  NavigateToOptions,
  PageProps,
  RegisteredNavigablePattern,
  RegisteredPageParams,
  RegisteredParams,
  RegisteredPattern,
  RouteContext,
} from '@k8ordo/framework';`;

const COOKIES = `cookies().get('session');
cookies().set('session', token, { maxAge: 60 * 60 * 24 });
cookies().delete('session');`;

const SERVE = `import { serve } from '@k8ordo/framework/serve';

const server = await serve({ port: 3000 });
console.log(server.url);`;

const VERCEL = `import { framework } from '@k8ordo/framework/vite';
import { vercel } from '@k8ordo/framework/vercel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'server' }), vercel()],
});`;

type RouteFile = { id: string; name: string; items: readonly Message[] };

/** A file name in code font, the same in every locale. */
const named =
  (name: string): Message =>
  () =>
    `\`${name}\``;

const FILES: readonly RouteFile[] = [
  {
    id: 'page-tsx',
    name: 'page.tsx',
    items: [t.pageDefault, t.pageRequest, t.pageSchema, t.pageSearch],
  },
  {
    id: 'layout-tsx',
    name: 'layout.tsx',
    items: [t.layoutDefault, t.pageRequest, t.layoutSchema],
  },
  {
    id: 'not-found-tsx',
    name: 'not-found.tsx',
    items: [t.notFoundDefault, t.pageRequest, t.notFoundNote],
  },
  {
    id: 'error-tsx',
    name: 'error.tsx',
    items: [t.errorDirective, t.errorDefault],
  },
  { id: 'loading-tsx', name: 'loading.tsx', items: [t.loadingDefault] },
  {
    id: 'redirect-ts',
    name: 'redirect.ts',
    items: [t.redirectDefault, t.redirectNote],
  },
  {
    id: 'route-ts',
    name: 'route.ts',
    items: [t.routeMethods, t.routeSchema, t.routeNote],
  },
  { id: 'guard-ts', name: 'guard.ts', items: [t.guardDefault] },
];

export default function FrameworkReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/reference">
      <DocSection id="entries" title={t.entriesTitle}>
        <p>
          <Rich>{t.entriesDescription()}</Rich>
        </p>
        <ul>
          {t.entriesList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <ApiEntry
        caveats={t.frameworkCaveats}
        from="@k8ordo/framework/vite"
        id="framework"
        name="framework"
        params={[
          {
            name: 'options.mode',
            type: "'static' | 'server'",
            description: t.frameworkMode,
          },
          {
            name: 'options.routesDir',
            type: 'string',
            description: t.frameworkRoutesDir,
          },
          {
            name: 'options.paths',
            type: '(patterns: readonly string[]) => readonly string[] | Promise<readonly string[]>',
            description: t.frameworkPaths,
          },
          {
            name: 'options.site',
            type: 'string',
            description: t.frameworkSite,
          },
          {
            name: 'options.csp',
            type: 'Readonly<Record<string, readonly string[]>>',
            description: t.frameworkCsp,
          },
        ]}
        returns={{ type: 'PluginOption[]', description: t.frameworkReturns }}
        signature="framework(options: FrameworkOptions): PluginOption[]"
        summary={t.frameworkSummary}
      >
        <CodeBlock code={CONFIG} lang="ts" title="vite.config.ts" />
      </ApiEntry>

      <DocSection id="files" title={t.filesTitle}>
        <p>
          <Rich>{t.filesDescription()}</Rich>
        </p>
        {FILES.map((file) => (
          <DocSubsection id={file.id} key={file.id} title={named(file.name)}>
            <ul>
              {file.items.map((item) => (
                <li key={item()}>
                  <Rich>{item()}</Rich>
                </li>
              ))}
            </ul>
          </DocSubsection>
        ))}
      </DocSection>

      <DocSection id="root" title={t.rootTitle}>
        <CodeBlock code={ROOT} lang="ts" />
        <p>
          <Rich>{t.rootDescription()}</Rich>
          <LocaleAnchor path="/:locale/router/reference">
            {m.router.navReference()}
          </LocaleAnchor>
          <Rich>{t.rootLinkTail()}</Rich>
        </p>
      </DocSection>

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
            type: '(name: string, scope?: CookieScope) => void',
            description: t.cookiesDelete,
          },
        ]}
        from={SERVER}
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
        from={SERVER}
        id="cookie-options"
        name="CookieOptions"
        signature={`type CookieOptions = {
  readonly path?: string;
  readonly domain?: string;
  readonly maxAge?: number;
  readonly expires?: Date;
  readonly httpOnly?: boolean;
  readonly secure?: boolean;
  readonly sameSite?: 'strict' | 'lax' | 'none';
};`}
        summary={t.cookieOptionsSummary}
      />

      <ApiEntry
        caveats={t.responseHeadersCaveats}
        from={SERVER}
        id="response-headers"
        name="responseHeaders"
        signature="responseHeaders(): Headers"
        summary={t.responseHeadersSummary}
      />

      <ApiEntry
        caveats={t.requestHeadersCaveats}
        from={SERVER}
        id="request-headers"
        name="requestHeaders"
        signature="requestHeaders(): Headers"
        summary={t.requestHeadersSummary}
      />

      <ApiEntry
        caveats={t.redirectCaveats}
        from={SERVER}
        id="redirect"
        name="redirect"
        params={[{ name: 'to', type: 'string', description: t.redirectTo }]}
        returns={{ type: 'never', description: t.redirectReturns }}
        signature="redirect(to: string): never"
        summary={t.redirectSummary}
      />

      <ApiEntry
        caveats={t.nonceCaveats}
        from={SERVER}
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
        from={SERVER}
        id="guard"
        name="Guard"
        signature={`type Guard<P extends string = string> = (
  context: GuardContext<P>,
) => Response | void | Promise<Response | void>;`}
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
        from={SERVER}
        id="route-request"
        name="RouteRequest"
        signature={`type RouteRequest = {
  readonly headers: Headers;
  readonly cookies: ReadonlyMap<string, string>;
};`}
        summary={t.routeRequestSummary}
      />

      <ApiEntry
        from={SERVER}
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
        from="@k8ordo/framework/serve"
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
        from="@k8ordo/framework/vercel"
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
