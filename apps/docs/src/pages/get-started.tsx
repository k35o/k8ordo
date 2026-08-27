import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../components/code-block';
import { InstallTabs } from '../components/install-tabs';
import { LocaleAnchor } from '../components/locale-anchor';
import { T } from '../components/t';
import { STORYBOOK_URL } from '../constants';

export function GetStarted() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <T k="nav.getStarted" />
        </Heading>
        <p className="text-fg-mute text-lg">
          <T k="getStarted.introduction" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="getStarted.installationTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="getStarted.installationDescription" />
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
          <T k="getStarted.setupTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="getStarted.setupDescription" />
        </p>

        <div className="flex flex-col gap-2">
          <Heading level="h3">1. CSS</Heading>
          <p className="text-fg-mute">
            <T k="getStarted.setupCssDescription" />
          </p>
          <CodeBlock code="import '@k8ordo/ui/styles.css';" lang="tsx" />
          <p className="text-fg-mute">
            <T k="getStarted.setupCssTailwindDescription" />
          </p>
          <CodeBlock code="import '@k8ordo/ui/tailwind.css';" lang="tsx" />
        </div>

        <div className="flex flex-col gap-2">
          <Heading level="h3">2. Provider</Heading>
          <p className="text-fg-mute">
            <T k="getStarted.setupProviderDescription" />
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
          <T k="getStarted.usageTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="getStarted.usageDescription" />
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
          <T k="getStarted.requirementsTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="getStarted.requirementsDescription" />
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">React &gt;= 19.0.0</li>
          <li className="list-disc">React DOM &gt;= 19.0.0</li>
          <li className="list-disc">
            Tailwind CSS &gt;= 4.0.0 (optional: tailwind.css)
          </li>
          <li className="list-disc">TypeScript &gt;= 6.0.0</li>
        </ul>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="getStarted.nextStepsTitle" />
        </Heading>
        <ul className="flex flex-col gap-3 pl-6">
          <li className="list-disc">
            <LocaleAnchor path="/components">
              <T k="getStarted.nextStepsComponents" />
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/theming">
              <T k="getStarted.nextStepsTheming" />
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <LocaleAnchor path="/i18n">
              <T k="getStarted.nextStepsI18n" />
            </LocaleAnchor>
          </li>
          <li className="list-disc">
            <Anchor href={STORYBOOK_URL} openInNewTab>
              <T k="getStarted.nextStepsStorybook" />
            </Anchor>
          </li>
        </ul>
      </section>
    </div>
  );
}
