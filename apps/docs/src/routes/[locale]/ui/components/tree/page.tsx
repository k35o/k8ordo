import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import {
  TreeControlledPreview,
  TreePreview,
} from '../../../../../demos/ui/components/tree-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function TreePage() {
  return (
    <div className={page.page}>
      <PageTitle name="Tree" />
      <div className={page.stack}>
        <Heading level="h1">Tree</Heading>
        <p className={page.lead}>
          <Rich>{m.components.tree.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-tree--keyboard`}
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
        <CodeBlock code="import { Tree } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.tree.basicDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Tree
  defaultExpandedIds={['src']}
  items={[
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'components',
          label: 'components',
          children: [{ id: 'button', label: 'button.tsx' }],
        },
        { id: 'index', label: 'index.ts' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ]}
  label="Files"
/>`}
          >
            <TreePreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.tree.controlledTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.tree.controlledDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`const [expandedIds, setExpandedIds] = useState<readonly string[]>(['src']);
const [selectedId, setSelectedId] = useState<string | null>(null);

<Tree
  expandedIds={expandedIds}
  items={files}
  label="Files"
  onChange={setSelectedId}
  onExpandedChange={setExpandedIds}
  selectedId={selectedId}
/>`}
          >
            <TreeControlledPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Tree')} items={propsOf('Tree')} />
      </section>
    </div>
  );
}
