import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.statePlaces;

const SIX = `import {
  defineCookieState,
  defineLocalState,
  defineMemoryState,
  definePageState,
  defineSessionState,
} from '@k8ordo/state';
import * as z from 'zod';

export const listState = definePageState('product-list', {
  url: z.object({
    page: z.coerce.number().int().min(1).default(1),
  }),
  entry: z.object({
    expanded: z.array(z.string()).default([]),
  }),
});

export const prefs = defineLocalState(
  'prefs',
  z.object({ view: z.enum(['grid', 'table']).default('grid') }),
);

export const notices = defineSessionState(
  'notices',
  z.object({ dismissed: z.array(z.string()).default([]) }),
);

export const density = defineCookieState(
  'density',
  z.object({
    density: z
      .enum(['comfortable', 'compact'])
      .default('comfortable'),
  }),
);

export const palette = defineMemoryState('command-palette', {
  open: false,
});`;

const MINI = `import * as z from 'zod/mini';

export const listState = definePageState('product-list', {
  url: z.object({
    inStock: z._default(z.stringbool(), false),
    page: z._default(
      z.coerce.number().check(z.int(), z.gte(1)),
      1,
    ),
  }),
});`;

export default function StatePlacesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/places">
      <DocSection description={t.sixDescription} id="six" title={t.sixTitle}>
        <CodeBlock code={SIX} lang="ts" title="state.ts" />
        <ul>
          {[
            t.sixUrl,
            t.sixEntry,
            t.sixLocal,
            t.sixSession,
            t.sixCookie,
            t.sixMemory,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.sixSameHook()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.scopeDescription}
        id="scope"
        title={t.scopeTitle}
      >
        <p>
          <Rich>{t.scopePage()}</Rich>
        </p>
        <p>
          <Rich>{t.scopeApp()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.chooseDescription}
        id="choose"
        title={t.chooseTitle}
      >
        <ol>
          {[
            t.chooseUrl,
            t.chooseEntry,
            t.choosePreference,
            t.chooseSession,
            t.chooseMemory,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ol>
        <Pitfall>
          <p>
            <Rich>{t.chooseSecret()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection description={t.keyDescription} id="key" title={t.keyTitle}>
        <ul>
          {[t.keyPage, t.keyStorage, t.keyCookie, t.keyRegistry].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.keyRename()}</Rich>
        </p>
        <p>
          <Rich>{t.keyShared()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.keyColorScheme()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.schemaDescription}
        id="schema"
        title={t.schemaTitle}
      >
        <p>
          <Rich>{t.schemaInput()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaAbsence()}</Rich>
        </p>
        <p>
          <Rich>{t.schemaMemory()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.miniDescription} id="mini" title={t.miniTitle}>
        <CodeBlock
          code={MINI}
          lang="ts"
          marks={{ 1: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="state.ts"
        />
        <p>
          <Rich>{t.miniSpelling()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
