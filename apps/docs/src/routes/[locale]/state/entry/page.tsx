import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { OrdersDemo } from '../../../../demos/state/entry/orders-demo';
import * as m from '../../../../messages';

const t = m.stateEntry;

const ENTRY = `import { definePageState } from '@k8ordo/state';
import * as z from 'zod';

export const ordersState = definePageState('orders', {
  entry: z.object({
    expanded: z.array(z.string()).default([]),
    showNotes: z.boolean().default(false),
  }),
});`;

const BOTH = `export const ordersState = definePageState('orders', {
  url: z.object({
    status: z.enum(['all', 'pending', 'shipped']).default('all'),
  }),
  entry: z.object({
    expanded: z.array(z.string()).default([]),
  }),
});

const [{ status, expanded }, update] = useAppState(ordersState);`;

const WRITES = `update({ status: 'pending' }, { history: 'push' });

update({ expanded: ['A-102'] });`;

export default function StateEntryPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/entry">
      <DocSection
        description={t.defineDescription}
        id="define"
        title={t.defineTitle}
      >
        <CodeBlock
          code={ENTRY}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="orders-state.ts"
        />
        <p>
          <Rich>{t.defineTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.defineOwnOutput()}</Rich>
        </p>
        <p>
          <Rich>{t.defineServer()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.bothDescription} id="both" title={t.bothTitle}>
        <CodeBlock code={BOTH} lang="tsx" marks={{ 10: 'highlight' }} />
        <p>
          <Rich>{t.bothMove()}</Rich>
        </p>
        <p>
          <Rich>{t.bothDisjoint()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.atomicDescription}
        id="atomic"
        title={t.atomicTitle}
      >
        <CodeBlock
          callouts={{
            1: t.atomicNavigateCallout(),
            3: t.atomicEntryCallout(),
          }}
          code={WRITES}
          lang="ts"
        />
        <ul>
          {[t.atomicUrl, t.atomicEntryOnly].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.atomicCarry()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.restoreDescription}
        id="restore"
        title={t.restoreTitle}
      >
        <ul>
          {[
            t.restoreTraverse,
            t.restoreReload,
            t.restoreNewTab,
            t.restoreLink,
            t.restoreSession,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <OrdersDemo />
      </Playground>
    </DocPage>
  );
}
