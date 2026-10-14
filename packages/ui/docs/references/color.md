# Color system

The colors in `@k8ordo/ui` are defined in the OKLCH color space and reach the UI
in a calm tone.

## Design intent

- **An OKLCH palette**: every color is defined in OKLCH. The chromatic hues share one lightness (L) scale, so a step number gives close to the same contrast whatever the hue; gray has a scale of its own
- **A vivid palette, calm tokens**: the palette itself stays vivid; the semantic tokens map it down to a restrained tone
- **Contrast**: text tokens hold WCAG AAA (7:1 or better) on the page and card grounds; `fg-subtle` and brand text on `*-bg` / `*-bg-mute` / `*-bg-emphasize` stop short of it but hold AA for normal text, in light and in dark — see [Contrast](#contrast)
- **The 60-30-10 rule**: 60% neutral (greys), 30% supporting (`bg-subtle`, …), 10% accent (primary)
- Primary is teal (H:180), secondary is cyan (H:210)
- Dark mode is designed as its own tone, not as an inversion of light mode

## OKLCH palette design

The lightness scale. Every chromatic hue uses the first L column, except that
teal and cyan put 100 at 0.955; gray uses the second:

| Step | L (chromatic) | L (gray) | Use                     |
| ---- | ------------- | -------- | ----------------------- |
| 50   | 0.975         | 0.975    | The lightest background |
| 100  | 0.945         | 0.955    | A light background      |
| 200  | 0.900         | 0.925    | A restrained background |
| 300  | 0.840         | 0.840    | Supporting color        |
| 400  | 0.750         | 0.750    | Mid tone                |
| 500  | 0.660         | 0.660    | The core color          |
| 600  | 0.575         | 0.520    | Slightly dark           |
| 700  | 0.490         | 0.420    | Dark tone               |
| 800  | 0.410         | 0.300    | For text (AAA on white) |
| 900  | 0.370         | 0.250    | Very dark               |
| 950  | 0.180         | 0.180    | The darkest             |

Chroma is set per hue and per step. Many steps lie outside the sRGB gamut, so
the browser maps them to what the display can show.

## Semantic colors (foreground)

| Token                | Light      | Dark       | Use             |
| -------------------- | ---------- | ---------- | --------------- |
| `--color-fg-base`    | gray-900   | gray-50    | Body text       |
| `--color-fg-subtle`  | gray-600   | gray-400   | Placeholders    |
| `--color-fg-mute`    | gray-700   | gray-300   | Supporting text |
| `--color-fg-inverse` | gray-50    | gray-900   | Inverted text   |
| `--color-fg-info`    | blue-800   | blue-200   | Information     |
| `--color-fg-success` | green-800  | green-200  | Success         |
| `--color-fg-warning` | yellow-800 | yellow-200 | Warning         |
| `--color-fg-error`   | red-800    | red-200    | Error           |

## Semantic colors (background)

| Token                  | Light      | Dark       | Use                                                                         |
| ---------------------- | ---------- | ---------- | --------------------------------------------------------------------------- |
| `--color-bg-base`      | white      | gray-800   | Card background                                                             |
| `--color-bg-raised`    | white      | gray-800   | Overlays (Modal, Dialog, DropdownMenu, ListBox, Autocomplete's option list) |
| `--color-bg-surface`   | gray-50    | gray-950   | Outermost ground: lighter than `bg-subtle` in light, darker in dark         |
| `--color-bg-subtle`    | gray-100   | gray-900   | Page background                                                             |
| `--color-bg-mute`      | gray-200   | gray-700   | For the hover state                                                         |
| `--color-bg-emphasize` | gray-300   | gray-600   | For the active state                                                        |
| `--color-bg-inverse`   | gray-900   | white      | Inverted background                                                         |
| `--color-bg-info`      | blue-100   | blue-900   | Information ground                                                          |
| `--color-bg-success`   | green-100  | green-900  | Success ground                                                              |
| `--color-bg-warning`   | yellow-100 | yellow-900 | Warning ground                                                              |
| `--color-bg-error`     | red-100    | red-900    | Error ground                                                                |

## Semantic colors (border)

| Token                      | Light      | Dark       | Use                |
| -------------------------- | ---------- | ---------- | ------------------ |
| `--color-border-base`      | gray-400   | gray-600   | Standard border    |
| `--color-border-subtle`    | gray-100   | gray-700   | Light border       |
| `--color-border-mute`      | gray-200   | gray-600   | Restrained border  |
| `--color-border-emphasize` | gray-500   | gray-500   | Emphasized border  |
| `--color-border-inverse`   | gray-700   | gray-300   | Inverted border    |
| `--color-border-info`      | blue-500   | blue-400   | Information border |
| `--color-border-success`   | green-500  | green-400  | Success border     |
| `--color-border-warning`   | yellow-500 | yellow-400 | Warning border     |
| `--color-border-error`     | red-500    | red-400    | Error border       |

## Brand color (primary: teal H:180)

| Token                          | Light    | Dark     | Use                       |
| ------------------------------ | -------- | -------- | ------------------------- |
| `--color-primary-fg`           | teal-800 | teal-300 | Primary text              |
| `--color-primary-bg`           | teal-200 | teal-900 | Primary background        |
| `--color-primary-bg-subtle`    | teal-50  | teal-950 | Light primary background  |
| `--color-primary-bg-mute`      | teal-100 | teal-900 | Restrained primary ground |
| `--color-primary-bg-emphasize` | teal-300 | teal-800 | Emphasized primary ground |
| `--color-primary-border`       | teal-500 | teal-500 | Primary border            |

## Brand color (secondary: cyan H:210)

| Token                            | Light    | Dark     | Use                         |
| -------------------------------- | -------- | -------- | --------------------------- |
| `--color-secondary-fg`           | cyan-800 | cyan-300 | Secondary text              |
| `--color-secondary-bg`           | cyan-200 | cyan-900 | Secondary background        |
| `--color-secondary-bg-subtle`    | cyan-50  | cyan-950 | Light secondary background  |
| `--color-secondary-bg-mute`      | cyan-100 | cyan-900 | Restrained secondary ground |
| `--color-secondary-bg-emphasize` | cyan-300 | cyan-800 | Emphasized secondary ground |
| `--color-secondary-border`       | cyan-500 | cyan-500 | Secondary border            |

## Data visualization and backdrop

| Token                      | Light              | Dark       | Use                     |
| -------------------------- | ------------------ | ---------- | ----------------------- |
| `--color-group-primary`    | teal-800           | teal-200   | First data series       |
| `--color-group-secondary`  | cyan-800           | cyan-200   | Second data series      |
| `--color-group-tertiary`   | pink-800           | pink-200   | Third data series       |
| `--color-group-quaternary` | purple-800         | purple-200 | Fourth data series      |
| `--color-back-drop`        | `rgb(0 0 0 / 0.5)` | (same)     | The backdrop of a modal |

Every color is a custom property, so it goes into any CSS property that takes a
color: `color: var(--color-fg-mute)`, `fill: var(--color-group-primary)`. With
`tailwind.css`, each one is also a color utility without its `--color-` prefix
(`bg-bg-base`, `text-fg-mute`, `fill-group-primary`, …).

Under forced colors, paint with the system colors through
`--color-system-canvas-text`, `--color-system-gray-text`,
`--color-system-highlight` and `--color-system-highlight-text` (see
[forced colors](#forced-colors-active)).

## Contrast

WCAG 2 contrast ratios of the color tokens, as axe measures them, for the
lowest pair in each row (rounded down). The tokens drop their `--color-` prefix
in this table and the next. Every pair holds at least AA for
normal text in light and in dark. The story `styles/contrast` renders each pair,
and the test suite runs axe over it in both color schemes — AAA where the table
says AAA — so a token change that breaks a row fails the build:

| Text                                                                  | Ground                                            | Light | Dark | Level                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------- | ----- | ---- | ------------------------------------------------------ |
| `fg-base`, `fg-mute`, the status `fg-*`, `primary-fg`, `secondary-fg` | `bg-base`, `bg-raised`, `bg-surface`, `bg-subtle` | 7.0   | 8.3  | AAA                                                    |
| A status `fg-*`                                                       | Its own `bg-*` (`bg-error` for `fg-error`, …)     | 6.9   | 7.5  | AAA, except `fg-success` on `bg-success` in light (AA) |
| `primary-fg` / `secondary-fg`                                         | `*-bg-subtle`                                     | 7.5   | 11.9 | AAA                                                    |
| `fg-base`                                                             | `bg-mute`                                         | 12.8  | 7.8  | AAA                                                    |
| `fg-mute`                                                             | `bg-mute`                                         | 6.7   | 5.2  | AA                                                     |
| `fg-base`                                                             | `bg-emphasize`                                    | 9.7   | 5.1  | AA                                                     |
| `fg-subtle`                                                           | `bg-base`, `bg-raised`, `bg-surface`, `bg-subtle` | 4.8   | 6.1  | AA                                                     |
| `primary-fg` / `secondary-fg`                                         | `*-bg`, `*-bg-mute`                               | 6.1   | 6.3  | AA                                                     |
| `primary-fg` / `secondary-fg`                                         | `*-bg-emphasize`                                  | 5.2   | 5.2  | AA                                                     |

In dark, `*-bg` is 900 (the same step as `*-bg-mute`) and `*-bg-emphasize` is
800, a step darker than the rest of the dark scale would suggest, so the brand
text stays AA on the hover and active grounds of a solid `Button` /
`IconButton`.

## High contrast and forced colors

The stylesheet follows the two contrast settings a user makes in the OS. Neither
is a preference an application stores, so `@k8ordo/color-scheme` leaves them
alone: there is nothing to toggle or persist.

### `prefers-contrast: more`

`styles.css` moves the text and border tokens further from the ground, in light
and in dark. Text then holds AAA on the page, card, and status grounds, and
borders hold 3:1 against the grounds they sit on.

| Token                                 | Light       | Dark     |
| ------------------------------------- | ----------- | -------- |
| `fg-base`                             | gray-950    | white    |
| `fg-mute`                             | gray-900    | gray-100 |
| `fg-subtle`                           | gray-800    | gray-200 |
| The status `fg-*`                     | 900         | 100      |
| `primary-fg` / `secondary-fg`         | 900         | 100      |
| `border-base`                         | gray-600    | gray-400 |
| `border-subtle`                       | gray-500    | gray-500 |
| `border-mute`                         | gray-500    | gray-400 |
| `border-emphasize`                    | gray-800    | gray-200 |
| The status `border-*`                 | 700         | 300      |
| `primary-border` / `secondary-border` | 700         | 300      |
| `bg-emphasize`                        | (unchanged) | gray-700 |

In dark, `bg-emphasize` moves a step darker as well, because white text on the
usual gray-600 would stay near 5:1.

Surfaces outlined only by a shadow or a ground — `Card`'s `shadow` variant,
`Modal`, `Drawer`, `Dialog`, `Alert`, `Callout` and `Toast`, a user `Message` — gain a
1px `border-base` outline, as do the `Switch` track and thumb and the `Slider`
and `Progress` tracks. A focused `DropdownMenu` or `ListBox` item and the
active `Autocomplete` option draw a 2px outline on top of their ground.

### `forced-colors: active`

Under forced colors the browser repaints every color from the user's palette,
drops shadows, and flattens grounds to one color. The components keep their
boundaries, focus rings, and selected states visible:

- **Boundaries**: the same outline as under `prefers-contrast: more`; controls with a border keep it
- **Focus rings**: the `box-shadow` ring disappears and a 2px outline shows instead (the components draw a transparent outline under forced colors, which the browser paints)
- **Selected states** are painted with system colors: `Highlight` for the selected tab's indicator, a checked `Switch` track, the `Progress` and `Slider` fill, and a selected `Autocomplete` option; `CanvasText` for the dot of a checked `Radio` / `RadioCard` and the thumb of a `Switch`
- `Separator` is painted `CanvasText` and `Skeleton` `GrayText`
- A color swatch in `Code` keeps its real color (`forced-color-adjust: none`), because the color is the content

### In your own UI

- Write the two settings as media queries: `@media (prefers-contrast: more)` and `@media (forced-colors: active)` (with `tailwind.css`, the `contrast-more:` and `forced-colors:` variants). Under forced colors only system colors survive, so paint state with them (`background-color: var(--color-system-highlight)`)
- Do not draw a boundary or a focus ring with `box-shadow` alone
- Do not hide something with a transparent color: forced colors paints it. Use `visibility: hidden`
- To tune the high-contrast values, redefine the tokens inside `@media (prefers-contrast: more)`, on `:root` and on `.dark`, in CSS loaded after the library stylesheet

## Usage examples

```css
/* page.module.css: float a card on the page background */
.page {
  min-height: 100vh;
  background-color: var(--color-bg-subtle);
}

.body {
  padding: calc(var(--spacing) * 6);
}

.title {
  color: var(--color-fg-base);
  font-weight: var(--font-weight-bold);
}

.lead {
  margin-top: calc(var(--spacing) * 2);
  color: var(--color-fg-mute);
}

.accent {
  color: var(--color-primary-fg);
}

/* the hover state */
.row {
  background-color: var(--color-bg-base);
  transition: background-color var(--duration-fast) var(--easing-out);
}

@media (hover: hover) {
  .row:hover {
    background-color: var(--color-bg-mute);
  }
}
```

```tsx
<div className={styles.page}>
  <Card variant="shadow">
    <div className={styles.body}>
      <h2 className={styles.title}>Title</h2>
      <p className={styles.lead}>Supporting text</p>
      <span className={styles.accent}>Accent text</span>
    </div>
  </Card>
</div>
```

With `tailwind.css` the same reads `bg-bg-subtle`, `p-6`, `text-fg-base
font-bold`, `mt-2 text-fg-mute`, `text-primary-fg`, and `bg-bg-base
hover:bg-bg-mute transition-colors duration-150 ease-out`.

## What not to do

- Gradient backgrounds
- Saturated color over large areas (keep accents small)
- Expressing state with opacity (`color-mix(… 90%, transparent)`, `/90`) — use the dedicated semantic color
- Using `--color-primary-bg` on hover — prefer `--color-bg-mute`
- Using a palette color (`--teal-500`) directly — use a semantic token. The palette is what the tokens are built from, not part of the API
- Simply inverting the colors for dark mode
