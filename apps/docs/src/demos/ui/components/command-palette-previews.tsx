'use client';

import { Button, CommandPalette, Kbd } from '@k8ordo/ui';
import type { CommandPaletteItem } from '@k8ordo/ui';
import { useEffect, useState } from 'react';

export function CommandPalettePreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [last, setLast] = useState<string>();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  const items: readonly CommandPaletteItem[] = [
    {
      id: 'new-file',
      label: 'New file',
      group: 'File',
      shortcut: ['⌘', 'N'],
      onSelect: () => {
        setLast('New file');
      },
    },
    {
      id: 'open-file',
      label: 'Open file',
      group: 'File',
      shortcut: ['⌘', 'O'],
      onSelect: () => {
        setLast('Open file');
      },
    },
    {
      id: 'theme',
      label: 'Toggle theme',
      group: 'View',
      keywords: ['dark', 'light'],
      onSelect: () => {
        setLast('Toggle theme');
      },
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="outline"
      >
        Open commands
      </Button>
      <p className="text-fg-mute flex items-center gap-1 text-sm">
        <Kbd label="Command">⌘</Kbd>
        <Kbd>K</Kbd>
        {last === undefined ? null : <span className="ms-2">Ran: {last}</span>}
      </p>
      <CommandPalette
        isOpen={isOpen}
        items={items}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
}
