import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
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
      <PageTitle name="chain" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">chain</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.helpers.chain.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { chain } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <Rich>{m.helpers.common.usageTitle()}</Rich>
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.helpers.common.basicUsageTitle()}</Rich>
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
          <Rich>{m.helpers.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.returnValueTitle()}</Rich>
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
