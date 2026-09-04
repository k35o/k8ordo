import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { MergePropsPreview } from '../_previews/merge-props-previews';

const parameters: PropItem[] = [
  { name: 'base', types: ['Record<string, unknown>'], defaultValue: null },
  { name: 'override', types: ['Record<string, unknown>'], defaultValue: null },
];

const returnValue: PropItem[] = [
  {
    name: 'mergedProps',
    types: ['Omit<A, keyof B> & B'],
    defaultValue: null,
  },
];

export default function MergePropsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">mergeProps</Heading>
        <p className="text-fg-mute text-lg">
          <T k="helpers.mergeProps.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="helpers.common.importTitle" />
        </Heading>
        <CodeBlock code="import { mergeProps } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <T k="helpers.common.usageTitle" />
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="helpers.common.basicUsageTitle" />
          </Heading>
          <ComponentPreview
            code={`const merged = mergeProps(
  { className: 'p-2', onClick: () => log('a') },
  { className: 'text-fg-info', onClick: () => log('b') },
);
// className: 'p-2 text-fg-info' (cn merged)
// onClick: chained — calls 'a' then 'b'`}
            lang="tsx"
          >
            <MergePropsPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="helpers.common.parametersTitle" />
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="helpers.common.returnValueTitle" />
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
