import { Code, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { DocTable } from '../_parts/doc-table';
import { PlacesDemo } from './_parts/places-demo';

const CATALOG = `// src/state/catalog.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const catalogState = definePageState('catalog', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    tags: z._default(z.array(z.string()), []),
    sort: z._default(z.enum(['new', 'price']), 'new'),
  }),
});`;

const MAP = `// src/state/map.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const mapState = definePageState('map', {
  url: z.object({
    zoom: z._default(z.coerce.number().check(z.int(), z.gte(1), z.lte(20)), 12),
    satellite: z._default(z.stringbool(), false),
    layers: z._default(z.array(z.enum(['traffic', 'transit'])), []),
    since: z.optional(z.iso.date()),
  }),
});`;

const ORDER_PANEL = `// src/state/order-panel.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const orderPanelState = definePageState('order-panel', {
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
    showTotals: z._default(z.boolean(), false),
  }),
});`;

const ORDERS = `// src/state/orders.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const ordersState = definePageState('orders', {
  url: z.object({
    status: z._default(z.enum(['open', 'shipped']), 'open'),
  }),
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
  }),
});`;

const ORDER_TABS = `// src/orders/order-tabs.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { ordersState } from '../state/orders';

export function OrderTabs() {
  const [{ status }, update] = useAppState(ordersState, ['status']);

  return (
    <button
      onClick={() => {
        update(
          { status: status === 'open' ? 'shipped' : 'open', expanded: [] },
          { history: 'push' },
        );
      }}
      type="button"
    >
      {status === 'open' ? 'Show shipped' : 'Show open'}
    </button>
  );
}`;

const PREFS = `// src/state/prefs.ts
import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const prefsState = defineLocalState(
  'prefs',
  z.object({
    view: z._default(z.enum(['grid', 'table']), 'grid'),
    pageSize: z._default(z.number().check(z.int(), z.gte(10), z.lte(100)), 20),
  }),
);`;

const NOTICES = `// src/state/notices.ts
import { defineSessionState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const noticesState = defineSessionState(
  'notices',
  z.object({
    dismissed: z._default(z.array(z.string()), []),
  }),
);`;

const DENSITY = `// src/state/density.ts
import { defineCookieState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const densityState = defineCookieState(
  'density',
  z.object({
    density: z._default(z.enum(['comfortable', 'compact']), 'comfortable'),
  }),
);`;

const PALETTE = `// src/state/command-palette.ts
import { defineMemoryState } from '@k8ordo/state';

export const commandPaletteState = defineMemoryState<{
  open: boolean;
  query: string;
  scope: 'all' | 'pages' | 'actions';
}>('command-palette', { open: false, query: '', scope: 'all' });`;

const PALETTE_BUTTON = `// src/command-palette/palette-button.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { commandPaletteState } from '../state/command-palette';

export function PaletteButton() {
  const [{ open }, update] = useAppState(commandPaletteState, ['open']);

  return (
    <button
      aria-expanded={open}
      onClick={() => {
        update({ open: !open, query: '' });
      }}
      type="button"
    >
      Commands
    </button>
  );
}`;

const CATALOG_CLASSIC = `// src/state/catalog.ts
import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const catalogState = definePageState('catalog', {
  url: z.object({
    q: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
    tags: z.array(z.string()).default([]),
    sort: z.enum(['new', 'price']).default('new'),
  }),
});`;

export default function StatePlacesPage() {
  const table = m.statePlaces.overviewTable;
  const refusals = m.statePlaces.refusalsTable;
  const types = m.statePlaces.typesTable;

  return (
    <DocPage
      introduction={m.statePlaces.introduction}
      path="/:locale/state/places"
    >
      <DocSection
        description={m.statePlaces.overviewDescription}
        title={m.statePlaces.overviewTitle}
      >
        <DocTable
          head={[
            table.definition(),
            table.livesIn(),
            table.survives(),
            table.sharedWith(),
            table.server(),
          ]}
          rows={[
            {
              key: 'url',
              cells: [
                <Rich key="definition">`definePageState` · `url`</Rich>,
                table.urlLivesIn(),
                table.urlSurvives(),
                table.urlSharedWith(),
                <Rich key="server">{table.urlServer()}</Rich>,
              ],
            },
            {
              key: 'entry',
              cells: [
                <Rich key="definition">`definePageState` · `entry`</Rich>,
                table.entryLivesIn(),
                table.entrySurvives(),
                table.entrySharedWith(),
                table.defaultsServer(),
              ],
            },
            {
              key: 'local',
              cells: [
                <Code key="definition">defineLocalState</Code>,
                'localStorage',
                table.localSurvives(),
                table.localSharedWith(),
                table.defaultsServer(),
              ],
            },
            {
              key: 'session',
              cells: [
                <Code key="definition">defineSessionState</Code>,
                'sessionStorage',
                table.sessionSurvives(),
                table.memorySharedWith(),
                table.defaultsServer(),
              ],
            },
            {
              key: 'cookie',
              cells: [
                <Code key="definition">defineCookieState</Code>,
                table.cookieLivesIn(),
                table.cookieSurvives(),
                table.localSharedWith(),
                <Rich key="server">{table.cookieServer()}</Rich>,
              ],
            },
            {
              key: 'memory',
              cells: [
                <Code key="definition">defineMemoryState</Code>,
                table.memoryLivesIn(),
                table.memorySurvives(),
                table.memorySharedWith(),
                table.memoryServer(),
              ],
            },
          ]}
        />
        <Heading level="h3">
          <Rich>{m.statePlaces.chooseTitle()}</Rich>
        </Heading>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseUrl()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseEntry()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseLocal()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseSession()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseCookie()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.chooseMemory()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.demoDescription}
        title={m.statePlaces.demoTitle}
      >
        <PlacesDemo />
      </DocSection>

      <DocSection
        description={m.statePlaces.urlDescription}
        title={m.statePlaces.urlTitle}
      >
        <CodeBlock code={CATALOG} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleNumber()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleBoolean()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleArray()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleScalar()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleSerialize()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.urlRuleDefault()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.statePlaces.urlMoreTypes()}</Rich>
        </p>
        <CodeBlock code={MAP} lang="ts" />
        <Heading level="h3">
          <Rich>{m.statePlaces.refusalsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.statePlaces.refusalsDescription()}</Rich>
        </p>
        <DocTable
          head={[refusals.written(), refusals.instead(), refusals.why()]}
          rows={[
            {
              key: 'boolean',
              cells: [
                <Rich key="written">`z.boolean()` / `z.coerce.boolean()`</Rich>,
                <Code key="instead">z.stringbool()</Code>,
                <Rich key="why">{refusals.booleanWhy()}</Rich>,
              ],
            },
            {
              key: 'array',
              cells: [
                <Rich key="written">{refusals.arrayWritten()}</Rich>,
                <Code key="instead">z._default(z.array(…), [])</Code>,
                <Rich key="why">{refusals.arrayWhy()}</Rich>,
              ],
            },
            {
              key: 'absence',
              cells: [
                <Rich key="written">{refusals.absenceWritten()}</Rich>,
                <Rich key="instead">`z._default()` / `z.optional()`</Rich>,
                <Rich key="why">{refusals.absenceWhy()}</Rich>,
              ],
            },
            {
              key: 'date',
              cells: [
                <Code key="written">z.date()</Code>,
                <Rich key="instead">{refusals.dateInstead()}</Rich>,
                <Rich key="why">{refusals.dateWhy()}</Rich>,
              ],
            },
          ]}
        />
      </DocSection>

      <DocSection
        description={m.statePlaces.entryDescription}
        title={m.statePlaces.entryTitle}
      >
        <CodeBlock code={ORDER_PANEL} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.entryTypes()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.entryHistory()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.entryServer()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.entryStale()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.bothDescription}
        title={m.statePlaces.bothTitle}
      >
        <CodeBlock code={ORDERS} lang="ts" />
        <CodeBlock code={ORDER_TABS} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.bothAtomic()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.bothCarry()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.bothDisjoint()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.bothCaveat()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.localDescription}
        title={m.statePlaces.localTitle}
      >
        <CodeBlock code={PREFS} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.localStorageKey()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.localJson()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.localTabs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.localStale()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.localServer()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.statePlaces.localServerLink()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.sessionDescription}
        title={m.statePlaces.sessionTitle}
      >
        <CodeBlock code={NOTICES} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.sessionSame()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.sessionKeys()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.sessionTabs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.sessionServer()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.statePlaces.localServerLink()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.cookieDescription}
        title={m.statePlaces.cookieTitle}
      >
        <CodeBlock code={DENSITY} lang="ts" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.cookieName()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.cookieWrite()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.cookieLax()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.cookieTabs()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.cookieSmall()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.localJson()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.statePlaces.cookieSecret()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/reading">
            <Rich>{m.statePlaces.cookieServer()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.statePlaces.memoryDescription}
        title={m.statePlaces.memoryTitle}
      >
        <CodeBlock code={PALETTE} lang="ts" />
        <CodeBlock code={PALETTE_BUTTON} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.memoryNoSchema()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.memoryImmutable()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.memoryDetails()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.keyDescription}
        title={m.statePlaces.keyTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.keyRegistry()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.keyEntry()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.keyLocal()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.keyCookie()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.statePlaces.keyRename()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.statePlaces.schemaDescription}
        title={m.statePlaces.schemaTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.statePlaces.schemaObject()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.schemaAbsence()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.schemaRefine()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.schemaOwnOutput()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.statePlaces.schemaSalvage()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.statePlaces.schemaSalvageLink()}</Rich>
            </LocaleAnchor>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.statePlaces.zodDescription}
        title={m.statePlaces.zodTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.statePlaces.zodCompare()}</Rich>
        </p>
        <CodeBlock code={CATALOG} lang="ts" />
        <CodeBlock code={CATALOG_CLASSIC} lang="ts" />
      </DocSection>

      <DocSection
        description={m.statePlaces.typesDescription}
        title={m.statePlaces.typesTitle}
      >
        <DocTable
          head={[types.type(), types.holds()]}
          rows={[
            {
              key: 'page',
              cells: [
                <Code key="type">PageState</Code>,
                <Rich key="holds">{types.pageState()}</Rich>,
              ],
            },
            {
              key: 'local',
              cells: [
                <Code key="type">LocalState</Code>,
                <Rich key="holds">{types.localState()}</Rich>,
              ],
            },
            {
              key: 'session',
              cells: [
                <Code key="type">SessionState</Code>,
                <Rich key="holds">{types.sessionState()}</Rich>,
              ],
            },
            {
              key: 'cookie',
              cells: [
                <Code key="type">CookieState</Code>,
                <Rich key="holds">{types.cookieState()}</Rich>,
              ],
            },
            {
              key: 'memory',
              cells: [
                <Code key="type">MemoryState</Code>,
                <Rich key="holds">{types.memoryState()}</Rich>,
              ],
            },
            {
              key: 'schema',
              cells: [
                <Code key="type">StateSchema</Code>,
                <Rich key="holds">{types.stateSchema()}</Rich>,
              ],
            },
            {
              key: 'output',
              cells: [
                <Code key="type">OutputOf</Code>,
                <Rich key="holds">{types.outputOf()}</Rich>,
              ],
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
