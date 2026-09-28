import { Alert, Anchor, Heading, Prose, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function ProsePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Prose" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Prose</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.prose.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-prose--default`}
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
        <CodeBlock code="import { Prose } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.prose.basicDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<article>
  <Prose>
    <MDXContent />
  </Prose>
</article>`}
          >
            <div className="w-full" lang="ja">
              <Prose>
                <h2>はじめに</h2>
                <p>
                  本文の中の<strong>強い強調</strong>と<em>強調</em>、
                  <a href="https://ordo.k8o.me">リンク</a>、
                  <code>inline code</code> が、読みやすく並ぶ。
                </p>
                <ul>
                  <li>リセットで消えた黒丸が戻る</li>
                  <li>番号付きのリストも同じ</li>
                </ul>
                <blockquote>
                  <p>引用は罫線と控えめな文字色で示す。</p>
                </blockquote>
              </Prose>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.prose.componentsTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.prose.componentsDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Prose>
  <p>A paragraph before the component.</p>
  <Alert message={['First note', 'Second note']} tone="info" />
  <p>A paragraph after it.</p>
</Prose>`}
          >
            <div className="w-full">
              <Prose>
                <p>A paragraph before the component.</p>
                <Alert message={['First note', 'Second note']} tone="info" />
                <p>A paragraph after it.</p>
              </Prose>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.prose.verticalTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.prose.verticalDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<div className="writing-v">
  <Prose>
    <p>…</p>
  </Prose>
</div>`}
          >
            <div className="writing-v h-56" lang="ja">
              <Prose>
                <h2>縦書き</h2>
                <p>縦書きでは、段落の頭を一字下げて組む。</p>
                <p>二つ目の段落も、同じく一字下げる。</p>
              </Prose>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Prose')} items={propsOf('Prose')} />
      </section>
    </div>
  );
}
