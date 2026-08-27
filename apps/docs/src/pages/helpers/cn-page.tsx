import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { CnPreview } from './_previews/cn-previews';

const parameters: PropItem[] = [
  {
    name: '...inputs',
    types: ['ClassValue[]'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'className',
    types: ['string'],
    defaultValue: null,
  },
];

export function CnPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">cn</Heading>
        <p className="text-fg-mute text-lg">
          <T k="helpers.cn.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="helpers.common.importTitle" />
        </Heading>
        <CodeBlock code="import { cn } from '@k8ordo/ui';" lang="ts" />
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
            code={`const className = cn(
  'rounded-lg border px-4 py-2',
  'bg-bg-mute text-fg-base',
);

// Conditional classes
const className = cn(
  'rounded-lg px-4 py-2',
  isActive && 'bg-bg-mute',
  isError && 'bg-red-500',
);`}
            lang="tsx"
          >
            <CnPreview />
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
