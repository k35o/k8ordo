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
      <DocSection id="define" title={t.defineTitle}>
        <CodeBlock
          code={ENTRY}
          lang="ts"
          marks={{ 5: 'highlight', 7: 'highlight' }}
          title="orders-state.ts"
        />
        <p>
          <Rich>{t.defineWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.defineTyped()}</Rich>
        </p>
        <p>
          <Rich>{t.defineServer()}</Rich>
        </p>
      </DocSection>

      <DocSection id="both" title={t.bothTitle}>
        <CodeBlock code={BOTH} lang="tsx" marks={{ 10: 'highlight' }} />
        <p>
          <Rich>{t.bothFlat()}</Rich>
        </p>
        <p>
          <Rich>{t.bothMove()}</Rich>
        </p>
        <p>
          <Rich>{t.bothDisjoint()}</Rich>
        </p>
      </DocSection>

      <DocSection id="atomic" title={t.atomicTitle}>
        <CodeBlock
          callouts={{
            1: t.atomicNavigateCallout(),
            3: t.atomicEntryCallout(),
          }}
          code={WRITES}
          lang="ts"
        />
        <p>
          <Rich>{t.atomicIntro()}</Rich>
        </p>
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

      <DocSection id="restore" title={t.restoreTitle}>
        <p>
          <Rich>{t.restoreIntro()}</Rich>
        </p>
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
