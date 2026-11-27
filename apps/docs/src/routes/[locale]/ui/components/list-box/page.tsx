import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  ListBoxBasicPreview,
  ListBoxIconTriggerPreview,
  ListBoxSizesPreview,
} from '../../../../../demos/ui/components/list-box-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function ListBoxPage() {
  return (
    <div className={page.page}>
      <PageTitle name="ListBox" />
      <div className={page.stack}>
        <Heading level="h1">ListBox</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { ListBox } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
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

<ListBox
  label="Fruit"
  onChange={(value) => setSelected(value)}
  options={OPTIONS}
  value={selected}
/>`}
          >
            <ListBoxBasicPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.listBox.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<ListBox label="Fruit (sm)" options={OPTIONS} size="sm" />
<ListBox label="Fruit (md)" options={OPTIONS} size="md" />
<ListBox label="Fruit (lg)" options={OPTIONS} size="lg" />`}
          >
            <ListBoxSizesPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.listBox.iconTriggerTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { ListIcon } from '@k8ordo/ui/icons';

<ListBox icon={<ListIcon />} label="Fruit" options={OPTIONS} />`}
          >
            <ListBoxIconTriggerPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('ListBox')} />
      </section>
    </div>
  );
}
