import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerTypedPaths;

const PARAMS = `href('/products/:id', { id: '42' });
href('/products/:id');
href('/products/:id', { productId: '42' });`;

const REGISTER = `import type { routes } from './routes';

declare module '@k8ordo/router' {
  interface Register {
    routes: typeof routes;
  }
}`;

const CHECKED = `href('/products/:id', { id: '42' });
href('/prodcuts/:id', { id: '42' });`;

const SITE_PATH = `import type { RegisteredNavigablePattern } from '@k8ordo/router';

export type SitePath = Exclude<
  Extract<RegisteredNavigablePattern, \`/:locale\${string}\`>,
  \`/:locale\${string}:\${string}\`
>;`;

const STATE_REGISTER = `import type { routes } from './routes';

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

const STATE_HREF = `listState.href('/products', { q: 'lamp' }); // '/products?q=lamp'
listState.href('/prodcuts', { q: 'lamp' });`;

const NAVIGABLE_PATH = `import type { NavigablePath } from '@k8ordo/router';

type A = NavigablePath<typeof routes, '/products/42'>;
// '/products/42'
type B = NavigablePath<typeof routes, '/products/42/reviews'>;
// never
type C = NavigablePath<typeof routes, '/products/'>;
// never`;

export default function RouterTypedPathsPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/typed-paths">
      <DocSection
        description={t.paramsDescription}
        id="params"
        title={t.paramsTitle}
      >
        <CodeBlock
          callouts={{ 2: t.paramsMissing(), 3: t.paramsMisspelled() }}
          code={PARAMS}
          lang="ts"
        />
      </DocSection>

      <DocSection
        description={t.registerDescription}
        id="register"
        title={t.registerTitle}
      >
        <CodeBlock code={REGISTER} lang="ts" title="src/k8ordo-router.d.ts" />
        <CodeBlock
          callouts={{ 2: t.registerTypo() }}
          code={CHECKED}
          lang="ts"
        />
        <p>
          <Rich>{t.registerEffect()}</Rich>
        </p>
        <p>
          <Rich>{t.registerOnce()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.registerFramework()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.typesDescription}
        id="types"
        title={t.typesTitle}
      >
        <CodeBlock code={SITE_PATH} lang="ts" title="src/links.ts" />
        <p>
          <Rich>{t.typesSite()}</Rich>
        </p>
        <p>
          <Rich>{t.typesList()}</Rich>
        </p>
        <ul>
          {[
            t.typesPattern,
            t.typesNavigable,
            t.typesParams,
            t.typesPageParams,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.typesBefore()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.typesSchema()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.stateDescription}
        id="state"
        title={t.stateTitle}
      >
        <CodeBlock code={STATE_REGISTER} lang="ts" title="src/k8ordo.d.ts" />
        <CodeBlock
          callouts={{ 2: t.stateNoMatch() }}
          code={STATE_HREF}
          lang="ts"
        />
        <p>
          <Rich>{t.statePath()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.navigablePathDescription}
        id="navigable-path"
        title={t.navigablePathTitle}
      >
        <CodeBlock code={NAVIGABLE_PATH} lang="ts" />
        <p>
          <Rich>{t.navigablePathRule()}</Rich>
        </p>
        <p>
          <Rich>{t.navigablePathSlash()}</Rich>
        </p>
        <p>
          <Rich>{t.navigablePathWhy()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
