import { Heading } from '@k8ordo/ui';
import type { ComponentProps, FC } from 'react';

import type { MessageKey } from '../i18n/types';
import { CodeBlock } from './code-block';
import { T } from './t';

type Props = {
  title: MessageKey;
  description: MessageKey;
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
      <T k={title} />
    </Heading>
    <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
      <T k={description} />
    </p>
    <div className="mt-6">
      <CodeBlock code={code} lang={lang} />
    </div>
  </section>
);
