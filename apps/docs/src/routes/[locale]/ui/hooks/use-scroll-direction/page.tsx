import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import {
  UseScrollDirectionPreview,
  UseScrollDirectionTargetPreview,
} from '../_previews/use-scroll-direction-previews';

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

export default function UseScrollDirectionPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useScrollDirection" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useScrollDirection</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.scrollDirection.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useScrollDirection } from '@k8ordo/ui';"
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
          <p className="text-fg-mute text-sm">
            <Rich>{m.hooks.scrollDirection.bodyNotScrollableNote()}</Rich>
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
            <Rich>{m.hooks.scrollDirection.targetTitle()}</Rich>
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
