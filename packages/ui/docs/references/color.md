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

| Tailwind class    | Light      | Dark       | Use             |
| ----------------- | ---------- | ---------- | --------------- |
| `text-fg-base`    | gray-900   | gray-50    | Body text       |
| `text-fg-subtle`  | gray-600   | gray-400   | Placeholders    |
| `text-fg-mute`    | gray-700   | gray-300   | Supporting text |
| `text-fg-inverse` | gray-50    | gray-900   | Inverted text   |
| `text-fg-info`    | blue-800   | blue-200   | Information     |
| `text-fg-success` | green-800  | green-200  | Success         |
| `text-fg-warning` | yellow-800 | yellow-200 | Warning         |
| `text-fg-error`   | red-800    | red-200    | Error           |

## Semantic colors (background)

| Tailwind class    | Light      | Dark       | Use                                                                         |
| ----------------- | ---------- | ---------- | --------------------------------------------------------------------------- |
| `bg-bg-base`      | white      | gray-800   | Card background                                                             |
| `bg-bg-raised`    | white      | gray-800   | Overlays (Modal, Dialog, DropdownMenu, ListBox, Autocomplete's option list) |
| `bg-bg-surface`   | gray-50    | gray-950   | Outermost ground: lighter than `bg-subtle` in light, darker in dark         |
| `bg-bg-subtle`    | gray-100   | gray-900   | Page background                                                             |
| `bg-bg-mute`      | gray-200   | gray-700   | For the hover state                                                         |
| `bg-bg-emphasize` | gray-300   | gray-600   | For the active state                                                        |
| `bg-bg-inverse`   | gray-900   | white      | Inverted background                                                         |
| `bg-bg-info`      | blue-100   | blue-900   | Information ground                                                          |
| `bg-bg-success`   | green-100  | green-900  | Success ground                                                              |
| `bg-bg-warning`   | yellow-100 | yellow-900 | Warning ground                                                              |
| `bg-bg-error`     | red-100    | red-900    | Error ground                                                                |

## Semantic colors (border)

| Tailwind class            | Light      | Dark       | Use                |
| ------------------------- | ---------- | ---------- | ------------------ |
| `border-border-base`      | gray-400   | gray-600   | Standard border    |
| `border-border-subtle`    | gray-100   | gray-700   | Light border       |
| `border-border-mute`      | gray-200   | gray-600   | Restrained border  |
| `border-border-emphasize` | gray-500   | gray-500   | Emphasized border  |
| `border-border-inverse`   | gray-700   | gray-300   | Inverted border    |
| `border-border-info`      | blue-500   | blue-400   | Information border |
| `border-border-success`   | green-500  | green-400  | Success border     |
| `border-border-warning`   | yellow-500 | yellow-400 | Warning border     |
| `border-border-error`     | red-500    | red-400    | Error border       |

## Brand color (primary: teal H:180)

| Tailwind class            | Light    | Dark     | Use                       |
| ------------------------- | -------- | -------- | ------------------------- |
| `text-primary-fg`         | teal-800 | teal-300 | Primary text              |
| `bg-primary-bg`           | teal-200 | teal-900 | Primary background        |
| `bg-primary-bg-subtle`    | teal-50  | teal-950 | Light primary background  |
| `bg-primary-bg-mute`      | teal-100 | teal-900 | Restrained primary ground |
| `bg-primary-bg-emphasize` | teal-300 | teal-800 | Emphasized primary ground |
| `border-primary-border`   | teal-500 | teal-500 | Primary border            |

## Brand color (secondary: cyan H:210)

| Tailwind class              | Light    | Dark     | Use                         |
| --------------------------- | -------- | -------- | --------------------------- |
| `text-secondary-fg`         | cyan-800 | cyan-300 | Secondary text              |
| `bg-secondary-bg`           | cyan-200 | cyan-900 | Secondary background        |
| `bg-secondary-bg-subtle`    | cyan-50  | cyan-950 | Light secondary background  |
| `bg-secondary-bg-mute`      | cyan-100 | cyan-900 | Restrained secondary ground |
| `bg-secondary-bg-emphasize` | cyan-300 | cyan-800 | Emphasized secondary ground |
| `border-secondary-border`   | cyan-500 | cyan-500 | Secondary border            |

## Data visualization and backdrop

| Tailwind class (`bg-` shown) | Light              | Dark       | Use                     |
| ---------------------------- | ------------------ | ---------- | ----------------------- |
| `bg-group-primary`           | teal-800           | teal-200   | First data series       |
| `bg-group-secondary`         | cyan-800           | cyan-200   | Second data series      |
| `bg-group-tertiary`          | pink-800           | pink-200   | Third data series       |
| `bg-group-quaternary`        | purple-800         | purple-200 | Fourth data series      |
| `backdrop:bg-back-drop`      | `rgb(0 0 0 / 0.5)` | (same)     | The backdrop of a modal |

Like every color token, these work with any color utility (`text-`, `fill-`,
`stroke-`, …). `transparent` is the one other color the theme defines.

## Contrast

WCAG 2 contrast ratios of the values in `tokens.css`, as axe measures them, for
the lowest pair in each row (rounded down). Every pair holds at least AA for
normal text in light and in dark. The story `styles/contrast` renders each pair,
and the test suite runs axe over it in both color schemes — AAA where the table
says AAA — so a token change that breaks a row fails the build:

| Text                                                                  | Ground                                            | Light | Dark | Level                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------- | ----- | ---- | ------------------------------------------------------ |
| `fg-base`, `fg-mute`, the status `fg-*`, `primary-fg`, `secondary-fg` | `bg-base`, `bg-raised`, `bg-surface`, `bg-subtle` | 7.0   | 8.3  | AAA                                                    |
| A status `fg-*`                                                       | Its own `bg-*` (`bg-error` for `fg-error`, …)     | 6.9   | 7.5  | AAA, except `fg-success` on `bg-success` in light (AA) |
| `primary-fg` / `secondary-fg`                                         | `*-bg-subtle`                                     | 7.5   | 11.9 | AAA                                                    |
| `fg-mute`                                                             | `bg-mute`                                         | 6.7   | 5.2  | AA                                                     |
| `fg-subtle`                                                           | `bg-base`, `bg-raised`, `bg-surface`, `bg-subtle` | 4.8   | 6.1  | AA                                                     |
| `primary-fg` / `secondary-fg`                                         | `*-bg`, `*-bg-mute`                               | 6.1   | 6.3  | AA                                                     |
| `primary-fg` / `secondary-fg`                                         | `*-bg-emphasize`                                  | 5.2   | 5.2  | AA                                                     |

In dark, `*-bg` is 900 (the same step as `*-bg-mute`) and `*-bg-emphasize` is
800, a step darker than the rest of the dark scale would suggest, so the brand
text stays AA on the hover and active grounds of a solid `Button` /
`IconButton`.

## Usage examples

```tsx
// Float a card on the page background
<div className="bg-bg-subtle min-h-screen">
  <Card variant="shadow">
    <div className="p-6">
      <h2 className="text-fg-base font-bold">Title</h2>
      <p className="text-fg-mute mt-2">Supporting text</p>
      <span className="text-primary-fg">Accent text</span>
    </div>
  </Card>
</div>

// Hover state
<button className="bg-bg-base hover:bg-bg-mute transition-colors">
  Button
</button>
```

## What not to do

- Gradient backgrounds (`bg-gradient-to-*`)
- Saturated color over large areas (keep accents small)
- Expressing state with opacity (`/90`, `/80`, …) — use the dedicated semantic color
- Using `bg-primary-bg` on hover — prefer `bg-bg-mute`
- Using a raw palette color (`bg-teal-500`) directly — use a semantic token
- Simply inverting the colors for dark mode
