'use client';

import { Button, Heading } from '@k8ordo/ui';

import { PageTitle } from '../../components/page-title';
import { href } from '../../links';
import * as m from '../../messages';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.notFound.title} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">{m.notFound.title()}</Heading>
        <p className="text-fg-mute">{m.notFound.description()}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
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
