import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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

const ABSENCE = `import * as z from 'zod';

export const listState = definePageState('product-list', {
  url: z.object({
    page: z.coerce.number().int().min(1),
  }),
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
      <DocSection id="six" title={t.sixTitle}>
        <CodeBlock code={SIX} lang="ts" title="src/state.ts" />
        <p>
          <Rich>{t.sixFunction()}</Rich>
        </p>
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

      <DocSection id="scope" title={t.scopeTitle}>
        <p>
          <Rich>{t.scopePage()}</Rich>
        </p>
        <p>
          <Rich>{t.scopeApp()}</Rich>
        </p>
      </DocSection>

      <DocSection id="choose" title={t.chooseTitle}>
        <p>
          <Rich>{t.chooseOrder()}</Rich>
        </p>
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
            <LocaleAnchor path="/:locale/state/cookie">
              {m.state.navCookie()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="key" title={t.keyTitle}>
        <p>
          <Rich>{t.keyFirstArgument()}</Rich>
        </p>
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

      <DocSection id="schema" title={t.schemaTitle}>
        <CodeBlock
          code={ABSENCE}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="src/state.ts"
        />
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

      <DocSection id="mini" title={t.miniTitle}>
        <CodeBlock
          code={MINI}
          lang="ts"
          marks={{ 1: 'highlight', 5: 'highlight', 6: 'highlight' }}
          title="src/state.ts"
        />
        <p>
          <Rich>{t.miniBundle()}</Rich>
        </p>
        <p>
          <Rich>{t.miniSpelling()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
