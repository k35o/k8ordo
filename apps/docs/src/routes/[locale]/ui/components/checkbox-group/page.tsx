import { Anchor, CheckboxGroup, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { CheckboxGroupControlledPreview } from '../../../../../demos/ui/components/checkbox-group-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/checkbox-group.module.css';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
] as const;

const FRAMEWORKS_CODE = `const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];`;

export default function CheckboxGroupPage() {
  return (
    <div className={page.page}>
      <PageTitle name="CheckboxGroup" />
      <div className={page.stack}>
        <Heading level="h1">CheckboxGroup</Heading>
        <p className={page.lead}>
          <Rich>{m.components.checkboxGroup.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-form-checkbox-group--default`}
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
          code="import { CheckboxGroup } from '@k8ordo/ui';"
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
            code={`${FRAMEWORKS_CODE}

const [value, setValue] = useState(['react']);

<p id="frameworks-label">Frameworks</p>
<CheckboxGroup
  aria-labelledby="frameworks-label"
  name="frameworks"
  onChange={setValue}
  options={FRAMEWORKS}
  value={value}
/>`}
          >
            <CheckboxGroupControlledPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.checkboxGroup.defaultValueTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p id="frameworks-default-label">Frameworks</p>
<CheckboxGroup
  aria-labelledby="frameworks-default-label"
  defaultValue={['vue']}
  name="frameworks-default"
  options={FRAMEWORKS}
/>`}
          >
            <div>
              <p className={styles.groupLabel} id="frameworks-default-label">
                Frameworks
              </p>
              <CheckboxGroup
                aria-labelledby="frameworks-default-label"
                defaultValue={['vue']}
                name="frameworks-default"
                options={FRAMEWORKS}
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.checkboxGroup.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<p id="frameworks-disabled-label">Frameworks</p>
<CheckboxGroup
  aria-labelledby="frameworks-disabled-label"
  defaultValue={['vue']}
  disabled
  name="frameworks-disabled"
  options={FRAMEWORKS}
/>`}
          >
            <div>
              <p className={styles.groupLabel} id="frameworks-disabled-label">
                Frameworks
              </p>
              <CheckboxGroup
                aria-labelledby="frameworks-disabled-label"
                defaultValue={['vue']}
                disabled
                name="frameworks-disabled"
                options={FRAMEWORKS}
              />
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('CheckboxGroup')}
          items={propsOf('CheckboxGroup')}
        />
      </section>
    </div>
  );
}
