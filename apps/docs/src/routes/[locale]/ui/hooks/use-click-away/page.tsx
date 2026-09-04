import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
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
      <div className="flex flex-col gap-4">
        <Heading level="h1">useClickAway</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useClickAway.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useClickAway } from '@k8ordo/ui';"
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
