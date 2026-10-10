import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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
      <DocSection id="params" title={t.paramsTitle}>
        <CodeBlock
          callouts={{ 2: t.paramsMissing(), 3: t.paramsMisspelled() }}
          code={PARAMS}
          lang="ts"
        />
        <p>
          <Rich>{t.paramsInferred()}</Rich>
        </p>
      </DocSection>

      <DocSection id="register" title={t.registerTitle}>
        <CodeBlock code={REGISTER} lang="ts" title="src/k8ordo-router.d.ts" />
        <CodeBlock
          callouts={{ 2: t.registerTypo() }}
          code={CHECKED}
          lang="ts"
        />
        <p>
          <Rich>{t.registerWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.registerEffect()}</Rich>
        </p>
        <ul>
          {[
            t.registerEffectLink,
            t.registerEffectParams,
            t.registerEffectMatch,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.registerOnce()}</Rich>
        </p>
        <p>
          <Rich>{t.stateRegisterBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/links">
            {m.state.navLinks()}
          </LocaleAnchor>
          <Rich>{t.stateRegisterAfter()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.registerFrameworkBefore()}</Rich>
            <LocaleAnchor path="/:locale/framework/routing">
              {m.framework.navRouting()}
            </LocaleAnchor>
            <Rich>{t.registerFrameworkAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="types" title={t.typesTitle}>
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
            <Rich>{t.typesSchemaBefore()}</Rich>
            <LocaleAnchor path="/:locale/framework/params">
              {m.framework.navParams()}
            </LocaleAnchor>
            <Rich>{t.typesSchemaAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="navigable-path" title={t.navigablePathTitle}>
        <CodeBlock code={NAVIGABLE_PATH} lang="ts" />
        <p>
          <Rich>{t.navigablePathRule()}</Rich>
        </p>
        <p>
          <Rich>{t.navigablePathSlash()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
