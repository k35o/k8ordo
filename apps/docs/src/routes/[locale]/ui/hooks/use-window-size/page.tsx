import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { UseWindowSizePreview } from '../_previews/use-window-size-previews';

const returnValue: PropItem[] = [
  {
    name: 'width',
    types: ['number'],
    defaultValue: null,
  },
  {
    name: 'height',
    types: ['number'],
    defaultValue: null,
  },
];

export default function UseWindowSizePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useWindowSize</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useWindowSize.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useWindowSize } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <T k="hooks.common.usageTitle" />
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.common.basicUsageTitle" />
          </Heading>
          <ComponentPreview
            code={`const { width, height } = useWindowSize();

return (
  <div>
    <span>Width: {width}px</span>
    <span>Height: {height}px</span>
  </div>
);`}
          >
            <UseWindowSizePreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.returnValueTitle" />
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
