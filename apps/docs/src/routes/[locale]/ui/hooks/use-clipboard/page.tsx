import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { UseClipboardPreview } from '../_previews/use-clipboard-previews';

const returnValue: PropItem[] = [
  {
    name: 'writeClipboard',
    types: ['(text: string) => Promise<void>'],
    defaultValue: null,
  },
  {
    name: 'readClipboard',
    types: ['() => Promise<string>'],
    defaultValue: null,
  },
];

export default function UseClipboardPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useClipboard</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useClipboard.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { useClipboard } from '@k8ordo/ui';"
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
            code={`const { writeClipboard } = useClipboard();
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  await writeClipboard('Hello from k8ordo UI!');
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

return (
  <button onClick={handleCopy}>
    {copied ? 'Copied!' : 'Copy Text'}
  </button>
);`}
          >
            <UseClipboardPreview />
          </ComponentPreview>
        </div>
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
