import { Note, Pitfall } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { WritesDemo } from '../../../../demos/state/updates/writes-demo';
import * as m from '../../../../messages';

const t = m.stateUpdates;

const PATCH = `const [{ inStock, page }, update] = useAppState(listState);

update({ inStock: true, page: 1 });`;

const VALIDATE = `update({ page: 0 });`;

const HISTORY = `update({ inStock: true, page: 1 });
update({ page: page + 1 }, { history: 'push' });`;

const BATCH = `const clear = () => {
  update({ inStock: false });
  update({ page: 1 });
};`;

const HANDLE = `const { committed, finished } = update({ page: 2 });`;

const PAGE_TURN = `export function Results() {
  const [{ page }, update] = useAppState(listState, ['page']);
  const heading = useRef<HTMLHeadingElement>(null);

  const turn = async (next: number) => {
    await update({ page: next }, { history: 'push' }).finished;
    heading.current?.focus();
  };

  return (
    <section>
      <h2 ref={heading} tabIndex={-1}>
        Results
      </h2>
      <ProductList page={page} />
      <button onClick={() => void turn(page + 1)} type="button">
        Next page
      </button>
    </section>
  );
}`;

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
      <DocSection id="patch" title={t.patchTitle}>
        <CodeBlock code={PATCH} lang="tsx" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.patchObject()}</Rich>
        </p>
        <p>
          <Rich>{t.patchSync()}</Rich>
        </p>
        <p>
          <Rich>{t.patchUnknown()}</Rich>
        </p>
      </DocSection>

      <DocSection id="validate" title={t.validateTitle}>
        <CodeBlock
          callouts={{ 1: t.validateCallout() }}
          code={VALIDATE}
          lang="tsx"
        />
        <p>
          <Rich>{t.validateSchema()}</Rich>
        </p>
        <p>
          <Rich>{t.validateThrow()}</Rich>
        </p>
        <p>
          <Rich>{t.validateMemory()}</Rich>
        </p>
      </DocSection>

      <DocSection id="history" title={t.historyTitle}>
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
          <Rich>{t.historyPageChange()}</Rich>
        </p>
      </DocSection>

      <DocSection id="batch" title={t.batchTitle}>
        <CodeBlock code={BATCH} lang="tsx" />
        <p>
          <Rich>{t.batchOne()}</Rich>
        </p>
        <p>
          <Rich>{t.batchBy()}</Rich>
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
          <Rich>{t.batchThin()}</Rich>
        </p>
        <p>
          <Rich>{t.batchSame()}</Rich>
          <LocaleAnchor path="/:locale/state/how-it-works">
            {m.state.navHowItWorks()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="handle" title={t.handleTitle}>
        <CodeBlock code={HANDLE} lang="ts" />
        <p>
          <Rich>{t.handleShape()}</Rich>
        </p>
        <ul>
          {[t.handleCommitted, t.handleFinished].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.handleWait()}</Rich>
        </p>
        <p>
          <Rich>{t.handleSettle()}</Rich>
        </p>
        <ul>
          {[t.handleAbort, t.handleFail].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <Note>
          <p>
            <Rich>{t.handleAction()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="page-turn" title={t.pageTurnTitle}>
        <CodeBlock
          code={PAGE_TURN}
          lang="tsx"
          marks={{ 6: 'highlight', 7: 'highlight', 12: 'highlight' }}
          title="results.tsx"
        />
        <p>
          <Rich>{t.pageTurnKeep()}</Rich>
        </p>
        <p>
          <Rich>{t.pageTurnFocus()}</Rich>
        </p>
      </DocSection>

      <DocSection id="functional" title={t.functionalTitle}>
        <CodeBlock code={FUNCTIONAL} lang="tsx" />
        <p>
          <Rich>{t.functionalBatch()}</Rich>
        </p>
        <p>
          <Rich>{t.functionalTwice()}</Rich>
        </p>
      </DocSection>

      <DocSection id="keys" title={t.keysTitle}>
        <CodeBlock
          callouts={{
            1: t.keysAllCallout(),
            2: t.keysPageCallout(),
            3: t.keysNoneCallout(),
            4: t.keysOptionsCallout(),
          }}
          code={KEYS}
          lang="tsx"
        />
        <p>
          <Rich>{t.keysInline()}</Rich>
        </p>
        <p>
          <Rich>{t.keysCompare()}</Rich>
          <LocaleAnchor path="/:locale/state/how-it-works">
            {m.state.navHowItWorks()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.keysSplit()}</Rich>
        </p>
      </DocSection>

      <DocSection id="drafts" title={t.draftsTitle}>
        <CodeBlock
          code={SEARCH_BOX}
          lang="tsx"
          marks={{ 9: 'highlight', 12: 'highlight' }}
          title="search-box.tsx"
        />
        <p>
          <Rich>{t.draftsCommit()}</Rich>
        </p>
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
