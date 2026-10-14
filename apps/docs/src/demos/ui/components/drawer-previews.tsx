'use client';

import { Button, Drawer } from '@k8ordo/ui';
import { useState } from 'react';

import { href } from '../../../links';

import styles from './drawer-previews.module.css';

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
        <nav className={styles.menu}>
          <a className={styles.link} href={href('/:locale')}>
            Home
          </a>
          <a className={styles.link} href={href('/:locale/ui')}>
            UI
          </a>
          <a className={styles.link} href={href('/:locale/ui/components')}>
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
        <nav className={styles.navigation}>
          <a className={styles.current} href={href('/:locale/ui')}>
            UI
          </a>
          <a className={styles.link} href={href('/:locale/ui/get-started')}>
            Get Started
          </a>
          <a className={styles.link} href={href('/:locale/ui/theming')}>
            Theming
          </a>
          <a className={styles.link} href={href('/:locale/ui/i18n')}>
            i18n
          </a>
          <a className={styles.link} href={href('/:locale/ui/components')}>
            Components
          </a>
          <a className={styles.link} href={href('/:locale/ui/ai')}>
            AI
          </a>
          <hr className={styles.separator} />
          <a className={styles.link} href={href('/:locale')}>
            Home
          </a>
        </nav>
      </Drawer>
    </>
  );
}
