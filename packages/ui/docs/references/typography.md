# Typography

Typography in `@k8ordo/ui` aims for readability and quiet at the same time.

## Font family

A font stack tuned for Japanese.

```css
font-family: 'Noto Sans JP', 'M PLUS 2', sans-serif;
```

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
| `font-normal`  | 400   | Body text                             |
| `font-medium`  | 450   | Emphasized text (restrained emphasis) |
| `font-bold`    | 700   | Headings, button labels               |

- Do not use `font-semibold` (600) or `font-extrabold` (800)
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

## Vertical writing mode

Dedicated utilities and a variant are provided for vertical writing.

### Utilities

| Tailwind class | Use                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `writing-h`    | Return to horizontal (`writing-mode: horizontal-tb`). Use it for figures, code blocks, and replaced elements inside a vertical tree. |
| `writing-v`    | Apply vertical writing (`writing-mode: vertical-rl`) together with the recommended defaults such as `text-orientation: mixed`.       |

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

### Caveats

- Replaced elements such as images and iframes may not size as expected under `vertical-rl`. Return the element itself to horizontal, as in `<img className="vertical:writing-h" />`.
- `-webkit-line-clamp` (`line-clamp-*`) conflicts with `writing-mode` in Safari. In vertical mode, replace it with a `block-size` cap plus `overflow: hidden`.
- Libraries that assume horizontal layout internally, such as KaTeX, need `writing-h` applied only where required.

## What not to do

- Use three or more font weights on one screen
- Use anything larger than `text-3xl` for ordinary text (`text-emphasize` and `text-highlight` are for special cases)
- Apply `uppercase` or `tracking-widest` to Japanese text
- Apply a gradient to text
- Build hierarchy from font size alone — use spacing as well
