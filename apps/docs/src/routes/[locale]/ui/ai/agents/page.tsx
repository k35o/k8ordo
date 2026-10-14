import type { Message } from '@k8ordo/i18n';
import { Anchor, Code, Heading, Separator } from '@k8ordo/ui';
import type { FC } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/ai/agents.module.css';

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
    path: 'docs/llms.txt',
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
  <div className={styles.surface}>
    <dt>
      <Anchor href={href}>
        <Code>{path}</Code>
      </Anchor>
    </dt>
    <dd className={styles.description}>
      <Rich>{description()}</Rich>
    </dd>
  </div>
);

export default function AiAgents() {
  return (
    <div className={page.page}>
      <PageTitle title={m.nav.aiAgents} />
      <div className={page.stack}>
        <Heading level="h1">
          <Rich>{m.nav.aiAgents()}</Rich>
        </Heading>
        <p className={page.lead}>
          <Rich>{m.aiAgents.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.aiAgents.setupTitle()}</Rich>
        </Heading>
        <CodeBlock
          code={`Use \`@k8ordo/ui\` for UI. Before writing or changing UI, read
\`node_modules/@k8ordo/ui/docs/GUIDE.md\`, then follow only the
\`docs/references/*.md\` links it lists that the task actually needs.
Colors, spacing, radii and font weights go through semantic tokens —
never raw values such as \`bg-teal-500\` or \`font-semibold\`.
Look up component props in \`docs/references/components.md\` (the AI chat
components in \`docs/references/ai-chat.md\`, the generative UI adapters in
\`docs/references/generative-ui.md\`) instead of recalling them;
a component that is listed in none of them does not exist.`}
          lang="md"
        />
        <p className={page.mute}>
          <Rich>{m.aiAgents.setupDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.aiAgents.surfacesTitle()}</Rich>
        </Heading>
        <dl className={page.stack}>
          {SURFACES.map((surface) => (
            <Surface key={surface.path} {...surface} />
          ))}
          <div className={styles.surface}>
            <dt>
              <Anchor href={MCP_URL} openInNewTab>
                <Code>{MCP_URL}</Code>
              </Anchor>
            </dt>
            <dd className={styles.description}>
              <Rich>{m.aiAgents.surfaceMcp()}</Rich>
            </dd>
          </div>
        </dl>
        <p className={page.mute}>
          <Rich>{m.aiAgents.surfacesDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.aiAgents.mcpTitle()}</Rich>
        </Heading>
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
        <p className={page.mute}>
          <Rich>{m.aiAgents.mcpDescription()}</Rich>
        </p>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.aiAgents.generatedTitle()}</Rich>
        </Heading>
        <p className={page.mute}>
          <Rich>{m.aiAgents.generatedDescription()}</Rich>
        </p>
      </section>
    </div>
  );
}
