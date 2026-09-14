import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseStepPreview } from '../_previews/use-step-previews';

const parameters: PropItem[] = [
  {
    name: 'initialCount',
    types: ['number'],
    defaultValue: null,
  },
  {
    name: 'maxCount',
    types: ['number'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'count',
    types: ['number'],
    defaultValue: null,
  },
  {
    name: 'next',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'back',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'isDisabledBack',
    types: ['boolean'],
    defaultValue: null,
  },
  {
    name: 'isDisabledNext',
    types: ['boolean'],
    defaultValue: null,
  },
];

export default function UseStepPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useStep" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useStep</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.step.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { useStep } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <Rich>{m.hooks.common.usageTitle()}</Rich>
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.hooks.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const { count, back, next, isDisabledBack, isDisabledNext } = useStep({
  initialCount: 1,
  maxCount: 5,
});

return (
  <div>
    <button disabled={isDisabledBack} onClick={back}>Back</button>
    <span>Step {count} / 5</span>
    <button disabled={isDisabledNext} onClick={next}>Next</button>
  </div>
);`}
          >
            <UseStepPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.returnValueTitle()}</Rich>
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
