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
  DefaultOpenPreview,
  ModalBasicPreview,
  ModalSidesPreview,
} from '../_previews/modal-previews';

export default function ModalPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Modal" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Modal</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.modal.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-modal--docs`}
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
        <CodeBlock code="import { Modal } from '@k8ordo/ui';" lang="ts" />
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
            code={`const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Modal
</Button>
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  side="center"
>
  <Dialog.Root>
    <Dialog.Header
      onClose={() => setIsOpen(false)}
      title="Confirmation"
    />
    <Dialog.Content>
      <p>Are you sure you want to proceed?</p>
    </Dialog.Content>
  </Dialog.Root>
</Modal>`}
          >
            <ModalBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.modal.sideTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button onClick={() => setCenterOpen(true)}>Center</Button>
<Button onClick={() => setBottomOpen(true)}>Bottom</Button>
<Button onClick={() => setRightOpen(true)}>Right</Button>

<Modal isOpen={centerOpen} onClose={() => setCenterOpen(false)} side="center">
  <Dialog.Root>
    <Dialog.Header onClose={() => setCenterOpen(false)} title="Center Modal" />
    <Dialog.Content>Centered on screen</Dialog.Content>
  </Dialog.Root>
</Modal>

<Modal isOpen={bottomOpen} onClose={() => setBottomOpen(false)} side="bottom">
  <Dialog.Root>
    <Dialog.Header onClose={() => setBottomOpen(false)} title="Bottom Modal" />
    <Dialog.Content>Slides up from bottom</Dialog.Content>
  </Dialog.Root>
</Modal>

<Modal isOpen={rightOpen} onClose={() => setRightOpen(false)} side="right">
  <Dialog.Root>
    <Dialog.Header onClose={() => setRightOpen(false)} title="Right Modal" />
    <Dialog.Content>Slides in from right</Dialog.Content>
  </Dialog.Root>
</Modal>`}
          >
            <ModalSidesPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.modal.defaultOpenTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Modal defaultOpen side="center">
  <Dialog.Root>
    <Dialog.Header
      onClose={() => {}}
      title="Default Open Modal"
    />
    <Dialog.Content>
      <p>This modal is open by default.</p>
    </Dialog.Content>
  </Dialog.Root>
</Modal>`}
          >
            <DefaultOpenPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.modal.portalRootTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.components.modal.portalRootDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { usePortalRoot } from '@k8ordo/ui';
import { createPortal } from 'react-dom';

function FloatingLayer({ children }) {
  // Inside a Modal this is the top-layer <dialog>; outside it is undefined.
  const portalRoot = usePortalRoot();
  return createPortal(children, portalRoot?.current ?? document.body);
}`}
          lang="tsx"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('Modal')} />
      </section>
    </div>
  );
}
