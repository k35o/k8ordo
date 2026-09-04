import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { UseIntervalPreview } from '../_previews/use-interval-previews';

const parameters: PropItem[] = [
  {
    name: 'callback',
    types: ['() => void'],
    defaultValue: null,
  },
  {
    name: 'timeout',
    types: ['number'],
    defaultValue: null,
  },
];

export default function UseIntervalPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useInterval</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useInterval.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock code="import { useInterval } from '@k8ordo/ui';" lang="ts" />
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
            code={`const [count, setCount] = useState(0);

const increment = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);

useInterval(increment, 1000);

return <span>Count: {count}</span>;`}
          >
            <UseIntervalPreview />
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
    </div>
  );
}
