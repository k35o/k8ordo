import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  DrawerBasicPreview,
  DrawerCustomContentPreview,
} from '../../../../../demos/ui/components/drawer-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function DrawerPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Drawer" />
      <div className={page.stack}>
        <Heading level="h1">Drawer</Heading>
        <p className={page.lead}>
          <Rich>{m.components.drawer.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-drawer--default`}
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
        <CodeBlock code="import { Drawer } from '@k8ordo/ui';" lang="ts" />
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

<Button onClick={() => setIsOpen(true)}>
  Open Drawer
</Button>
<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Menu"
>
  <nav className={styles.nav}>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</Drawer>`}
          >
            <DrawerBasicPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.drawer.customContentTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Navigation Drawer
</Button>
<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Navigation"
>
  <nav className={styles.nav}>
    <a className={styles.current} href="/">
      Dashboard
    </a>
    <a className={styles.link} href="/profile">
      Profile
    </a>
    <a className={styles.link} href="/settings">
      Settings
    </a>
    <hr className={styles.divider} />
    <a className={styles.link} href="/help">
      Help
    </a>
    <a className={styles.link} href="/logout">
      Sign Out
    </a>
  </nav>
</Drawer>`}
          >
            <DrawerCustomContentPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('Drawer')} />
      </section>
    </div>
  );
}
