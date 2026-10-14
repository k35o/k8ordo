import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  InViewBasicPreview,
  InViewOncePreview,
} from '../../../../../demos/ui/components/in-view-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function InViewPage() {
  return (
    <div className={page.page}>
      <PageTitle name="InView" />
      <div className={page.stack}>
        <Heading level="h1">InView</Heading>
        <p className={page.lead}>
          <Rich>{m.components.inView.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-observers-in-view--default`}
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
        <CodeBlock code="import { InView } from '@k8ordo/ui';" lang="ts" />
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
            code={`const [container, setContainer] = useState<HTMLElement | null>(null);
const [isInView, setIsInView] = useState(false);

<div ref={setContainer} className={styles.scroller}>
  <InView onChange={setIsInView} root={container}>
    <p>Target</p>
  </InView>
</div>`}
          >
            <InViewBasicPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.inView.onceTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.inView.onceDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<InView once onChange={setHasBeenSeen} root={container}>
  <p>Target</p>
</InView>`}
          >
            <InViewOncePreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.inView.multipleTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
            <Rich>{m.components.inView.multipleDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('InView')} />
      </section>
    </div>
  );
}
