import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { ChainPreview } from '../_previews/chain-previews';

const parameters: PropItem[] = [
  {
    name: '...callbacks',
    types: ['(T | undefined)[]'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'chainedFunction',
    types: ['(...args: Parameters<T>) => void'],
    defaultValue: null,
  },
];

export default function ChainPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">chain</Heading>
        <p className="text-fg-mute text-lg">
          <T k="helpers.chain.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="helpers.common.importTitle" />
        </Heading>
        <CodeBlock code="import { chain } from '@k8ordo/ui';" lang="ts" />
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
            code={`<button
  onClick={chain(
    () => playRipple(),
    onClick,
    () => trackAnalytics(),
  )}
/>`}
            lang="tsx"
          >
            <ChainPreview />
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
