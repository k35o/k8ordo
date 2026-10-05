'use client';

import { useAppState } from '@k8ordo/state';
import { Button, Code, IconButton, MinusIcon, PlusIcon } from '@k8ordo/ui';

import * as m from '../../../../messages';
import { TABS, demoState } from './demo-state';

export function StateDemo() {
  const [current, update] = useAppState(demoState);
  const search = demoState.search(current);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 text-sm">
            <Code>tab</Code>
          </span>
          {TABS.map((value) => (
            <Button
              color={value === current.tab ? 'primary' : 'base'}
              key={value}
              onAction={() => {
                update({ tab: value });
              }}
              size="sm"
              variant={value === current.tab ? 'solid' : 'outline'}
            >
              {value}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14 text-sm">
            <Code>page</Code>
          </span>
          <IconButton
            color="base"
            label={m.state.demoPrevious()}
            onAction={() => {
              update({ page: current.page - 1 }, { history: 'push' });
            }}
            size="sm"
          >
            <MinusIcon />
          </IconButton>
          <span className="min-w-8 text-center text-sm tabular-nums">
            {current.page}
          </span>
          <IconButton
            color="base"
            label={m.state.demoNext()}
            onAction={() => {
              update({ page: current.page + 1 }, { history: 'push' });
            }}
            size="sm"
          >
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
        <dt className="text-fg-mute">URL</dt>
        <dd className="break-all">
          <Code>{search === '' ? m.state.demoUrlEmpty() : `?${search}`}</Code>
        </dd>
        <dt className="text-fg-mute">state</dt>
        <dd className="break-all">
          <Code>{JSON.stringify(current)}</Code>
        </dd>
      </dl>
    </div>
  );
}
