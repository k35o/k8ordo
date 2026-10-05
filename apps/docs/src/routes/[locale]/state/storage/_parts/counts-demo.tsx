'use client';

import {
  defineLocalState,
  defineMemoryState,
  defineSessionState,
  useAppState,
} from '@k8ordo/state';
import { Button, Code } from '@k8ordo/ui';
import * as z from 'zod/mini';

import * as m from '../../../../../messages';

const t = m.stateStorage;

/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const count = z.object({
  count: z._default(z.number().check(z.int(), z.gte(0)), 0),
});
/* oxlint-enable no-underscore-dangle */

// 3 つとも同じ形にして、違いが置き場所だけになるようにする
const localCount = defineLocalState('storage-demo-local', count);
const sessionCount = defineSessionState('storage-demo-session', count);
const memoryCount = defineMemoryState('storage-demo-memory', { count: 0 });

type RowProps = {
  place: string;
  storageKey: string | undefined;
  value: number;
  onIncrement: () => void;
};

function Row({ place, storageKey, value, onIncrement }: RowProps) {
  return (
    <li className="border-border-mute flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
      <div className="flex flex-col gap-1">
        <span className="font-bold">{place}</span>
        <span className="text-fg-mute text-xs break-all">
          {storageKey === undefined ? t.demoNoKey() : <Code>{storageKey}</Code>}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="min-w-8 text-end text-lg tabular-nums">{value}</span>
        <Button
          aria-label={t.demoIncrement(place)}
          color="base"
          onClick={onIncrement}
          size="sm"
          variant="outline"
        >
          +1
        </Button>
      </div>
    </li>
  );
}

export function CountsDemo() {
  const [local, updateLocal] = useAppState(localCount);
  const [session, updateSession] = useAppState(sessionCount);
  const [memory, updateMemory] = useAppState(memoryCount);

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        <Row
          onIncrement={() => {
            updateLocal((current) => ({ count: current.count + 1 }));
          }}
          place="localStorage"
          storageKey={localCount.storageKey}
          value={local.count}
        />
        <Row
          onIncrement={() => {
            updateSession((current) => ({ count: current.count + 1 }));
          }}
          place="sessionStorage"
          storageKey={sessionCount.storageKey}
          value={session.count}
        />
        <Row
          onIncrement={() => {
            updateMemory((current) => ({ count: current.count + 1 }));
          }}
          place={t.demoMemory()}
          storageKey={undefined}
          value={memory.count}
        />
      </ul>
      <div>
        <Button
          color="base"
          onClick={() => {
            updateLocal({ count: 0 });
            updateSession({ count: 0 });
            updateMemory({ count: 0 });
          }}
          size="sm"
          variant="skeleton"
        >
          {t.demoReset()}
        </Button>
      </div>
    </div>
  );
}
