import { Alert, Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { inheritsOf, propsOf } from '../../data/component-props';
import {
  AlertActionButtonPreview,
  AlertActionLinkPreview,
  AlertDismissiblePreview,
  AlertWithActionPreview,
} from './_previews/alert-previews';

export function AlertPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Alert</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.alert.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-alert--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock code="import { Alert } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview code='<Alert message="This is an info alert." tone="info" />'>
            <Alert message="This is an info alert." tone="info" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.alert.statusesTitle" />
          </Heading>
          <ComponentPreview
            code={`<Alert message="Operation completed successfully." tone="success" />
<Alert message="Here is some useful information." tone="info" />
<Alert message="Please proceed with caution." tone="warning" />
<Alert message="Something went wrong." tone="error" />`}
          >
            <Alert message="Operation completed successfully." tone="success" />
            <Alert message="Here is some useful information." tone="info" />
            <Alert message="Please proceed with caution." tone="warning" />
            <Alert message="Something went wrong." tone="error" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.alert.multipleMessagesTitle" />
          </Heading>
          <ComponentPreview
            code={`<Alert
  message={[
    "Password must be at least 8 characters.",
    "Password must include a number.",
    "Password must include a special character.",
  ]}
  tone="error"
/>`}
          >
            <Alert
              message={[
                'Password must be at least 8 characters.',
                'Password must include a number.',
                'Password must include a special character.',
              ]}
              tone="error"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.alert.actionTitle" />
          </Heading>
          <ComponentPreview
            code={`// Navigation link — the consumer owns the element and its style.
// Use Anchor for a link that matches the library look, or any
// <a> / Next.js Link with your own className.
<Alert
  message="A new version is available."
  tone="info"
  action={{
    label: 'Learn more',
    renderItem: ({ children }) => (
      <Anchor href="https://example.com" openInNewTab>
        {children}
      </Anchor>
    ),
  }}
/>

// Action button (open a modal, etc.) — style it however you like.
<Alert
  message="Your profile setup is incomplete."
  tone="warning"
  action={{
    label: 'Open settings',
    renderItem: ({ children }) => (
      <button
        className="text-fg-info underline"
        type="button"
        onClick={() => {}}
      >
        {children}
      </button>
    ),
  }}
/>`}
          >
            <AlertActionLinkPreview />
            <AlertActionButtonPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.alert.dismissibleTitle" />
          </Heading>
          <ComponentPreview
            code={`const [isVisible, setIsVisible] = useState(true);

// onClose renders an in-frame close (×) button at the row's end.
<Alert
  message="..."
  onClose={() => setIsVisible(false)}
  tone="warning"
/>

// onClose can be combined with action.
<Alert
  action={{
    label: 'Learn more',
    renderItem: ({ children }) => (
      <button className="text-primary-fg underline" type="button" onClick={openHelp}>
        {children}
      </button>
    ),
  }}
  message="..."
  onClose={() => setIsVisible(false)}
  tone="warning"
/>`}
          >
            <AlertDismissiblePreview />
            <AlertWithActionPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('Alert')}
          items={propsOf('Alert')}
          messagesNote
        />
      </section>
    </div>
  );
}
