# Typography

Typography in `@k8ordo/ui` aims for readability and quiet at the same time.

## Font family

A font stack tuned for Japanese: Noto Sans JP and M PLUS 2.

The library ships no font files and sets no `font-family` of its own, so until
your app sets one, text stays on preflight's system stack (Roboto included).
Load the fonts yourself (fontsource, `next/font`, …) and define the two
variables the theme reads:

```css
:root {
  --font-noto-sans-jp: 'Noto Sans JP', sans-serif;
  --font-m-plus-2: 'M PLUS 2', sans-serif;
}

body {
  font-family: var(--font-noto-sans-jp);
}
```

- With `tailwind.css`, those variables back the `font-noto-sans-jp` and `font-m-plus-2` utilities. They are the only font-family utilities; the theme removes `font-sans`, `font-serif`, and `font-mono`
- **Do not use Inter / Roboto / Open Sans** — they read as AI-generated
- Japanese text dominates, so Japanese faces come first

## Font size scale

| Tailwind class   | Value    | Use                     |
| ---------------- | -------- | ----------------------- |
| `text-xs`        | 0.75rem  | Annotations, captions   |
| `text-sm`        | 0.875rem | Supporting text, labels |
| `text-md`        | 1rem     | Body text (default)     |
| `text-lg`        | 1.125rem | Subheadings             |
| `text-xl`        | 1.25rem  | Headings                |
| `text-2xl`       | 1.5rem   | Large headings          |
| `text-3xl`       | 1.875rem | Page titles             |
| `text-emphasize` | 3rem     | Emphasis display        |
| `text-highlight` | 6rem     | Highlight display       |

## Font weight

Use weight sparingly. Heavy type undermines the quiet.

| Tailwind class | Value | Use                                   |
| -------------- | ----- | ------------------------------------- |
| (none)         | 400   | Body text (the inherited default)     |
| `font-medium`  | 450   | Emphasized text (restrained emphasis) |
| `font-bold`    | 700   | Headings, button labels               |

- The theme defines only `font-medium` and `font-bold`. `font-normal`, `font-semibold`, and the other Tailwind weight classes are not generated
- Note that `font-medium` is 450 here — lighter than the usual 500

## Line height

Japanese text needs more leading than Latin text.

| Tailwind class    | Value | Use                             |
| ----------------- | ----- | ------------------------------- |
| `leading-none`    | 1     | Special cases (highlight, …)    |
| `leading-tight`   | 1.25  | Headings                        |
| `leading-snug`    | 1.375 | Subheadings                     |
| `leading-normal`  | 1.5   | Inside lists; the default       |
| `leading-relaxed` | 1.625 | Body text (recommended)         |
| `leading-loose`   | 2     | When wide leading is called for |

## Letter spacing

| Tailwind class    | Value   | Use                         |
| ----------------- | ------- | --------------------------- |
| `tracking-none`   | 0em     | Default                     |
| `tracking-normal` | 0.025em | When a little air is wanted |

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

- Body text on `leading-loose` (2) with `tracking-normal`: Japanese needs more
  leading than Latin text.
- `1rem` between blocks, `3rem` above an `h2`, `2rem` above `h3`–`h6`, and
  `0.75rem` between a heading and what follows it.
- Headings in `font-bold`, `leading-snug`, with `text-wrap: balance` and
  proportional kana (`font-feature-settings: 'palt'`).
- `strong` in `font-bold`. `em` as emphasis dots (傍点, `text-emphasis: filled
sesame`) where the text is Japanese (`:lang(ja)`), and italic elsewhere.
- Links, inline code, `kbd`, and `pre` drawn like `Anchor`, `Code`, `Kbd`, and a
  code block; lists with their markers back; quotes, tables, rules, images,
  and GFM footnotes and task lists.
- Under `.writing-v`, each paragraph's first line is indented one character,
  as a book is set.

**Only bare elements are typeset.** The element rules stop at any element with a
`class` — which is every `@k8ordo/ui` component — so a component placed in the
text keeps its own look (an `Alert`'s list does not get bullets). The spacing
between blocks still applies to it. The classes remark-gfm puts on footnotes
and task lists are the exception: they are treated as part of the text.
Map an MDX element to a component when you want it to look like the component,
and leave it bare when you want it to look like text.

## Vertical writing mode

Dedicated utilities and a variant are provided for vertical writing.

### Utilities

| Tailwind class        | Use                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `writing-h`           | Return to horizontal (`writing-mode: horizontal-tb`). Use it for figures, code blocks, and replaced elements inside a vertical tree.                                                   |
| `writing-v`           | Apply vertical writing (`writing-mode: vertical-rl`) together with the recommended defaults such as `text-orientation: mixed`.                                                         |
| `writing-sideways-rl` | Turn a block sideways (`writing-mode: sideways-rl`): it lays out like horizontal text rotated 90° clockwise, Japanese glyphs included. `Table` applies it to itself under `vertical:`. |

### The `vertical:` variant

A Tailwind variant that activates inside a `.writing-v` subtree and is disabled
inside `.writing-h`. It lets you override a horizontal default declaratively.

```tsx
<div className="writing-v">
  <p className="my-4 vertical:my-0">
    {/* Vertical margin only in horizontal mode; dropped when vertical */}
  </p>
</div>
```

### Switching at runtime

There is no JavaScript API for the writing mode. Keep the mode in your own
state, and put `writing-v` on the container that should turn vertical:

```tsx
const [mode, setMode] = useState<'horizontal' | 'vertical'>('horizontal');

<article className={mode === 'vertical' ? 'writing-v' : undefined}>
  <p className="my-4 vertical:my-0">…</p>
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

- Replaced elements such as images and iframes may not size as expected under `vertical-rl`. Return the element itself to horizontal, as in `<img className="vertical:writing-h" />`.
- `-webkit-line-clamp` (`line-clamp-*`) conflicts with `writing-mode` in Safari. In vertical mode, replace it with a `block-size` cap plus `overflow: hidden`.
- Libraries that assume horizontal layout internally, such as KaTeX, need `writing-h` applied only where required.

## What not to do

- Reach past the three weights (400, `font-medium`, `font-bold`) with an arbitrary value (`font-[600]`, …)
- Use anything larger than `text-3xl` for ordinary text (`text-emphasize` and `text-highlight` are for special cases)
- Apply `uppercase` or `tracking-widest` to Japanese text
- Apply a gradient to text
- Build hierarchy from font size alone — use spacing as well
