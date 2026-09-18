import { Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { DocTable } from '../_parts/doc-table';

const FILTER_STATE = `// src/state/filter.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const filterState = definePageState('product-filter', {
  url: z.object({
    q: z._default(z.string().check(z.maxLength(50)), ''),
    min: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
  }),
});`;

const FILTER_PAGE = `// src/routes/catalog/page.tsx
import { formFields } from '@k8ordo/form/server';

import { filterState } from '../../state/filter';
import { FilterForm } from './_parts/filter-form';

const filterFields = formFields(filterState.url);

export default function CatalogPage() {
  return <FilterForm fields={filterFields} />;
}`;

const FILTER_FORM = `// src/routes/catalog/_parts/filter-form.tsx
'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useAppState } from '@k8ordo/state';

import { filterState } from '../../../state/filter';

type Props = {
  fields: FormFields<'q' | 'min', never>;
};

export function FilterForm({ fields }: Props) {
  const form = useForm(fields);
  const q = form.field('q');
  const min = form.field('min');
  const [{ q: currentQ, min: currentMin }] = useAppState(filterState);

  return (
    <form method="get" {...form.props}>
      <label>
        Keyword
        <input {...q.input} defaultValue={currentQ} />
      </label>
      {q.error !== undefined && <p>{q.error}</p>}
      <label>
        Minimum price
        <input {...min.input} defaultValue={currentMin} />
      </label>
      {min.error !== undefined && <p>{min.error}</p>}
      <button type="submit">Filter</button>
    </form>
  );
}`;

const STORED_PREFERENCE = `// src/components/stored-preference.tsx
'use client';

import { colorSchemeState } from '@k8ordo/color-scheme';
import { useAppState } from '@k8ordo/state';

export function StoredPreference() {
  const [{ preference }] = useAppState(colorSchemeState);

  return <p>{preference ?? 'system'}</p>;
}`;

const UNIT_TEST = `// src/state/catalog.test.ts
import { describe, expect, it } from 'vitest';

import { catalogState } from './catalog';

describe('catalogState', () => {
  it('falls back to the default for a page the schema rejects', () => {
    expect(catalogState.parseUrl(new URLSearchParams('page=0')).page).toBe(1);
  });

  it('leaves defaults out of links', () => {
    expect(catalogState.href('/catalog', { page: 1, tags: [] })).toBe(
      '/catalog',
    );
  });
});`;

const BROWSER_TEST = `// src/catalog/tag-filter.browser.test.tsx
import { resetStateRegistry } from '@k8ordo/state';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';

import { prefsState } from '../state/prefs';
import { TagFilter } from './tag-filter';

const interceptAsRouter = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

let home = '';

beforeEach(() => {
  home = location.href;
  navigation.addEventListener('navigate', interceptAsRouter);
});

afterEach(async () => {
  await cleanup();
  await navigation.navigate(home, { history: 'replace' }).finished;
  navigation.removeEventListener('navigate', interceptAsRouter);
  resetStateRegistry();
  localStorage.removeItem(prefsState.storageKey);
});

it('writes the selected tag into the URL', async () => {
  const screen = await render(<TagFilter tags={['sale', 'new']} />);

  await screen.getByRole('button', { name: 'sale' }).click();

  await expect
    .poll(() => new URL(location.href).searchParams.getAll('tags'))
    .toEqual(['sale']);
});`;

export default function StateIntegrationsPage() {
  const routers = m.stateIntegrations.routersTable;

  return (
    <DocPage
      introduction={m.stateIntegrations.introduction}
      path="/:locale/state/integrations"
    >
      <DocSection
        description={m.stateIntegrations.routersDescription}
        title={m.stateIntegrations.routersTitle}
      >
        <DocTable
          head={[routers.operation(), routers.needs()]}
          rows={[
            {
              key: 'links',
              cells: [
                <Rich key="operation">{routers.links()}</Rich>,
                routers.linksNeeds(),
              ],
            },
            {
              key: 'quiet',
              cells: [
                <Rich key="operation">{routers.quiet()}</Rich>,
                routers.quietNeeds(),
              ],
            },
            {
              key: 'url',
              cells: [
                <Rich key="operation">{routers.url()}</Rich>,
                routers.urlNeeds(),
              ],
            },
            {
              key: 'server',
              cells: [
                <Rich key="operation">{routers.server()}</Rich>,
                routers.serverNeeds(),
              ],
            },
          ]}
        />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.routersNavigate()}</Rich>
        </p>

        <Heading level="h3">
          <Rich>{m.stateIntegrations.kRouterTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.kRouterDescription()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.kRouterSplit()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.kRouterRegister()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/reading">
            <Rich>{m.stateIntegrations.kRouterRegisterLink()}</Rich>
          </LocaleAnchor>
        </p>
        <p>
          <LocaleAnchor path="/:locale/router/navigation">
            <Rich>{m.stateIntegrations.kRouterLink()}</Rich>
          </LocaleAnchor>
        </p>

        <Heading level="h3">
          <Rich>{m.stateIntegrations.frameworkTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.frameworkDescription()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/reading">
            <Rich>{m.stateIntegrations.frameworkLink()}</Rich>
          </LocaleAnchor>
        </p>

        <Heading level="h3">
          <Rich>{m.stateIntegrations.otherTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.otherDescription()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateIntegrations.formDescription}
        title={m.stateIntegrations.formTitle}
      >
        <CodeBlock code={FILTER_STATE} lang="ts" />
        <CodeBlock code={FILTER_PAGE} lang="tsx" />
        <CodeBlock code={FILTER_FORM} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateIntegrations.formFlow()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateIntegrations.formNoJs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateIntegrations.formCanonical()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.formDemo()}</Rich>{' '}
          <LocaleAnchor path="/:locale/form">
            <Rich>{m.stateIntegrations.formDemoLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.stateIntegrations.colorDescription}
        title={m.stateIntegrations.colorTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.colorScript()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.colorRead()}</Rich>
        </p>
        <CodeBlock code={STORED_PREFERENCE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.colorKey()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/color-scheme/how-it-works">
            <Rich>{m.stateIntegrations.colorLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.stateIntegrations.testingDescription}
        title={m.stateIntegrations.testingTitle}
      >
        <CodeBlock code={UNIT_TEST} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateIntegrations.testingBrowser()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateIntegrations.testingReset()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateIntegrations.testingUnmount()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateIntegrations.testingIntercept()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateIntegrations.testingStorage()}</Rich>
          </li>
        </ul>
        <CodeBlock code={BROWSER_TEST} lang="tsx" />
      </DocSection>
    </DocPage>
  );
}
