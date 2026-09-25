import { Code } from '@k8ordo/ui';

import * as m from '../../messages';
import { CodeBlock } from '../code-block';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { Rich } from '../rich';
import type { Mode } from './mode';
import {
  Bullet,
  Bullets,
  Cell,
  GuideTable,
  Paragraph,
  Row,
  SubHeading,
} from './prose';

const TREE = `src/routes/
  layout.tsx
  page.tsx
  not-found.tsx
  error.tsx
  old/
    redirect.ts
  products/
    page.tsx
    [id]/
      page.tsx
  (docs)/
    layout.tsx
    guide/
      page.tsx
  _parts/
    counter.tsx`;

const PAGE_PROPS = `// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';

export default function ProductPage({
  params,
  pathname,
}: PageProps<'/products/:id'>) {
  return (
    <>
      <h1>{params.id}</h1>
      <p>{pathname}</p>
    </>
  );
}`;

const ROOT_LAYOUT = `// src/routes/layout.tsx
import type { ReactNode } from 'react';

import { locales } from '../i18n';

export default function Root({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return (
    <html dir={locales.definitions[locale].dir} lang={locale}>
      <body>{children}</body>
    </html>
  );
}`;

const SHADOW_TREE = `src/routes/
  page.tsx
  about/
    page.tsx
  (shop)/
    sale/
      page.tsx
    [id]/
      page.tsx`;

const SHADOW_ERROR = `routes/ is not a valid pathname space:
  routes/about/page.tsx: "/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it`;

const REFUSED = `routes/ is not a valid pathname space:
  routes/[123]: "[123]" is not a valid param directory — use [name] with a letter or underscore first
  routes/products/helper.ts: routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts — move "helper.ts" under a _-prefixed directory`;

type Refusal = { contains: string | (() => string); error: string };

const REFUSALS: readonly Refusal[] = [
  {
    contains: '`products/helper.ts`',
    error:
      'routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts — move "helper.ts" under a _-prefixed directory',
  },
  {
    contains: '`[123]/page.tsx`',
    error:
      '"[123]" is not a valid param directory — use [name] with a letter or underscore first',
  },
  {
    contains: '`(docs/page.tsx`',
    error: '"(docs" is not a valid route group — use (name)',
  },
  {
    contains: '`pro ducts/page.tsx`',
    error:
      '"pro ducts" cannot be a URL segment — use letters, digits, . _ ~ or -',
  },
  {
    contains: '`[id]/things/[id]/page.tsx`',
    error:
      '":id" is already taken by an ancestor — params must be unique within a path',
  },
  {
    contains: m.frameworkRouting.refusesTable.noPageBelow,
    error: 'has a layout but no page.tsx below it, so it can never render',
  },
  {
    contains: m.frameworkRouting.refusesTable.nothingBelow,
    error:
      'declares no route — every directory needs a page.tsx (or redirect.ts) somewhere below it',
  },
  {
    contains: m.frameworkRouting.refusesTable.twoGroups,
    error:
      '"/" is already declared by (a)/page.tsx — route groups do not separate URLs',
  },
  {
    contains: m.frameworkRouting.refusesTable.pageAndRedirect,
    error: '"old" cannot both render page.tsx and redirect — keep one',
  },
  {
    contains: m.frameworkRouting.refusesTable.groupShadow,
    error:
      '"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it',
  },
  {
    contains: m.frameworkRouting.refusesTable.catchAllShadow,
    error:
      '"/about" can never match — "/*" ((shell)/not-found.tsx) is declared first and answers it',
  },
];

const GENERATED_TREE = `src/routes/
  layout.tsx
  page.tsx
  not-found.tsx
  products/
    page.tsx
    [id]/
      page.tsx`;

const GENERATED_ROUTES = `// .k8ordo/routes.gen.ts
export const routes = defineRoutes({
  '/': {
    layout: layout satisfies Layout<'/'>,
    children: {
      '/': page satisfies Page<'/'>,
      '/products': {
        children: {
          '/': products_page satisfies Page<'/products'>,
          '/:id': products_id_page satisfies Page<'/products/:id'>,
        },
      },
      '/*': not_found satisfies Page<'/*'>,
    },
  },
});`;

const generatedRegister = (mode: Mode): string => {
  const request = mode === 'server';
  return [
    '// .k8ordo/register.gen.ts',
    "import type { ParsedParamsMap } from '@k8ordo/router';",
    ...(request
      ? ["import type { RouteRequest } from '@k8ordo/server/runtime';"]
      : []),
    "import type { paramSchemas, routes } from './routes.gen';",
    '',
    "declare module '@k8ordo/router' {",
    '  interface Register {',
    '    routes: typeof routes;',
    '    params: ParsedParamsMap<typeof paramSchemas>;',
    ...(request ? ['    request: RouteRequest;'] : []),
    '  }',
    '}',
  ].join('\n');
};

const TSCONFIG = `{
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"]
}`;

const TITLE = `// src/routes/products/[id]/page.tsx
import type { PageProps } from '@k8ordo/router';

export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  return (
    <>
      <title>{\`Product \${params.id}\`}</title>
      <meta content="One product from the catalog" name="description" />
      <h1>{params.id}</h1>
    </>
  );
}`;

const LINKS = `// src/routes/products/page.tsx
import { href } from '@k8ordo/router';

export default function ProductsPage() {
  return (
    <ul>
      <li>
        <a href={href('/products/:id', { id: 1 })}>first product</a>
      </li>
      <li>
        <a href={href('/guide')}>guide</a>
      </li>
    </ul>
  );
}`;

/** Inline code names, comma separated. */
function Names({ names }: { names: readonly string[] }) {
  return names.map((name, index) => (
    <span key={name}>
      {index === 0 ? null : ', '}
      <Code>{name}</Code>
    </span>
  ));
}

/**
 * The `routes/` grammar, shared by `/static/routing` and `/server/routing`.
 * Where the two modes differ it reads the mode's own messages.
 */
export function RoutingGuide({ mode }: { mode: Mode }) {
  const t = m.frameworkRouting;
  const own = mode === 'static' ? m.staticRouting : m.serverRouting;
  const request = mode === 'server' ? ['request'] : [];

  return (
    <>
      <DocSection description={t.treeDescription} title={t.treeTitle}>
        <CodeBlock code={TREE} lang="bash" />
        <GuideTable head={[t.urlTable.file, t.urlTable.url, t.urlTable.role]}>
          <Row>
            <Cell nowrap>
              <Code>layout.tsx</Code>
            </Cell>
            <Cell nowrap>—</Cell>
            <Cell>
              <Rich>{t.urlTable.rootLayout()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>page.tsx</Code>
            </Cell>
            <Cell nowrap>
              <Code>/</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.rootPage()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>not-found.tsx</Code>
            </Cell>
            <Cell nowrap>
              <Code>{'/*'}</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.notFound()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>error.tsx</Code>
            </Cell>
            <Cell nowrap>—</Cell>
            <Cell>
              <Rich>{t.urlTable.error()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>old/redirect.ts</Code>
            </Cell>
            <Cell nowrap>
              <Code>/old</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.redirect()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>products/page.tsx</Code>
            </Cell>
            <Cell nowrap>
              <Code>/products</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.literal()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>products/[id]/page.tsx</Code>
            </Cell>
            <Cell nowrap>
              <Code>/products/:id</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.param()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>(docs)/layout.tsx</Code>
            </Cell>
            <Cell nowrap>—</Cell>
            <Cell>
              <Rich>{t.urlTable.groupLayout()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>(docs)/guide/page.tsx</Code>
            </Cell>
            <Cell nowrap>
              <Code>/guide</Code>
            </Cell>
            <Cell>
              <Rich>{t.urlTable.groupPage()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>_parts/counter.tsx</Code>
            </Cell>
            <Cell nowrap>—</Cell>
            <Cell>
              <Rich>{t.urlTable.private()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
      </DocSection>

      <DocSection description={t.filesDescription} title={t.filesTitle}>
        <GuideTable
          head={[t.filesTable.file, t.filesTable.role, t.filesTable.receives]}
        >
          <Row>
            <Cell nowrap>
              <Code>page.tsx</Code>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.page()}</Rich>
            </Cell>
            <Cell>
              <Names names={['params', 'pathname', ...request]} />
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>layout.tsx</Code>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.layout()}</Rich>
            </Cell>
            <Cell>
              <Names names={['children', 'params', 'pathname', ...request]} />
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>not-found.tsx</Code>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.notFound()}</Rich>
            </Cell>
            <Cell>
              <Names names={['params', 'pathname', ...request]} />
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>error.tsx</Code>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.error()}</Rich>
            </Cell>
            <Cell>
              <Names names={['error', 'reset']} />
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>redirect.ts</Code>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.redirect()}</Rich>
            </Cell>
            <Cell>
              <Rich>{t.filesTable.nothing()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <Paragraph text={own.filesNote}>
          {mode === 'static' ? (
            <LocaleAnchor path="/:locale/static/errors">
              {m.static.navErrors()}
            </LocaleAnchor>
          ) : (
            <LocaleAnchor path="/:locale/server/actions">
              {m.server.navActions()}
            </LocaleAnchor>
          )}
        </Paragraph>
      </DocSection>

      <DocSection description={t.segmentsDescription} title={t.segmentsTitle}>
        <GuideTable
          head={[
            t.segmentsTable.form,
            t.segmentsTable.adds,
            t.segmentsTable.meaning,
          ]}
        >
          <Row>
            <Cell nowrap>
              <Code>products</Code>
            </Cell>
            <Cell nowrap>
              <Code>/products</Code>
            </Cell>
            <Cell>
              <Rich>{t.segmentsTable.literal()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>[id]</Code>
            </Cell>
            <Cell nowrap>
              <Code>/:id</Code>
            </Cell>
            <Cell>
              <Rich>{t.segmentsTable.param()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>(docs)</Code>
            </Cell>
            <Cell nowrap>
              <Rich>{t.segmentsTable.none()}</Rich>
            </Cell>
            <Cell>
              <Rich>{t.segmentsTable.group()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>_parts</Code>
            </Cell>
            <Cell nowrap>
              <Rich>{t.segmentsTable.none()}</Rich>
            </Cell>
            <Cell>
              <Rich>{t.segmentsTable.private()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <Paragraph text={t.segmentsNoRest} />
      </DocSection>

      <DocSection description={t.propsDescription} title={t.propsTitle}>
        <CodeBlock code={PAGE_PROPS} lang="tsx" />
        <Paragraph text={t.propsTypes} />
        <Paragraph text={t.propsSite} />
        <CodeBlock code={ROOT_LAYOUT} lang="tsx" />
      </DocSection>

      <DocSection description={t.orderDescription} title={t.orderTitle}>
        <Paragraph text={t.orderGroups} />
        <CodeBlock code={SHADOW_TREE} lang="bash" />
        <CodeBlock code={SHADOW_ERROR} lang="bash" />
      </DocSection>

      <DocSection description={t.refusesDescription} title={t.refusesTitle}>
        <CodeBlock code={REFUSED} lang="bash" />
        <GuideTable head={[t.refusesTable.contains, t.refusesTable.error]}>
          {REFUSALS.map((refusal) => (
            <Row key={refusal.error}>
              <Cell>
                <Rich>
                  {typeof refusal.contains === 'string'
                    ? refusal.contains
                    : refusal.contains()}
                </Rich>
              </Cell>
              <Cell>
                <Code>{refusal.error}</Code>
              </Cell>
            </Row>
          ))}
        </GuideTable>
        <Paragraph text={t.refusesShadowing} />
        <Paragraph text={own.refusesNote} />
        {mode === 'static' && (
          <Bullets>
            <Bullet>
              <Rich>{m.staticRouting.refusesPaths()}</Rich> —{' '}
              <LocaleAnchor path="/:locale/static/params">
                {m.static.navParams()}
              </LocaleAnchor>
            </Bullet>
            <Bullet>
              <Rich>{m.staticRouting.refusesNotFound()}</Rich> —{' '}
              <LocaleAnchor path="/:locale/static/deploy">
                {m.static.navDeploy()}
              </LocaleAnchor>
            </Bullet>
            <Bullet>
              <Rich>{m.staticRouting.refusesActions()}</Rich> —{' '}
              <LocaleAnchor path="/:locale/static/get-started">
                {m.nav.getStarted()}
              </LocaleAnchor>
            </Bullet>
            <Bullet>
              <Rich>{m.staticRouting.refusesThrow()}</Rich> —{' '}
              <LocaleAnchor path="/:locale/static/errors">
                {m.static.navErrors()}
              </LocaleAnchor>
            </Bullet>
          </Bullets>
        )}
      </DocSection>

      <DocSection description={t.generatedDescription} title={t.generatedTitle}>
        <GuideTable head={[t.generatedTable.file, t.generatedTable.holds]}>
          <Row>
            <Cell nowrap>
              <Code>routes.gen.ts</Code>
            </Cell>
            <Cell>
              <Rich>{t.generatedTable.routes()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>register.gen.ts</Code>
            </Cell>
            <Cell>
              <Rich>{t.generatedTable.register()}</Rich>
            </Cell>
          </Row>
          <Row>
            <Cell nowrap>
              <Code>.gitignore</Code>
            </Cell>
            <Cell>
              <Rich>{t.generatedTable.gitignore()}</Rich>
            </Cell>
          </Row>
        </GuideTable>
        <Paragraph text={t.generatedExample} />
        <CodeBlock code={GENERATED_TREE} lang="bash" />
        <CodeBlock code={GENERATED_ROUTES} lang="ts" />
        <CodeBlock code={generatedRegister(mode)} lang="ts" />
        <SubHeading text={t.setup.tsconfigTitle} />
        <Paragraph text={t.generatedTsconfig} />
        <CodeBlock code={TSCONFIG} lang="json" />
        <Paragraph text={t.generatedTypecheck} />
      </DocSection>

      <DocSection description={t.titlesDescription} title={t.titlesTitle}>
        <CodeBlock code={TITLE} lang="tsx" />
        <Paragraph text={t.titlesOne} />
      </DocSection>

      <DocSection description={t.linksDescription} title={t.linksTitle}>
        <CodeBlock code={LINKS} lang="tsx" />
        <Paragraph text={t.linksMore}>
          <LocaleAnchor path="/:locale/router/links">
            {m.router.navLinks()}
          </LocaleAnchor>
          {' · '}
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </Paragraph>
      </DocSection>
    </>
  );
}
