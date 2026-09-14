import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import {
  UseScrollLockPreview,
  UseScrollLockTargetPreview,
} from '../_previews/use-scroll-lock-previews';

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

export default function UseScrollLockPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useScrollLock" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useScrollLock</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.scrollLock.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useScrollLock } from '@k8ordo/ui';"
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
            <Rich>{m.hooks.scrollLock.bodyNotScrollableNote()}</Rich>
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
            <Rich>{m.hooks.scrollLock.targetTitle()}</Rich>
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
