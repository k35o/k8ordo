import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const returnValue: PropItem[] = [
  {
    name: 'isClient',
    types: ['boolean'],
    defaultValue: null,
  },
];

export default function UseClientPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useClient" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useClient</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.client.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { useClient } from '@k8ordo/ui';" lang="ts" />
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
          <CodeBlock
            code={`const isClient = useClient();

if (!isClient) {
  return <p>Loading...</p>;
}

return <p>Window width: {window.innerWidth}px</p>;`}
            lang="tsx"
          />
        </div>
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
