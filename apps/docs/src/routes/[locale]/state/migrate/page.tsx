import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateMigrate;

const V1 = `export const prefs = defineLocalState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
    pageSize: z.number().default(20),
  }),
  {
    version: 1,
    migrate: (old) => ({
      view: old['layout'] === 'list' ? 'table' : 'grid',
      pageSize: old['pageSize'],
    }),
  },
);`;

const ROWS = `{"layout":"list","pageSize":50}
[1,{"view":"table","pageSize":50}]`;

const V2 = `export const prefs = defineLocalState(
  'prefs',
  z.object({
    view: z.enum(['grid', 'table']).default('grid'),
    perPage: z.number().default(20),
  }),
  {
    version: 2,
    migrate: (old, fromVersion) => {
      if (fromVersion === 0) {
        return {
          view: old['layout'] === 'list' ? 'table' : 'grid',
          perPage: old['pageSize'],
        };
      }
      return { view: old['view'], perPage: old['pageSize'] };
    },
  },
);`;

export default function StateMigratePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/migrate">
      <DocSection
        description={t.salvageDescription}
        id="salvage"
        title={t.salvageTitle}
      >
        <ul>
          {[
            t.salvageAdded,
            t.salvageTightened,
            t.salvageRenamed,
            t.salvageMeaning,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.salvageWhen()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.versionDescription}
        id="version"
        title={t.versionTitle}
      >
        <CodeBlock
          code={V1}
          lang="ts"
          marks={{
            8: 'highlight',
            9: 'highlight',
            10: 'highlight',
            11: 'highlight',
            12: 'highlight',
          }}
          title="prefs.ts"
        />
        <p>
          <Rich>{t.versionStory()}</Rich>
        </p>
        <p>
          <Rich>{t.versionEnvelope()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 1: t.rowBeforeCallout(), 2: t.rowAfterCallout() }}
          code={ROWS}
          lang="json"
          title="localStorage: k8ordo-state:prefs"
        />
        <p>
          <Rich>{t.versionPositive()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.flowDescription} id="flow" title={t.flowTitle}>
        <ol>
          {[t.flowMigrate, t.flowSalvage, t.flowWriteBack].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ol>
        <p>
          <Rich>{t.flowKeys()}</Rich>
        </p>
        <p>
          <Rich>{t.flowCookie()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.nextDescription} id="next" title={t.nextTitle}>
        <CodeBlock
          code={V2}
          lang="ts"
          marks={{ 5: 'highlight', 8: 'highlight', 10: 'highlight' }}
          title="prefs.ts"
        />
        <p>
          <Rich>{t.nextStory()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.edgesDescription}
        id="edges"
        title={t.edgesTitle}
      >
        <ul>
          {[
            t.edgesNewer,
            t.edgesThrow,
            t.edgesAdopt,
            t.edgesInlineRead,
            t.edgesSession,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.edgesWithout()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
