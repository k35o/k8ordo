import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { MergeRefsPreview } from '../_previews/merge-refs-previews';

const parameters: PropItem[] = [
  {
    name: '...refs',
    types: ['ReadonlyArray<Ref<T> | undefined>'],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'callbackRef',
    types: ['RefCallback<T>'],
    defaultValue: null,
  },
];

export default function MergeRefsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="mergeRefs" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">mergeRefs</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.helpers.mergeRefs.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { mergeRefs } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <Rich>{m.helpers.common.usageTitle()}</Rich>
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.helpers.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const Input: FC<{ ref?: Ref<HTMLInputElement> }> = ({ ref }) => {
  const internalRef = useRef<HTMLInputElement>(null);

  return <input ref={mergeRefs(internalRef, ref)} />;
};`}
            lang="tsx"
          >
            <MergeRefsPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />
      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.helpers.common.returnValueTitle()}</Rich>
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
