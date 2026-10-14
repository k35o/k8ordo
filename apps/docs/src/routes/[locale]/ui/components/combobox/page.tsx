import { Anchor, Combobox, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { ComboboxAsyncPreview } from '../../../../../demos/ui/components/combobox-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/combobox.module.css';

const PREFECTURES = [
  { value: 'hokkaido', label: 'Hokkaido' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'kanagawa', label: 'Kanagawa' },
  { value: 'aichi', label: 'Aichi' },
  { value: 'kyoto', label: 'Kyoto' },
  { value: 'osaka', label: 'Osaka' },
  { value: 'fukuoka', label: 'Fukuoka' },
];

const ASYNC_EXAMPLE = `<Combobox
  aria-label="City"
  name="city"
  search={async (query, { signal }) => {
    const response = await fetch(
      \`/api/cities?q=\${encodeURIComponent(query)}\`,
      { signal },
    );
    return response.json();
  }}
/>`;

const FORM_EXAMPLE = `// schema.ts
export const addressSchema = z.object({
  prefecture: z.enum(['hokkaido', 'tokyo', 'osaka']),
});

// address-form.tsx
const prefecture = form.field('prefecture');

<FormControl
  errorText={prefecture.error}
  invalid={prefecture.invalid}
  label="Prefecture"
  required={prefecture.required}
  renderInput={(props) => (
    <Combobox {...props} {...prefecture.input} options={prefectures} />
  )}
/>`;

export default function ComboboxPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Combobox" />
      <div className={page.stack}>
        <Heading level="h1">Combobox</Heading>
        <p className={page.lead}>
          <Rich>{m.components.combobox.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-combobox--default`}
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
        <CodeBlock code="import { Combobox } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.combobox.usageDescription()}</Rich>
          </p>
          <ComponentPreview code='<Combobox aria-label="Prefecture" name="prefecture" options={prefectures} />'>
            <div className={styles.frame}>
              <Combobox
                aria-label="Prefecture"
                name="prefecture"
                options={PREFECTURES}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.combobox.asyncTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.combobox.asyncDescription()}</Rich>
          </p>
          <ComponentPreview code={ASYNC_EXAMPLE}>
            <ComboboxAsyncPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.combobox.formTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.combobox.formDescription()}</Rich>
          </p>
          <CodeBlock code={FORM_EXAMPLE} lang="tsx" />
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Combobox')}
          items={propsOf('Combobox')}
          messagesNote
        />
      </section>
    </div>
  );
}
