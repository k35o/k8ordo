import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { propsOf } from '../../data/component-props';
import {
  DrawerBasicPreview,
  DrawerCustomContentPreview,
} from './_previews/drawer-previews';

export function DrawerPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Drawer</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.drawer.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-drawer--docs`}
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
        <CodeBlock code="import { Drawer } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.common.basicUsageTitle" />
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
  <nav className="flex flex-col gap-2">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</Drawer>`}
          >
            <DrawerBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.drawer.customContentTitle" />
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
  <nav className="flex flex-col gap-1">
    <a className="rounded-md px-3 py-2 font-bold hover:bg-bg-mute" href="/">
      Dashboard
    </a>
    <a className="rounded-md px-3 py-2 hover:bg-bg-mute" href="/profile">
      Profile
    </a>
    <a className="rounded-md px-3 py-2 hover:bg-bg-mute" href="/settings">
      Settings
    </a>
    <hr className="border-border-mute my-2" />
    <a className="rounded-md px-3 py-2 hover:bg-bg-mute" href="/help">
      Help
    </a>
    <a className="rounded-md px-3 py-2 hover:bg-bg-mute" href="/logout">
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

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable items={propsOf('Drawer')} />
      </section>
    </div>
  );
}
