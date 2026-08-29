/**
 * Rewrites the `Props:` blocks inside `docs/references/components.md` from
 * `docs/props.generated.json`.
 *
 * Only the props lists are generated. The prose and the code examples around
 * them stay hand-written, because they carry judgement the types do not.
 * `ai-chat.md` is deliberately left out: its props bullets group controllable
 * props and describe pass-through behavior, which the generated form would
 * flatten away.
 *
 *   node scripts/generate-components-md.ts            # rewrite the blocks
 *   node scripts/generate-components-md.ts --check    # fail if any block is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const DOC_PATH = fileURLToPath(
  new URL('../docs/references/components.md', import.meta.url),
);
const PROPS_PATH = fileURLToPath(
  new URL('../docs/props.generated.json', import.meta.url),
);

type Prop = {
  name: string;
  types: string[];
  defaultValue: string | null;
  required: boolean;
};
type Component = { name: string; props: Prop[]; inherits: string | null };

const { components } = JSON.parse(await readFile(PROPS_PATH, 'utf8')) as {
  components: Component[];
};
const byName = new Map(components.map((c) => [c.name, c]));

/** Icons are covered as a group, not one section each. */
const iconish = (name: string) => name.endsWith('Icon') || name === 'Logo';

const renderProps = (component: Component): string[] => {
  if (component.props.length === 0) {
    return ['- _No props of its own._'];
  }
  return component.props.map((prop) => {
    const types = prop.types.map((type) => `\`${type}\``).join(' | ');
    const suffix = prop.required
      ? ' (required)'
      : prop.defaultValue === null
        ? ''
        : ` (default: \`${prop.defaultValue}\`)`;
    return `- \`${prop.name}\`: ${types}${suffix}`;
  });
};

const source = await readFile(DOC_PATH, 'utf8');
const lines = source.split('\n');
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

const output = out.join('\n');

// Fails in both modes: the block would be filled in correctly but read under
// the wrong component, which no amount of regenerating fixes.
if (misplaced.length > 0) {
  console.error(
    `Props ブロックが所属する節の外にあります:\n  ${misplaced.join('\n  ')}`,
  );
  process.exit(1);
}

if (process.argv.includes('--check')) {
  if (output !== source) {
    console.error(
      'docs/references/components.md props are stale. Run `pnpm generate:components-md`.',
    );
    process.exit(1);
  }
  console.warn('docs/references/components.md props are in sync.');
} else {
  await writeFile(DOC_PATH, output);
  console.warn(`Rewrote props for ${rewritten.size} components.`);

  const documented = new Set(
    [...source.matchAll(/^### (\S+)/gmu)].map((m) => m[1] ?? ''),
  );
  // The AI chat components are documented in ai-chat.md with hand-written
  // props bullets, so their absence from components.md is not a gap.
  const aiChatSource = await readFile(
    fileURLToPath(new URL('../docs/references/ai-chat.md', import.meta.url)),
    'utf8',
  );
  const documentedElsewhere = new Set(
    [...aiChatSource.matchAll(/^## (\S+)/gmu)].map((m) => m[1] ?? ''),
  );
  const covered = (name: string) =>
    documented.has(name.split('.')[0] ?? '') ||
    documentedElsewhere.has(name.split('.')[0] ?? '');
  const missing = components
    .filter((c) => c.props.length > 0)
    .map((c) => c.name)
    .filter((name) => !rewritten.has(name) && !covered(name));
  if (unknown.length > 0) {
    console.warn(`Props ブロックの対応先が不明: ${unknown.join(', ')}`);
  }
  const uncovered = missing.filter((name) => !iconish(name));
  if (uncovered.length > 0) {
    console.warn(`components.md に未掲載: ${uncovered.join(', ')}`);
  }
  // Documented but with no `Props:` block to fill — the props exist, the
  // section just never asked for them.
  const noBlock = components
    .filter((c) => c.props.length > 0 && !rewritten.has(c.name))
    .filter(
      (c) =>
        documented.has(c.name) || documented.has(c.name.split('.')[0] ?? ''),
    )
    .map((c) => c.name)
    .filter((name) => !iconish(name));
  if (noBlock.length > 0) {
    console.warn(`Props ブロックが無い節: ${noBlock.join(', ')}`);
  }
}
