'use client';

import { useClipboard } from '@k8ordo/ui';
import { useState } from 'react';

export function UseClipboardPreview() {
  const { writeClipboard } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await writeClipboard('Hello from k8ordo UI!');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className="border-border-mute hover:bg-bg-mute rounded-lg border px-4 py-2 text-sm transition-colors"
        onClick={() => {
          void handleCopy();
        }}
        type="button"
      >
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
    </div>
  );
}
