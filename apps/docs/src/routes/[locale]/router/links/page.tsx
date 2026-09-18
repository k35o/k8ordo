import type { Message } from '@k8ordo/i18n';
import { Anchor, Code, Heading, Table } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { MatchPlayground } from './_parts/match-playground';

const HREF = `// src/product-links.tsx
import { href } from '@k8ordo/router';

export function ProductLinks({ id }: { id: string }) {
  return (
    <nav>
      <a href={href('/products')}>All products</a>
      <a href={href('/products/:id', { id })}>This product</a>
    </nav>
  );
}`;

const HREF_TYPE = `import { href } from '@k8ordo/router';

const path: \`/products/\${string}\` = href('/products/:id', { id: '42' });`;

const NAVIGATE = `import { navigateTo } from '@k8ordo/router';

navigateTo('/products/:id', { id: '42' });
navigateTo('/products/:id', { id: '42' }, { history: 'replace' });
navigateTo('/products');
navigateTo('/products', { history: 'replace' });`;

const OPEN_BUTTON = `// src/open-product-button.tsx
import { navigateTo } from '@k8ordo/router';
import { useState } from 'react';

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

export function OpenProductButton({ id }: { id: string }) {
  const [isOpening, setIsOpening] = useState(false);
  return (
    <button
      disabled={isOpening}
      onClick={async () => {
        setIsOpening(true);
        try {
          await navigateTo('/products/:id', { id }).finished;
        } catch (error) {
          if (!isAbort(error)) throw error;
        } finally {
          setIsOpening(false);
        }
      }}
      type="button"
    >
      {isOpening ? 'Opening…' : 'Open'}
    </button>
  );
}`;

const REGISTER = `// types/k8ordo-router.d.ts
import type { routes } from '../src/routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`;

const REGISTER_CHECKED = `import { href, matchPath } from '@k8ordo/router';

href('/products/:id', { id: '42' });
matchPath('/products/*', '/products/42');

// @ts-expect-error
href('/prodcuts/:id', { id: '42' });

// @ts-expect-error
matchPath('/about/*', '/about/team');`;

const BIND = `// src/links.ts
import { bindParams } from '@k8ordo/router';

import { locales } from './i18n';

export const { href, navigateTo } = bindParams(() => ({
  locale: locales.getLocale(),
}));`;

const BIND_USAGE = `import { href, navigateTo } from './links';

href('/:locale/products/:id', { id: '42' });
href('/:locale/products/:id', { locale: 'en', id: '42' });
navigateTo('/:locale', { locale: 'en' }, { history: 'replace' });
navigateTo('/:locale/products', undefined, { history: 'replace' });

// @ts-expect-error
navigateTo('/:locale/products', { history: 'replace' });`;

const PARAMS = `// src/pages/product-page.tsx
import { useParams } from '@k8ordo/router';

export function ProductPage() {
  const { id } = useParams('/products/:id');
  return <h1>Product {id}</h1>;
}`;

const ROUTE = `// src/breadcrumb.tsx
import { href, useRoute } from '@k8ordo/router';

export function Breadcrumb() {
  const { pattern, params } = useRoute();
  if (pattern !== '/products/:id') {
    return null;
  }
  return (
    <nav aria-label="Breadcrumb">
      <a href={href('/products')}>Products</a> / {params['id']}
    </nav>
  );
}`;

const NAV_LINK = `// src/products-nav-link.tsx
import { href, useMatch } from '@k8ordo/router';

export function ProductsNavLink() {
  const onIndex = useMatch('/products') !== null;
  const inSection = useMatch('/products/*', { inclusive: true }) !== null;
  return (
    <a
      aria-current={onIndex ? 'page' : inSection ? 'true' : undefined}
      href={href('/products')}
    >
      Products
    </a>
  );
}`;

const STATE_REGISTER = `// types/k8ordo.d.ts
import type { routes } from '../src/routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}

declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}`;

const ROUTE_OF = `import type { RouteOf } from '@k8ordo/router';

import type { routes } from './routes';

type AppPath = RouteOf<typeof routes>;`;

const USE_PARAMS_ERROR =
  'useParams("/products/:id") rendered under "/products"';

const USE_ROUTE_ERROR = 'useRoute must render inside a matched <Router>';

type CallRow = { call: string; result: string };

const HREF_ROWS: readonly CallRow[] = [
  { call: "href('/products')", result: "'/products'" },
  { call: "href('/products/:id', { id: 42 })", result: "'/products/42'" },
  { call: "href('/products/:id', { id: 'a/b' })", result: "'/products/a%2Fb'" },
  {
    call: "href('/:locale/products', { locale: 'en' })",
    result: "'/en/products'",
  },
];

const MATCH_ROWS: readonly CallRow[] = [
  {
    call: "matchPath('/products/:id', '/products/42')",
    result: "{ id: '42' }",
  },
  { call: "matchPath('/products/*', '/products/42')", result: '{}' },
  { call: "matchPath('/products/*', '/products')", result: 'null' },
  {
    call: "matchPath('/products/*', '/products', { inclusive: true })",
    result: '{}',
  },
  {
    call: "matchPath('/:locale/ui/*', '/ja/ui/components/button')",
    result: "{ locale: 'ja' }",
  },
];

const NORMALIZE_ROWS: readonly CallRow[] = [
  { call: '/products/', result: '/products' },
  { call: '/products///', result: '/products' },
  { call: '/', result: '/' },
  { call: '///', result: '/' },
  { call: '//products', result: '//products' },
  { call: '/caf%C3%A9/', result: '/caf%C3%A9' },
];

const HREF_ERRORS: ReadonlyArray<{ label: Message; error: string }> = [
  {
    label: m.routerLinks.hrefErrorWildcard,
    error: '"/:locale/*" is a wildcard — it has no href',
  },
  {
    label: m.routerLinks.hrefErrorMissing,
    error: '"/products/:id" needs a value for ":id"',
  },
  {
    label: m.routerLinks.hrefErrorSpelling,
    error: '"/products/:id" got a value for ":id" that has no URL spelling',
  },
];

const REGISTER_TYPE_ROWS: ReadonlyArray<{ name: string; meaning: Message }> = [
  {
    name: 'RegisteredPattern',
    meaning: m.routerLinks.registerTypesTable.registeredPattern,
  },
  {
    name: 'RegisteredNavigablePattern',
    meaning: m.routerLinks.registerTypesTable.registeredNavigablePattern,
  },
  {
    name: 'RegisteredParams<P>',
    meaning: m.routerLinks.registerTypesTable.registeredParams,
  },
  { name: 'ParamsOf<P>', meaning: m.routerLinks.registerTypesTable.paramsOf },
  { name: 'PathFor<P>', meaning: m.routerLinks.registerTypesTable.pathFor },
  { name: 'ParamValue', meaning: m.routerLinks.registerTypesTable.paramValue },
];

function CallTable({
  rows,
  head,
}: {
  rows: readonly CallRow[];
  head: readonly [Message, Message];
}) {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{head[0]()}</Table.HeaderCell>
          <Table.HeaderCell>{head[1]()}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.call}>
            <Table.Cell>
              <Code>{row.call}</Code>
            </Table.Cell>
            <Table.Cell>
              <Code>{row.result}</Code>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

const CALL_HEAD = [m.routerLinks.demo.call, m.routerLinks.demo.result] as const;

export default function RouterLinksPage() {
  return (
    <DocPage
      introduction={m.routerLinks.introduction}
      path="/:locale/router/links"
    >
      <DocSection
        description={m.routerLinks.hrefDescription}
        title={m.routerLinks.hrefTitle}
      >
        <CodeBlock code={HREF} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.hrefValues()}</Rich>
        </p>
        <CallTable head={CALL_HEAD} rows={HREF_ROWS} />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.hrefReturn()}</Rich>
        </p>
        <CodeBlock code={HREF_TYPE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.hrefErrors()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          {HREF_ERRORS.map((item) => (
            <li className="list-disc" key={item.error}>
              <span className="flex flex-col gap-1">
                <Rich>{item.label()}</Rich>
                <span className="break-all">
                  <Code>{item.error}</Code>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection
        description={m.routerLinks.noLinkDescription}
        title={m.routerLinks.noLinkTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.noLinkNotClaimed()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.navigateDescription}
        title={m.routerLinks.navigateTitle}
      >
        <CodeBlock code={NAVIGATE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.navigateOptions()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.navigateDefault()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/updates">
            @k8ordo/state
          </LocaleAnchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.navigateFinished()}</Rich>
        </p>
        <CodeBlock code={OPEN_BUTTON} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.navigateNoAction()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.navigateAbort()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/navigation">
            {m.router.navNavigation()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.registerDescription}
        title={m.routerLinks.registerTitle}
      >
        <CodeBlock code={REGISTER} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.registerEffect()}</Rich>
        </p>
        <CodeBlock code={REGISTER_CHECKED} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.registerFramework()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </p>
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerLinks.registerTypesTable.type()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerLinks.registerTypesTable.meaning()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {REGISTER_TYPE_ROWS.map((row) => (
              <Table.Row key={row.name}>
                <Table.Cell>
                  <Code>{row.name}</Code>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.meaning()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </DocSection>

      <DocSection
        description={m.routerLinks.bindDescription}
        title={m.routerLinks.bindTitle}
      >
        <CodeBlock code={BIND} lang="ts" />
        <p className="text-fg-mute text-sm">
          <Anchor
            href="https://github.com/k35o/k8ordo/blob/main/apps/docs/src/links.ts"
            openInNewTab
          >
            apps/docs/src/links.ts
          </Anchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.bindUsage()}</Rich>
        </p>
        <CodeBlock code={BIND_USAGE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.bindSource()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.bindPitfall()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.bindTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.paramsDescription}
        title={m.routerLinks.paramsTitle}
      >
        <CodeBlock code={PARAMS} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.paramsBelief()}</Rich>
        </p>
        <span className="break-all">
          <Code>{USE_PARAMS_ERROR}</Code>
        </span>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.paramsRoute()}</Rich>
        </p>
        <CodeBlock code={ROUTE} lang="tsx" />
        <span className="break-all">
          <Code>{USE_ROUTE_ERROR}</Code>
        </span>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.paramsFramework()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.pathnameDescription}
        title={m.routerLinks.pathnameTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.pathnameNoSearch()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.pathnameTiming()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.pathnameRaw()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.pathnameServer()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.matchDescription}
        title={m.routerLinks.matchTitle}
      >
        <CodeBlock code={NAV_LINK} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.matchWildcard()}</Rich>
        </p>
        <CallTable head={CALL_HEAD} rows={MATCH_ROWS} />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.matchPure()}</Rich>
        </p>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.routerLinks.demoTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerLinks.demoDescription()}</Rich>
          </p>
          <MatchPlayground />
        </div>
      </DocSection>

      <DocSection
        description={m.routerLinks.normalizeDescription}
        title={m.routerLinks.normalizeTitle}
      >
        <CallTable
          head={[
            m.routerLinks.normalizeTable.input,
            m.routerLinks.normalizeTable.output,
          ]}
          rows={NORMALIZE_ROWS}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.normalizeScope()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerLinks.stateDescription}
        title={m.routerLinks.stateTitle}
      >
        <CodeBlock code={STATE_REGISTER} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerLinks.stateRouteOf()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/integrations">
            @k8ordo/state
          </LocaleAnchor>
        </p>
        <CodeBlock code={ROUTE_OF} lang="ts" />
      </DocSection>
    </DocPage>
  );
}
