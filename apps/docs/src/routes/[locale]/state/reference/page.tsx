import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage } from '../../../../components/doc-page';
import * as m from '../../../../messages';

const t = m.stateReference;
const FROM = '@k8ordo/state';

const PAGE_EXAMPLE = `export const listState = definePageState('product-list', {
  url: z.object({
    page: z.coerce.number().int().min(1).default(1),
  }),
  entry: z.object({
    expanded: z.array(z.string()).default([]),
  }),
});`;

const APP_STATE_EXAMPLE = `const [{ page }, update] = useAppState(listState, ['page']);

update({ page: page + 1 }, { history: 'push' });`;

export default function StateReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/reference">
      <ApiEntry
        caveats={t.pageCaveats}
        fields={[
          { name: 'kind', type: "'page'", description: t.fieldKind },
          { name: 'key', type: 'string', description: t.fieldKey },
          { name: 'url', type: 'Url', description: t.pageUrl },
          { name: 'entry', type: 'Entry', description: t.pageEntry },
          {
            name: 'parseUrl',
            type: '(input: UrlInput) => OutputOf<Url>',
            description: t.pageParseUrl,
          },
          {
            name: 'href',
            type: '(path, values?) => string',
            description: t.pageHref,
          },
          {
            name: 'search',
            type: '(values?) => string',
            description: t.pageSearch,
          },
        ]}
        from={FROM}
        id="define-page-state"
        name="definePageState"
        params={[
          { name: 'key', type: 'string', description: t.pageKeyParam },
          {
            name: 'config',
            type: '{ url?: StateSchema; entry?: StateSchema }',
            description: t.pageConfig,
          },
        ]}
        returns={{ type: 'PageState<Url, Entry>', description: t.pageReturns }}
        signature={`definePageState<Url, Entry>(
  key: string,
  config: { url?: Url; entry?: Entry },
): PageState<Url, Entry>`}
        summary={t.pageSummary}
      >
        <CodeBlock code={PAGE_EXAMPLE} lang="ts" title="src/state.ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.readerCaveats}
        from={FROM}
        id="url-reader"
        name="urlReader"
        params={[
          { name: 'schema', type: 'StateSchema', description: t.readerSchema },
        ]}
        returns={{
          type: '(input: UrlInput) => output<Url>',
          description: t.readerReturns,
        }}
        signature={`urlReader<Url extends StateSchema>(
  schema: Url,
): (input: UrlInput) => output<Url>`}
        summary={t.readerSummary}
      />

      <ApiEntry
        caveats={t.localCaveats}
        fields={[
          { name: 'kind', type: "'local'", description: t.fieldKind },
          { name: 'key', type: 'string', description: t.fieldKey },
          { name: 'schema', type: 'Schema', description: t.fieldSchema },
          {
            name: 'storageKey',
            type: 'string',
            description: t.localStorageKey,
          },
          {
            name: 'inlineRead',
            type: '() => string',
            description: t.localInlineRead,
          },
        ]}
        from={FROM}
        id="define-local-state"
        name="defineLocalState"
        params={[
          { name: 'key', type: 'string', description: t.localKeyParam },
          { name: 'schema', type: 'StateSchema', description: t.schemaParam },
          {
            name: 'versioning',
            type: 'Versioning',
            description: t.versioningParam,
          },
        ]}
        returns={{ type: 'LocalState<Schema>', description: t.localReturns }}
        signature={`defineLocalState<Schema>(
  key: string,
  schema: Schema,
  versioning?: Versioning<Schema>,
): LocalState<Schema>`}
        summary={t.localSummary}
      />

      <ApiEntry
        caveats={t.sessionCaveats}
        fields={[
          { name: 'kind', type: "'session'", description: t.fieldKind },
          { name: 'key', type: 'string', description: t.fieldKey },
          { name: 'schema', type: 'Schema', description: t.fieldSchema },
          {
            name: 'storageKey',
            type: 'string',
            description: t.sessionStorageKey,
          },
          {
            name: 'inlineRead',
            type: '() => string',
            description: t.sessionInlineRead,
          },
        ]}
        from={FROM}
        id="define-session-state"
        name="defineSessionState"
        params={[
          { name: 'key', type: 'string', description: t.sessionKeyParam },
          { name: 'schema', type: 'StateSchema', description: t.schemaParam },
        ]}
        returns={{
          type: 'SessionState<Schema>',
          description: t.sessionReturns,
        }}
        signature={`defineSessionState<Schema>(
  key: string,
  schema: Schema,
): SessionState<Schema>`}
        summary={t.sessionSummary}
      />

      <ApiEntry
        caveats={t.cookieCaveats}
        fields={[
          { name: 'kind', type: "'cookie'", description: t.fieldKind },
          { name: 'key', type: 'string', description: t.fieldKey },
          { name: 'schema', type: 'Schema', description: t.fieldSchema },
          {
            name: 'cookieName',
            type: 'string',
            description: t.cookieName,
          },
          {
            name: 'parseCookies',
            type: '(cookies: ReadonlyMap<string, string>) => output<Schema>',
            description: t.cookieParse,
          },
          {
            name: 'cookieValue',
            type: '(values?) => string',
            description: t.cookieValue,
          },
        ]}
        from={FROM}
        id="define-cookie-state"
        name="defineCookieState"
        params={[
          { name: 'key', type: 'string', description: t.cookieKeyParam },
          { name: 'schema', type: 'StateSchema', description: t.schemaParam },
          {
            name: 'versioning',
            type: 'Versioning',
            description: t.versioningParam,
          },
        ]}
        returns={{ type: 'CookieState<Schema>', description: t.cookieReturns }}
        signature={`defineCookieState<Schema>(
  key: string,
  schema: Schema,
  versioning?: Versioning<Schema>,
): CookieState<Schema>`}
        summary={t.cookieSummary}
      />

      <ApiEntry
        caveats={t.memoryCaveats}
        fields={[
          { name: 'kind', type: "'memory'", description: t.fieldKind },
          { name: 'key', type: 'string', description: t.fieldKey },
          {
            name: 'initial',
            type: 'Readonly<Values>',
            description: t.memoryInitialField,
          },
        ]}
        from={FROM}
        id="define-memory-state"
        name="defineMemoryState"
        params={[
          { name: 'key', type: 'string', description: t.memoryKeyParam },
          { name: 'initial', type: 'Values', description: t.memoryInitial },
        ]}
        returns={{
          type: 'MemoryState<Values>',
          description: t.memoryReturns,
        }}
        signature={`defineMemoryState<Values>(
  key: string,
  initial: Values,
): MemoryState<Values>`}
        summary={t.memorySummary}
      />

      <ApiEntry
        caveats={t.appStateCaveats}
        from={FROM}
        id="use-app-state"
        name="useAppState"
        params={[
          { name: 'def', type: 'AnyState', description: t.appStateDef },
          {
            name: 'keys',
            type: 'readonly Key[]',
            description: t.appStateKeys,
          },
          {
            name: 'options',
            type: '{ initialUrl? } | { initialCookie? }',
            description: t.appStateOptions,
          },
        ]}
        returns={{
          type: '[state, update]',
          description: t.appStateReturns,
        }}
        signature={`useAppState(def, options?): [state, update]
useAppState(def, keys, options?): [Pick<state, Key>, update]`}
        summary={t.appStateSummary}
      >
        <CodeBlock code={APP_STATE_EXAMPLE} lang="tsx" title="pager.tsx" />
      </ApiEntry>

      <ApiEntry
        caveats={t.handleCaveats}
        fields={[
          {
            name: 'committed',
            type: 'Promise<void>',
            description: t.handleCommitted,
          },
          {
            name: 'finished',
            type: 'Promise<void>',
            description: t.handleFinished,
          },
        ]}
        from={FROM}
        id="update-handle"
        name="UpdateHandle"
        signature={`type UpdateHandle = {
  committed: Promise<void>;
  finished: Promise<void>;
};`}
        summary={t.handleSummary}
      />

      <ApiEntry
        caveats={t.optionsCaveats}
        fields={[
          {
            name: 'history',
            type: "'push' | 'replace'",
            description: t.optionsHistory,
          },
        ]}
        from={FROM}
        id="update-options"
        name="UpdateOptions"
        signature={`type UpdateOptions = {
  history?: 'push' | 'replace';
};`}
        summary={t.optionsSummary}
      />

      <ApiEntry
        caveats={t.versioningCaveats}
        fields={[
          { name: 'version', type: 'number', description: t.versioningVersion },
          {
            name: 'migrate',
            type: '(old, fromVersion) => values',
            description: t.versioningMigrate,
          },
        ]}
        from={FROM}
        id="versioning"
        name="Versioning"
        signature={`type Versioning<Schema> = {
  version: number;
  migrate: (
    old: Readonly<Record<string, unknown>>,
    fromVersion: number,
  ) => { readonly [Key in keyof input<Schema>]?: unknown };
};`}
        summary={t.versioningSummary}
      />

      <ApiEntry
        caveats={t.registerCaveats}
        fields={[
          {
            name: 'routes',
            type: 'typeof routes',
            description: t.registerRoutes,
          },
          { name: 'path', type: 'string', description: t.registerPath },
        ]}
        from={FROM}
        id="register"
        name="Register"
        signature={`declare module '@k8ordo/state' {
  interface Register {
    routes: typeof routes;
  }
}`}
        summary={t.registerSummary}
      />

      <ApiEntry
        caveats={t.resetCaveats}
        from={FROM}
        id="reset-state-registry"
        name="resetStateRegistry"
        signature="resetStateRegistry(): void"
        summary={t.resetSummary}
      />

      <ApiEntry
        caveats={t.outputOfCaveats}
        from={FROM}
        id="output-of"
        name="OutputOf"
        signature={`type OutputOf<Schema> = Schema extends StateSchema
  ? output<Schema>
  : Record<never, never>;`}
        summary={t.outputOfSummary}
      />

      <ApiEntry
        from={FROM}
        id="state-schema"
        name="StateSchema"
        signature={`type StateSchema<Shape extends $ZodShape = $ZodShape> =
  $ZodObject<Shape> & { shape: Shape };`}
        summary={t.stateSchemaSummary}
      />

      <ApiEntry
        from={FROM}
        id="url-input"
        name="UrlInput"
        signature={`type UrlInput =
  | URLSearchParams
  | Readonly<Record<string, string | readonly string[] | undefined>>;`}
        summary={t.urlInputSummary}
      />

      <ApiEntry
        from={FROM}
        id="any-state"
        name="AnyState"
        signature={`type AnyState =
  | PageState
  | LocalState
  | SessionState
  | CookieState
  | MemoryState;`}
        summary={t.anyStateSummary}
      />
    </DocPage>
  );
}
