import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateBeforeHydration;

const THEME = `import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod';

export const themeState = defineLocalState(
  'theme',
  z.object({ mode: z.enum(['light', 'dark']).optional() }),
);`;

const ACCESSORS = `themeState.storageKey;
// 'k8ordo-state:theme'

themeState.inlineRead();
// '(()=>{try{const v=JSON.parse(localStorage.getItem("k8ordo-state:theme"));…})()'`;

const LAYOUT = `import type { ReactNode } from 'react';

import { themeState } from '../state';

const applyTheme = \`(() => {
  const s = \${themeState.inlineRead()};
  if (s && s.mode === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();\`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>{applyTheme}</script>
      </head>
      <body>{children}</body>
    </html>
  );
}`;

export default function StateBeforeHydrationPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/state/before-hydration"
    >
      <DocSection id="why" title={t.whyTitle}>
        <CodeBlock code={THEME} lang="ts" title="src/state.ts" />
        <CodeBlock
          code={ACCESSORS}
          lang="ts"
          marks={{ 1: 'highlight', 4: 'highlight' }}
        />
        <p>
          <Rich>{t.whyKey()}</Rich>
        </p>
        <p>
          <Rich>{t.whyDrift()}</Rich>
        </p>
        <p>
          <Rich>{t.whyCookie()}</Rich>
          <Rich>{t.whyCookieSee()}</Rich>
          <LocaleAnchor path="/:locale/framework/request">
            {m.framework.navRequest()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="embed" title={t.embedTitle}>
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 6: 'highlight', 18: 'highlight', 20: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <p>
          <Rich>{t.embedValue()}</Rich>
        </p>
        <p>
          <Rich>{t.embedSuppress()}</Rich>
        </p>
      </DocSection>

      <DocSection id="null" title={t.nullTitle}>
        <p>
          <Rich>{t.nullLead()}</Rich>
        </p>
        <ul>
          {[
            t.nullNothing,
            t.nullCorrupt,
            t.nullNotObject,
            t.nullUnreadable,
            t.nullVersion,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="raw" title={t.rawTitle}>
        <p>
          <Rich>{t.rawSchema()}</Rich>
        </p>
        <p>
          <Rich>{t.rawFields()}</Rich>
        </p>
        <Note>
          <p>
            <LocaleAnchor path="/:locale/color-scheme">
              @k8ordo/color-scheme
            </LocaleAnchor>
            <Rich>{t.rawColorScheme()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
