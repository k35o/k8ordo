import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { CountsDemo } from './_parts/counts-demo';

const t = m.stateStorage;

const LOCAL = `import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod';

export const prefs = defineLocalState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
    pageSize: z.number().default(20),
  }),
);`;

const LOCAL_USE = `const [{ view }, update] = useAppState(prefs, ['view']);

update({ view: 'table' });`;

const SESSION = `import { defineSessionState } from '@k8ordo/state';
import * as z from 'zod';

export const notices = defineSessionState(
  'notices',
  z.object({ dismissed: z.array(z.string()).default([]) }),
);`;

const MEMORY = `import { defineMemoryState } from '@k8ordo/state';

export const palette = defineMemoryState('command-palette', {
  open: false,
  query: '',
});

type Panel = { tab: 'logs' | 'network' };

export const panel = defineMemoryState<Panel>('debug-panel', {
  tab: 'logs',
});`;

export default function StateStoragePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/storage">
      <DocSection
        description={t.localDescription}
        id="local"
        title={t.localTitle}
      >
        <CodeBlock code={LOCAL} lang="ts" title="prefs.ts" />
        <CodeBlock code={LOCAL_USE} lang="tsx" title="view-switch.tsx" />
        <p>
          <Rich>{t.localRow()}</Rich>
        </p>
        <p>
          <Rich>{t.localJson()}</Rich>
        </p>
        <p>
          <Rich>{t.localServer()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.tabsDescription}
        id="tabs"
        title={t.tabsTitle}
      >
        <p>
          <Rich>{t.tabsKeys()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.sessionDescription}
        id="session"
        title={t.sessionTitle}
      >
        <CodeBlock code={SESSION} lang="ts" title="notices.ts" />
        <p>
          <Rich>{t.sessionLifetime()}</Rich>
        </p>
        <p>
          <Rich>{t.sessionSame()}</Rich>
        </p>
        <p>
          <Rich>{t.sessionKinds()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.memoryDescription}
        id="memory"
        title={t.memoryTitle}
      >
        <CodeBlock
          code={MEMORY}
          lang="ts"
          marks={{ 10: 'highlight' }}
          title="palette.ts"
        />
        <p>
          <Rich>{t.memoryNoSchema()}</Rich>
        </p>
        <p>
          <Rich>{t.memoryEach()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.memoryImmutable()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <CountsDemo />
      </Playground>
    </DocPage>
  );
}
