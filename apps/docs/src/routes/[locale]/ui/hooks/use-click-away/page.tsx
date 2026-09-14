import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseClickAwayPreview } from '../_previews/use-click-away-previews';

const parameters: PropItem[] = [
  {
    name: 'ref',
    types: ['RefObject<T | null>'],
    defaultValue: null,
  },
  {
    name: 'callback',
    types: ['(e: Event) => void'],
    defaultValue: null,
  },
  {
    name: 'enabled',
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

export default function UseClickAwayPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useClickAway" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useClickAway</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.clickAway.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useClickAway } from '@k8ordo/ui';"
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
          <ComponentPreview
            code={`const [isOpen, setIsOpen] = useState(false);
const ref = useRef<HTMLDivElement>(null);
useClickAway(ref, () => {
  setIsOpen(false);
}, isOpen);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Popup</button>
    {isOpen && (
      <div ref={ref}>Click outside to close</div>
    )}
  </>
);`}
          >
            <UseClickAwayPreview />
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
