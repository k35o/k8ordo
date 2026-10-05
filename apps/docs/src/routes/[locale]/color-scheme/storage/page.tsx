import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeStorage;

const DEFINITION = `import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const colorSchemeState = defineLocalState(
  'color-scheme',
  z.object({ preference: z.optional(z.enum(['light', 'dark'])) }),
);`;

const READ = `'use client';

import { colorSchemeState } from '@k8ordo/color-scheme';
import { useAppState } from '@k8ordo/state';

export function StoredPreference() {
  const [{ preference }] = useAppState(colorSchemeState);

  return <output>{preference ?? 'nothing chosen'}</output>;
}`;

const BESIDE = `import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const writingModeState = defineLocalState(
  'writing-mode',
  z.object({ mode: z.optional(z.enum(['horizontal', 'vertical'])) }),
);`;

export default function ColorSchemeStoragePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/storage">
      <DocSection
        description={t.definitionDescription}
        id="definition"
        title={t.definitionTitle}
      >
        <CodeBlock
          code={DEFINITION}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="scheme.ts"
        />
        <p>
          <Rich>{t.definitionKey()}</Rich>
        </p>
        <p>
          <Rich>{t.definitionOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.rowsDescription} id="rows" title={t.rowsTitle}>
        <ul>
          {[t.rowsNever, t.rowsDark, t.rowsLight, t.rowsSystem].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.rowsSame()}</Rich>
        </p>
        <p>
          <Rich>{t.rowsDefault()}</Rich>
        </p>
        <p>
          <Rich>{t.rowsTiming()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.readDescription} id="read" title={t.readTitle}>
        <CodeBlock
          code={READ}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="stored-preference.tsx"
        />
        <p>
          <Rich>{t.readCaveat()}</Rich>
        </p>
        <p>
          <Rich>{t.readInline()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/state/before-hydration">
            {t.readInlineLink()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.tabsDescription} id="tabs" title={t.tabsTitle}>
        <Pitfall>
          <p>
            <Rich>{t.tabsSameTab()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.besideDescription}
        id="beside"
        title={t.besideTitle}
      >
        <CodeBlock code={BESIDE} lang="ts" title="state.ts" />
        <p>
          <Rich>{t.besideModule()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.besideCollision()}</Rich>
          </p>
        </Pitfall>
        <p>
          <LocaleAnchor path="/:locale/state/places">
            {t.besideLink()}
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
