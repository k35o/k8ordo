import { Accordion, Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/accordion.module.css';

export default function AccordionPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Accordion" />
      <div className={page.stack}>
        <Heading level="h1">Accordion</Heading>
        <p className={page.lead}>
          <Rich>{m.components.accordion.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-accordion--primary`}
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
        <CodeBlock code="import { Accordion } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Accordion.Root>
  <Accordion.Item>
    <h3>
      <Accordion.Button>What is k8ordo UI?</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>k8ordo UI is a React UI component library.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item>
    <h3>
      <Accordion.Button>How do I install it?</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>Install via npm, yarn, or pnpm.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item>
    <h3>
      <Accordion.Button>Is it accessible?</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>Yes, it follows WAI-ARIA accordion patterns.</p>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`}
          >
            <div className={styles.frame}>
              <Accordion.Root>
                <Accordion.Item>
                  <h3>
                    <Accordion.Button>What is k8ordo UI?</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>k8ordo UI is a React UI component library.</p>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <h3>
                    <Accordion.Button>How do I install it?</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>Install via npm, yarn, or pnpm.</p>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <h3>
                    <Accordion.Button>Is it accessible?</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>Yes, it follows WAI-ARIA accordion patterns.</p>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.accordion.defaultOpenTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Accordion.Root>
  <Accordion.Item defaultOpen>
    <h3>
      <Accordion.Button>Open by default</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>This panel is open on initial render.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item>
    <h3>
      <Accordion.Button>Closed by default</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>This panel is closed on initial render.</p>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`}
          >
            <div className={styles.frame}>
              <Accordion.Root>
                <Accordion.Item defaultOpen>
                  <h3>
                    <Accordion.Button>Open by default</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>This panel is open on initial render.</p>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <h3>
                    <Accordion.Button>Closed by default</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>This panel is closed on initial render.</p>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.accordion.multipleDefaultOpenTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Accordion.Root>
  <Accordion.Item defaultOpen>
    <h3>
      <Accordion.Button>Section A</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>This panel is open by default.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item defaultOpen>
    <h3>
      <Accordion.Button>Section B</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>This panel is also open by default.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item>
    <h3>
      <Accordion.Button>Section C</Accordion.Button>
    </h3>
    <Accordion.Panel>
      <p>This panel is closed by default.</p>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`}
          >
            <div className={styles.frame}>
              <Accordion.Root>
                <Accordion.Item defaultOpen>
                  <h3>
                    <Accordion.Button>Section A</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>This panel is open by default.</p>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                  <h3>
                    <Accordion.Button>Section B</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>This panel is also open by default.</p>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                  <h3>
                    <Accordion.Button>Section C</Accordion.Button>
                  </h3>
                  <Accordion.Panel>
                    <p>This panel is closed by default.</p>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">Accordion.Root</Heading>
        <PropsTable items={propsOf('Accordion.Root')} />
        <Heading level="h3">Accordion.Item</Heading>
        <PropsTable items={propsOf('Accordion.Item')} />
        <Heading level="h3">Accordion.Button</Heading>
        <PropsTable items={propsOf('Accordion.Button')} />
        <Heading level="h3">Accordion.Panel</Heading>
        <PropsTable items={propsOf('Accordion.Panel')} />
      </section>
    </div>
  );
}
