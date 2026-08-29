# Color system

The colors in `@k8ordo/ui` are defined in the OKLCH color space and reach the UI
in a calm tone.

## Design intent

- **An OKLCH palette**: every color is defined in OKLCH. Lightness (L) is shared across hues, so the same step number gives matching contrast whatever the hue
- **A vivid palette, calm tokens**: the palette itself stays vivid; the semantic tokens map it down to a restrained tone
- **WCAG AAA**: fg/bg pairs hold a contrast ratio of 7:1 or better
- **The 60-30-10 rule**: 60% neutral (greys), 30% supporting (`bg-subtle`, …), 10% accent (primary)
- Primary is teal (H:180), secondary is cyan (H:210)
- Dark mode is designed as its own tone, not as an inversion of light mode

## OKLCH palette design

The lightness scale (shared by every hue):

| Step | L     | Use                     |
| ---- | ----- | ----------------------- |
| 50   | 0.975 | The lightest background |
| 100  | 0.945 | A light background      |
| 200  | 0.900 | A restrained background |
| 300  | 0.840 | Supporting color        |
| 400  | 0.750 | Mid tone                |
| 500  | 0.660 | The core color          |
| 600  | 0.575 | Slightly dark           |
| 700  | 0.490 | Dark tone               |
| 800  | 0.410 | For text (AAA on white) |
| 900  | 0.370 | The darkest             |

Chroma is optimized per hue (maximized within gamut).

## Semantic colors (foreground)

| Tailwind class    | Light      | Dark       | Use             |
| ----------------- | ---------- | ---------- | --------------- |
| `text-fg-base`    | gray-900   | gray-50    | Body text       |
| `text-fg-subtle`  | gray-400   | gray-500   | Placeholders    |
| `text-fg-mute`    | gray-700   | gray-300   | Supporting text |
| `text-fg-inverse` | gray-50    | gray-900   | Inverted text   |
| `text-fg-info`    | blue-800   | blue-200   | Information     |
| `text-fg-success` | green-800  | green-200  | Success         |
| `text-fg-warning` | yellow-800 | yellow-200 | Warning         |
| `text-fg-error`   | red-800    | red-200    | Error           |

## Semantic colors (background)

| Tailwind class    | Light      | Dark       | Use                  |
| ----------------- | ---------- | ---------- | -------------------- |
| `bg-bg-base`      | white      | gray-900   | Card background      |
| `bg-bg-subtle`    | gray-100   | gray-800   | Page background      |
| `bg-bg-mute`      | gray-200   | gray-700   | For the hover state  |
| `bg-bg-emphasize` | gray-300   | gray-600   | For the active state |
| `bg-bg-inverse`   | gray-900   | white      | Inverted background  |
| `bg-bg-info`      | blue-100   | blue-900   | Information ground   |
| `bg-bg-success`   | green-100  | green-900  | Success ground       |
| `bg-bg-warning`   | yellow-100 | yellow-900 | Warning ground       |
| `bg-bg-error`     | red-100    | red-900    | Error ground         |

## Semantic colors (border)

| Tailwind class            | Light      | Dark       | Use                |
| ------------------------- | ---------- | ---------- | ------------------ |
| `border-border-base`      | gray-400   | gray-600   | Standard border    |
| `border-border-subtle`    | gray-100   | gray-900   | Light border       |
| `border-border-mute`      | gray-200   | gray-800   | Restrained border  |
| `border-border-emphasize` | gray-500   | gray-500   | Emphasized border  |
| `border-border-inverse`   | gray-700   | gray-300   | Inverted border    |
| `border-border-info`      | blue-500   | blue-500   | Information border |
| `border-border-success`   | green-500  | green-500  | Success border     |
| `border-border-warning`   | yellow-500 | yellow-500 | Warning border     |
| `border-border-error`     | red-500    | red-500    | Error border       |

## Brand color (primary: teal H:180)

| Tailwind class            | Light    | Dark     | Use                       |
| ------------------------- | -------- | -------- | ------------------------- |
| `text-primary-fg`         | teal-800 | teal-100 | Primary text              |
| `bg-primary-bg`           | teal-200 | teal-800 | Primary background        |
| `bg-primary-bg-subtle`    | teal-50  | teal-900 | Light primary background  |
| `bg-primary-bg-mute`      | teal-100 | teal-800 | Restrained primary ground |
| `bg-primary-bg-emphasize` | teal-200 | teal-700 | Emphasized primary ground |
| `border-primary-border`   | teal-500 | teal-500 | Primary border            |

## Brand color (secondary: cyan H:210)

| Tailwind class            | Light    | Dark     | Use                        |
| ------------------------- | -------- | -------- | -------------------------- |
| `text-secondary-fg`       | cyan-700 | cyan-300 | Secondary text             |
| `bg-secondary-bg`         | cyan-300 | cyan-700 | Secondary background       |
| `bg-secondary-bg-subtle`  | cyan-100 | cyan-900 | Light secondary background |
| `border-secondary-border` | cyan-600 | cyan-600 | Secondary border           |

## Usage examples

```tsx
// Float a card on the page background
<div className="bg-bg-subtle min-h-screen">
  <Card appearance="shadow">
    <div className="p-8">
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
