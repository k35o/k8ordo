import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { CreateSafeContextPreview } from '../_previews/create-safe-context-previews';

const parameters: PropItem[] = [
  { name: 'errorMessage', types: ['string'], defaultValue: null },
];

const returnValue: PropItem[] = [
  {
    name: '[Context, useSafeContext]',
    types: ['readonly [Context<T | null>, () => T]'],
    defaultValue: null,
  },
];

export default function CreateSafeContextPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="createSafeContext" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">createSafeContext</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.helpers.createSafeContext.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { createSafeContext } from '@k8ordo/ui';"
          lang="ts"
        />
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
            code={`const [CounterContext, useCounter] = createSafeContext<CounterValue>(
  'useCounter must be used within CounterProvider',
);

const Provider: FC<PropsWithChildren> = ({ children }) => (
  <CounterContext value={...}>{children}</CounterContext>
);

const Child = () => {
  const { count } = useCounter(); // throws if used outside Provider
  return <span>{count}</span>;
};`}
            lang="tsx"
          >
            <CreateSafeContextPreview />
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
