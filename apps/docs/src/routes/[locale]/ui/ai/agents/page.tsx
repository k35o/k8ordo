import type { Message } from '@k8ordo/i18n';
import { Anchor, Code, Heading, Separator } from '@k8ordo/ui';
import type { FC } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import * as m from '../../../../../messages';

const MCP_URL = `${STORYBOOK_URL}/mcp`;

const SURFACES: Array<{
  path: string;
  href: string;
  description: Message;
}> = [
  {
    path: 'docs/GUIDE.md',
    href: '/docs/GUIDE.md',
    description: m.aiAgents.surfaceGuide,
  },
  {
    path: 'docs/references/*.md',
    href: '/docs/references/components.md',
    description: m.aiAgents.surfaceReference,
  },
  {
    path: 'llms.txt',
    href: '/llms.txt',
    description: m.aiAgents.surfaceIndex,
  },
  {
    path: 'design.md',
    href: '/design.md',
    description: m.aiAgents.surfaceTokens,
  },
  {
    path: '@k8ordo/ui/props.json',
    href: '/docs/references/components.md',
    description: m.aiAgents.surfaceProps,
  },
];

const Surface: FC<{ path: string; href: string; description: Message }> = ({
  path,
  href,
  description,
}) => (
  <div className="border-border-mute flex flex-col gap-1 border-b pb-4">
    <dt>
      <Anchor href={href}>
        <Code>{path}</Code>
      </Anchor>
    </dt>
    <dd className="text-fg-mute text-sm">
      <Rich>{description()}</Rich>
    </dd>
  </div>
);

export default function AiAgents() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.nav.aiAgents} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.aiAgents()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.aiAgents.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiAgents.setupTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiAgents.setupDescription()}</Rich>
        </p>
        <CodeBlock
          code={`Use \`@k8ordo/ui\` for UI. Before writing or changing UI, read
\`node_modules/@k8ordo/ui/docs/GUIDE.md\`, then follow only the
\`docs/references/*.md\` links it lists that the task actually needs.
Colors, spacing, radii and font weights go through semantic tokens —
never raw values such as \`bg-teal-500\` or \`font-semibold\`.
Look up component props in \`docs/references/components.md\` instead of
recalling them; a component that is not listed there does not exist.`}
          lang="md"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiAgents.surfacesTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiAgents.surfacesDescription()}</Rich>
        </p>
        <dl className="flex flex-col gap-4">
          {SURFACES.map((surface) => (
            <Surface key={surface.path} {...surface} />
          ))}
          <div className="border-border-mute flex flex-col gap-1 border-b pb-4">
            <dt>
              <Anchor href={MCP_URL} openInNewTab>
                <Code>{MCP_URL}</Code>
              </Anchor>
            </dt>
            <dd className="text-fg-mute text-sm">
              <Rich>{m.aiAgents.surfaceMcp()}</Rich>
            </dd>
          </div>
        </dl>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiAgents.mcpTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiAgents.mcpDescription()}</Rich>
        </p>
        <CodeBlock
          code={`{
  "mcpServers": {
    "k8ordo": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`}
          lang="json"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.aiAgents.generatedTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.aiAgents.generatedDescription()}</Rich>
        </p>
      </section>
    </div>
  );
}
