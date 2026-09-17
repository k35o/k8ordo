import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  ListBoxBasicPreview,
  ListBoxIconTriggerPreview,
  ListBoxSizesPreview,
} from '../_previews/list-box-previews';

export default function ListBoxPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="ListBox" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">ListBox</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.listBox.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-list-box--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { ListBox } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const OPTIONS: readonly Option[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'melon', label: 'Melon' },
];

const [selected, setSelected] = useState<string>();

<ListBox.Root
  onChange={(value) => setSelected(value)}
  options={OPTIONS}
  value={selected}
>
  <ListBox.Trigger label="Fruit" />
  <ListBox.Content />
</ListBox.Root>`}
          >
            <ListBoxBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.listBox.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<ListBox.Root onChange={onChange} options={OPTIONS} value={value}>
  <ListBox.Trigger label="Fruit (sm)" size="sm" />
  <ListBox.Content />
</ListBox.Root>

<ListBox.Root onChange={onChange} options={OPTIONS} value={value}>
  <ListBox.Trigger label="Fruit (md)" size="md" />
  <ListBox.Content />
</ListBox.Root>

<ListBox.Root onChange={onChange} options={OPTIONS} value={value}>
  <ListBox.Trigger label="Fruit (lg)" size="lg" />
  <ListBox.Content />
</ListBox.Root>`}
          >
            <ListBoxSizesPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.listBox.iconTriggerTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { ListIcon } from '@k8ordo/ui';

<ListBox.Root onChange={onChange} options={OPTIONS} value={value}>
  <ListBox.IconTrigger icon={<ListIcon />} label="Fruit" />
  <ListBox.Content />
</ListBox.Root>`}
          >
            <ListBoxIconTriggerPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">ListBox.Root</Heading>
        <PropsTable items={propsOf('ListBox.Root')} />
        <Heading level="h3">ListBox.Trigger</Heading>
        <PropsTable items={propsOf('ListBox.Trigger')} />
        <Heading level="h3">ListBox.IconTrigger</Heading>
        <PropsTable items={propsOf('ListBox.IconTrigger')} />
        <Heading level="h3">ListBox.Content</Heading>
        <PropsTable items={propsOf('ListBox.Content')} />
      </section>
    </div>
  );
}
