import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';

const parameters: PropItem[] = [
  {
    name: 'ref',
    types: ['RefObject<Element | null>'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'writingMode',
    types: ["'horizontal'", "'vertical'"],
    defaultValue: null,
  },
];

export default function UseWritingModePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useWritingMode</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useWritingMode.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useWritingMode } from '@k8ordo/ui';"
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
          <CodeBlock
            code={`const ref = useRef<HTMLDivElement>(null);
const writingMode = useWritingMode(ref);

return (
  <div ref={ref}>
    {writingMode === 'vertical' ? '縦書き' : '横書き'}
  </div>
);`}
            lang="tsx"
          />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.parametersTitle" />
        </Heading>
        <PropsTable items={parameters} />
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
