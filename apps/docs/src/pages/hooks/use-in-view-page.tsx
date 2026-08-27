import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { UseInViewPreview } from './_previews/use-in-view-previews';

const parameters: PropItem[] = [
  {
    name: 'ref',
    types: ['RefObject<T | null>'],
    defaultValue: null,
  },
  {
    name: 'options.threshold',
    types: ['number', 'number[]'],
    defaultValue: '0',
  },
  {
    name: 'options.root',
    types: ['Element', 'null'],
    defaultValue: 'null',
  },
  {
    name: 'options.rootMargin',
    types: ['string'],
    defaultValue: "'0px'",
  },
  {
    name: 'options.once',
    types: ['boolean'],
    defaultValue: 'false',
  },
];

const returnValue: PropItem[] = [
  {
    name: 'isInView',
    types: ['boolean'],
    defaultValue: null,
  },
];

export function UseInViewPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useInView</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useInView.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock code="import { useInView } from '@k8ordo/ui';" lang="ts" />
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
            code={`const ref = useRef<HTMLDivElement>(null);
const isInView = useInView(ref, { threshold: 0.5 });

return (
  <div ref={ref}>
    {isInView ? 'Visible' : 'Not visible'}
  </div>
);`}
          >
            <UseInViewPreview />
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
