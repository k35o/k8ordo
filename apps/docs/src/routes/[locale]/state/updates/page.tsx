import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { WritesDemo } from '../../../../demos/state/updates/writes-demo';
import * as m from '../../../../messages';

const t = m.stateUpdates;

const PATCH = `const [{ inStock, page }, update] = useAppState(listState);

update({ inStock: true, page: 1 });`;

const HISTORY = `update({ inStock: true, page: 1 });
update({ page: page + 1 }, { history: 'push' });`;

const BATCH = `const clear = () => {
  update({ inStock: false });
  update({ page: 1 });
};`;

const HANDLE = `const { committed, finished } = update({ page: 2 });`;

const FOCUS = `const heading = useRef<HTMLHeadingElement>(null);

const onNext = async () => {
  await update({ page: page + 1 }, { history: 'push' }).finished;
  heading.current?.focus();
};`;

const FUNCTIONAL = `update((current) => ({ page: current.page + 1 }));`;

const KEYS = `useAppState(listState);
useAppState(listState, ['page']);
useAppState(listState, []);
useAppState(listState, ['page'], { initialUrl });`;

const SEARCH_BOX = `export function SearchBox() {
  const [{ q }, update] = useAppState(catalogState, ['q']);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        update({ q: String(data.get('q') ?? ''), page: 1 });
      }}
    >
      <input defaultValue={q} key={q} name="q" type="search" />
      <button type="submit">Search</button>
    </form>
  );
}`;

export default function StateUpdatesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/updates">
      <DocSection
        description={t.patchDescription}
        id="patch"
        title={t.patchTitle}
      >
        <CodeBlock code={PATCH} lang="tsx" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.patchSync()}</Rich>
        </p>
        <p>
          <Rich>{t.patchUnknown()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.validateDescription}
        id="validate"
        title={t.validateTitle}
      >
        <p>
          <Rich>{t.validateUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.validateThrow()}</Rich>
        </p>
        <p>
          <Rich>{t.validateMemory()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.historyDescription}
        id="history"
        title={t.historyTitle}
      >
        <CodeBlock
          callouts={{
            1: t.historyReplaceCallout(),
            2: t.historyPushCallout(),
          }}
          code={HISTORY}
          lang="tsx"
        />
        <p>
          <Rich>{t.historyPush()}</Rich>
        </p>
        <p>
          <Rich>{t.historyPageOnly()}</Rich>
        </p>
        <p>
          <Rich>{t.historyNavigateTo()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.batchDescription}
        id="batch"
        title={t.batchTitle}
      >
        <CodeBlock code={BATCH} lang="tsx" />
        <p>
          <Rich>{t.batchAwait()}</Rich>
        </p>
        <ul>
          {[
            t.batchUrl,
            t.batchEntry,
            t.batchStorage,
            t.batchCookie,
            t.batchMemory,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.batchSame()}</Rich>
        </p>
        <p>
          <Rich>{t.batchShared()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.handleDescription}
        id="handle"
        title={t.handleTitle}
      >
        <CodeBlock code={HANDLE} lang="ts" />
        <ul>
          {[t.handleCommitted, t.handleFinished].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.handleIgnore()}</Rich>
        </p>
        <p>
          <Rich>{t.handleWait()}</Rich>
        </p>
        <CodeBlock
          code={FOCUS}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="pager.tsx"
        />
        <p>
          <Rich>{t.handleAbort()}</Rich>
        </p>
        <p>
          <Rich>{t.handleSettle()}</Rich>
        </p>
        <p>
          <Rich>{t.handleFail()}</Rich>
        </p>
        <p>
          <Rich>{t.handleAction()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.functionalDescription}
        id="functional"
        title={t.functionalTitle}
      >
        <CodeBlock code={FUNCTIONAL} lang="tsx" />
        <p>
          <Rich>{t.functionalBatch()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.keysDescription} id="keys" title={t.keysTitle}>
        <CodeBlock
          callouts={{
            1: t.keysAllCallout(),
            2: t.keysPageCallout(),
            3: t.keysNoneCallout(),
          }}
          code={KEYS}
          lang="tsx"
        />
        <p>
          <Rich>{t.keysInline()}</Rich>
        </p>
        <p>
          <Rich>{t.keysCompare()}</Rich>
        </p>
        <p>
          <Rich>{t.keysSplit()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.draftsDescription}
        id="drafts"
        title={t.draftsTitle}
      >
        <CodeBlock
          code={SEARCH_BOX}
          lang="tsx"
          marks={{ 9: 'highlight', 12: 'highlight' }}
          title="search-box.tsx"
        />
        <p>
          <Rich>{t.draftsKey()}</Rich>
        </p>
        <p>
          <Rich>{t.draftsGetBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/search">
            {m.form.navSearch()}
          </LocaleAnchor>
          <Rich>{t.draftsGetAfter()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.draftsMirror()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <WritesDemo />
      </Playground>
    </DocPage>
  );
}
