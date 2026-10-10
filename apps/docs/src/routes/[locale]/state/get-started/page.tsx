import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { ProductsDemo } from '../../../../demos/state/get-started/products-demo';
import * as m from '../../../../messages';

const t = m.stateGetStarted;

const STATE = `import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const listState = definePageState('product-list', {
  url: z.object({
    inStock: z.stringbool().default(false),
    page: z.coerce.number().int().min(1).default(1),
  }),
});`;

const FILTERS = `'use client';

import { useAppState } from '@k8ordo/state';

import { listState } from '../state';

export function Filters() {
  const [{ inStock, page }, update] = useAppState(listState);

  return (
    <div>
      <label>
        <input
          checked={inStock}
          onChange={(event) => {
            update({ inStock: event.target.checked, page: 1 });
          }}
          type="checkbox"
        />
        In stock only
      </label>
      <button
        onClick={() => {
          update({ page: page + 1 }, { history: 'push' });
        }}
        type="button"
      >
        Next page
      </button>
    </div>
  );
}`;

export default function StateGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/get-started">
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/state" />
        <p>
          <Rich>{t.navigationApi()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.zodMiniBefore()}</Rich>
            <LocaleAnchor path="/:locale/state/places">
              {m.state.navPlaces()}
            </LocaleAnchor>
            <Rich>{t.zodMiniAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="define" title={t.defineTitle}>
        <CodeBlock
          callouts={{ 4: t.defineKeyCallout() }}
          code={STATE}
          lang="ts"
          marks={{ 4: 'highlight', 6: 'highlight', 7: 'highlight' }}
          title="src/state.ts"
        />
        <p>
          <Rich>{t.definePlace()}</Rich>
        </p>
        <p>
          <Rich>{t.defineFields()}</Rich>
        </p>
        <p>
          <Rich>{t.defineModule()}</Rich>
        </p>
      </DocSection>

      <DocSection id="component" title={t.componentTitle}>
        <CodeBlock
          callouts={{
            16: t.componentReplaceCallout(),
            24: t.componentPushCallout(),
          }}
          code={FILTERS}
          lang="tsx"
          marks={{ 8: 'highlight', 16: 'highlight', 24: 'highlight' }}
          title="src/components/filters.tsx"
        />
        <p>
          <Rich>{t.componentHook()}</Rich>
        </p>
        <p>
          <Rich>{t.componentSync()}</Rich>
          <LocaleAnchor path="/:locale/state/updates">
            {m.state.navUpdates()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.componentHistory()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.tryDescription}
        id="try"
        steps={t.trySteps}
        title={t.tryTitle}
      >
        <ProductsDemo />
      </Playground>
    </DocPage>
  );
}
