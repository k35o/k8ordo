'use client';

import { useSessionStorage } from '@k8ordo/ui';

export function UseSessionStorageBasicPreview() {
  const [value, setValue] = useSessionStorage('demo-session-count', 0);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        Count: <strong>{value}</strong>
      </span>
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors"
        onClick={() => {
          setValue(value + 1);
        }}
        type="button"
      >
        Increment
      </button>
    </div>
  );
}

export function UseSessionStorageRemovePreview() {
  const [value, setValue, handleRemove] = useSessionStorage(
    'demo-session-name',
    'k8ordo UI',
  );

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        Value: <strong>{value}</strong>
      </span>
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors"
        onClick={() => {
          setValue('Updated!');
        }}
        type="button"
      >
        Update
      </button>
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors"
        onClick={handleRemove}
        type="button"
      >
        Remove
      </button>
    </div>
  );
}
