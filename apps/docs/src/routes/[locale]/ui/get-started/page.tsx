import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { STORYBOOK_URL } from '../../../../constants';
import * as m from '../../../../messages';

export default function GetStarted() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.nav.getStarted} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.getStarted()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.getStarted.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.getStarted.installationTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.getStarted.installationDescription()}</Rich>
        </p>
        <InstallTabs
          npm={<CodeBlock code="npm install @k8ordo/ui" lang="bash" />}
          pnpm={<CodeBlock code="pnpm add @k8ordo/ui" lang="bash" />}
          yarn={<CodeBlock code="yarn add @k8ordo/ui" lang="bash" />}
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.getStarted.setupTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.getStarted.setupDescription()}</Rich>
        </p>

        <div className="flex flex-col gap-2">
          <Heading level="h3">1. CSS</Heading>
          <p className="text-fg-mute">
            <Rich>{m.getStarted.setupCssDescription()}</Rich>
          </p>
          <CodeBlock code="import '@k8ordo/ui/styles.css';" lang="tsx" />
          <p className="text-fg-mute">
            <Rich>{m.getStarted.setupCssTailwindDescription()}</Rich>
          </p>
          <CodeBlock code="import '@k8ordo/ui/tailwind.css';" lang="tsx" />
        </div>

        <div className="flex flex-col gap-2">
          <Heading level="h3">2. Provider</Heading>
          <p className="text-fg-mute">
            <Rich>{m.getStarted.setupProviderDescription()}</Rich>
          </p>
          <CodeBlock
            code={`import { UIProvider } from '@k8ordo/ui';

function App({ children }) {
  return (
    <UIProvider>
      {children}
    </UIProvider>
  );
}`}
            lang="tsx"
          />
        </div>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.getStarted.usageTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.getStarted.usageDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { Button, Heading } from '@k8ordo/ui';

function MyComponent() {
  return (
    <div>
      <Heading level="h1">Hello k8ordo UI</Heading>
      <Button variant="solid">Click me</Button>
    </div>
  );
}`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.getStarted.requirementsTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.getStarted.requirementsDescription()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">React &gt;= 19.3.0</li>
          <li className="list-disc">React DOM &gt;= 19.3.0</li>
          <li className="list-disc">
            Tailwind CSS &gt;= 4.3.3 (optional: tailwind.css)
          </li>
          <li className="list-disc">
            TypeScript &gt;= 7.0.2 (optional: type declarations)
          </li>
          <li className="list-disc">
            @types/react, @types/react-dom &gt;= 19.3.0 (optional: type
            declarations)
          </li>
          <li className="list-disc">
            zod &gt;= 4.4.3 &lt;5.0.0 (optional: generative-UI schemas)
          </li>
          <li className="list-disc">
            @json-render/core, @json-render/react &gt;= 0.20.0 &lt;0.21.0
            (optional: @k8ordo/ui/json-render)
          </li>
          <li className="list-disc">
            @openuidev/lang-core &gt;= 0.2.10 &lt;0.3.0 (optional:
            @k8ordo/ui/openui, @k8ordo/ui/openui/prompt)
          </li>
          <li className="list-disc">
            @openuidev/react-lang &gt;= 0.2.9 &lt;0.3.0 (optional:
            @k8ordo/ui/openui)
          </li>
          <li className="list-disc">
            ai &gt;= 7.0.51 (optional: @k8ordo/ui/ai-sdk)
          </li>
          <li className="list-disc">
            streamdown &gt;= 2.5.0 (optional: @k8ordo/ui/ai/response)
          </li>
        </ul>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.getStarted.nextStepsTitle()}</Rich>
        </Heading>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/:locale/ui/components">
              <Rich>{m.getStarted.nextStepsComponents()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/ui/theming">
              <Rich>{m.getStarted.nextStepsTheming()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/:locale/ui/i18n">
              <Rich>{m.getStarted.nextStepsI18n()}</Rich>
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <Anchor href={STORYBOOK_URL} openInNewTab>
              <Rich>{m.getStarted.nextStepsStorybook()}</Rich>
            </Anchor>
          </li>
        </ul>
      </section>
    </div>
  );
}
