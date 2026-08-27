'use client';

import { Button, Drawer } from '@k8ordo/ui';
import { useState } from 'react';

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
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/">
            Home
          </a>
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/about">
            About
          </a>
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/contact">
            Contact
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
            href="/"
          >
            Dashboard
          </a>
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/profile">
            Profile
          </a>
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/settings">
            Settings
          </a>
          <hr className="border-border-mute my-2" />
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/help">
            Help
          </a>
          <a className="hover:bg-bg-mute rounded-md px-3 py-2" href="/logout">
            Sign Out
          </a>
        </nav>
      </Drawer>
    </>
  );
}
