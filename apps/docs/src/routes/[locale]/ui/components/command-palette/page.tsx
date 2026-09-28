import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { CommandPalettePreview } from '../_previews/command-palette-previews';

const USAGE = `const [isOpen, setIsOpen] = useState(false);

<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  items={[
    {
      id: 'new-file',
      label: 'New file',
      group: 'File',
      shortcut: ['⌘', 'N'],
      onSelect: createFile,
    },
    {
      id: 'theme',
      label: 'Toggle theme',
      group: 'View',
      keywords: ['dark', 'light'],
      onSelect: toggleTheme,
    },
  ]}
/>`;

const SHORTCUT = `useEffect(() => {
  const listener = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsOpen(true);
    }
  };
  document.addEventListener('keydown', listener);
  return () => {
    document.removeEventListener('keydown', listener);
  };
}, []);`;

export default function CommandPalettePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="CommandPalette" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">CommandPalette</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.commandPalette.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-overlays-command-palette--default`}
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
          code="import { CommandPalette } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.commandPalette.usageDescription()}</Rich>
          </p>
          <ComponentPreview code={USAGE}>
            <CommandPalettePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.commandPalette.shortcutTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.commandPalette.shortcutDescription()}</Rich>
          </p>
          <CodeBlock code={SHORTCUT} lang="tsx" />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('CommandPalette')}
          items={propsOf('CommandPalette')}
          messagesNote
        />
      </section>
    </div>
  );
}
