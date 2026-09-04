'use client';

import { useLocalStorage } from '@k8ordo/ui';

export function UseLocalStorageBasicPreview() {
  const [value, setValue] = useLocalStorage('demo-count', 0);

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

export function UseLocalStorageRemovePreview() {
  const [value, setValue, handleRemove] = useLocalStorage(
    'demo-name',
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
