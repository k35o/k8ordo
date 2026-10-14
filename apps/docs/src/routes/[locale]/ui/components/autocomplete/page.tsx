import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import {
  AutocompleteBasicPreview,
  AutocompleteDisabledPreview,
  AutocompleteInvalidPreview,
  AutocompleteMultiplePreview,
  AutocompleteRequiredPreview,
} from '../../../../../demos/ui/components/autocomplete-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function AutocompletePage() {
  return (
    <div className={page.page}>
      <PageTitle name="Autocomplete" />
      <div className={page.stack}>
        <Heading level="h1">Autocomplete</Heading>
        <p className={page.lead}>
          <Rich>{m.components.autocomplete.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-autocomplete--default`}
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
        <CodeBlock
          code="import { Autocomplete } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState<string[]>([]);

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Orange', value: 'orange' },
];

<Autocomplete
  id="autocomplete-basic"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  onChange={setValue}
  options={options}
  value={value}
/>`}
          >
            <AutocompleteBasicPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.autocomplete.requiredTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Autocomplete
  id="autocomplete-required"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required
  onChange={setValue}
  options={options}
  value={value}
/>`}
          >
            <AutocompleteRequiredPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.autocomplete.multipleSelectionTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [value, setValue] = useState<string[]>(['apple', 'cherry']);

<Autocomplete
  id="autocomplete-multiple"
  aria-describedby={undefined}
  disabled={false}
  invalid={false}
  required={false}
  onChange={setValue}
  options={options}
  value={value}
/>`}
          >
            <AutocompleteMultiplePreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.autocomplete.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Autocomplete
  id="autocomplete-disabled"
  aria-describedby={undefined}
  disabled
  invalid={false}
  required={false}
  onChange={setValue}
  options={options}
  value={['apple']}
/>`}
          >
            <AutocompleteDisabledPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.autocomplete.invalidTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Autocomplete
  id="autocomplete-invalid"
  aria-describedby={undefined}
  disabled={false}
  invalid
  required={false}
  onChange={setValue}
  options={options}
  value={value}
/>`}
          >
            <AutocompleteInvalidPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Autocomplete')}
          items={propsOf('Autocomplete')}
          messagesNote
        />
      </section>
    </div>
  );
}
