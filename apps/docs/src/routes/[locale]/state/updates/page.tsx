import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { DocTable } from '../_parts/doc-table';
import { UpdatesDemo } from './_parts/updates-demo';

const TAG_FILTER = `// src/catalog/tag-filter.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { catalogState } from '../state/catalog';

type Props = {
  tags: readonly string[];
};

export function TagFilter({ tags }: Props) {
  const [{ tags: selected }, update] = useAppState(catalogState, ['tags']);

  return (
    <div>
      {tags.map((tag) => (
        <button
          aria-pressed={selected.includes(tag)}
          key={tag}
          onClick={() => {
            update((current) => ({
              tags: current.tags.includes(tag)
                ? current.tags.filter((other) => other !== tag)
                : [...current.tags, tag],
              page: 1,
            }));
          }}
          type="button"
        >
          {tag}
        </button>
      ))}
      <button
        onClick={() => {
          update({ tags: [] });
          update({ page: 1 });
        }}
        type="button"
      >
        Clear
      </button>
    </div>
  );
}`;

const RESULTS = `// src/catalog/results.tsx
'use client';

import { useAppState } from '@k8ordo/state';
import { useRef } from 'react';

import { catalogState } from '../state/catalog';

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

export function Results() {
  const [{ page }, update] = useAppState(catalogState, ['page']);
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section>
      <h2 ref={heading} tabIndex={-1}>
        Page {page}
      </h2>
      <button
        onClick={async () => {
          try {
            await update({ page: page + 1 }, { history: 'push' }).finished;
          } catch (error) {
            if (!isAbort(error)) throw error;
            return;
          }
          heading.current?.focus();
        }}
        type="button"
      >
        Next page
      </button>
    </section>
  );
}`;

const SEARCH_BOX = `// src/catalog/search-box.tsx
'use client';

import { useAppState } from '@k8ordo/state';

import { catalogState } from '../state/catalog';

export function SearchBox() {
  const [{ q }, update] = useAppState(catalogState, ['q']);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get('q');
        update({ q: typeof value === 'string' ? value : '', page: 1 });
      }}
    >
      <input
        aria-label="Search"
        defaultValue={q}
        key={q}
        name="q"
        type="search"
      />
      <button type="submit">Search</button>
    </form>
  );
}`;

const KEYS_CALL = "useAppState(definition, ['q', 'page'])";

export default function StateUpdatesPage() {
  const hook = m.stateUpdates.hookTable;
  const batch = m.stateUpdates.batchTable;
  const handle = m.stateUpdates.handleTable;

  return (
    <DocPage
      introduction={m.stateUpdates.introduction}
      path="/:locale/state/updates"
    >
      <DocSection
        description={m.stateUpdates.hookDescription}
        title={m.stateUpdates.hookTitle}
      >
        <DocTable
          head={[hook.call(), hook.state(), hook.rerenders()]}
          rows={[
            {
              key: 'all',
              cells: [
                <Code key="call">useAppState(definition)</Code>,
                hook.allState(),
                hook.allRerenders(),
              ],
            },
            {
              key: 'keys',
              cells: [
                <Code key="call">{KEYS_CALL}</Code>,
                hook.keysState(),
                hook.keysRerenders(),
              ],
            },
            {
              key: 'none',
              cells: [
                <Code key="call">useAppState(definition, [])</Code>,
                <Code key="state">{'{}'}</Code>,
                hook.noneRerenders(),
              ],
            },
          ]}
        />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.hookShape()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.hookFirstRender()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.hookInitialUrl()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.stateUpdates.hookInitialUrlLink()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.hookStable()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.hookAnyState()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateUpdates.updateDescription}
        title={m.stateUpdates.updateTitle}
      >
        <CodeBlock code={TAG_FILTER} lang="tsx" />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.updateSync()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.updateValidate()}</Rich>{' '}
            <LocaleAnchor path="/:locale/state/reading">
              <Rich>{m.stateUpdates.updateSalvageLink()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.updateThrow()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.updateUnknown()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.updateMemory()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateUpdates.batchDescription}
        title={m.stateUpdates.batchTitle}
      >
        <DocTable
          head={[batch.changes(), batch.write(), batch.router()]}
          rows={[
            {
              key: 'url',
              cells: [
                <Rich key="changes">{batch.urlChanges()}</Rich>,
                <Code key="write">
                  {'navigation.navigate(url, { history, state })'}
                </Code>,
                batch.urlRouter(),
              ],
            },
            {
              key: 'entry',
              cells: [
                <Rich key="changes">{batch.entryChanges()}</Rich>,
                <Code key="write">
                  {'navigation.updateCurrentEntry({ state })'}
                </Code>,
                batch.none(),
              ],
            },
            {
              key: 'local',
              cells: [
                <Code key="changes">defineLocalState</Code>,
                <Rich key="write">{batch.localWrite()}</Rich>,
                batch.none(),
              ],
            },
            {
              key: 'memory',
              cells: [
                <Code key="changes">defineMemoryState</Code>,
                batch.memoryWrite(),
                batch.none(),
              ],
            },
          ]}
        />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.batchAwait()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.batchNoop()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.batchShared()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.batchLive()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateUpdates.handleDescription}
        title={m.stateUpdates.handleTitle}
      >
        <DocTable
          head={[handle.promise(), handle.resolves()]}
          rows={[
            {
              key: 'committed',
              cells: [<Code key="promise">committed</Code>, handle.committed()],
            },
            {
              key: 'finished',
              cells: [<Code key="promise">finished</Code>, handle.finished()],
            },
          ]}
        />
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.handleRouter()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.handleSettled()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.handleReject()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateUpdates.handleAwait()}</Rich>
        </p>
        <CodeBlock code={RESULTS} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateUpdates.handleAbort()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateUpdates.handleAsyncAction()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.stateUpdates.historyDescription}
        title={m.stateUpdates.historyTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.historyPageOnly()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.historyBatch()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.historyEntryOnly()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.historyNavigateTo()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateUpdates.keysDescription}
        title={m.stateUpdates.keysTitle}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{m.stateUpdates.keysInline()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.keysEqual()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{m.stateUpdates.keysBoundary()}</Rich>
          </li>
        </ul>
      </DocSection>

      <DocSection
        description={m.stateUpdates.demoDescription}
        title={m.stateUpdates.demoTitle}
      >
        <UpdatesDemo />
      </DocSection>

      <DocSection
        description={m.stateUpdates.draftDescription}
        title={m.stateUpdates.draftTitle}
      >
        <CodeBlock code={SEARCH_BOX} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.stateUpdates.draftKey()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
