import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  AlertDialogPreview,
  DialogBasicPreview,
  DialogBottomPreview,
  DialogLabelPreview,
} from '../../../../../demos/ui/components/dialog-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function DialogPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Dialog" />
      <div className={page.stack}>
        <Heading level="h1">Dialog</Heading>
        <p className={page.lead}>
          <Rich>{m.components.dialog.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-dialog--default`}
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
        <CodeBlock code="import { Dialog } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
>
  <p>Are you sure you want to proceed?</p>
</Dialog>`}
          >
            <DialogBasicPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.dialog.alertDialogTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.dialog.alertDialogDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Dialog
  description="This action cannot be undone."
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  role="alertdialog"
  title="Delete this item?"
>
  <div className={styles.actions}>
    <Button
      color="base"
      onClick={() => setIsOpen(false)}
      variant="outline"
    >
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>Delete</Button>
  </div>
</Dialog>`}
          >
            <AlertDialogPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.dialog.sideTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.dialog.sideDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  side="bottom"
  title="Share"
>
  <p>Slides up from the bottom of the screen.</p>
</Dialog>`}
          >
            <DialogBottomPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.dialog.labelTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.dialog.labelDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Dialog isOpen={isOpen} label="Notice" onClose={() => setIsOpen(false)}>
  <div className={styles.body}>
    <p>The maintenance starts at 22:00.</p>
    <div className={styles.actions}>
      <Button onClick={() => setIsOpen(false)}>OK</Button>
    </div>
  </div>
</Dialog>`}
          >
            <DialogLabelPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.dialog.closingTitle()}</Rich>
        </Heading>
        <p className={page.mute}>
          <Rich>{m.components.dialog.closingDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.dialog.portalRootTitle()}</Rich>
        </Heading>
        <p className={page.mute}>
          <Rich>{m.components.dialog.portalRootDescription()}</Rich>
        </p>
        <CodeBlock
          code={`const [container, setContainer] = useState<HTMLDialogElement | null>(null);

<Dialog isOpen={isOpen} onClose={close} ref={setContainer} title="Pick a date">
  <ThirdPartyDatePicker portalContainer={container} />
</Dialog>`}
          lang="tsx"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('Dialog')} />
      </section>
    </div>
  );
}
