import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import {
  UseScrollDirectionPreview,
  UseScrollDirectionTargetPreview,
} from './_previews/use-scroll-direction-previews';

const parameters: PropItem[] = [
  {
    name: 'options.threshold',
    types: ['number'],
    defaultValue: '50',
  },
  {
    name: 'options.target',
    types: ['RefObject<HTMLElement | null>'],
    defaultValue: 'window',
  },
];

const returnValue: PropItem[] = [
  {
    name: 'x',
    types: ["'left'", "'right'"],
    defaultValue: null,
  },
  {
    name: 'y',
    types: ["'up'", "'down'"],
    defaultValue: null,
  },
];

export function UseScrollDirectionPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useScrollDirection</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useScrollDirection.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useScrollDirection } from '@k8ordo/ui';"
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
          <p className="text-fg-mute text-sm">
            <T k="hooks.useScrollDirection.bodyNotScrollableNote" />
          </p>
          <ComponentPreview
            code={`const { x, y } = useScrollDirection();

return (
  <div>
    <span>Vertical: {y}</span>
    <span>Horizontal: {x}</span>
  </div>
);`}
          >
            <UseScrollDirectionPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.useScrollDirection.targetTitle" />
          </Heading>
          <ComponentPreview
            code={`const scrollRef = useRef<HTMLDivElement>(null);
const { y } = useScrollDirection({ target: scrollRef, threshold: 20 });

return (
  <div ref={scrollRef} style={{ overflow: 'auto', height: 128 }}>
    {/* scrollable content */}
  </div>
);`}
          >
            <UseScrollDirectionTargetPreview />
          </ComponentPreview>
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
