import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkModes;

const CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'server' })],
});`;

const REFUSED = `static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:
  src/lib/session.ts
this application wants mode: 'server'`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function FrameworkModesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/framework/modes">
      <DocSection id="choose" title={t.chooseTitle}>
        <p>
          <Rich>{t.chooseServer()}</Rich>
        </p>
        <Items items={t.chooseList} />
        <p>
          <Rich>{t.chooseStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.chooseFallback()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.chooseStart()}</Rich>
        </p>
      </DocSection>

      <DocSection id="differences" title={t.differencesTitle}>
        <Items items={t.differencesList} />
      </DocSection>

      <DocSection id="switch" title={t.switchTitle}>
        <CodeBlock
          code={CONFIG}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.switchMode()}</Rich>
        </p>
        <p>
          <Rich>{t.switchOptions()}</Rich>
          {t.sentenceGap()}
          <Rich>{t.switchDeploy()}</Rich>
          <LocaleAnchor path="/:locale/framework/deploy">
            {m.framework.navDeploy()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.switchToStatic()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refused" title={t.refusedTitle}>
        <CodeBlock code={REFUSED} lang="text" title="vite build" />
        <p>
          <Rich>{t.refusedLead()}</Rich>
        </p>
        <Items items={t.refusedList} />
        <p>
          <Rich>{t.refusedWants()}</Rich>
          {t.sentenceGap()}
          <Rich>{t.refusedTypes()}</Rich>
        </p>
        <p>
          <Rich>{t.refusedBeyond()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
