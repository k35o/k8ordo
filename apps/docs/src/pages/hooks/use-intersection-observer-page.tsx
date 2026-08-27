import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';

const parameters: PropItem[] = [
  {
    name: 'ref',
    types: ['RefObject<T | null>'],
    defaultValue: null,
  },
  {
    name: 'callback',
    types: ['(entry: IntersectionObserverEntry) => void'],
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
    name: 'void',
    types: ['void'],
    defaultValue: null,
  },
];

export function UseIntersectionObserverPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useIntersectionObserver</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useIntersectionObserver.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useIntersectionObserver } from '@k8ordo/ui';"
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

useIntersectionObserver(ref, (entry) => {
  console.log('isIntersecting:', entry.isIntersecting);
}, { threshold: 0.5 });

return <div ref={ref}>Observed element</div>;`}
            lang="tsx"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Heading level="h3">once</Heading>
          <CodeBlock
            code={`const ref = useRef<HTMLDivElement>(null);

useIntersectionObserver(ref, (entry) => {
  if (entry.isIntersecting) {
    // Triggered only once
    loadContent();
  }
}, { once: true });

return <div ref={ref}>Lazy loaded content</div>;`}
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
