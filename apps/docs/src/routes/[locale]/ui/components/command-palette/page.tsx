import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { CommandPalettePreview } from '../../../../../demos/ui/components/command-palette-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

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
    <div className={page.page}>
      <PageTitle name="CommandPalette" />
      <div className={page.stack}>
        <Heading level="h1">CommandPalette</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { CommandPalette } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.commandPalette.usageDescription()}</Rich>
          </p>
          <ComponentPreview code={USAGE}>
            <CommandPalettePreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.commandPalette.shortcutTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.commandPalette.shortcutDescription()}</Rich>
          </p>
          <CodeBlock code={SHORTCUT} lang="tsx" />
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
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
