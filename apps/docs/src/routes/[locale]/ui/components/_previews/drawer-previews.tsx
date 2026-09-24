'use client';

import { Button, Drawer } from '@k8ordo/ui';
import { useState } from 'react';

import { href } from '../../../../../links';

export function DrawerBasicPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Drawer
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Menu"
      >
        <nav className="flex flex-col gap-2">
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale')}
          >
            Home
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui')}
          >
            UI
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/components')}
          >
            Components
          </a>
        </nav>
      </Drawer>
    </>
  );
}

export function DrawerCustomContentPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Navigation Drawer
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Navigation"
      >
        <nav className="flex flex-col gap-1">
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2 font-bold"
            href={href('/:locale/ui')}
          >
            UI
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/get-started')}
          >
            Get Started
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/theming')}
          >
            Theming
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/i18n')}
          >
            i18n
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/components')}
          >
            Components
          </a>
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale/ui/ai')}
          >
            AI
          </a>
          <hr className="border-border-mute my-2" />
          <a
            className="hover:bg-bg-mute rounded-md px-3 py-2"
            href={href('/:locale')}
          >
            Home
          </a>
        </nav>
      </Drawer>
    </>
  );
}
