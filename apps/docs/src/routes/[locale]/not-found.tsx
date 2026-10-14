'use client';

import { Button, Heading } from '@k8ordo/ui';

import { PageTitle } from '../../components/page-title';
import { href } from '../../links';
import * as m from '../../messages';

import page from '../../styles/page.module.css';
import styles from '../../styles/pages/not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.root}>
      <PageTitle title={m.notFound.title} />
      <div className={page.stack}>
        <Heading level="h1">{m.notFound.title()}</Heading>
        <p className={page.mute}>{m.notFound.description()}</p>
      </div>
      <div className={styles.actions}>
        <Button
          renderItem={({ className, children }) => (
            <a className={className} href={href('/:locale')}>
              {children}
            </a>
          )}
          size="md"
          variant="solid"
        >
          {m.nav.home()}
        </Button>
        <Button
          color="base"
          renderItem={({ className, children }) => (
            <a className={className} href={href('/:locale/ui/get-started')}>
              {children}
            </a>
          )}
          size="md"
          variant="outline"
        >
          {m.nav.getStarted()}
        </Button>
      </div>
    </div>
  );
}
