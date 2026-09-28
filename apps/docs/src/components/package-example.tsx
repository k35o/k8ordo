import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import type { ComponentProps, FC } from 'react';

import { Rich } from './rich';

type Props = {
  title: Message;
  description: Message;
  code: string;
  lang?: ComponentProps<typeof CodeBlock>['lang'];
};

/**
 * A landing page's one worked example. A Server Component, because the
 * highlighter runs here rather than in the browser — the client landing
 * renders it as given.
 */
export const PackageExample: FC<Props> = ({
  title,
  description,
  code,
  lang = 'tsx',
}) => (
  <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
    <Heading level="h2">
      <Rich>{title()}</Rich>
    </Heading>
    <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
      <Rich>{description()}</Rich>
    </p>
    <div className="mt-6">
      <CodeBlock code={code} lang={lang} />
    </div>
  </section>
);
