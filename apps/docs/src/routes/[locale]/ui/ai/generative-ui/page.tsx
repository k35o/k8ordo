import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { InstallCommand } from '../../../../../components/install';
import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

const t = m.generativeUi;

const EXAMPLE_URL =
  'https://github.com/k35o/k8ordo/tree/main/examples/ui-integrations';

const CATALOG = `import { catalog } from '@k8ordo/ui/catalog';

catalog.TextField.description; // 'Single-line text input. type picks …'
catalog.TextField.props; // z.object({ name, label, placeholder, … })
catalog.TextField.value; // { prop: 'defaultValue', initial: (props) => … }
catalog.Button.events; // { press: 'The user pressed the button.' }
catalog.Stack.children; // true`;

const RENDER = `'use client';
import { renderers } from '@k8ordo/ui/catalog/render';

export function Title(field: {
  value: string;
  setValue: (next: string) => void;
}) {
  return renderers.TextField({
    props: { name: 'title', label: 'Title' },
    ...field,
  });
}`;

const GLUE = `import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { catalog as k8ordo } from '@k8ordo/ui/catalog';

export const catalog = defineCatalog(schema, {
  components: Object.fromEntries(
    Object.entries(k8ordo).map(([name, entry]) => [
      name,
      {
        props: entry.props,
        description: entry.description,
        ...(entry.children === true ? { slots: ['default'] } : {}),
      },
    ]),
  ),
  actions: {},
});`;

const VALIDATE = `import { catalogPropIssues } from '@k8ordo/ui/catalog';

catalogPropIssues('Button', { label: 'OK', colour: 'primary' });
// ['Button: Unknown prop "colour". Allowed props: label, variant, …']`;

const PROMPT_LANGUAGE = `import { catalogRules } from '@k8ordo/ui/catalog';

const systemPrompt = catalog.prompt({
  customRules: [...catalogRules, 'Write all UI text in Japanese.'],
});`;

export default function GenerativeUi() {
  return (
    <div className={page.page}>
      <PageTitle title={m.nav.generativeUi} />
      <div className={page.stack}>
        <Heading level="h1">
          <Rich>{m.nav.generativeUi()}</Rich>
        </Heading>
        <p className={page.lead}>
          <Rich>{t.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.installTitle()}</Rich>
        </Heading>
        <InstallCommand packages="zod" />
        <p className={page.mute}>
          <Rich>{t.installDescription()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.catalogTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={CATALOG}
          lang="ts"
          marks={{ 5: 'highlight' }}
          title="catalog.ts"
        />
        <p className={page.mute}>
          <Rich>{t.catalogDescription()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.catalogValue()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.catalogEvents()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.catalogServer()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.renderTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={RENDER}
          lang="tsx"
          marks={{ 8: 'highlight' }}
          title="title.tsx"
        />
        <p className={page.mute}>
          <Rich>{t.renderDescription()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.renderNull()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.renderValue()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.renderLabel()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.renderEvents()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.renderToast()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.glueTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={GLUE}
          lang="ts"
          marks={{ 7: 'highlight' }}
          title="json-render/catalog.ts"
        />
        <p className={page.mute}>
          <Rich>{t.glueDescription()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.glueBinding()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.glueEvents()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.glueAnyTypes()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.glueExample()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.glueCopy()}</Rich>
        </p>
        <p>
          <Anchor href={EXAMPLE_URL} openInNewTab>
            {t.glueLink()}
          </Anchor>
        </p>
      </section>

      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.validateTitle()}</Rich>
        </Heading>
        <CodeBlock code={VALIDATE} lang="ts" marks={{ 3: 'highlight' }} />
        <p className={page.mute}>
          <Rich>{t.validateDescription()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.validateUnknown()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.validateAcross()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.validateRepair()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{t.promptTitle()}</Rich>
        </Heading>
        <CodeBlock
          callouts={{ 4: t.promptLanguageCallout() }}
          code={PROMPT_LANGUAGE}
          lang="ts"
          marks={{ 4: 'highlight' }}
          title="system-prompt.ts"
        />
        <p className={page.mute}>
          <Rich>{t.promptLanguage()}</Rich>
        </p>
        <p className={page.mute}>
          <Rich>{t.promptRules()}</Rich>
        </p>
      </section>
    </div>
  );
}
