type Section = { heading: string; lines: string[] };

const trimBlankLines = (lines: string[]): string[] => {
  const start = lines.findIndex((line) => line.trim() !== '');
  if (start === -1) return [];
  const end = lines.findLastIndex((line) => line.trim() !== '');
  return lines.slice(start, end + 1);
};

/** Read the way the `Props:` blocks read a heading: `### Tabs (compound)` is `Tabs`. */
const nameOf = (heading: string): string => /^\S*/u.exec(heading)?.[0] ?? '';

const splitAt = (lines: string[], level: '## ' | '### '): Section[] => {
  const sections: Section[] = [{ heading: '', lines: [] }];
  let fenced = false;
  for (const line of lines) {
    if (line.startsWith('```')) fenced = !fenced;
    if (!fenced && line.startsWith(level)) {
      sections.push({ heading: line.slice(level.length).trim(), lines: [] });
    }
    sections.at(-1)?.lines.push(line);
  }
  return sections;
};

/**
 * Puts every `### Component` section of components.md under the `##` heading
 * of its category, and the category headings in the order `titles` gives.
 */
export const regroupSections = (
  markdown: string,
  titles: ReadonlyMap<string, string>,
  categoryOf: (name: string) => string | undefined,
): string => {
  const titleSet = new Set(titles.values());
  const blocks = splitAt(markdown.split('\n'), '## ');
  const categoryBlocks = blocks.filter((block) => titleSet.has(block.heading));
  const first = blocks.findIndex((block) => titleSet.has(block.heading));
  const last = blocks.findLastIndex((block) => titleSet.has(block.heading));
  if (first === -1) {
    throw new Error('components.md has no category section');
  }
  const stray = blocks
    .slice(first, last + 1)
    .filter((block) => !titleSet.has(block.heading));
  if (stray.length > 0) {
    throw new Error(
      `components.md: the category sections must run together, found ${stray.map((block) => `## ${block.heading}`).join(', ')} among them`,
    );
  }
  if (
    new Set(categoryBlocks.map((block) => block.heading)).size !==
    categoryBlocks.length
  ) {
    throw new Error('components.md: a category heading appears twice');
  }

  const titleOf = (heading: string): string | undefined => {
    const category = categoryOf(nameOf(heading));
    return category === undefined ? undefined : titles.get(category);
  };
  const seen = new Set<string>();
  const moved: Array<{ title: string; section: Section }> = [];
  const parsed = blocks.map((block) => {
    // Everything before the first `##` has no heading line of its own.
    const headingLine = block.heading === '' ? undefined : block.lines[0];
    const body = block.heading === '' ? block.lines : block.lines.slice(1);
    const [intro = { heading: '', lines: [] }, ...sections] = splitAt(
      body,
      '### ',
    );
    const kept = sections.filter((section) => {
      const title = titleOf(section.heading);
      if (title === undefined) return true;
      if (seen.has(nameOf(section.heading))) {
        throw new Error(
          `components.md: ### ${nameOf(section.heading)} appears twice`,
        );
      }
      seen.add(nameOf(section.heading));
      if (title === block.heading) return true;
      moved.push({ title, section });
      return false;
    });
    return { block, headingLine, intro, kept };
  });

  const outside = (from: number, to?: number): string[] => {
    const lines: string[] = [];
    for (const { headingLine, intro, kept } of parsed.slice(from, to)) {
      if (headingLine !== undefined) lines.push(headingLine);
      lines.push(...intro.lines);
      for (const section of kept) lines.push(...section.lines);
    }
    return lines;
  };

  const categoryLines: string[] = [];
  for (const title of titles.values()) {
    const found = parsed.find(({ block }) => block.heading === title);
    const intro = trimBlankLines(found?.intro.lines ?? []);
    const sections = [
      ...(found?.kept ?? []),
      ...moved
        .filter((entry) => entry.title === title)
        .map((entry) => entry.section),
    ];
    if (intro.length === 0 && sections.length === 0) continue;
    categoryLines.push(`## ${title}`, '');
    if (intro.length > 0) categoryLines.push(...intro, '');
    for (const section of sections) {
      categoryLines.push(...trimBlankLines(section.lines), '');
    }
  }

  return [...outside(0, first), ...categoryLines, ...outside(last + 1)].join(
    '\n',
  );
};

/** Joins words into lines of at most 80 columns, as the hand-wrapped prose is. */
export const wrap = (words: string[]): string => {
  const wrapped: string[] = [];
  for (const word of words) {
    const current = wrapped.at(-1);
    if (current !== undefined && current.length + 1 + word.length <= 80) {
      wrapped[wrapped.length - 1] = `${current} ${word}`;
    } else {
      wrapped.push(word);
    }
  }
  return `${wrapped.join('\n')}\n`;
};

/** Replaces what sits between `<!-- generated:<name> -->` and its closing marker. */
export const fillGenerated = (
  file: string,
  markdown: string,
  name: string,
  body: string,
): string => {
  const pattern = new RegExp(
    `<!-- generated:${name} -->\\n[\\s\\S]*?<!-- /generated:${name} -->\\n`,
    'gu',
  );
  const found = markdown.match(pattern)?.length ?? 0;
  if (found !== 1) {
    throw new Error(
      `${file}: <!-- generated:${name} --> must appear exactly once, found ${String(found)}`,
    );
  }
  // The formatter keeps a blank line after the opening marker; writing the
  // formatted shape is what lets `--check` compare text.
  return markdown.replace(
    pattern,
    () =>
      `<!-- generated:${name} -->\n\n${body}\n<!-- /generated:${name} -->\n`,
  );
};
