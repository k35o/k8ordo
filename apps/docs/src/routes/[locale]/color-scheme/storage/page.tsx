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

export default function ColorSchemeStoragePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/storage">
      <DocSection id="definition" title={t.definitionTitle}>
        <CodeBlock
          callouts={{
            5: t.definitionKeyCallout(),
            6: t.definitionOptionalCallout(),
          }}
          code={DEFINITION}
          lang="ts"
          marks={{ 5: 'highlight', 6: 'highlight' }}
          title="scheme.ts"
        />
        <p>
          <Rich>{t.definitionStateBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/storage">
            {m.state.navStorage()}
          </LocaleAnchor>
          <Rich>{t.definitionStateAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.definitionKey()}</Rich>
        </p>
        <p>
          <Rich>{t.definitionOptional()}</Rich>
        </p>
      </DocSection>

      <DocSection id="rows" title={t.rowsTitle}>
        <p>
          <Rich>{t.rowsWhen()}</Rich>
        </p>
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
          <Rich>{t.rowsDefaultBefore()}</Rich>
          <LocaleAnchor path="/:locale/color-scheme/switcher">
            {m.colorScheme.navSwitcher()}
          </LocaleAnchor>
          <Rich>{t.rowsDefaultAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="read" title={t.readTitle}>
        <CodeBlock
          code={READ}
          lang="tsx"
          marks={{ 7: 'highlight' }}
          title="stored-preference.tsx"
        />
        <p>
          <Rich>{t.readHook()}</Rich>
        </p>
        <p>
          <Rich>{t.readScheme()}</Rich>
        </p>
        <p>
          <Rich>{t.readInlineBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/before-hydration">
            {m.state.navBeforeHydration()}
          </LocaleAnchor>
          <Rich>{t.readInlineAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="tabs" title={t.tabsTitle}>
        <p>
          <Rich>{t.tabsSync()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.tabsSameTab()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="beside" title={t.besideTitle}>
        <p>
          <Rich>{t.besideOwnBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/storage">
            {m.state.navStorage()}
          </LocaleAnchor>
          <Rich>{t.besideOwnAfter()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.besideCollision()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
