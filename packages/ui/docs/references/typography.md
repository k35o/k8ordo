# Typography

Typography in `@k8ordo/ui` aims for readability and quiet at the same time.

## Font family

A font stack tuned for Japanese: Noto Sans JP and M PLUS 2.

The library ships no font files and sets no font of its own: until your app
sets one, text stays on the reset's system stack, `--font-family-sans`
(Roboto included). Load the fonts yourself (fontsource, `next/font`, …), declare
them as tokens, and set the body:

```css
:root {
  --font-family-noto-sans-jp: 'Noto Sans JP', sans-serif;
  --font-family-m-plus-2: 'M PLUS 2', sans-serif;
}

body {
  font-family: var(--font-family-noto-sans-jp);
}
```

- `--font-family-sans` and `--font-family-mono` are the reset's stacks, which `body` and `code` / `kbd` / `pre` use until your app sets its own
- With `tailwind.css`, `--font-family-noto-sans-jp` and `--font-family-m-plus-2` back the `font-noto-sans-jp` and `font-m-plus-2` utilities. They are the only font-family utilities; the theme removes `font-sans`, `font-serif`, and `font-mono`
- **Do not use Inter / Roboto / Open Sans** — they read as AI-generated
- Japanese text dominates, so Japanese faces come first

## Font size scale

Each size has a line height to go with it, `--line-height-<size>`
(`--font-size-sm` with `--line-height-sm`). With `tailwind.css`, `text-<size>`
sets both.

| Token                   | Value    | Use                     |
| ----------------------- | -------- | ----------------------- |
| `--font-size-xs`        | 0.75rem  | Annotations, captions   |
| `--font-size-sm`        | 0.875rem | Supporting text, labels |
| `--font-size-md`        | 1rem     | Body text (default)     |
| `--font-size-lg`        | 1.125rem | Subheadings             |
| `--font-size-xl`        | 1.25rem  | Headings                |
| `--font-size-2xl`       | 1.5rem   | Large headings          |
| `--font-size-3xl`       | 1.875rem | Page titles             |
| `--font-size-emphasize` | 3rem     | Emphasis display        |
| `--font-size-highlight` | 6rem     | Highlight display       |

Three sizes follow the text they sit in, in `em`: `--font-size-code` (0.875em,
code in running text), `--font-size-kbd` (0.8125em) and `--font-size-callout`
(0.9em, the notes of a `CodeBlock`). `--spacing-em` (0.25em) is the spacing step
that goes with them.

## Font weight

Use weight sparingly. Heavy type undermines the quiet.

| Token                  | Value | Use                                   |
| ---------------------- | ----- | ------------------------------------- |
| (none)                 | 400   | Body text (the inherited default)     |
| `--font-weight-medium` | 450   | Emphasized text (restrained emphasis) |
| `--font-weight-bold`   | 700   | Headings, button labels               |

- There are only these two weight tokens. With `tailwind.css`, `font-medium` and `font-bold` are the only weight utilities
- Note that `--font-weight-medium` is 450 here — lighter than the usual 500

## Line height

Japanese text needs more leading than Latin text.

| Token                   | Value | Use                             |
| ----------------------- | ----- | ------------------------------- |
| `--line-height-none`    | 1     | Special cases (highlight, …)    |
| `--line-height-tight`   | 1.25  | Headings                        |
| `--line-height-snug`    | 1.375 | Subheadings                     |
| `--line-height-normal`  | 1.5   | Inside lists; the default       |
| `--line-height-relaxed` | 1.625 | Body text (recommended)         |
| `--line-height-loose`   | 2     | When wide leading is called for |

With `tailwind.css` these are `leading-none` … `leading-loose`.

## Letter spacing

| Token                     | Value   | Use                         |
| ------------------------- | ------- | --------------------------- |
| `--letter-spacing-none`   | 0em     | Default                     |
| `--letter-spacing-normal` | 0.025em | When a little air is wanted |

With `tailwind.css` these are `tracking-none` and `tracking-normal`.

## The Heading component

Use the `Heading` component for headings.

```tsx
import { Heading } from '@k8ordo/ui';

<Heading level="h1">Page title</Heading>
<Heading level="h2">Section heading</Heading>
<Heading level="h3">Subsection</Heading>
```

## Long-form text (Prose)

The base styles reset headings, lists, margins, and emphasis, which is right for
an interface and wrong for an article. `Prose` puts the typesetting of body text
back inside it, for Markdown or MDX rendered to HTML:

```tsx
import { Prose } from '@k8ordo/ui';

<article>
  <Prose>{content}</Prose>
</article>;
```

What it sets, tuned for Japanese:

- Body text on `--line-height-loose` (2) with `--letter-spacing-normal`:
  Japanese needs more leading than Latin text.
- `1rem` between blocks, `3rem` above an `h2`, `2rem` above `h3`–`h6`, and
  `0.75rem` between a heading and what follows it.
- Headings in `--font-weight-bold`, `--line-height-snug`, with
  `text-wrap: balance` and proportional kana (`font-feature-settings: 'palt'`).
- `strong` in `--font-weight-bold`. `em` as emphasis dots (傍点, `text-emphasis: filled
sesame`) where the text is Japanese (`:lang(ja)`), and italic elsewhere.
- Links, inline code, `kbd`, and `pre` drawn like `Anchor`, `Code`, `Kbd`, and a
  code block; lists with their markers back; quotes, tables, rules, images,
  and GFM footnotes and task lists (the footnotes' `sr-only` heading is
  read but not shown).
- Under `.writing-v`, each paragraph's first line is indented one character,
  as a book is set.

**Only bare elements are typeset.** The element rules stop at any element with a
`class` — which is every `@k8ordo/ui` component — so a component placed in the
text keeps its own look (an `Alert`'s list does not get bullets). The spacing
between blocks still applies to it. The classes remark-gfm puts on footnotes
and task lists (`footnotes`, `contains-task-list`, `task-list-item`,
`data-footnote-backref`, `sr-only`) are the exception: they are treated as part
of the text.
Map an MDX element to a component when you want it to look like the component,
and leave it bare when you want it to look like text.

## Vertical writing mode

`styles.css` ships three classes for the writing mode. They are the public
markers the components read, not utilities: put them on the element that
should turn.

| Class                 | Use                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `writing-h`           | Return to horizontal (`writing-mode: horizontal-tb`). Use it for figures, code blocks, and replaced elements inside a vertical tree.                                                   |
| `writing-v`           | Apply vertical writing (`writing-mode: vertical-rl`) together with the recommended defaults such as `text-orientation: mixed`.                                                         |
| `writing-sideways-rl` | Turn a block sideways (`writing-mode: sideways-rl`): it lays out like horizontal text rotated 90° clockwise, Japanese glyphs included. `Table` turns itself this way in vertical text. |

### Styling for vertical text

`writing-v` and `writing-h` also set the custom property `--writing`
(`vertical` or `horizontal`; `:root` holds `horizontal`), and it inherits. Read
it with a style query to change your own styles in vertical text:

```css
.paragraph {
  margin-block: calc(var(--spacing) * 4);

  @container style(--writing: vertical) {
    margin-block: 0;
  }
}
```

A style query asks the element's parent, so it does not see a `writing-v` on
the element itself: style that element through a class of its own. Prefer
logical properties (`margin-block`, `inline-size`) first; they often make the
override unnecessary.

With `tailwind.css`, the `vertical:` variant does the same for utilities: it
applies inside a `.writing-v` subtree and not inside `.writing-h`
(`className="my-4 vertical:my-0"`).

### Switching at runtime

There is no JavaScript API for the writing mode. Keep the mode in your own
state, and put `writing-v` on the container that should turn vertical:

```tsx
const [mode, setMode] = useState<'horizontal' | 'vertical'>('horizontal');

<article className={mode === 'vertical' ? 'writing-v' : undefined}>
  <p className={styles.paragraph}>…</p>
  <pre className="writing-h">…</pre>
</article>;
```

- Components follow a `.writing-v` ancestor on their own, with no props.
  `Tabs` (arrow keys and `aria-orientation`) and `Autocomplete` (the width of
  its list) also follow a class toggled while they are on screen. `Popover`,
  `Tooltip`, `DropdownMenu`, and `ListBox` read the writing mode each time
  they open, so a change made while one is open shows the next time it opens.
- When your own JavaScript has to branch — hiding a side rail in vertical
  mode, say — branch on the state you toggle, not on the DOM.
- To read the mode of an element you do not control, call
  `getComputedStyle(element).writingMode` at the moment you need it. There is
  no event to subscribe to, and a `ResizeObserver` does not stand in for one:
  an element that shrinks to fit its content keeps its logical size when the
  writing mode flips, so the observer never fires.

### Caveats

- Replaced elements such as images and iframes may not size as expected under `vertical-rl`. Return the element itself to horizontal, as in `<img className="writing-h" />`.
- `-webkit-line-clamp` conflicts with `writing-mode` in Safari. In vertical mode, replace it with a `block-size` cap plus `overflow: hidden`.
- Libraries that assume horizontal layout internally, such as KaTeX, need `writing-h` applied only where required.

## What not to do

- Reach past the three weights (400, `--font-weight-medium`, `--font-weight-bold`) with an arbitrary value (`font-weight: 600`, …)
- Use anything larger than `--font-size-3xl` for ordinary text (`--font-size-emphasize` and `--font-size-highlight` are for special cases)
- Apply `text-transform: uppercase` or wide letter spacing to Japanese text
- Apply a gradient to text
- Build hierarchy from font size alone — use spacing as well
