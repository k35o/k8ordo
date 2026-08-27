import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import {
  UseScrollLockPreview,
  UseScrollLockTargetPreview,
} from './_previews/use-scroll-lock-previews';

const parameters: PropItem[] = [
  {
    name: 'target',
    types: ['RefObject<HTMLElement | null>'],
    defaultValue: 'document.body',
  },
];

const returnValue: PropItem[] = [
  {
    name: 'lock',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'unlock',
    types: ['() => void'],
    defaultValue: null,
  },
];

export function UseScrollLockPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useScrollLock</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useScrollLock.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useScrollLock } from '@k8ordo/ui';"
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
            <T k="hooks.useScrollLock.bodyNotScrollableNote" />
          </p>
          <ComponentPreview
            code={`const { lock, unlock } = useScrollLock();

return (
  <div>
    <button onClick={lock}>Lock</button>
    <button onClick={unlock}>Unlock</button>
  </div>
);`}
          >
            <UseScrollLockPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.useScrollLock.targetTitle" />
          </Heading>
          <ComponentPreview
            code={`const scrollRef = useRef<HTMLDivElement>(null);
const { lock, unlock } = useScrollLock(scrollRef);

return (
  <div>
    <button onClick={lock}>Lock area</button>
    <button onClick={unlock}>Unlock area</button>
    <div ref={scrollRef} style={{ overflow: 'auto', height: 128 }}>
      {/* scrollable content */}
    </div>
  </div>
);`}
          >
            <UseScrollLockTargetPreview />
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
