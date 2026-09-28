import { Anchor, Heading, Separator, Stepper } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { StepperInteractivePreview } from '../_previews/stepper-previews';

const STEPS = [
  { label: 'Plan', description: 'Pick what fits' },
  { label: 'Payment', description: 'Card or invoice' },
  { label: 'Review', description: 'Check and send' },
];

const STEPS_CODE = `const steps = [
  { label: 'Plan', description: 'Pick what fits' },
  { label: 'Payment', description: 'Card or invoice' },
  { label: 'Review', description: 'Check and send' },
];`;

export default function StepperPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Stepper" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Stepper</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.stepper.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-stepper--default`}
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
        <CodeBlock code="import { Stepper } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.stepper.usageDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`${STEPS_CODE}

<Stepper aria-label="Sign-up" steps={steps} value={1} />`}
          >
            <Stepper aria-label="Sign-up" steps={STEPS} value={1} />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.stepper.interactiveTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.stepper.interactiveDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`const [step, setStep] = useState(2);

<Stepper
  aria-label="Sign-up"
  interactive
  onChange={setStep}
  steps={steps}
  value={step}
/>`}
          >
            <StepperInteractivePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.stepper.verticalTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Stepper
  aria-label="Sign-up"
  orientation="vertical"
  steps={steps}
  value={1}
/>`}
          >
            <Stepper
              aria-label="Sign-up"
              orientation="vertical"
              steps={STEPS}
              value={1}
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Stepper')}
          items={propsOf('Stepper')}
          messagesNote
        />
      </section>
    </div>
  );
}
