import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
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
      <PageTitle name="useInterval" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useInterval</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.interval.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { useInterval } from '@k8ordo/ui';" lang="ts" />
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
          <Rich>{m.hooks.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
    </div>
  );
}
