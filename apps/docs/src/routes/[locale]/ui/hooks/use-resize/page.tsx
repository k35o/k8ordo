import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const parameters: PropItem[] = [
  {
    name: 'ref',
    types: ['RefObject<T | null>'],
    defaultValue: null,
  },
  {
    name: 'callback',
    types: ['(entry: ResizeObserverEntry) => void'],
    defaultValue: null,
  },
  {
    name: 'options.enabled',
    types: ['boolean'],
    defaultValue: 'true',
  },
];

const returnValue: PropItem[] = [
  {
    name: 'void',
    types: ['void'],
    defaultValue: null,
  },
];

export default function UseResizePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useResize" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useResize</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.resize.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { useResize } from '@k8ordo/ui';" lang="ts" />
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
            code={`const [size, setSize] = useState({ width: 0, height: 0 });
const ref = useRef<HTMLDivElement>(null);

useResize(ref, (entry) => {
  const { width, height } = entry.contentRect;
  setSize({ width, height });
});

return (
  <div ref={ref}>
    <p>Width: {size.width}px</p>
    <p>Height: {size.height}px</p>
  </div>
);`}
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
