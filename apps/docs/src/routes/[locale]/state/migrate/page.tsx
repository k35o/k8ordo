import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateMigrate;

const SALVAGE = `{"layout":"list","pageSize":50}
{"view":"grid","pageSize":50}`;

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
      <DocSection id="salvage" title={t.salvageTitle}>
        <CodeBlock
          callouts={{
            1: t.salvageBeforeCallout(),
            2: t.salvageAfterCallout(),
          }}
          code={SALVAGE}
          lang="json"
        />
        <p>
          <Rich>{t.salvageField()}</Rich>
        </p>
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

      <DocSection id="version" title={t.versionTitle}>
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

      <DocSection id="flow" title={t.flowTitle}>
        <p>
          <Rich>{t.flowLead()}</Rich>
        </p>
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

      <DocSection id="second-change" title={t.secondChangeTitle}>
        <CodeBlock
          code={V2}
          lang="ts"
          marks={{ 5: 'highlight', 8: 'highlight', 10: 'highlight' }}
          title="prefs.ts"
        />
        <p>
          <Rich>{t.secondChangeStory()}</Rich>
        </p>
      </DocSection>

      <DocSection id="edges" title={t.edgesTitle}>
        <p>
          <Rich>{t.edgesLead()}</Rich>
        </p>
        <ul>
          {[t.edgesNewer, t.edgesThrow, t.edgesAdopt].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
          <li>
            <Rich>{t.edgesInlineRead()}</Rich>
            <LocaleAnchor path="/:locale/state/before-hydration">
              {m.state.navBeforeHydration()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
          <li>
            <Rich>{t.edgesSession()}</Rich>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
