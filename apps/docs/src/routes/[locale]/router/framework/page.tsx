import type { Message } from '@k8ordo/i18n';
import { Code, Heading, Table } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const SECTION_NAV = `// src/routes/_parts/section-nav.tsx
'use client';

import { href, useMatch, usePathname } from '@k8ordo/router';

export function SectionNav() {
  const pathname = usePathname();
  const inProducts = useMatch('/products/*', { inclusive: true }) !== null;
  return (
    <nav>
      <a aria-current={pathname === '/' ? 'page' : undefined} href={href('/')}>
        Home
      </a>
      <a
        aria-current={inProducts ? 'true' : undefined}
        href={href('/products')}
      >
        Products
      </a>
    </nav>
  );
}`;

const PAGE = `// src/routes/products/[id]/page.tsx
import { href } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return (
    <article>
      <h1>Product {params.id}</h1>
      <a href={href('/products/:id', { id: params.id + 1 })}>Next product</a>
    </article>
  );
}`;

const LAYOUT = `// src/routes/products/layout.tsx
import type { LayoutProps } from '@k8ordo/router';

export default function ProductsLayout({ children }: LayoutProps<'/products'>) {
  return (
    <section>
      <h1>Products</h1>
      {children}
    </section>
  );
}`;

const REQUEST = `// src/routes/page.tsx
import type { PageProps } from '@k8ordo/router';

export default function HomePage({ request }: PageProps<'/'>) {
  return <p>{request.headers.get('accept-language') ?? '-'}</p>;
}`;

const REGISTER_GEN = `// .k8ordo/register.gen.ts
import type { ParsedParamsMap } from '@k8ordo/router';
import type { paramSchemas, routes } from './routes.gen';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
    params: ParsedParamsMap<typeof paramSchemas>;
  }
}

declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}`;

const TYPED_LINK = `import { href } from '@k8ordo/router';

href('/products/:id', { id: 42 });

// @ts-expect-error
href('/products/:id', { id: '42' });`;

const ROOT_LAYOUT = `// src/routes/layout.tsx
import type { LayoutProps } from '@k8ordo/router';
import { ViewTransition } from 'react';

import { SectionNav } from './_parts/section-nav';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <SectionNav />
        <ViewTransition
          default="none"
          update={{ navigation: 'auto', default: 'none' }}
        >
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}`;

const TSCONFIG = `{
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"]
}`;

const USE_PATHNAME_ERROR =
  'usePathname needs <Router> above it, or a page rendered by @k8ordo/static or @k8ordo/server';

type CompareRow = { api: string; client: Message; framework: Message };

const COMPARE_ROWS: readonly CompareRow[] = [
  {
    api: 'defineRoutes',
    client: m.routerFramework.compareTable.handWritten,
    framework: m.routerFramework.compareTable.generatedTable,
  },
  {
    api: '<Router> / <Outlet />',
    client: m.routerFramework.compareTable.mountYourself,
    framework: m.routerFramework.compareTable.notUsed,
  },
  {
    api: 'href / navigateTo / bindParams',
    client: m.routerFramework.compareTable.mountYourself,
    framework: m.routerFramework.compareTable.sameTyped,
  },
  {
    api: 'usePathname / useMatch / matchPath / normalizePathname',
    client: m.routerFramework.compareTable.mountYourself,
    framework: m.routerFramework.compareTable.same,
  },
  {
    api: 'useParams / useRoute',
    client: m.routerFramework.compareTable.readParams,
    framework: m.routerFramework.compareTable.paramsProp,
  },
  {
    api: 'Register',
    client: m.routerFramework.compareTable.registerHand,
    framework: m.routerFramework.compareTable.registerGenerated,
  },
  {
    api: 'ErrorComponent',
    client: m.routerFramework.compareTable.errorKey,
    framework: m.routerFramework.compareTable.errorFile,
  },
  {
    api: 'PathnameProvider / NavigationGeneration / useInterceptedNavigation',
    client: m.routerFramework.compareTable.mountedByRouter,
    framework: m.routerFramework.compareTable.mountedByRuntime,
  },
  {
    api: 'PageProps / LayoutProps',
    client: m.routerFramework.compareTable.notApplicable,
    framework: m.routerFramework.compareTable.routeFileProps,
  },
];

const SCHEMA_TYPE_ROWS: ReadonlyArray<{ name: string; meaning: Message }> = [
  {
    name: 'ParsedParams<Pattern, Schemas>',
    meaning: m.routerFramework.schemaTypesTable.parsedParams,
  },
  {
    name: 'ParsedParamsMap<Schemas>',
    meaning: m.routerFramework.schemaTypesTable.parsedParamsMap,
  },
  {
    name: 'ParamsSchemaFor<Pattern>',
    meaning: m.routerFramework.schemaTypesTable.paramsSchemaFor,
  },
  {
    name: 'StandardSchemaLike<Output>',
    meaning: m.routerFramework.schemaTypesTable.standardSchemaLike,
  },
  {
    name: 'SchemaOutput<Schema>',
    meaning: m.routerFramework.schemaTypesTable.schemaOutput,
  },
  {
    name: 'RegisteredPageParams<P>',
    meaning: m.routerFramework.schemaTypesTable.registeredPageParams,
  },
];

export default function RouterFrameworkPage() {
  return (
    <DocPage
      introduction={m.routerFramework.introduction}
      path="/:locale/router/framework"
    >
      <DocSection
        description={m.routerFramework.noTableDescription}
        title={m.routerFramework.noTableTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.noTableNavigation()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/navigation">
            {m.router.navNavigation()}
          </LocaleAnchor>
        </p>
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerFramework.compareTable.api()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Rich>{m.routerFramework.compareTable.client()}</Rich>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Rich>{m.routerFramework.compareTable.framework()}</Rich>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {COMPARE_ROWS.map((row) => (
              <Table.Row key={row.api}>
                <Table.Cell>
                  <Code>{row.api}</Code>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.client()}</Rich>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.framework()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </DocSection>

      <DocSection
        description={m.routerFramework.locationDescription}
        title={m.routerFramework.locationTitle}
      >
        <CodeBlock code={SECTION_NAV} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.locationServerComponent()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.locationThisSite()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/links">
            {m.router.navLinks()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerFramework.propsDescription}
        title={m.routerFramework.propsTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.propsPage()}</Rich>
        </p>
        <CodeBlock code={PAGE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.propsLayout()}</Rich>
        </p>
        <CodeBlock code={LAYOUT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.propsRequest()}</Rich>
        </p>
        <CodeBlock code={REQUEST} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.propsInline()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.propsNotFound()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerFramework.schemaDescription}
        title={m.routerFramework.schemaTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.schemaLinks()}</Rich>
        </p>
        <CodeBlock code={TYPED_LINK} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.schemaGenerated()}</Rich>
        </p>
        <CodeBlock code={REGISTER_GEN} lang="ts" />
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerFramework.schemaTypesTable.type()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerFramework.schemaTypesTable.meaning()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {SCHEMA_TYPE_ROWS.map((row) => (
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
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.schemaTypesNote()}</Rich>{' '}
          <LocaleAnchor path="/:locale/static/params">
            <Rich>{m.routerFramework.nextParams()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerFramework.providerDescription}
        title={m.routerFramework.providerTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.providerMissing()}</Rich>
        </p>
        <span className="break-all">
          <Code>{USE_PATHNAME_ERROR}</Code>
        </span>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.providerHydration()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerFramework.writesDescription}
        title={m.routerFramework.writesTitle}
      >
        <div className="flex flex-col gap-2">
          <Heading level="h3">
            <Rich>{m.routerFramework.writesApp()}</Rich>
          </Heading>
          <ul className="text-fg-mute flex flex-col gap-2 pl-6">
            <li className="list-disc">
              <Rich>{m.routerFramework.writesAppRoutes()}</Rich>
            </li>
            <li className="list-disc">
              <Rich>{m.routerFramework.writesAppLinks()}</Rich>
            </li>
            <li className="list-disc">
              <Rich>{m.routerFramework.writesAppLocation()}</Rich>
            </li>
            <li className="list-disc">
              <Rich>{m.routerFramework.writesAppTransition()}</Rich>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <Heading level="h3">
            <Rich>{m.routerFramework.writesGenerated()}</Rich>
          </Heading>
          <ul className="text-fg-mute flex flex-col gap-2 pl-6">
            <li className="list-disc">
              <Rich>{m.routerFramework.writesGeneratedTable()}</Rich>
            </li>
            <li className="list-disc">
              <Rich>{m.routerFramework.writesGeneratedRegister()}</Rich>
            </li>
            <li className="list-disc">
              <Rich>{m.routerFramework.writesGeneratedRuntime()}</Rich>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <Heading level="h3">
            <Rich>{m.routerFramework.writesNever()}</Rich>
          </Heading>
          <ul className="text-fg-mute flex flex-col gap-2 pl-6">
            <li className="list-disc">
              <Rich>{m.routerFramework.writesNeverList()}</Rich>
            </li>
          </ul>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerFramework.writesTsconfig()}</Rich>
        </p>
        <CodeBlock code={TSCONFIG} lang="json" />
      </DocSection>

      <DocSection
        description={m.routerFramework.transitionDescription}
        title={m.routerFramework.transitionTitle}
      >
        <CodeBlock code={ROOT_LAYOUT} lang="tsx" />
      </DocSection>

      <DocSection title={m.routerFramework.nextTitle}>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/static/routing">
              <Rich>{m.routerFramework.nextStatic()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/server/routing">
              <Rich>{m.routerFramework.nextServer()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/static/params">
              <Rich>{m.routerFramework.nextParams()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
