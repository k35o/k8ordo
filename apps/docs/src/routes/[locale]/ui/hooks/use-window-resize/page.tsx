import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const parameters: PropItem[] = [
  {
    name: 'callback',
    types: ['(size: { width: number; height: number }) => void'],
    defaultValue: null,
  },
  {
    name: 'options.enabled',
    types: ['boolean'],
    defaultValue: 'true',
  },
];

export default function UseWindowResizePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useWindowResize" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useWindowResize</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.windowResize.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useWindowResize } from '@k8ordo/ui';"
          lang="ts"
        />
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
            code={`useWindowResize((size) => {
  console.log(\`Window: \${size.width}x\${size.height}\`);
});`}
            lang="tsx"
          />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
    </div>
  );
}
