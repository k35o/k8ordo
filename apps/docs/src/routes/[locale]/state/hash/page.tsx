import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateHash;

const HASH = `import { definePageState, useAppState } from '@k8ordo/state';
import * as z from 'zod';

export const deckState = definePageState('deck', {
  url: z.object({ mode: z.enum(['view', 'present']).default('view') }),
  hash: z.coerce.number().int().min(1).default(1),
});

// /slides/intro#3
const [{ hash, mode }, update] = useAppState(deckState);
// hash === 3`;

const WRITES = `update({ hash: 4 }); // /slides/intro#4

update({ hash: 5 }, { history: 'push' });

update({ hash: 1 }); // /slides/intro`;

const LINK = `deckState.href('/slides/intro', { hash: 4 });
// '/slides/intro#4'`;

export default function StateHashPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/hash">
      <DocSection id="define" title={t.defineTitle}>
        <CodeBlock
          code={HASH}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="deck-state.ts"
        />
        <p>
          <Rich>{t.defineOne()}</Rich>
        </p>
        <p>
          <Rich>{t.defineRules()}</Rich>
        </p>
        <p>
          <Rich>{t.defineServer()}</Rich>
        </p>
      </DocSection>

      <DocSection id="write" title={t.writeTitle}>
        <CodeBlock code={WRITES} lang="ts" />
        <p>
          <Rich>{t.writeLike()}</Rich>
        </p>
        <p>
          <Rich>{t.writeScroll()}</Rich>
        </p>
        <CodeBlock code={LINK} lang="ts" />
        <p>
          <Rich>{t.writeLink()}</Rich>
        </p>
      </DocSection>

      <DocSection id="anchor" title={t.anchorTitle}>
        <p>
          <Rich>{t.anchorRead()}</Rich>
        </p>
        <p>
          <Rich>{t.anchorKeep()}</Rich>
        </p>
        <p>
          <Rich>{t.anchorFollow()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
