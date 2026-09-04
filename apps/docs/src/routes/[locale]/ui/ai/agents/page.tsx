import { Anchor, Code, Heading, Separator } from '@k8ordo/ui';
import type { FC } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import type { MessageKey } from '../../../../../i18n';

const MCP_URL = `${STORYBOOK_URL}/mcp`;

const SURFACES: Array<{
  path: string;
  href: string;
  descKey: MessageKey;
}> = [
  {
    path: 'docs/GUIDE.md',
    href: '/docs/GUIDE.md',
    descKey: 'aiAgents.surfaceGuide',
  },
  {
    path: 'docs/references/*.md',
    href: '/docs/references/components.md',
    descKey: 'aiAgents.surfaceReference',
  },
  {
    path: 'llms.txt',
    href: '/llms.txt',
    descKey: 'aiAgents.surfaceIndex',
  },
  {
    path: 'design.md',
    href: '/design.md',
    descKey: 'aiAgents.surfaceTokens',
  },
  {
    path: '@k8ordo/ui/props.json',
    href: '/docs/references/components.md',
    descKey: 'aiAgents.surfaceProps',
  },
];

const Surface: FC<{ path: string; href: string; descKey: MessageKey }> = ({
  path,
  href,
  descKey,
}) => (
  <div className="border-border-mute flex flex-col gap-1 border-b pb-4">
    <dt>
      <Anchor href={href}>
        <Code>{path}</Code>
      </Anchor>
    </dt>
    <dd className="text-fg-mute text-sm">
      <T k={descKey} />
    </dd>
  </div>
);

export default function AiAgents() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <T k="nav.aiAgents" />
        </Heading>
        <p className="text-fg-mute text-lg">
          <T k="aiAgents.introduction" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiAgents.setupTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiAgents.setupDescription" />
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
          <T k="aiAgents.surfacesTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiAgents.surfacesDescription" />
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
              <T k="aiAgents.surfaceMcp" />
            </dd>
          </div>
        </dl>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="aiAgents.mcpTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiAgents.mcpDescription" />
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
          <T k="aiAgents.generatedTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="aiAgents.generatedDescription" />
        </p>
      </section>
    </div>
  );
}
