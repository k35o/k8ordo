/**
 * Writes the generated parts of `docs/references/components.md` (where each
 * component section sits, its `Props:` block, the icon list, the `Messages`
 * key list) and the README's component list, from
 * `docs/props.generated.json` and `src/i18n/usage.ts`. The prose and the
 * examples stay hand-written, because they carry judgement the types do not.
 * `ai-chat.md` is deliberately left out: its props bullets group controllable
 * props and describe pass-through behavior, which the generated form would
 * flatten away.
 *
 *   node scripts/generate-component-docs.ts            # rewrite both files
 *   node scripts/generate-component-docs.ts --check    # fail if either is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { en } from '../src/i18n/en.ts';
import type { Messages } from '../src/i18n/messages.ts';
import { messageUsage } from '../src/i18n/usage.ts';
import { fillGenerated, regroupSections, wrap } from './component-docs.ts';

const DOC_PATH = fileURLToPath(
  new URL('../docs/references/components.md', import.meta.url),
);
const PROPS_PATH = fileURLToPath(
  new URL('../docs/props.generated.json', import.meta.url),
);
const AI_CHAT_PATH = fileURLToPath(
  new URL('../docs/references/ai-chat.md', import.meta.url),
);
const README_PATH = fileURLToPath(new URL('../README.md', import.meta.url));

const CATEGORIES = new Map([
  ['buttons', 'Buttons'],
  ['navigation', 'Navigation'],
  ['form', 'Forms'],
  ['data-display', 'Data display'],
  ['feedback', 'Feedback'],
  ['overlays', 'Overlays'],
  ['layout', 'Layout'],
  ['observers', 'Observers'],
  ['icons', 'Icons'],
  ['providers', 'Providers'],
]);
// Documented in ai-chat.md and a hand-written README section, whose bullets
// carry each component's parts.
const AI_CATEGORY = 'ai';

type Prop = {
  name: string;
  types: string[];
  defaultValue: string | null;
  required: boolean;
};
type Component = {
  name: string;
  category: string;
  props: Prop[];
  inherits: string | null;
  omitted: string[];
};

const { components } = JSON.parse(await readFile(PROPS_PATH, 'utf8')) as {
  components: Component[];
};
const byName = new Map(components.map((c) => [c.name, c]));
const topLevel = (name: string) => name.split('.')[0] ?? '';
const categoryOfTopLevel = new Map(
  components.map((c) => [topLevel(c.name), c.category]),
);

/** Icons are covered as a group, not one section each. */
const iconish = (name: string) => name.endsWith('Icon') || name === 'Logo';

const unknownCategories = [
  ...new Set(components.map((c) => c.category)),
].filter((category) => category !== AI_CATEGORY && !CATEGORIES.has(category));
if (unknownCategories.length > 0) {
  console.error(
    `CATEGORIES に見出しの無いフォルダ: ${unknownCategories.join(', ')}`,
  );
  process.exit(1);
}

const renderProps = (component: Component): string[] => {
  const except =
    component.omitted.length === 0
      ? ''
      : `, except ${component.omitted.map((key) => `\`${key}\``).join(' / ')}`;
  // A bullet rather than a sentence under the list, so the skip below takes it
  // with the block on the next run instead of leaving a copy behind.
  const forwarded =
    component.inherits === null
      ? []
      : [`- Other props are forwarded to \`${component.inherits}\`${except}.`];
  if (component.props.length === 0) {
    return ['- _No props of its own._', ...forwarded];
  }
  const own = component.props.map((prop) => {
    const types = prop.types.map((type) => `\`${type}\``).join(' | ');
    const suffix = prop.required
      ? ' (required)'
      : prop.defaultValue === null
        ? ''
        : ` (default: \`${prop.defaultValue}\`)`;
    return `- \`${prop.name}\`: ${types}${suffix}`;
  });
  return [...own, ...forwarded];
};

const source = await readFile(DOC_PATH, 'utf8');
const lines = regroupSections(source, CATEGORIES, (name) =>
  categoryOfTopLevel.get(name),
).split('\n');
const out: string[] = [];

let heading: string | null = null;
/** A `##` has started since the current `###`, so the block below belongs elsewhere. */
let headingLeftBehind = false;
const rewritten = new Set<string>();
const unknown: string[] = [];
const misplaced: string[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i] ?? '';

  // A `##` ends the component section, so anything after it belongs to the
  // next one. Only the contents of a block are generated, never its position,
  // so a marker parked past the boundary would otherwise be filled in silently
  // and read as if it documented a component from the following section.
  if (line.startsWith('## ')) headingLeftBehind = heading !== null;

  const headingMatch = /^### (\S+)/u.exec(line);
  if (headingMatch) {
    heading = headingMatch[1] ?? null;
    headingLeftBehind = false;
  }

  const propsMatch = /^Props(?: \(([\w.]+)\))?:\s*$/u.exec(line);
  if (!propsMatch) {
    out.push(line);
    continue;
  }

  if (headingLeftBehind) {
    misplaced.push(`${line.trim()} (${i + 1} 行目、### ${heading} の節の外)`);
  }

  // `Props (Root):` inside `### Tabs` means `Tabs.Root`.
  const qualifier = propsMatch[1];
  const name =
    qualifier === undefined
      ? heading
      : qualifier.includes('.') || heading === null
        ? qualifier
        : `${heading}.${qualifier}`;
  const component = name === null ? undefined : byName.get(name);
  if (!component) {
    unknown.push(name ?? '(見出しなし)');
    out.push(line);
    continue;
  }

  // Skip the hand-written list this replaces: the blank line, the bullets,
  // and any continuation lines indented under them.
  let j = i + 1;
  while (j < lines.length && (lines[j] ?? '').trim() === '') j++;
  while (
    j < lines.length &&
    (/^\s*- /u.test(lines[j] ?? '') || /^\s+\S/u.test(lines[j] ?? ''))
  ) {
    j++;
  }

  out.push(line, '', ...renderProps(component));
  // Close the block only when the text resuming after it does not already
  // start with a blank line, so the output survives the formatter unchanged.
  if ((lines[j] ?? '').trim() !== '') out.push('');
  rewritten.add(component.name);

  i = j - 1;
}

const renderIcons = (): string => {
  const icons = components
    .filter((c) => c.category === 'icons' && c.name.endsWith('Icon'))
    .map(
      (c, index, all) => `\`${c.name}\`${index === all.length - 1 ? '.' : ','}`,
    );
  return wrap(['The', 'icons:', ...icons]);
};

/** A key whose text carries `{min}` gets that noted, since a translation keeps it. */
const keyLabel = (key: keyof Messages): string => {
  const placeholders = [...en[key].matchAll(/\{\w+\}/gu)].map(
    ([placeholder]) => `\`${placeholder}\``,
  );
  if (placeholders.length === 0) return `\`${key}\``;
  const verb = placeholders.length === 1 ? 'is' : 'are';
  return `\`${key}\` (${placeholders.join(' and ')} ${verb} replaced)`;
};

const renderMessageKeys = (): string => {
  const rows = new Map<string, string[]>();
  for (const key of Object.keys(messageUsage) as Array<keyof Messages>) {
    const usedBy = messageUsage[key].join(' / ');
    rows.set(usedBy, [...(rows.get(usedBy) ?? []), keyLabel(key)]);
  }
  return [...rows]
    .map(([usedBy, keys]) => `- ${usedBy}: ${keys.join(', ')}\n`)
    .join('');
};

const renderReadmeCategories = (): string =>
  [...CATEGORIES]
    .filter(([category]) => components.some((c) => c.category === category))
    .map(([category, title]) => {
      const names = [
        ...new Set(
          components
            .filter((c) => c.category === category)
            .map((c) => topLevel(c.name)),
        ),
      ];
      const bullets =
        category === 'icons'
          ? [
              '- [Icons](docs/references/components.md#icons) — decorative icon components (`CloseIcon`, `ChevronIcon`, …)',
            ]
          : names.map(
              (name) =>
                `- [${name}](docs/references/components.md#${name.toLowerCase()})`,
            );
      return `### ${title}\n\n${bullets.join('\n')}\n`;
    })
    .join('\n');

const output = (
  [
    ['icons', renderIcons()],
    ['message-keys', renderMessageKeys()],
  ] as const
).reduce(
  (markdown, [name, body]) =>
    fillGenerated('components.md', markdown, name, body),
  out.join('\n'),
);

const readmeSource = await readFile(README_PATH, 'utf8');
const readmeOutput = fillGenerated(
  'README.md',
  readmeSource,
  'component-categories',
  renderReadmeCategories(),
);

// Stops before anything is written: the block would be filled in correctly but
// read under the wrong component, which no amount of regenerating fixes.
if (misplaced.length > 0) {
  console.error(
    `Props ブロックが所属する節の外にあります:\n  ${misplaced.join('\n  ')}`,
  );
  process.exit(1);
}

const problems: string[] = [];

if (process.argv.includes('--check')) {
  if (output !== source) {
    problems.push(
      'docs/references/components.md is stale. Run `pnpm generate:props`.',
    );
  }
  if (readmeOutput !== readmeSource) {
    problems.push('README.md is stale. Run `pnpm generate:props`.');
  }
} else {
  await writeFile(DOC_PATH, output);
  await writeFile(README_PATH, readmeOutput);
  console.warn(`Rewrote props for ${rewritten.size} components.`);
}

const headings = (markdown: string, level: '##' | '###') =>
  new Set(
    [...markdown.matchAll(new RegExp(`^${level} (\\S+)`, 'gmu'))].map(
      (m) => m[1] ?? '',
    ),
  );
const sections = (markdown: string) =>
  new Map(
    markdown
      .split(/^## /mu)
      .map((part) => [part.slice(0, part.indexOf('\n')), part] as const),
  );
const backticked = (text: string) =>
  new Set([...text.matchAll(/`(\w+)`/gu)].map((m) => m[1] ?? ''));

const documented = headings(output, '###');
// The AI chat components are documented in ai-chat.md with hand-written
// props bullets, so their absence from components.md is not a gap.
const documentedElsewhere = headings(
  await readFile(AI_CHAT_PATH, 'utf8'),
  '##',
);
const listedIcons = backticked(sections(output).get('Icons') ?? '');
const covered = (name: string) =>
  iconish(name)
    ? listedIcons.has(name)
    : documented.has(topLevel(name)) || documentedElsewhere.has(topLevel(name));

const undocumented = components
  .map((c) => c.name)
  .filter((name) => !rewritten.has(name) && !covered(name));
if (undocumented.length > 0) {
  problems.push(`components.md に未掲載: ${undocumented.join(', ')}`);
}
if (unknown.length > 0) {
  problems.push(`Props ブロックの対応先が不明: ${unknown.join(', ')}`);
}
// Documented but with no `Props:` block to fill — the props exist, the
// section just never asked for them.
const noBlock = components
  .filter((c) => c.props.length > 0 && !rewritten.has(c.name))
  .filter((c) => documented.has(c.name) || documented.has(topLevel(c.name)))
  .map((c) => c.name)
  .filter((name) => !iconish(name));
if (noBlock.length > 0) {
  problems.push(`Props ブロックが無い節: ${noBlock.join(', ')}`);
}

// The README's AI chat list names each component in bold, with its parts and
// behavior written by hand. Only that list counts, so a bold word elsewhere
// cannot stand in for a missing bullet.
const inAiList = new Set(
  [
    ...(sections(readmeOutput).get('AI Chat Components') ?? '').matchAll(
      /\*\*(\w+)\*\*/gu,
    ),
  ].map((m) => m[1] ?? ''),
);
const notInAiList = [
  ...new Set(
    components
      .filter((c) => c.category === AI_CATEGORY)
      .map((c) => topLevel(c.name)),
  ),
].filter((name) => !inAiList.has(name));
if (notInAiList.length > 0) {
  problems.push(
    `README.md の AI Chat Components に未掲載: ${notInAiList.join(', ')}`,
  );
}

// A part (`Message.Copy`) counts, and so does the compound it belongs to
// (`FileField`), which is not a component of its own.
const componentNames = new Set(
  components.flatMap((c) => [c.name, topLevel(c.name)]),
);
const unknownUsers = [
  ...new Set(
    Object.values(messageUsage)
      .flat()
      .map((user) => user.replace(/ \(.+\)$/u, '')),
  ),
].filter((name) => !componentNames.has(name));
if (unknownUsers.length > 0) {
  problems.push(
    `src/i18n/usage.ts に export に無い部品名: ${unknownUsers.join(', ')}`,
  );
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
if (process.argv.includes('--check')) {
  console.warn('docs/references/components.md and README.md are in sync.');
}
