import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  ToastBasicPreview,
  ToastCloseAllPreview,
} from '../_previews/toast-previews';

// useToast の戻り値はコンポーネントではないので生成の対象外。
const toastReturnProps: PropItem[] = [
  {
    name: 'open',
    types: [
      '(tone: Status, message: string, options?: ToastOptions) => string',
    ],
    defaultValue: null,
  },
  {
    name: 'close',
    types: ['(id: string) => void'],
    defaultValue: null,
  },
  {
    name: 'closeAll',
    types: ['() => void'],
    defaultValue: null,
  },
];

export default function ToastPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Toast" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Toast</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.toast.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-toast--docs`}
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
        <CodeBlock
          code="import { ToastProvider, useToast } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<ToastProvider>
  <ToastDemo />
</ToastProvider>

function ToastDemo() {
  const { open } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => open('success', 'Operation completed')}>
        Success
      </Button>
      <Button onClick={() => open('info', 'Here is some information')}>
        Info
      </Button>
      <Button onClick={() => open('warning', 'Please check your input')}>
        Warning
      </Button>
      <Button onClick={() => open('error', 'Something went wrong')}>
        Error
      </Button>
    </div>
  );
}`}
          >
            <ToastBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.toast.useToastTitle()}</Rich>
          </Heading>
          <CodeBlock
            code={`const { open, close, closeAll } = useToast();

// Show a toast
open('success', 'Saved successfully');

// Close a specific toast by the ID open returned
const toastId = open('info', 'Syncing…', {
  duration: Number.POSITIVE_INFINITY,
});
close(toastId);

// Close all toasts
closeAll();`}
            lang="tsx"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.toast.closeAllTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`function CloseAllDemo() {
  const { open, closeAll } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => open('info', 'Notification 1')}>
        Add Toast
      </Button>
      <Button onClick={() => open('success', 'Notification 2')}>
        Add Another
      </Button>
      <Button onClick={closeAll}>Close All</Button>
    </div>
  );
}`}
          >
            <ToastCloseAllPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">ToastProvider</Heading>
        <PropsTable
          inherits={inheritsOf('ToastProvider')}
          items={propsOf('ToastProvider')}
        />
        <Heading level="h3">useToast</Heading>
        <PropsTable items={toastReturnProps} />
      </section>
    </div>
  );
}
