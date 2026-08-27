'use client';

import { chain } from '@k8ordo/ui';
import { useState } from 'react';

export function ChainPreview() {
  const [logs, setLogs] = useState<string[]>([]);

  const handleClick = chain(
    () => {
      setLogs((prev) => [...prev, '1. internal']);
    },
    () => {
      setLogs((prev) => [...prev, '2. user onClick']);
    },
    () => {
      setLogs((prev) => [...prev, '3. analytics']);
    },
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          className="bg-primary-bg text-primary-fg rounded-lg px-4 py-2 text-sm"
          onClick={handleClick}
          type="button"
        >
          Click me
        </button>
        <button
          className="border-border-mute rounded-lg border px-4 py-2 text-sm"
          onClick={() => {
            setLogs([]);
          }}
          type="button"
        >
          Clear
        </button>
      </div>
      <ul className="border-border-mute text-fg-mute flex min-h-24 flex-col gap-1 rounded-lg border px-3 py-2 text-sm">
        {logs.length === 0 ? (
          <li className="text-fg-subtle italic">No calls yet</li>
        ) : (
          logs.map((log, i) => <li key={`${i.toString()}-${log}`}>{log}</li>)
        )}
      </ul>
    </div>
  );
}
